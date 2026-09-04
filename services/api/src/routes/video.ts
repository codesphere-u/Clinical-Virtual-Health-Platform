/**
 * @aura/api-service - Video Consultation Token Route
 * Phase 5: Production Readiness
 *
 * POST /api/v1/video/token
 * Issues a cryptographically signed LiveKit room access token after verifying:
 *   1. The requesting user is the patient or the assigned clinician for the appointment
 *   2. The appointment is in a valid state for video (PATIENT_WAITING | CONSULTATION_STARTED | CONFIRMED | BOOKED)
 *   3. Logs VIDEO_TOKEN_ISSUED to the SHA-256 Audit Vault (ADR-010)
 */

import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AppointmentStatus, UserRole, Jurisdiction } from '@aura/domain';
import { LiveKitVideoProvider } from '@aura/video';
import { auditVault } from '../services/audit-vault.js';
import { appointmentsDb } from './appointments.js';

// ── Schema ─────────────────────────────────────────────────────────────────

const VideoTokenRequestSchema = z.object({
  appointmentId: z.string().min(1, 'appointmentId is required'),
});

const VideoTokenResponseSchema = z.object({
  token: z.string(),
  roomName: z.string(),
  livekitUrl: z.string(),
  expiresAt: z.string().datetime(),
  participantIdentity: z.string(),
});

export type VideoTokenRequest = z.infer<typeof VideoTokenRequestSchema>;
export type VideoTokenResponse = z.infer<typeof VideoTokenResponseSchema>;

// ── Valid appointment states for video access ───────────────────────────────
const VIDEO_ELIGIBLE_STATES = new Set<AppointmentStatus>([
  AppointmentStatus.PATIENT_WAITING,
  AppointmentStatus.CONSULTATION_STARTED,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.BOOKED,
]);

// ── Route Plugin ────────────────────────────────────────────────────────────

