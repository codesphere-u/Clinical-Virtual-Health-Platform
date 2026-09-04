/**
 * @aura/api-service - Phase 5 Video Consultation Token & Room Termination Integration Tests
 */

import { buildServer } from '../server.js';
import { appointmentsDb } from '../routes/appointments.js';
import { AppointmentStatus, EncounterType } from '@aura/domain';

async function runVideoTests() {
  console.log('🧪 Starting Phase 5 Video Token & Room Management Tests...\n');
  const app = await buildServer();

  const testAppointmentId = 'apt-video-test-001';
  const testPatientId = 'pat-video-111';
  const testClinicianId = 'cli-video-222';
  const unauthorizedUserId = 'pat-intruder-999';

  // Seed test appointment in confirmed state
  appointmentsDb.set(testAppointmentId, {
    id: testAppointmentId,
    patientId: testPatientId,
    clinicianId: testClinicianId,
    scheduledStart: new Date().toISOString(),
    scheduledEnd: new Date(Date.now() + 3600000).toISOString(),
    encounterType: EncounterType.TELEMEDICINE_VIDEO,
    status: AppointmentStatus.CONFIRMED,
    roomSid: `cvh-room-${testAppointmentId}`,
    chiefComplaint: 'Post-operative wound review',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  try {
    // ── Test 1: Generate Video Token for Authorized Patient ─────────────────
    console.log('Test 1: Patient requests LiveKit video token...');
    const patientTokenRes = await app.inject({
      method: 'POST',
      url: '/api/v1/video/token',
      headers: {
        'x-user-id': testPatientId,
        'x-user-role': 'patient',
      },
      payload: {
        appointmentId: testAppointmentId,
      },
    });

    if (patientTokenRes.statusCode !== 200) {
      throw new Error(`Expected 200, got ${patientTokenRes.statusCode}: ${patientTokenRes.body}`);
    }
    const tokenData = JSON.parse(patientTokenRes.body);
    if (!tokenData.token || !tokenData.roomName || tokenData.participantIdentity !== testPatientId) {
      throw new Error(`Invalid token payload: ${patientTokenRes.body}`);
    }
    console.log(`  ✅ LiveKit token issued for patient (Room: ${tokenData.roomName})`);

    // ── Test 2: Generate Video Token for Assigned Clinician ─────────────────
    console.log('\nTest 2: Clinician requests LiveKit video token...');
    const clinicianTokenRes = await app.inject({
      method: 'POST',
      url: '/api/v1/video/token',
      headers: {
        'x-user-id': testClinicianId,
        'x-user-role': 'clinician',
      },
      payload: {
        appointmentId: testAppointmentId,
      },
    });

    if (clinicianTokenRes.statusCode !== 200) {
      throw new Error(`Expected 200, got ${clinicianTokenRes.statusCode}: ${clinicianTokenRes.body}`);
    }
    console.log('  ✅ LiveKit token issued for clinician');

    // ── Test 3: Unauthorized Participant Rejected (403) ───────────────────
    console.log('\nTest 3: Intruder requests video token for another patient room...');
    const forbiddenRes = await app.inject({
      method: 'POST',
      url: '/api/v1/video/token',
      headers: {
        'x-user-id': unauthorizedUserId,
        'x-user-role': 'patient',
      },
      payload: {
        appointmentId: testAppointmentId,
      },
    });

    if (forbiddenRes.statusCode !== 403) {
      throw new Error(`Expected 403 Forbidden, got ${forbiddenRes.statusCode}`);
    }
    console.log('  ✅ Unauthorized access correctly blocked with 403');

    // ── Test 4: Inactive / Cancelled State Gate (422) ───────────────────────
    console.log('\nTest 4: Video token request on cancelled appointment...');
    const cancelledAptId = 'apt-video-cancelled-002';
    appointmentsDb.set(cancelledAptId, {
      id: cancelledAptId,
      patientId: testPatientId,
      clinicianId: testClinicianId,
      scheduledStart: new Date().toISOString(),
      scheduledEnd: new Date(Date.now() + 3600000).toISOString(),
      encounterType: EncounterType.TELEMEDICINE_VIDEO,
      status: AppointmentStatus.CANCELLED,
      roomSid: `cvh-room-${cancelledAptId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const unprocessableRes = await app.inject({
      method: 'POST',
      url: '/api/v1/video/token',
      headers: {
        'x-user-id': testPatientId,
        'x-user-role': 'patient',
      },
      payload: {
        appointmentId: cancelledAptId,
      },
    });

    if (unprocessableRes.statusCode !== 422) {
      throw new Error(`Expected 422 Unprocessable, got ${unprocessableRes.statusCode}`);
    }
    console.log('  ✅ Cancelled appointment state correctly blocked with 422');

    // ── Test 5: Clinician Terminates Room ──────────────────────────────────
    console.log('\nTest 5: Clinician terminates active consultation room...');
    const terminateRes = await app.inject({
      method: 'DELETE',
      url: `/api/v1/video/room/${testAppointmentId}`,
      headers: {
        'x-user-id': testClinicianId,
        'x-user-role': 'clinician',
      },
    });

    if (terminateRes.statusCode !== 200) {
      throw new Error(`Expected 200, got ${terminateRes.statusCode}: ${terminateRes.body}`);
    }
    const termData = JSON.parse(terminateRes.body);
    if (termData.status !== 'CONSULTATION_COMPLETED') {
      throw new Error(`Expected status CONSULTATION_COMPLETED, got: ${termData.status}`);
    }
    console.log('  ✅ Room terminated and appointment transitioned to CONSULTATION_COMPLETED');

    console.log('\n🎉 ALL 5 PHASE 5 VIDEO ROUTE TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Phase 5 Video Tests Failed:', error);
    process.exit(1);
  }
}

runVideoTests();
