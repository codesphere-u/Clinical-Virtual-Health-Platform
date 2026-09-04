-- ============================================================================
-- Migration 0001: Initial Schema for Aura Clinical & Virtual Health Platform
-- Applied by: packages/database/src/migrate.ts
-- Jurisdiction: Nigeria (NDPA 2023) & United Kingdom (UK GDPR 2018)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable pgvector for future AI embedding support
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA public;

-- ── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE "UserRole" AS ENUM (
  'patient', 'clinician', 'admin', 'safeguarding_lead', 'auditor'
);

CREATE TYPE "VerificationStatus" AS ENUM (
  'unverified', 'pending_review', 'verified', 'rejected', 'expired'
);

CREATE TYPE "AppointmentStatus" AS ENUM (
  'available', 'booked', 'confirmed', 'reminder_sent',
  'patient_checked_in', 'patient_waiting', 'clinician_ready',
  'consultation_started', 'consultation_completed',
  'cancelled', 'no_show', 'rescheduled'
);

CREATE TYPE "EncounterType" AS ENUM (
  'telemedicine_video', 'telemedicine_audio', 'async_review', 'in_person'
);

CREATE TYPE "PrescriptionStatus" AS ENUM (
  'draft', 'authorized', 'dispensed', 'cancelled', 'expired'
);

CREATE TYPE "SeverityLevel" AS ENUM (
  'mild', 'moderate', 'severe', 'life_threatening'
);

CREATE TYPE "InvestigationStatus" AS ENUM (
  'ordered', 'sample_collected', 'in_progress', 'resulted', 'reviewed', 'cancelled'
);

