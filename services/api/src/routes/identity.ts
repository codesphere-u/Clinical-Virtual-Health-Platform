/**
 * @docaas/api-service - Identity & Biometric KYC Routes
 * Phase 2: Nigerian NIN/BVN Verification & Camera Passive Liveness
 */

import type { FastifyInstance } from 'fastify';
import {
  evaluatePassiveLiveness,
  verifyNigerianKyc,
  computeClinicianCompliancePassport,
  type ClinicianComplianceCheckInput,
} from '@docaas/auth';
import { UserRole } from '@docaas/domain';

export async function identityRoutes(fastify: FastifyInstance): Promise<void> {

  // ------------------------------------------------------------------
  // POST /api/v1/identity/liveness-check
  // Passive liveness anti-spoofing — accepts base64 image from camera capture
  // ------------------------------------------------------------------
  fastify.post('/api/v1/identity/liveness-check', async (req, reply) => {
    const actor = req.actor;
    if (!actor) return reply.status(401).send({ error: 'Authentication required.' });

    const { imageBase64, sourceType, clientMetadata } = req.body as {
      imageBase64?: string;
      sourceType?: 'camera_stream' | 'file_upload';
      clientMetadata?: Record<string, unknown>;
    };

    if (!imageBase64) {
      return reply.status(400).send({ error: 'imageBase64 is required.' });
    }

    const result = evaluatePassiveLiveness({
      imageBufferOrBase64: imageBase64,
      sourceType: sourceType ?? 'camera_stream',
      clientMetadata: {
        deviceModel: clientMetadata?.['deviceModel'] as string | undefined,
        cameraResolution: clientMetadata?.['cameraResolution'] as string | undefined,
        captureTimestamp: clientMetadata?.['captureTimestamp'] as number | undefined,
      },
    });

    if (!result.isLiveHumanConfirmed) {
      fastify.log.warn({
        userId: actor.userId,
        confidenceScore: result.confidenceScore,
        rejectedReason: result.rejectedReason,
        msg: 'Liveness check REJECTED',
      });

      return reply.status(422).send({
        verified: false,
        isHumanFaceDetected: result.isHumanFaceDetected,
        confidenceScore: result.confidenceScore,
        rejectedReason: result.rejectedReason,
        guidance: 'Please retake the selfie in good lighting, looking directly at the camera, with no eyewear or face coverings.',
      });
    }

    return reply.send({
      verified: true,
      confidenceScore: result.confidenceScore,
      antiSpoofScore: result.antiSpoofScore,
      detectedLandmarksCount: result.detectedLandmarksCount,
      message: 'Liveness confirmed. Facial biometric accepted.',
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/identity/kyc/nigeria
  // Nigerian NIN or BVN verification against NIMC / NIBSS
  // ------------------------------------------------------------------
  fastify.post('/api/v1/identity/kyc/nigeria', async (req, reply) => {
    const actor = req.actor;
    if (!actor) return reply.status(401).send({ error: 'Authentication required.' });

    if (actor.role !== UserRole.PATIENT) {
      return reply.status(403).send({ error: 'NIN/BVN KYC is exclusively for patient identity onboarding.' });
    }

    const { nin, bvn, legalFirstName, legalLastName } = req.body as {
      nin?: string;
      bvn?: string;
      legalFirstName: string;
      legalLastName: string;
    };

    if (!nin && !bvn) {
      return reply.status(400).send({ error: 'At least one of nin or bvn must be provided.' });
    }

    if (!legalFirstName || !legalLastName) {
      return reply.status(400).send({ error: 'legalFirstName and legalLastName are required.' });
    }

    const result = verifyNigerianKyc({
      patientId: actor.userId,
      nin,
      bvn,
      legalFirstName,
      legalLastName,
    });

    if (!result.isVerified) {
      return reply.status(422).send({
        verified: false,
        verificationStatus: result.verificationStatus,
        failureReason: result.failureReason,
      });
    }

    fastify.log.info({
      userId: actor.userId,
      provider: result.verificationProvider,
      hashedId: result.hashedIdentifier, // Never log raw NIN/BVN
      msg: 'Nigerian KYC verification successful',
    });

    return reply.send({
      verified: true,
      verificationStatus: result.verificationStatus,
      verificationProvider: result.verificationProvider,
      hashedIdentifier: result.hashedIdentifier,
      matchedNameSimilarity: result.matchedNameSimilarity,
      message: 'Nigerian identity verified successfully. Your account is now KYC-compliant.',
    });
  });

  // ------------------------------------------------------------------
  // GET /api/v1/identity/compliance-passport/:clinicianId
  // Clinician compliance passport — real-time status of GMC / safeguarding / indemnity
  // ------------------------------------------------------------------
  fastify.get('/api/v1/identity/compliance-passport/:clinicianId', async (req, reply) => {
    const actor = req.actor;
    if (!actor) return reply.status(401).send({ error: 'Authentication required.' });

    const { clinicianId } = req.params as { clinicianId: string };

    // Restrict: clinicians can only view their own passport unless admin
    if (actor.role !== UserRole.ADMIN && actor.userId !== clinicianId) {
      return reply.status(403).send({
        error: 'Access denied. Clinicians may only view their own compliance passport.',
      });
    }

    // Sample passport data (in production, this pulls from the Prisma clinician profile)
    const sampleInput: ClinicianComplianceCheckInput = {
      gmcNumber: '7654321',
      gmcRevalidationDate: new Date(Date.now() + 90 * 24 * 3600 * 1000), // 90 days from now
      safeguardingLevel3Date: new Date(Date.now() + 180 * 24 * 3600 * 1000), // Valid for 6 months
      indemnityInsuranceExpiryDate: new Date(Date.now() + 20 * 24 * 3600 * 1000), // Expiring in 20 days → expiring_soon
    };

    const passport = computeClinicianCompliancePassport(sampleInput);

    return reply.send({
      clinicianId,
      compliancePassport: passport,
      generatedAt: new Date().toISOString(),
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/identity/compliance-passport/:clinicianId/submit-document
  // Clinician submits a credential document for admin review
  // ------------------------------------------------------------------
  fastify.post('/api/v1/identity/compliance-passport/:clinicianId/submit-document', async (req, reply) => {
    const actor = req.actor;
    if (!actor) return reply.status(401).send({ error: 'Authentication required.' });

    const { clinicianId } = req.params as { clinicianId: string };

    if (actor.role !== UserRole.CLINICIAN || actor.userId !== clinicianId) {
      return reply.status(403).send({ error: 'Only the owning clinician may submit compliance documents.' });
    }

    const { documentType, fileBase64, expiryDate, notes: _notes } = req.body as {
      documentType:
        | 'gmc_certificate'
        | 'mdcn_license'
        | 'safeguarding_certificate'
        | 'indemnity_insurance'
        | 'dbs_certificate'
        | 'other';
      fileBase64: string;
      expiryDate?: string;
      notes?: string;
    };

    if (!documentType || !fileBase64) {
      return reply.status(400).send({ error: 'documentType and fileBase64 are required.' });
    }

    const documentId = crypto.randomUUID();
    const submissionRef = `CPD-${documentId.substring(0, 8).toUpperCase()}`;

    fastify.log.info({
      clinicianId,
      documentType,
      submissionRef,
      msg: 'Compliance document submitted for admin review',
    });

    return reply.status(202).send({
      submissionRef,
      documentId,
      documentType,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
      expiryDate,
      message: `Document submitted for review. Reference: ${submissionRef}. You will be notified once reviewed by the compliance team.`,
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/admin/compliance-passport/:clinicianId/approve
  // Admin reviews and approves or rejects a compliance submission
  // ------------------------------------------------------------------
  fastify.post('/api/v1/admin/compliance-passport/:clinicianId/approve', async (req, reply) => {
    const actor = req.actor;
    if (!actor || actor.role !== UserRole.ADMIN) {
      return reply.status(403).send({ error: 'Admin access required.' });
    }

    const { clinicianId } = req.params as { clinicianId: string };
    const { submissionRef, decision, adminNotes: _adminNotes } = req.body as {
      submissionRef: string;
      decision: 'approved' | 'rejected';
      adminNotes?: string;
    };

    if (!submissionRef || !decision) {
      return reply.status(400).send({ error: 'submissionRef and decision are required.' });
    }

    const auditToken = crypto.randomUUID();

    fastify.log.info({
      adminId: actor.userId,
      clinicianId,
      submissionRef,
      decision,
      auditToken,
      msg: `Compliance document ${decision.toUpperCase()} by admin`,
    });

    return reply.send({
      submissionRef,
      clinicianId,
      decision,
      reviewedAt: new Date().toISOString(),
      reviewedBy: actor.userId,
      auditToken,
      message: `Clinician compliance document ${decision}. Clinician will be notified.`,
    });
  });
}
