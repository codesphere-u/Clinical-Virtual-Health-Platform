/**
 * Unit Tests for @aura/domain
 * Validates Appointment State Machine transitions and Data Residency enums
 */

import assert from 'node:assert/strict';
import {
  AppointmentStatus,
  canTransitionAppointment,
  UserRole,
  Jurisdiction,
  DataClassificationTier,
} from '../index.js';

async function runDomainTests() {
  console.log('🧪 Running @aura/domain unit tests...');

  // 1. Legal Appointment Transitions
  assert.equal(
    canTransitionAppointment(AppointmentStatus.AVAILABLE, AppointmentStatus.BOOKED),
    true,
    'Available to Booked should be permitted'
  );
  assert.equal(
    canTransitionAppointment(AppointmentStatus.BOOKED, AppointmentStatus.PATIENT_CHECKED_IN),
    true,
    'Booked to Checked In should be permitted'
  );
  assert.equal(
    canTransitionAppointment(AppointmentStatus.PATIENT_CHECKED_IN, AppointmentStatus.PATIENT_WAITING),
    true,
    'Checked In to Waiting should be permitted'
  );
  assert.equal(
    canTransitionAppointment(AppointmentStatus.PATIENT_WAITING, AppointmentStatus.CLINICIAN_READY),
    true,
    'Waiting to Clinician Ready should be permitted'
  );
  assert.equal(
    canTransitionAppointment(AppointmentStatus.CLINICIAN_READY, AppointmentStatus.CONSULTATION_STARTED),
    true,
    'Clinician Ready to Started should be permitted'
  );
  assert.equal(
    canTransitionAppointment(AppointmentStatus.CONSULTATION_STARTED, AppointmentStatus.CONSULTATION_COMPLETED),
    true,
    'Started to Completed should be permitted'
  );
  console.log('  ✅ Legal appointment state transitions verified');

  // 2. Illegal Appointment Transitions
  assert.equal(
    canTransitionAppointment(AppointmentStatus.AVAILABLE, AppointmentStatus.CONSULTATION_COMPLETED),
    false,
    'Available cannot directly become Completed'
  );
  assert.equal(
    canTransitionAppointment(AppointmentStatus.CONSULTATION_COMPLETED, AppointmentStatus.BOOKED),
    false,
    'Completed cannot transition back to Booked'
  );
  assert.equal(
    canTransitionAppointment(AppointmentStatus.CANCELLED, AppointmentStatus.CONSULTATION_STARTED),
    false,
    'Cancelled cannot become Started'
  );
  console.log('  ✅ Illegal appointment state transitions blocked');

  // 3. Role & Jurisdiction Enums
  assert.equal(UserRole.PATIENT, 'patient');
  assert.equal(UserRole.CLINICIAN, 'clinician');
  assert.equal(UserRole.ADMIN, 'admin');
  assert.equal(Jurisdiction.NIGERIA, 'NG');
  assert.equal(Jurisdiction.UNITED_KINGDOM, 'GB');
  assert.equal(DataClassificationTier.TIER_2_CLINICAL_NOTE, 'tier_2_clinical_note');
  console.log('  ✅ Core roles and residency classification verified');

  console.log('🎉 ALL @aura/domain UNIT TESTS PASSED!\n');
}

runDomainTests().catch((err) => {
  console.error('Domain test failed:', err);
  process.exit(1);
});
