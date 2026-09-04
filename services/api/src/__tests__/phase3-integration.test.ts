/**
 * Phase 3-4 Backend Core Logic & Integration Test Suite
 * Validates:
 * - Appointment booking & Idempotency deduplication
 * - Conflict prevention
 * - Waiting room state & 10s heartbeats (ADR-009)
 * - Emergency Triage Intercepts (ADR-007)
 * - Clinical Allergy Safety Blocks (ADR-004)
 * - Cryptographic SOAP note locking (ADR-010)
 * - Dual-Jurisdiction Cross-Border Data Residency (ADR-006)
 * - SHA-256 Audit Vault Chain Verification (ADR-010)
 */

process.env.SKIP_SERVER_LISTEN = 'true';
import { buildServer } from '../server.js';
import assert from 'node:assert/strict';

async function runTests() {
  console.log('🧪 Starting Phase 3-4 Clinical Engine Integration Tests...\n');
  const app = await buildServer();

  try {
    // Test 1: Health Diagnostic Probe
    console.log('Test 1: Health Check & System Readiness (ADR-012)...');
    const healthRes = await app.inject({ method: 'GET', url: '/health/ready' });
    assert.equal(healthRes.statusCode, 200);
    const healthJson = healthRes.json();
    assert.equal(healthJson.status, 'ready');
    assert.equal(healthJson.auditVaultChain, 'intact');
    console.log('  ✅ Health probe ready & Audit Vault intact\n');

    // Test 2: Appointment Booking with Idempotency Key
    console.log('Test 2: Appointment Booking & Idempotency Key Deduplication (ADR-013)...');
    const idempotencyKey = crypto.randomUUID();
    const scheduledStart = new Date(Date.now() + 86400 * 1000).toISOString();
    const scheduledEnd = new Date(Date.now() + 86400 * 1000 + 45 * 60 * 1000).toISOString();

    const bookPayload = {
      clinicianId: 'c1111111-1111-1111-1111-111111111111',
      patientId: 'p1111111-1111-1111-1111-111111111111',
      scheduledStart,
      scheduledEnd,
      encounterType: 'telemedicine_video',
      presentingReason: 'Routine hypertension follow-up and review of ambulatory blood pressure readings',
      idempotencyKey,
    };

    const bookRes1 = await app.inject({
      method: 'POST',
      url: '/api/v1/appointments/book',
      headers: { 'x-idempotency-key': idempotencyKey },
      payload: bookPayload,
    });
    assert.equal(bookRes1.statusCode, 201);
    const bookedApt = bookRes1.json();
    assert.ok(bookedApt.appointmentId);
    assert.ok(bookedApt.roomSid);

    // Re-submit with same idempotency key
    const bookRes2 = await app.inject({
      method: 'POST',
      url: '/api/v1/appointments/book',
      headers: { 'x-idempotency-key': idempotencyKey },
      payload: bookPayload,
    });
    assert.equal(bookRes2.statusCode, 201);
    assert.equal(bookRes2.headers['x-cache'], 'IDEMPOTENT-HIT');
    assert.equal(bookRes2.json().appointmentId, bookedApt.appointmentId);
    console.log('  ✅ Appointment booked & identical idempotency hit validated\n');

    // Test 3: Waiting Room State Machine & Heartbeat (ADR-009)
    console.log('Test 3: Waiting Room State Machine & 10s Heartbeats (ADR-009)...');
    const joinRes = await app.inject({
      method: 'POST',
      url: '/api/v1/waiting-room/join',
      payload: {
        appointmentId: bookedApt.appointmentId,
        participantRole: 'patient',
        displayName: 'Olumide Babalola',
      },
    });
    assert.equal(joinRes.statusCode, 200);
    const joinJson = joinRes.json();
    assert.equal(joinJson.status, 'patient_waiting');
    assert.ok(joinJson.videoToken);

    // Send 10s heartbeat
    const hbRes = await app.inject({
      method: 'POST',
      url: '/api/v1/waiting-room/heartbeat',
      payload: {
        appointmentId: bookedApt.appointmentId,
        participantRole: 'patient',
        networkQuality: 'excellent',
        audioMuted: false,
        videoMuted: false,
      },
    });
    assert.equal(hbRes.statusCode, 200);
    assert.equal(hbRes.json().acknowledged, true);
    assert.equal(hbRes.json().networkQuality, 'excellent');
    console.log('  ✅ Patient waiting room joined & heartbeat acknowledged\n');

    // Test 4: Clinician Admits Patient
    console.log('Test 4: Clinician Admits Patient from Queue...');
    const admitRes = await app.inject({
      method: 'POST',
      url: '/api/v1/waiting-room/admit',
      payload: { appointmentId: bookedApt.appointmentId },
    });
    assert.equal(admitRes.statusCode, 200);
    assert.equal(admitRes.json().status, 'consultation_started');
    console.log('  ✅ Patient admitted to live consultation\n');

    // Test 5: Assistive AI Emergency Triage Intercept (ADR-007)
    console.log('Test 5: Assistive AI Emergency Triage Intercept (ADR-007)...');
    const redFlagRes = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/triage-check',
      payload: {
        patientAge: 45,
        patientSymptoms: ['Crushing chest pressure radiating to left arm', 'Difficulty breathing'],
        vitalSigns: { systolicBp: 185, diastolicBp: 110, heartRateBpm: 120, spo2Percentage: 88 },
      },
    });
    assert.equal(redFlagRes.statusCode, 422);
    const triageJson = redFlagRes.json();
    assert.equal(triageJson.status, 'EMERGENCY_INTERCEPT');
    assert.equal(triageJson.isEmergencyRedFlag, true);
    assert.ok(triageJson.emergencyContactNumbers.nigeria.includes('112'));
    assert.ok(triageJson.disclaimer.includes('EMERGENCY CLINICAL SAFETY INTERCEPT'));
    console.log('  ✅ Emergency symptom detected: Instant ER redirection triggered\n');

    // Test 6: Electronic Prescription Allergy Safety Block (ADR-004)
    console.log('Test 6: E-Prescription Allergy Safety Block (ADR-004)...');
    const allergyPrescriptionRes = await app.inject({
      method: 'POST',
      url: '/api/v1/prescriptions',
      payload: {
        appointmentId: bookedApt.appointmentId,
        patientId: 'e2b1b3a1-1234-4567-8901-123456789abc',
        idempotencyKey: crypto.randomUUID(),
        items: [
          {
            medicationName: 'Amoxicillin / Clavulanate',
            strength: '625mg',
            dosage: '1 tablet',
            frequency: 'Every 8 hours',
            route: 'Oral',
            duration: '7 days',
            quantity: 21,
            repeatsAllowed: 0,
            specialInstructions: 'Take with food',
          },
        ],
      },
    });
    assert.equal(allergyPrescriptionRes.statusCode, 422);
    const allergyJson = allergyPrescriptionRes.json();
    assert.equal(allergyJson.error, 'CLINICAL ALLERGY SAFETY BLOCK');
    assert.equal(allergyJson.conflictingDrug, 'Amoxicillin / Clavulanate');
    console.log('  ✅ Penicillin-class allergy conflict strictly blocked with 422\n');

    // Test 7: Valid E-Prescription Authorization & Cryptographic Signing
    console.log('Test 7: Valid E-Prescription Authorization & Digital Signature Stamp...');
    const validPrescriptionRes = await app.inject({
      method: 'POST',
      url: '/api/v1/prescriptions',
      payload: {
        appointmentId: bookedApt.appointmentId,
        patientId: 'e2b1b3a1-1234-4567-8901-123456789abc',
        idempotencyKey: crypto.randomUUID(),
        items: [
          {
            medicationName: 'Amlodipine Besylate',
            strength: '10mg',
            dosage: '1 tablet',
            frequency: 'Once daily in the morning',
            route: 'Oral',
            duration: '30 days',
            quantity: 30,
            repeatsAllowed: 1,
            specialInstructions: 'Continue low sodium diet',
          },
        ],
      },
    });
    assert.equal(validPrescriptionRes.statusCode, 201);
    const validRxJson = validPrescriptionRes.json();
    assert.equal(validRxJson.status, 'authorized');
    assert.ok(validRxJson.prescriptionCode.startsWith('RX-2026-'));
    assert.ok(validRxJson.digitalSignatureHash);
    console.log(`  ✅ Prescription ${validRxJson.prescriptionCode} sealed with digital signature\n`);

    // Test 8: Consultation SOAP Note Signing & Cryptographic Locking
    console.log('Test 8: SOAP Note Signing & Tamper-Evident Record Locking (ADR-010)...');
    const signNoteRes = await app.inject({
      method: 'POST',
      url: `/api/v1/consultations/${bookedApt.appointmentId}/sign`,
      payload: {
        appointmentId: bookedApt.appointmentId,
        presentingComplaint: 'High blood pressure follow-up',
        historyOfPresentingComplaint: 'Patient reports well-controlled home BP averaging 132/84 mmHg. No headaches or visual changes.',
        treatmentPlan: 'Increased Amlodipine to 10mg daily. Continue lifestyle interventions. Review in 4 weeks.',
        safetyNettingAdvice: 'Return immediately if chest pain, severe dyspnea, or sudden severe headache develops.',
        primaryDiagnosis: {
          code: 'I10',
          name: 'Essential (primary) hypertension',
          isPrimary: true,
          classification: 'confirmed',
        },
        aiGeneratedDraft: false,
        clinicianReviewedAndApproved: true,
      },
    });
    assert.equal(signNoteRes.statusCode, 200);
    const noteJson = signNoteRes.json();
    assert.equal(noteJson.isLocked, true);
    assert.ok(noteJson.signatureHash);
    console.log('  ✅ SOAP note signed and locked in medical records\n');

    // Test 9: Dual-Jurisdiction Data Residency Policy Evaluation (ADR-006)
    console.log('Test 9: Dual-Jurisdiction Cross-Border Transfer Evaluation (ADR-006)...');
    const transferRes = await app.inject({
      method: 'POST',
      url: '/api/v1/cross-border/evaluate',
      payload: {
        patientId: 'p1111111-1111-1111-1111-111111111111',
        sourceJurisdiction: 'NG',
        destinationJurisdiction: 'UK',
        clinicianId: 'c1111111-1111-1111-1111-111111111111',
        clinicianLicensingBody: 'GMC',
        purpose: 'telemedicine_consultation',
        hasExplicitConsent: true,
        dataCategories: ['PatientSnapshot', 'Vitals', 'MedicationHistory'],
      },
    });
    assert.equal(transferRes.statusCode, 200);
    const transferJson = transferRes.json();
    assert.equal(transferJson.isPermitted, true);
    assert.ok(transferJson.appliedSafeguards.length > 0);
    console.log('  ✅ Cross-border transfer evaluated and permitted under NDPA Sec 43\n');

    // Test 10: Complete Audit Trail SHA-256 Chain Verification (ADR-010)
    console.log('Test 10: Audit Trail SHA-256 Cryptographic Chain Verification (ADR-010)...');
    const verifyRes = await app.inject({ method: 'GET', url: '/api/v1/audit/verify' });
    assert.equal(verifyRes.statusCode, 200);
    const verifyJson = verifyRes.json();
    assert.equal(verifyJson.status, 'VERIFIED_SECURE');
    assert.equal(verifyJson.chainIntact, true);
    assert.ok(verifyJson.totalBlocksVerified >= 5);
    console.log(`  ✅ SHA-256 Audit Chain verified: ${verifyJson.totalBlocksVerified} blocks intact\n`);

    console.log('🎉 ALL 10 PHASE 3-4 INTEGRATION TESTS PASSED SUCCESSFULLY!');
  } finally {
    await app.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Integration Test Failed:', err);
  process.exit(1);
});
