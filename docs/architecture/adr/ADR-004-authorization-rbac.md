# ADR-004: Authorization, RBAC & Clinical Permission Matrices

## Status
Accepted

## Context
Clinical systems demand fine-grained access control. A coarse role-based check (e.g. `if (role === 'clinician')`) is dangerous: a clinician must not view unassigned patient records without an active clinical relationship or booked appointment, except under audited emergency override ("break-glass").

## Decision
We implement a hybrid **Role-Based and Attribute-Based Access Control (RBAC + ABAC)** model.

1. **Roles**:
   - `patient`: Own medical records, appointments, messaging with assigned clinicians, own feedback.
   - `clinician`: Assigned consultations, active waiting patients, clinical notes, prescriptions for assigned patients, aggregate feedback reports.
   - `admin`: Operational monitoring, clinician verification approvals, compliance passports, user status management. Explicitly prohibited from viewing unmasked clinical encounter notes.
   - `safeguarding_lead`: Designated role with access to safeguarding cases and crisis escalations.
   - `auditor`: Immutable audit trail inspection and compliance reporting.
2. **Contextual ABAC Policies**:
   - Record access requires `ActiveRelationship(clinicianId, patientId)` derived from a confirmed appointment within a valid clinical window ($\pm 7\text{ days}$).
   - "Break-glass" emergency access requires explicit clinical justification, triggers immediate alert to the Data Protection Officer (DPO), and enters high-priority audit logs.

## Consequences
- Every protected route enforces declarative permission middleware (`requirePermission('records:read', { checkRelationship: true })`).
