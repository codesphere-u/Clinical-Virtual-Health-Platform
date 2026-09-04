# ADR-006: Dual-Jurisdiction Data Residency Policy Engine

## Status
Accepted

## Context
The platform initially operates across two primary legal and regulatory zones:
1. **Nigeria**: Governed by the Nigeria Data Protection Act 2023 (NDPA), National Information Technology Development Agency (NITDA) guidelines, and Medical and Dental Council of Nigeria (MDCN) ethics.
2. **United Kingdom**: Governed by UK GDPR, Data Protection Act 2018, and General Medical Council (GMC) guidance for remote consultations.

Assuming that simple consent or database replication across regions satisfies cross-border health requirements is legally and technically unsound.

## Decision
We implement a dedicated **Data Residency Policy Engine** enforcing primary jurisdictional storage with controlled, logged cross-border transfers.

1. **Topology**:
   - **Nigeria Region (Lagos)**: Primary storage for Nigerian patient demographic records, full clinical notes, local lab orders, and raw medical imaging.
   - **UK Region (London)**: Primary storage for UK clinician compliance passports, GMC credential verifications, and UK audit mirrors.
2. **Data Residency Evaluation Matrix**:
   Before any record crosses jurisdictional boundaries, the Engine evaluates:
   - `patient.jurisdiction`
   - `clinician.jurisdiction`
   - `record.classification` (Tier 1: Direct Identifiers, Tier 2: De-identified Clinical Notes, Tier 3: Diagnostic Images)
   - `legal_basis` (Direct clinical care contract, explicit safeguarding mandate, or statutory patient consent)
3. **Cross-Border Transfer Gateway**:
   - When a UK clinician accesses a Nigerian patient's record during an authorized consultation, data is streamed in-memory via an encrypted session tunnel without permanent persistence in UK regional databases.
   - Every cross-border transfer generates an immutable `CrossBorderTransferEvent` in the audit vault recording transferring IP, destination country, accessing clinician, and legal basis.

## Consequences
- Compliance rules are configurable policy inputs, never hard-coded statutory assumptions.
- Independent database and object store endpoints are maintained per region.
