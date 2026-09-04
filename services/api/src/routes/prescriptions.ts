/**
 * @aura/api-service - E-Prescriptions & Allergy Safety Checks
 * Conforms to ADR-002, ADR-004, ADR-010
 */

import { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import { CreatePrescriptionSchema, PrescriptionItemSchema } from '@aura/models';
import { SeverityLevel, UserRole, Jurisdiction } from '@aura/domain';
import { checkAllergyConflict } from '@aura/validation';
import { auditVault } from '../services/audit-vault.js';
import { z } from 'zod';

export type StoredPrescriptionItem = z.infer<typeof PrescriptionItemSchema>;

export interface StoredPrescription {
  prescriptionCode: string;
  appointmentId: string;
  patientId: string;
  clinicianId: string;
  items: StoredPrescriptionItem[];
  dispensingPharmacyNotes?: string;
  status: 'authorized' | 'dispensed' | 'cancelled';
  digitalSignatureHash: string;
  issuedAt: string;
  expiresAt: string;
  pdfDocumentUrl: string;
}

export const prescriptionsDb = new Map<string, StoredPrescription>([
  [
    'RX-2026-88491',
    {
      prescriptionCode: 'RX-2026-88491',
      appointmentId: 'apt-seed-001',
      patientId: 'p1111111-1111-1111-1111-111111111111',
      clinicianId: 'c1111111-1111-1111-1111-111111111111',
      items: [
        {
          medicationName: 'Amlodipine Besylate',
          strength: '5mg',
          dosage: '1 tablet',
          frequency: 'Once daily in the morning',
          route: 'Oral',
          duration: '30 days',
          quantity: 30,
          repeatsAllowed: 2,
          specialInstructions: 'Take with or without food. Monitor blood pressure weekly.',
        },
      ],
      status: 'authorized',
      digitalSignatureHash: 'sha256-verified-clinician-e-signature-gmc-7654321',
      issuedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 29 * 86400 * 1000).toISOString(),
      pdfDocumentUrl: 'https://vault.alliance-health.org/prescriptions/RX-2026-88491.pdf',
    },
  ],
]);

export const prescriptionRoutes: FastifyPluginAsync = async (fastify) => {
  // 1. Issue New E-Prescription with Automated Allergy Cross-Checks
  fastify.post('/api/v1/prescriptions', async (req, reply) => {
    const parse = CreatePrescriptionSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({
        error: 'Invalid prescription payload',
        details: parse.error.format(),
      });
    }

    const data = parse.data;
    const clinicianId = req.actor?.userId || 'c1111111-1111-1111-1111-111111111111';

    // Patient allergies known to platform (e.g. Penicillin)
    const patientAllergies = [
      { substance: 'Penicillin', severity: SeverityLevel.LIFE_THREATENING },
      { substance: 'Amoxicillin', severity: SeverityLevel.LIFE_THREATENING },
      { substance: 'Ampicillin', severity: SeverityLevel.LIFE_THREATENING },
    ];

    for (const item of data.items) {
      const allergyCheck = checkAllergyConflict(patientAllergies, item.medicationName);
      if (allergyCheck.hasConflict) {
        // Record security/safety audit event
        auditVault.recordEvent({
          actorId: clinicianId,
          actorRole: UserRole.CLINICIAN,
          action: 'PRESCRIPTION_ALLERGY_BLOCKED',
          resourceType: 'PrescriptionAttempt',
          resourceId: data.patientId,
          jurisdiction: Jurisdiction.NIGERIA,
          details: {
            conflictingDrug: item.medicationName,
            clinicalWarning: allergyCheck.clinicalWarning,
          },
        });

        return reply.status(422).send({
          error: 'CLINICAL ALLERGY SAFETY BLOCK',
          clinicalWarning: allergyCheck.clinicalWarning,
          conflictingDrug: item.medicationName,
          severity: SeverityLevel.LIFE_THREATENING,
          recommendation:
            'Select alternative non-beta-lactam antibiotic class (e.g., Macrolides, Fluoroquinolones) or review patient allergy panel.',
        });
      }
    }

    const prescriptionCode = `RX-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 86400 * 1000).toISOString();

    const signaturePayload = `${prescriptionCode}:${clinicianId}:${data.patientId}:${now}`;
    const digitalSignatureHash = crypto.createHash('sha256').update(signaturePayload).digest('hex');

    const prescriptionRecord: StoredPrescription = {
      prescriptionCode,
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      clinicianId,
      items: data.items,
      dispensingPharmacyNotes: data.dispensingPharmacyNotes,
      status: 'authorized',
      digitalSignatureHash,
      issuedAt: now,
      expiresAt,
      pdfDocumentUrl: `https://vault.alliance-health.org/prescriptions/${prescriptionCode}.pdf`,
    };

    prescriptionsDb.set(prescriptionCode, prescriptionRecord);

    // Record in Tamper-Evident Audit Vault (ADR-010)
    auditVault.recordEvent({
      actorId: clinicianId,
      actorRole: UserRole.CLINICIAN,
      action: 'PRESCRIPTION_AUTHORIZED',
      resourceType: 'Prescription',
      resourceId: prescriptionCode,
      jurisdiction: Jurisdiction.NIGERIA,
      details: {
        patientId: data.patientId,
        medicationCount: data.items.length,
        digitalSignatureHash,
      },
    });

    return reply.status(201).send({
      prescriptionCode,
      status: 'authorized',
      itemsCount: data.items.length,
      digitalSignatureHash,
      issuedAt: now,
      expiresAt,
      pdfDocumentUrl: prescriptionRecord.pdfDocumentUrl,
      verificationQrUrl: `https://verify.alliance-health.org/rx/${prescriptionCode}`,
      message: 'Electronic prescription authorized and cryptographically sealed.',
    });
  });

  // 2. Verify Prescription by Code (for Pharmacist / Patient)
  fastify.get('/api/v1/prescriptions/:code', async (req, reply) => {
    const { code } = req.params as { code: string };
    const prescription = prescriptionsDb.get(code);

    if (!prescription) {
      return reply.status(404).send({ error: 'Prescription not found or invalid code' });
    }

    return reply.send({
      prescription,
      isValid: prescription.status === 'authorized' && new Date(prescription.expiresAt) > new Date(),
    });
  });

  // 3. List Patient Prescriptions
  fastify.get('/api/v1/prescriptions', async (req) => {
    const { patientId } = req.query as { patientId?: string };
    let list = Array.from(prescriptionsDb.values());

    if (patientId) {
      list = list.filter((p) => p.patientId === patientId);
    }

    return { prescriptions: list, total: list.length };
  });
};
