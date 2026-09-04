-- ============================================================================
-- Migration 0002: Performance Indexes for Audit, Compliance & Analytics
-- Applied by: packages/database/src/migrate.ts
-- Purpose: Supports Phase 5 analytics queries and regulatory audit reporting
-- ============================================================================

-- ── Audit Vault Indexes ───────────────────────────────────────────────────────

-- Jurisdiction + timestamp: primary analytics query pattern for cross-border reporting
CREATE INDEX IF NOT EXISTS idx_audit_events_jurisdiction_ts
  ON audit_events(jurisdiction, created_at DESC);

-- Action + resource: for event-type filtering in the Audit Vault Inspector
CREATE INDEX IF NOT EXISTS idx_audit_events_action_resource
  ON audit_events(action, resource_type, resource_id);

-- User-centric audit trail (who did what)
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id_ts
  ON audit_events(user_id, created_at DESC);

-- ── Cross-Border Transfer Indexes ─────────────────────────────────────────────

-- Flow direction analytics (NG→GB, GB→NG)
CREATE INDEX IF NOT EXISTS idx_xborder_jurisdiction_flow
  ON cross_border_transfer_logs(from_jurisdiction, to_jurisdiction, created_at DESC);

-- Legal basis breakdown (NDPA Sec 43 vital interest vs. explicit consent)
CREATE INDEX IF NOT EXISTS idx_xborder_legal_basis
  ON cross_border_transfer_logs(legal_basis, created_at DESC);

-- ── Clinical Analytics Indexes ────────────────────────────────────────────────

-- Consultation volume by specialty: requires joining clinician_profiles
CREATE INDEX IF NOT EXISTS idx_appointments_status_ts
  ON appointments(status, scheduled_start DESC);

-- Prescription safety: dispensing status monitoring
CREATE INDEX IF NOT EXISTS idx_prescriptions_status_ts
  ON prescriptions(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prescriptions_clinician_ts
  ON prescriptions(clinician_id, created_at DESC);

-- Investigation throughput (ordered → resulted turnaround time)
CREATE INDEX IF NOT EXISTS idx_investigations_status_ts
  ON investigation_orders(status, created_at DESC);

-- Clinician workload and utilization
CREATE INDEX IF NOT EXISTS idx_appointments_clinician_ts
  ON appointments(clinician_id, scheduled_start DESC);

-- ── Waiting Room Analytics ────────────────────────────────────────────────────

-- Active waiting room query (real-time admin dashboard)
CREATE INDEX IF NOT EXISTS idx_appointments_waiting
  ON appointments(status)
  WHERE status IN ('patient_waiting', 'clinician_ready');

-- ── Patient Feedback Metrics ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_feedback_clinician
  ON patient_feedbacks(clinician_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_rating
  ON patient_feedbacks(rating, created_at DESC);

-- ── Full-Text Search Support ──────────────────────────────────────────────────

-- Clinical note full-text search (presenting complaint + diagnosis)
CREATE INDEX IF NOT EXISTS idx_clinical_notes_fts
  ON clinical_notes USING GIN (
    to_tsvector('english',
      COALESCE(presenting_complaint, '') || ' ' ||
      COALESCE(primary_diagnosis_name, '') || ' ' ||
      COALESCE(treatment_plan, '')
    )
  );

-- ── Formulary Search ──────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_formulary_generic_name
  ON formulary_medications USING GIN (to_tsvector('english', generic_name));

CREATE INDEX IF NOT EXISTS idx_formulary_jurisdiction
  ON formulary_medications(jurisdiction);

-- ── Updated_at Triggers for automatic timestamp management ────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'organizations', 'users', 'patient_profiles', 'clinician_profiles',
    'appointments', 'clinical_notes'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I;
       CREATE TRIGGER trg_%I_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END;
$$;
