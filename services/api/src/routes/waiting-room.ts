/**
 * @aura/api-service - Realtime Waiting Room & Heartbeat Engine
 * Conforms to ADR-009: Realtime Waiting Room State Machine & Heartbeats
 */

import { FastifyPluginAsync } from 'fastify';
import { WaitingRoomHeartbeatSchema } from '@aura/models';
import { AppointmentStatus, UserRole, Jurisdiction } from '@aura/domain';
import { LiveKitVideoProvider, VideoService } from '@aura/video';
import { appointmentsDb } from './appointments.js';
import { auditVault } from '../services/audit-vault.js';

const livekitProvider = new LiveKitVideoProvider({
  apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
  apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
  wsUrl: process.env.LIVEKIT_WS_URL || 'ws://localhost:7880',
});
const videoService = new VideoService(livekitProvider);

export interface WaitingParticipant {
  appointmentId: string;
  patientId: string;
  patientName: string;
  clinicianId: string;
  joinedAt: string;
  lastHeartbeat: string;
  networkQuality: 'excellent' | 'good' | 'fair' | 'poor';
  isClinicianReady: boolean;
  isAdmitted: boolean;
}

export const waitingRoomQueue = new Map<string, WaitingParticipant>();

export const waitingRoomRoutes: FastifyPluginAsync = async (fastify) => {
  // 1. Patient joins waiting room
  fastify.post('/api/v1/waiting-room/join', async (req, reply) => {
    const { appointmentId, participantRole, displayName } = req.body as {
      appointmentId: string;
      participantRole?: UserRole;
      displayName?: string;
    };

    if (!appointmentId) {
      return reply.status(400).send({ error: 'appointmentId is required' });
    }

    const appointment = appointmentsDb.get(appointmentId);
    if (appointment) {
      appointment.status = AppointmentStatus.PATIENT_WAITING;
      appointment.updatedAt = new Date().toISOString();
    }

    const now = new Date().toISOString();
    const participant: WaitingParticipant = {
      appointmentId,
      patientId: appointment?.patientId || 'patient-default',
      patientName: displayName || 'Olumide Babalola',
      clinicianId: appointment?.clinicianId || 'clinician-default',
      joinedAt: now,
      lastHeartbeat: now,
      networkQuality: 'good',
      isClinicianReady: false,
      isAdmitted: false,
    };

    waitingRoomQueue.set(appointmentId, participant);

    const tokenResult = await videoService.generateToken({
      roomSid: `cvh-room-${appointmentId}`,
      userId: participant.patientId,
      userRole: participantRole || UserRole.PATIENT,
      displayName: participant.patientName,
    });

    auditVault.recordEvent({
      actorId: participant.patientId,
      actorRole: UserRole.PATIENT,
      action: 'WAITING_ROOM_JOINED',
      resourceType: 'Appointment',
      resourceId: appointmentId,
      jurisdiction: Jurisdiction.NIGERIA,
      details: {
        roomSid: tokenResult.roomSid,
        networkQuality: participant.networkQuality,
      },
    });

    return reply.send({
      status: AppointmentStatus.PATIENT_WAITING,
      videoToken: tokenResult.token,
      serverUrl: tokenResult.serverUrl,
      roomSid: tokenResult.roomSid,
      waitingSince: now,
      queuePosition: Array.from(waitingRoomQueue.keys()).indexOf(appointmentId) + 1,
      estimatedWaitMinutes: 3,
    });
  });

  // 2. Realtime Heartbeat (every 10s per ADR-009)
  fastify.post('/api/v1/waiting-room/heartbeat', async (req, reply) => {
    const parse = WaitingRoomHeartbeatSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid heartbeat payload' });
    }

    const data = parse.data;
    const participant = waitingRoomQueue.get(data.appointmentId);

    if (participant) {
      participant.lastHeartbeat = new Date().toISOString();
      if (data.networkQuality) {
        participant.networkQuality = data.networkQuality as 'excellent' | 'good' | 'fair' | 'poor';
      }
    }

    return reply.send({
      acknowledged: true,
      serverTimestamp: new Date().toISOString(),
      networkQuality: data.networkQuality || 'good',
      isClinicianReady: participant?.isClinicianReady || false,
      isAdmitted: participant?.isAdmitted || false,
    });
  });

  // 3. Clinician checks waiting queue
  fastify.get('/api/v1/waiting-room/queue', async () => {
    const now = Date.now();
    const activeQueue: WaitingParticipant[] = [];

    for (const [appId, item] of waitingRoomQueue.entries()) {
      const lastHbMs = new Date(item.lastHeartbeat).getTime();
      // Drop participants whose heartbeats timed out beyond 60s
      if (now - lastHbMs < 60000) {
        activeQueue.push(item);
      } else {
        waitingRoomQueue.delete(appId);
      }
    }

    return {
      queueLength: activeQueue.length,
      participants: activeQueue,
    };
  });

  // 4. Clinician admits / calls in patient
  fastify.post('/api/v1/waiting-room/admit', async (req, reply) => {
    const { appointmentId } = req.body as { appointmentId: string };
    const participant = waitingRoomQueue.get(appointmentId);

    if (!participant) {
      return reply.status(404).send({ error: 'Participant not in waiting room' });
    }

    participant.isClinicianReady = true;
    participant.isAdmitted = true;

    const appointment = appointmentsDb.get(appointmentId);
    if (appointment) {
      appointment.status = AppointmentStatus.CONSULTATION_STARTED;
      appointment.updatedAt = new Date().toISOString();
    }

    auditVault.recordEvent({
      actorId: participant.clinicianId,
      actorRole: UserRole.CLINICIAN,
      action: 'CONSULTATION_SESSION_ADMITTED',
      resourceType: 'Appointment',
      resourceId: appointmentId,
      jurisdiction: Jurisdiction.NIGERIA,
      details: {
        roomSid: `cvh-room-${appointmentId}`,
      },
    });

    return reply.send({
      success: true,
      appointmentId,
      status: AppointmentStatus.CONSULTATION_STARTED,
      message: 'Patient admitted into live clinical consultation room.',
    });
  });
};