export const videoRoutes: FastifyPluginAsync = async (fastify) => {
  // ── Lazy-initialize LiveKit provider from environment ────────────────────
  const getLiveKitProvider = (): LiveKitVideoProvider => {
    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret =
      process.env.LIVEKIT_API_SECRET || 'devkey_secret_minimum_32_chars_____';
    const wsUrl = process.env.LIVEKIT_URL || 'ws://localhost:7880';

    return new LiveKitVideoProvider({ apiKey, apiSecret, wsUrl });
  };

  /**
   * POST /api/v1/video/token
   * Issues a LiveKit participant access token for an authorized consultation room.
   */
  fastify.post<{
    Body: VideoTokenRequest;
    Reply: VideoTokenResponse | { error: string; code: string };
  }>(
    '/api/v1/video/token',
    async (req, reply) => {
      // ── 1. Validate Request Body ──────────────────────────────────────────
      const parseResult = VideoTokenRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: parseResult.error.issues.map((i) => i.message).join('; '),
          code: 'INVALID_REQUEST',
        });
      }

      const { appointmentId } = parseResult.data;

      // Extract verified caller from request.actor or test headers
      const actor = req.actor;
      const actorId = actor?.userId || actor?.sub || (req.headers['x-user-id'] as string) || '';
      const actorRole = actor?.role || (req.headers['x-user-role'] as string) || '';

      if (!actorId) {
        return reply.status(401).send({
          error: 'Unauthorized: missing authentication token or identity.',
          code: 'UNAUTHORIZED',
        });
      }

      // ── 2. Resolve Appointment ────────────────────────────────────────────
      const appointment = appointmentsDb.get(appointmentId);
      if (!appointment) {
        return reply.status(404).send({
          error: `Appointment ${appointmentId} not found.`,
          code: 'APPOINTMENT_NOT_FOUND',
        });
      }

      // ── 3. Authorization: Must be the patient or the assigned clinician ───
      const isPatient =
        actorRole === 'patient' && appointment.patientId === actorId;
      const isClinician =
        actorRole === 'clinician' && appointment.clinicianId === actorId;
      const isAdmin = actorRole === 'admin';

      if (!isPatient && !isClinician && !isAdmin) {
        return reply.status(403).send({
          error:
            'Access denied. You are not a participant in this consultation.',
          code: 'VIDEO_ACCESS_DENIED',
        });
      }

      // ── 4. Appointment State Gate ─────────────────────────────────────────
      if (!VIDEO_ELIGIBLE_STATES.has(appointment.status)) {
        return reply.status(422).send({
          error: `Cannot issue video token: appointment is in state "${appointment.status}". Valid states: ${[...VIDEO_ELIGIBLE_STATES].join(', ')}.`,
          code: 'APPOINTMENT_STATE_INVALID',
        });
      }

      // ── 5. Generate LiveKit Token ─────────────────────────────────────────
      const provider = getLiveKitProvider();
      const roomName = appointment.roomSid || `cvh-room-${appointmentId}`;

      const displayName =
        actorRole === 'clinician'
          ? `Dr. Clinician (${actorId.slice(0, 8)})`
          : `Patient (${actorId.slice(0, 8)})`;

      const TOKEN_TTL_SECONDS = 60 * 60; // 1 hour per consultation session

      const tokenResult = await provider.generateParticipantToken({
        roomSid: roomName,
        userId: actorId,
        userRole: actorRole as any,
        displayName,
        ttlSeconds: TOKEN_TTL_SECONDS,
      });

      // ── 6. Audit Vault: Log Token Issuance ───────────────────────────────
      const mappedRole =
        actorRole === 'clinician'
          ? UserRole.CLINICIAN
          : actorRole === 'admin'
          ? UserRole.ADMIN
          : UserRole.PATIENT;

      auditVault.recordEvent({
        actorId,
        actorRole: mappedRole,
        action: 'VIDEO_TOKEN_ISSUED',
        resourceType: 'Appointment',
        resourceId: appointmentId,
        jurisdiction: Jurisdiction.NIGERIA,
        details: {
          roomName,
          participantRole: actorRole,
          tokenExpiresAt: tokenResult.expiresAt.toISOString(),
          liveKitUrl: tokenResult.serverUrl,
        },
      });

      fastify.log.info(
        {
          appointmentId,
          actorId,
          actorRole,
          roomName,
        },
        '[VIDEO] Token issued for LiveKit room'
      );

      // ── 7. Respond ────────────────────────────────────────────────────────
      return reply.status(200).send({
        token: tokenResult.token,
        roomName,
        livekitUrl: tokenResult.serverUrl,
        expiresAt: tokenResult.expiresAt.toISOString(),
        participantIdentity: actorId,
      });
    }
  );

  /**
   * DELETE /api/v1/video/room/:appointmentId
   * Clinician-only: Forcibly terminates a LiveKit room, ending the consultation.
   */
  fastify.delete<{
    Params: { appointmentId: string };
  }>(
    '/api/v1/video/room/:appointmentId',
    async (req, reply) => {
      const { appointmentId } = req.params;
      const actor = req.actor;
      const actorId = actor?.userId || actor?.sub || (req.headers['x-user-id'] as string) || '';
      const actorRole = actor?.role || (req.headers['x-user-role'] as string) || '';

      if (actorRole !== 'clinician' && actorRole !== 'admin') {
        return reply.status(403).send({
          error: 'Only clinicians or admins may terminate consultation rooms.',
          code: 'INSUFFICIENT_ROLE',
        });
      }

      const appointment = appointmentsDb.get(appointmentId);
      if (!appointment) {
        return reply.status(404).send({
          error: `Appointment ${appointmentId} not found.`,
          code: 'APPOINTMENT_NOT_FOUND',
        });
      }

      const roomName = appointment.roomSid || `cvh-room-${appointmentId}`;
      const provider = getLiveKitProvider();

      await provider.endConsultationRoom(roomName);

      // Update appointment state
      appointmentsDb.set(appointmentId, {
        ...appointment,
        status: AppointmentStatus.CONSULTATION_COMPLETED,
        updatedAt: new Date().toISOString(),
      });

      auditVault.recordEvent({
        actorId,
        actorRole: actorRole === 'admin' ? UserRole.ADMIN : UserRole.CLINICIAN,
        action: 'VIDEO_ROOM_TERMINATED',
        resourceType: 'Appointment',
        resourceId: appointmentId,
        jurisdiction: Jurisdiction.NIGERIA,
        details: { roomName, terminatedBy: actorRole },
      });

      return reply.status(200).send({
        success: true,
        appointmentId,
        roomName,
        status: 'CONSULTATION_COMPLETED',
        terminatedAt: new Date().toISOString(),
      });
    }
  );
};
