# ADR-010: Tamper-Evident SHA-256 Audit Trail

## Status
Accepted

## Context
Clinical litigation, GMC disciplinary inquiries, and data protection statutes require unalterable, non-repudiable proof of who accessed, created, or modified any medical record, e-prescription, or credential. Traditional relational database records with `updated_at` timestamps can be quietly altered by database administrators.

## Decision
We implement an **Append-Only, Cryptographically Chained Audit Vault**:

1. **Hash Chaining**:
   - Each audit log entry calculates an immutable cryptographic signature:
     $$\text{Hash}_n = \text{SHA-256}(\text{Hash}_{n-1} \,\|\, \text{Timestamp} \,\|\, \text{UserId} \,\|\, \text{Action} \,\|\, \text{ResourceId} \,\|\, \text{PayloadHash})$$
   - Any modification or deletion of past audit events invalidates the cryptographic chain for all subsequent entries.
2. **Database Permissions**:
   - The database role utilized by the core application has `INSERT` and `SELECT` privileges only on `audit_events`. `UPDATE`, `DELETE`, and `TRUNCATE` privileges are strictly revoked at the database engine level.
3. **Clinical Immutability**:
   - Clinical notes cannot be modified in place once signed. Edits create an explicit `ClinicalNoteAmendment` record capturing amendment justification, author, and timestamp while preserving the original text.

## Consequences
- Compliance auditors can independently verify cryptographic integrity using a verification CLI tool.