-- ── Core Tables ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS organizations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  jurisdiction     TEXT NOT NULL DEFAULT 'NG',
  regulatory_body  TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            UUID REFERENCES organizations(id),
  email             TEXT NOT NULL UNIQUE,
  phone_number      TEXT UNIQUE,
  password_hash     TEXT NOT NULL,
  role              "UserRole" NOT NULL DEFAULT 'patient',
  is_mfa_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret        TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  is_suspended      BOOLEAN NOT NULL DEFAULT FALSE,
  suspension_reason TEXT,
  last_login_at     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_family         TEXT NOT NULL,
  refresh_token_hash   TEXT NOT NULL,
  device_fingerprint   TEXT,
  ip_address           INET,
  user_agent           TEXT,
  expires_at           TIMESTAMPTZ NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_profiles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  mrn                  TEXT NOT NULL UNIQUE,
  first_name           TEXT NOT NULL,
  middle_name          TEXT,
  last_name            TEXT NOT NULL,
  date_of_birth        DATE NOT NULL,
  gender               TEXT NOT NULL,
  blood_group          TEXT,
  genotype             TEXT,
  photo_url            TEXT,
  liveness_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  id_card_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status  "VerificationStatus" NOT NULL DEFAULT 'unverified',
  nin_bvn_hash         TEXT,
  nationality          TEXT NOT NULL DEFAULT 'Nigerian',
  state_of_origin      TEXT,
  residential_address  JSONB,
  emergency_contact    JSONB,
  preferred_language   TEXT NOT NULL DEFAULT 'en',
  safeguarding_flag    BOOLEAN NOT NULL DEFAULT FALSE,
  safeguarding_notes   TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinician_profiles (
  id                                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  clinician_code                    TEXT NOT NULL UNIQUE,
  first_name                        TEXT NOT NULL,
  last_name                         TEXT NOT NULL,
  title                             TEXT NOT NULL,
  photo_url                         TEXT,
  primary_specialty                 TEXT NOT NULL,
  sub_specialties                   TEXT[] NOT NULL DEFAULT '{}',
  primary_licensing_body            TEXT NOT NULL,
  primary_license_number            TEXT NOT NULL,
  gmc_revalidation_due_date         DATE,
  mdcn_annual_practicing_license_date DATE,
  compliance_passport_status        "VerificationStatus" NOT NULL DEFAULT 'pending_review',
  bio                               TEXT,
  consultation_fee_cents            INTEGER NOT NULL DEFAULT 0,
  currency                          TEXT NOT NULL DEFAULT 'NGN',
  is_accepting_new_patients         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinician_credentials (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinician_id        UUID NOT NULL REFERENCES clinician_profiles(id) ON DELETE CASCADE,
  credential_type     TEXT NOT NULL,
  issuer              TEXT NOT NULL,
  certificate_number  TEXT,
  document_url        TEXT NOT NULL,
  issue_date          DATE NOT NULL,
  expiry_date         DATE,
  verification_status "VerificationStatus" NOT NULL DEFAULT 'pending_review',
  verified_at         TIMESTAMPTZ,
  verification_notes  TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability_slots (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinician_id     UUID NOT NULL REFERENCES clinician_profiles(id) ON DELETE CASCADE,
  start_time       TIMESTAMPTZ NOT NULL,
  end_time         TIMESTAMPTZ NOT NULL,
  is_booked        BOOLEAN NOT NULL DEFAULT FALSE,
  is_recurring     BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_rule  TEXT,
  is_emergency_slot BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id                    UUID NOT NULL REFERENCES patient_profiles(id),
  clinician_id                  UUID NOT NULL REFERENCES clinician_profiles(id),
  slot_id                       UUID UNIQUE REFERENCES availability_slots(id),
  scheduled_start               TIMESTAMPTZ NOT NULL,
  scheduled_end                 TIMESTAMPTZ NOT NULL,
  status                        "AppointmentStatus" NOT NULL DEFAULT 'booked',
  encounter_type                "EncounterType" NOT NULL DEFAULT 'telemedicine_video',
  cancellation_reason           TEXT,
  patient_checked_in_at         TIMESTAMPTZ,
  patient_joined_waiting_room_at TIMESTAMPTZ,
  clinician_joined_room_at      TIMESTAMPTZ,
  consultation_started_at       TIMESTAMPTZ,
  consultation_ended_at         TIMESTAMPTZ,
  room_sid                      TEXT,
  idempotency_key               TEXT UNIQUE,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_allergies (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  substance   TEXT NOT NULL,
  reaction    TEXT NOT NULL,
  severity    "SeverityLevel" NOT NULL DEFAULT 'moderate',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_conditions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  condition_name  TEXT NOT NULL,
  icd10_code      TEXT,
  diagnosis_date  DATE,
  status          TEXT NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS formulary_medications (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jurisdiction          TEXT NOT NULL DEFAULT 'NG',
  generic_name          TEXT NOT NULL,
  brand_names           TEXT[] NOT NULL DEFAULT '{}',
  dosage_form           TEXT NOT NULL,
  strengths             TEXT[] NOT NULL DEFAULT '{}',
  standard_route        TEXT NOT NULL,
  is_controlled_substance BOOLEAN NOT NULL DEFAULT FALSE,
  contraindications     TEXT[] NOT NULL DEFAULT '{}',
  interaction_keywords  TEXT[] NOT NULL DEFAULT '{}',
  black_box_warning     TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinical_notes (
  id                              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id                  UUID NOT NULL UNIQUE REFERENCES appointments(id),
  patient_id                      UUID NOT NULL REFERENCES patient_profiles(id),
  clinician_id                    UUID NOT NULL REFERENCES clinician_profiles(id),
  version                         INTEGER NOT NULL DEFAULT 1,
  is_locked                       BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at                       TIMESTAMPTZ,
  presenting_complaint            TEXT NOT NULL,
  history_of_presenting_complaint TEXT NOT NULL,
  past_medical_history            TEXT,
  past_surgical_history           TEXT,
  drug_history                    TEXT,
  social_history                  TEXT,
  family_history                  TEXT,
  review_of_systems               JSONB,
  examination_findings            TEXT,
  vitals                          JSONB,
  primary_diagnosis_code          TEXT,
  primary_diagnosis_name          TEXT NOT NULL,
  secondary_diagnoses             JSONB NOT NULL DEFAULT '[]',
  differential_diagnoses          TEXT,
  clinical_reasoning              TEXT,
  treatment_plan                  TEXT NOT NULL,
  follow_up_instructions          TEXT,
  safety_netting_advice           TEXT NOT NULL,
  ai_generated_draft              BOOLEAN NOT NULL DEFAULT FALSE,
  ai_model_version                TEXT,
  clinician_reviewed_and_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinical_note_amendments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinical_note_id  UUID NOT NULL REFERENCES clinical_notes(id) ON DELETE CASCADE,
  amended_by_user_id UUID NOT NULL,
  amendment_reason  TEXT NOT NULL,
  previous_content  JSONB NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_code      TEXT NOT NULL UNIQUE,
  appointment_id         UUID REFERENCES appointments(id),
  patient_id             UUID NOT NULL REFERENCES patient_profiles(id),
  clinician_id           UUID NOT NULL REFERENCES clinician_profiles(id),
  status                 "PrescriptionStatus" NOT NULL DEFAULT 'authorized',
  digital_signature_hash TEXT NOT NULL,
  signed_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dispensing_pharmacy_notes TEXT,
  pdf_document_url       TEXT,
  idempotency_key        TEXT UNIQUE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prescription_items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id     UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medication_name     TEXT NOT NULL,
  strength            TEXT NOT NULL,
  dosage              TEXT NOT NULL,
  frequency           TEXT NOT NULL,
  route               TEXT NOT NULL,
  duration            TEXT NOT NULL,
  quantity            INTEGER NOT NULL,
  special_instructions TEXT,
  repeats_allowed     INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investigation_orders (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code                TEXT NOT NULL UNIQUE,
  appointment_id            UUID REFERENCES appointments(id),
  patient_id                UUID NOT NULL REFERENCES patient_profiles(id),
  clinician_id              UUID NOT NULL REFERENCES clinician_profiles(id),
  test_type                 TEXT NOT NULL,
  clinical_indication       TEXT NOT NULL,
  status                    "InvestigationStatus" NOT NULL DEFAULT 'ordered',
  priority                  TEXT NOT NULL DEFAULT 'routine',
  requires_clinician_review BOOLEAN NOT NULL DEFAULT TRUE,
  reviewed_at               TIMESTAMPTZ,
  clinician_commentary      TEXT,
  released_to_patient       BOOLEAN NOT NULL DEFAULT FALSE,
  released_at               TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investigation_results (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id             UUID NOT NULL REFERENCES investigation_orders(id) ON DELETE CASCADE,
  parameter_name       TEXT NOT NULL,
  numeric_value        DOUBLE PRECISION,
  text_value           TEXT,
  unit                 TEXT,
  reference_range_low  DOUBLE PRECISION,
  reference_range_high DOUBLE PRECISION,
  is_abnormal          BOOLEAN NOT NULL DEFAULT FALSE,
  is_critical          BOOLEAN NOT NULL DEFAULT FALSE,
  document_url         TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_feedbacks (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id      UUID NOT NULL UNIQUE REFERENCES appointments(id),
  patient_id          UUID NOT NULL REFERENCES patient_profiles(id),
  clinician_id        UUID NOT NULL REFERENCES clinician_profiles(id),
  rating              INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  clarity_rating      INTEGER CHECK (clarity_rating BETWEEN 1 AND 5),
  feedback_comments   TEXT,
  is_published        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Compliance & Audit Tables ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id),
  role          TEXT,
  action        TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id   TEXT NOT NULL,
  ip_address    INET,
  user_agent    TEXT,
  jurisdiction  TEXT,
  metadata      JSONB,
  hash          TEXT NOT NULL, -- SHA-256 tamper-evident chained hash
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cross_border_transfer_logs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id        TEXT NOT NULL,
  clinician_id      TEXT NOT NULL,
  from_jurisdiction TEXT NOT NULL,
  to_jurisdiction   TEXT NOT NULL,
  data_tier         TEXT NOT NULL,
  legal_basis       TEXT NOT NULL,
  transfer_token    TEXT NOT NULL UNIQUE,
  ip_address        INET,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Referential Indexes ───────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_mrn ON patient_profiles(mrn);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinician_status ON appointments(clinician_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_start ON appointments(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_availability_slots_clinician ON availability_slots(clinician_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_patient_allergies_patient_id ON patient_allergies(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_code ON prescriptions(prescription_code);
CREATE INDEX IF NOT EXISTS idx_investigation_orders_patient ON investigation_orders(patient_id, status);
