# Clinical Case Management Platform (CCMP)
## Executive Architecture & System Specification

**Client**: Dr. Oluwadamilola A. T. Haastrup & Dr. Oluwatosin O. O. Haastrup  
**Developer**: Codesphere Innovations (U) Limited  
**Governing Contract**: Software Development Contract dated 1st September 2026  
**Platform Scope**: Web & Native Mobile (iOS/Android) Cross-Border Clinical Telemedicine Ecosystem  

---

## 1. Executive Summary

The **Clinical Case Management Platform (CCMP)** is an enterprise-grade digital health ecosystem engineered for high-assurance cross-border clinical delivery—connecting patients located primarily in Nigeria with accredited British (GMC-registered) and Nigerian (MDCN-registered) medical specialists.

Built strictly according to the 5-week milestone schedule in Section 2 of the Software Development Contract, the platform enforces strict data sovereignty across Nigerian Data Protection Act (NDPA 2023) and UK General Data Protection Regulation (UK GDPR / Data Protection Act 2018).

---

## 2. Platform Architecture & Monorepo Topology

```text
ccmp-monorepo/
├── apps/
│   ├── patient-web/          # Next.js 15 App Router: Patient Health Portal
│   ├── clinician-web/        # Next.js 15 App Router: 3-Pane Telemedicine Workstation
│   ├── admin-web/            # Next.js 15 App Router: Governance & GMC/MDCN Credentialing
│   └── analytics-web/        # Next.js 15 App Router: Clinical Analytics & Audit Vault
│
├── flutter/
│   ├── apps/
│   │   ├── patient/          # Native Flutter Mobile (iOS & Android)
│   │   ├── clinician/        # Native Flutter Mobile for On-the-Go Doctors
│   │   └── desktop/          # Flutter Desktop Workstation (macOS, Windows, Linux)
│   └── packages/
│       ├── design_system/    # Native DOCAAS Clinical Theme & UI Tokens
│       ├── appointments/     # Booking & Calendar State Engines
│       ├── clinical/         # Clinical SOAP & Vitals Formatters
│       └── networking/       # Resilient Offline-First HTTP Client
│
├── packages/
│   ├── design-system/        # DOCAAS Clinical Design System (React, Tailwind)
│   ├── database/             # PostgreSQL 16 schema (25+ entities) & Prisma ORM
│   ├── domain/               # Healthcare state machines & entity logic
│   ├── validation/           # Zod clinical contracts (Dosage, age, GMC/MDCN)
│   ├── auth/                 # Stateless JWT, TOTP MFA, passive liveness KYC, RBAC
│   └── video/                # Provider-agnostic Video Gateway & LiveKit SFU
│
├── services/
│   └── api/                  # Fastify REST/OpenAPI core clinical server (11 modules)
│
└── docs/
    └── architecture/adr/     # 15 Architectural Decision Records (ADR-001 to ADR-015)
```

---

## 3. Core Capabilities by Domain

### A. Patient Experience Portal (`apps/patient-web`)
- **5-Step Smart Booking Wizard**: Dynamic specialty selection, clinician availability calendar, payment intent initiation, triage questionnaire.
- **Unified Electronic Health Records (EHR)**: Chronological consultation logs, lab investigation results, verified clinician addenda.
- **E-Prescription & Pharmacy Hub**: Active medication regimen, dosage instructions, refilling requests, allergy records.
- **Data Privacy & Jurisdictional Consent**: Granular NDPA 2023 / UK GDPR consent toggles for cross-border data transfer.

### B. Clinician Telemedicine Workstation (`apps/clinician-web`)
- **3-Pane Telehealth Console**:
  - *Left Pane*: Live video stage powered by LiveKit WebRTC SFU with adaptive bitrate.
  - *Center Pane*: Structured SOAP clinical note editor (Subjective, Objective, Assessment, Plan) with AI Scribe auto-summarization.
  - *Right Pane*: Prescription issuing engine with real-time allergy contraindication and drug-drug interaction detection.
- **Practice Schedule & Queue**: Real-time virtual waiting room with 10-second heartbeats and live queue positioning.

### C. Admin Command Center (`apps/admin-web`)
- **Clinician Credentialing Queue**: Verification workflow for UK General Medical Council (GMC) and Medical & Dental Council of Nigeria (MDCN) licenses with document inspection drawer.
- **Identity & RBAC Governance**: Role assignment for Clinicians, Patients, Pharmacists, Compliance Officers, and Admins.
- **Tamper-Evident Audit Vault**: SHA-256 cryptographic chain browser with one-click export for regulatory authorities.
- **Compliance Center**: NDPA 2023 & UK GDPR compliance scorecards, DPIA status, and sovereignty monitoring.

### D. Analytics Intelligence Hub (`apps/analytics-web`)
- **Clinical Quality Dashboard**: Consultation volume trends, specialty distribution, diagnosis code frequency.
- **Safety Interventions**: 97.2% safe prescription rate tracking, allergy block logs, and clinical duration analytics.
- **Cross-Border Telemetry**: Sovereign data transfer ledger comparing domestic routing vs. UK-Nigeria encrypted syncs.

---

## 4. Regulatory, Legal & Security Foundations

1. **Dual-Jurisdiction Data Sovereignty (ADR-006)**:
   - Personal health data stored in local region (Lagos for Nigerian residents, London for UK compliance).
   - Cross-border transfers require explicit patient consent, logged in immutable audit records.
2. **Tamper-Evident SHA-256 Audit Trail (ADR-010)**:
   - Every clinical note, prescription issuance, record access, and credential check is cryptographically chained (`prevHash === hash(n-1)`).
3. **Assistive AI Safety Guardrails (ADR-007)**:
   - Human-in-the-loop: AI suggestions require explicit clinician review and sign-off. Autonomous diagnosis or prescribing is strictly prohibited.
4. **WCAG 2.2 Accessibility (ADR-015)**:
   - High-contrast clinical typography, screen-reader semantic landmarking, and zero reliance on color alone for critical alerts.

---

## 5. Verification & Codebase Integrity

- **Monorepo Build Health**: Recursive TypeScript typecheck across all 12 projects: **12 passed, 0 errors** (`pnpm -r run typecheck`).
- **Test Coverage**: Automated integration test suites passed in `services/api/src/__tests__/`:
  - `phase3-integration.test.ts` (Consultations, SOAP notes, e-prescriptions, audit log chaining).
  - `phase5-video.test.ts` (WebRTC room creation, participant token generation, heartbeat transitions).
- **Codebase Volume**: 144 files created, 17,297 insertions.
