/**
 * @docaas/api-service - Clinical Workstation & SOAP Consultation Notes
 * Conforms to ADR-002, ADR-010, ADR-015
 */

import { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import { SaveClinicalNoteSchema } from '@docaas/models';
import { AppointmentStatus, SeverityLevel, UserRole, Jurisdiction } from '@docaas/domain';
import { calculatePatientAge } from '@docaas/validation';
import { auditVault } from '../services/audit-vault.js';
import { appointmentsDb } from './appointments.js';

export interface StoredClinicalNote {
  id: string;
  appointmentId: string;
  patientId: string;
  clinicianId: string;
  presentingComplaint: string;
  historyOfPresentingComplaint: string;
  treatmentPlan: string;
  safetyNettingAdvice: string;
  primaryDiagnosis: {
    code: string;
    name: string;
    isPrimary: boolean;
    classification: 'confirmed' | 'differential' | 'provisional' | 'resolved';
  };
  differentialDiagnoses?: string;
  isLocked: boolean;
  lockedAt?: string;
  signatureHash?: string;
  createdAt: string;
  updatedAt: string;
}

export const clinicalNotesDb = new Map<string, StoredClinicalNote>();

export const consultationRoutes: FastifyPluginAsync = async (fastify) => {
  // 1. Get Consultation Encounter Workspace Snapshot
  fastify.get('/api/v1/consultations/:id/workspace', async (req, reply) => {
    const { id } = req.params as { id: string };

    const appointment = appointmentsDb.get(id);
    const patientDob = '1982-04-12';
    const age = calculatePatientAge(patientDob, Jurisdiction.NIGERIA);

    const existingNote = Array.from(clinicalNotesDb.values()).find((n) => n.appointmentId === id);

    return reply.send({
      appointmentId: id,
      encounterType: appointment?.encounterType || 'telemedicine_video',
      patientSnapshot: {
        id: appointment?.patientId || 'p1111111-1111-1111-1111-111111111111',
        mrn: 'CVH-2026-0001',
        fullName: 'Olumide Babalola',
        dateOfBirth: patientDob,
        ageYears: age.years,
        gender: 'Male',
        bloodGroup: 'O+',
        genotype: 'AA',
        allergies: [
          { substance: 'Penicillin', severity: SeverityLevel.LIFE_THREATENING },
          { substance: 'Sulfa Drugs', severity: SeverityLevel.MODERATE },
        ],
        safeguardingFlag: false,
        vitals: {
          systolicBp: 142,
          diastolicBp: 90,
          heartRateBpm: 76,
          spo2Percentage: 98,
          temperatureCelsius: 37.1,
          recordedAt: new Date().toISOString(),
        },
      },
      currentEncounter: {
        status: appointment?.status || AppointmentStatus.CONSULTATION_STARTED,
        startedAt: appointment?.createdAt || new Date().toISOString(),
      },
      existingNote: existingNote || null,
    });
  });

  // 2. Draft / Auto-save SOAP Note
  fastify.put('/api/v1/consultations/:id/notes/draft', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as {
      presentingComplaint?: string;
      historyOfPresentingComplaint?: string;
      treatmentPlan?: string;
      safetyNettingAdvice?: string;
      primaryDiagnosis?: {
        code: string;
        name: string;
        isPrimary: boolean;
        classification: 'confirmed' | 'differential' | 'provisional' | 'resolved';
      };
      differentialDiagnoses?: string;
    };

    let note = Array.from(clinicalNotesDb.values()).find((n) => n.appointmentId === id);

    if (note && note.isLocked) {
      return reply.status(403).send({
        error: 'LOCKED_RECORD',
        message: 'This clinical encounter note has already been signed and locked in the medical record.',
      });
    }

    const now = new Date().toISOString();
    const clinicianId = req.actor?.userId || 'c1111111-1111-1111-1111-111111111111';

    if (!note) {
      const noteId = crypto.randomUUID();
      const defaultDiagnosis = body.primaryDiagnosis || {
        code: 'R68.89',
        name: 'General Medical Evaluation',
        isPrimary: true,
        classification: 'provisional',
      };

      const newNote: StoredClinicalNote = {
        id: noteId,
        appointmentId: id,
        patientId: 'p1111111-1111-1111-1111-111111111111',
        clinicianId,
        presentingComplaint: body.presentingComplaint || '',
        historyOfPresentingComplaint: body.historyOfPresentingComplaint || '',
        treatmentPlan: body.treatmentPlan || '',
        safetyNettingAdvice: body.safetyNettingAdvice || '',
        primaryDiagnosis: defaultDiagnosis,
        differentialDiagnoses: body.differentialDiagnoses,
        isLocked: false,
        createdAt: now,
        updatedAt: now,
      };
      clinicalNotesDb.set(noteId, newNote);
      note = newNote;
    } else {
      if (body.presentingComplaint !== undefined) note.presentingComplaint = body.presentingComplaint;
      if (body.historyOfPresentingComplaint !== undefined) note.historyOfPresentingComplaint = body.historyOfPresentingComplaint;
      if (body.treatmentPlan !== undefined) note.treatmentPlan = body.treatmentPlan;
      if (body.safetyNettingAdvice !== undefined) note.safetyNettingAdvice = body.safetyNettingAdvice;
      if (body.primaryDiagnosis !== undefined) note.primaryDiagnosis = body.primaryDiagnosis;
      if (body.differentialDiagnoses !== undefined) note.differentialDiagnoses = body.differentialDiagnoses;
      note.updatedAt = now;
    }

    return reply.send({
      success: true,
      noteId: note.id,
      updatedAt: note.updatedAt,
      message: 'Draft SOAP note auto-saved.',
    });
  });

  // 3. Official Sign & Lock Clinical Note (Tamper-Evident SHA-256)
  fastify.post('/api/v1/consultations/:id/sign', async (req, reply) => {
    const { id } = req.params as { id: string };
    const parse = SaveClinicalNoteSchema.safeParse(req.body);

    if (!parse.success) {
      return reply.status(400).send({
        error: 'Invalid note payload',
        details: parse.error.format(),
      });
    }

    const data = parse.data;
    const now = new Date().toISOString();
    const clinicianId = req.actor?.userId || 'c1111111-1111-1111-1111-111111111111';
    const patientId = 'p1111111-1111-1111-1111-111111111111';

    const signaturePayload = `${id}:${patientId}:${clinicianId}:${data.primaryDiagnosis.code}:${now}`;
    const signatureHash = crypto.createHash('sha256').update(signaturePayload).digest('hex');

    const noteId = crypto.randomUUID();
    const lockedNote: StoredClinicalNote = {
      id: noteId,
      appointmentId: id,
      patientId,
      clinicianId,
      presentingComplaint: data.presentingComplaint,
      historyOfPresentingComplaint: data.historyOfPresentingComplaint,
      treatmentPlan: data.treatmentPlan,
      safetyNettingAdvice: data.safetyNettingAdvice,
      primaryDiagnosis: data.primaryDiagnosis,
      differentialDiagnoses: data.differentialDiagnoses,
      isLocked: true,
      lockedAt: now,
      signatureHash,
      createdAt: now,
      updatedAt: now,
    };

    clinicalNotesDb.set(noteId, lockedNote);

    // Update appointment status to completed
    const appointment = appointmentsDb.get(id);
    if (appointment) {
      appointment.status = AppointmentStatus.CONSULTATION_COMPLETED;
      appointment.updatedAt = now;
    }

    // Record in Tamper-Evident Audit Vault (ADR-010)
    auditVault.recordEvent({
      actorId: clinicianId,
      actorRole: UserRole.CLINICIAN,
      action: 'CLINICAL_NOTE_SIGNED_AND_LOCKED',
      resourceType: 'ClinicalNote',
      resourceId: noteId,
      jurisdiction: Jurisdiction.NIGERIA,
      details: {
        appointmentId: id,
        primaryDiagnosisCode: data.primaryDiagnosis.code,
        primaryDiagnosisName: data.primaryDiagnosis.name,
        signatureHash,
      },
    });

    return reply.status(200).send({
      clinicalNoteId: noteId,
      isLocked: true,
      lockedAt: now,
      primaryDiagnosis: data.primaryDiagnosis,
      signatureHash,
      message: 'Official consultation encounter note signed and locked in immutable medical record.',
    });
  });
};
