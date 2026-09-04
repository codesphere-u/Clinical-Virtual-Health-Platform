# ADR-011: Disaster Recovery, Backups & Sovereign Data Portability

## Status
Accepted

## Context
Healthcare organizations must never be locked in or held hostage by proprietary software vendors or development shops. In the event of vendor dissolution or catastrophic infrastructure failure, the clinical organization must retain full ownership, control, and exportability of its electronic medical records.

## Decision
1. **Sovereign Data Portability**:
   - Automated full-system exports available in open, non-proprietary standards:
     - HL7 FHIR (Fast Healthcare Interoperability Resources R4) for clinical records.
     - Normalized JSON + PostgreSQL dump schemas.
     - PDF/A-compliant archival clinical records.
2. **Encrypted Disaster Recovery Backups**:
   - Continuous WAL archiving to sovereign object storage with point-in-time recovery (PITR) up to 35 days.
   - Daily automated encrypted snapshots stored in regional secondary cloud storage.
   - Disaster recovery drills scheduled quarterly with target Recovery Point Objective (RPO) $\le 15\text{ minutes}$ and Recovery Time Objective (RTO) $\le 2\text{ hours}$.
3. **Vendor Independence**:
   - Self-contained migration scripts and documented database schemas ensure that any standard engineering team can run the system independently.

## Consequences
- Automated export utilities are built into the administrator command center under `/admin/exports`.
