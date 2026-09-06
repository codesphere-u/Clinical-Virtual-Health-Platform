# Clinical Case Management Platform (CCMP)

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.1-white?logo=fastify&logoColor=black)](https://fastify.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.2-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![LiveKit WebRTC](https://img.shields.io/badge/LiveKit-WebRTC_SFU-002B36?logo=webrtc&logoColor=white)](https://livekit.io/)
[![Flutter](https://img.shields.io/badge/Flutter-3.24-02569B?logo=flutter&logoColor=white)](https://flutter.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WCAG 2.2 AA/AAA](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA%2FAAA-059669)](docs/architecture/adr/ADR-015-web-architecture-design-system.md)
[![NDPA 2023 Compliant](https://img.shields.io/badge/Compliance-Nigeria_NDPA_2023-0D746F)](docs/architecture/adr/ADR-006-data-residency.md)
[![UK GDPR Compliant](https://img.shields.io/badge/Compliance-UK_GDPR_%2F_DPA_2018-1D4ED8)](docs/architecture/adr/ADR-006-data-residency.md)

**Enterprise-grade cross-border digital clinical case management and telemedicine ecosystem connecting patients in Nigeria with GMC-registered British specialists and accredited MDCN consultants.**

Developed under the Software Development Contract dated 1st September 2026 for **Dr. Oluwadamilola A. T. Haastrup & Dr. Oluwatosin O. O. Haastrup** by **Codesphere Innovations (U) Limited**.

[Executive Summary](docs/EXECUTIVE_SUMMARY.md) • [Phase 1–2 Completion Report](docs/PHASE_1_2_COMPLETION_REPORT.md) • [Client Presentation Guide](docs/CLIENT_PRESENTATION_WALKTHROUGH.md) • [ADR Index](docs/architecture/adr/index.md)

</div>

---

## 📑 Table of Contents

- [Platform Overview](#-platform-overview)
- [Monorepo Architecture](#-monorepo-architecture)
- [The 4 Core Web Portals](#-the-4-core-web-portals)
- [Cross-Platform Native Mobile & Desktop](#-cross-platform-native-mobile--desktop)
- [Visual Architecture: DOCAAS Clinical Design System](#-visual-architecture-docaas-clinical-design-system)
- [Clinical Safety, AI & Security Guardrails](#-clinical-safety-ai--security-guardrails)
- [Contract Milestones & Delivery Status](#-contract-milestones--delivery-status)
- [Architectural Decision Records (ADRs)](#-architectural-decision-records-adrs)
- [Quickstart & Local Development](#-quickstart--local-development)
- [Verification & Build Matrix](#-verification--build-matrix)

---

## 🏥 Platform Overview

The **Clinical Case Management Platform (CCMP)** solves the critical challenges of cross-border virtual medicine between Nigeria and the United Kingdom:

1. **Dual-Jurisdiction Compliance**: Built-in data residency routing respecting both Nigeria's **NDPA 2023** and the UK's **Data Protection Act 2018 / UK GDPR**.
2. **Clinical Safety by Design**: Real-time drug-allergy blocking engine, biometric KYC verification, and an assistive AI Scribe with mandatory clinician sign-off.
3. **High-Assurance Video Consultations**: LiveKit WebRTC SFU with adaptive bitrate, packet loss resilience, and sub-200ms latency between Lagos and London.
4. **Tamper-Evident Cryptographic Ledger**: SHA-256 chained audit trail capturing every prescription, clinical addendum, and record access event.

---

## 🏗️ Monorepo Architecture

The platform is structured as an enterprise monorepo using **pnpm workspaces** and **Turborepo**:

```text
ccmp-monorepo/
├── apps/
│   ├── patient-web/              # Next.js 15: Patient Health Portal (Port 3000)
│   ├── clinician-web/            # Next.js 15: 3-Pane Telemedicine Workstation (Port 3002)
│   ├── admin-web/                # Next.js 15: Command Center & Credentialing (Port 3003)
│   └── analytics-web/            # Next.js 15: Clinical Analytics & Audit Vault (Port 3004)
│
├── flutter/
│   ├── apps/
│   │   ├── patient/              # Native Flutter Mobile (iOS & Android)
│   │   ├── clinician/            # Native Flutter Mobile for Clinicians
│   │   └── desktop/              # Native Flutter Workstation (Windows, macOS, Linux)
│   └── packages/
│       ├── core/                 # Shared Flutter primitives & results
│       ├── design_system/        # Native Flutter DOCAAS Clinical theme & widgets
│       ├── auth/                 # Biometric KYC & secure token storage
│       ├── networking/           # Offline-resilient Dio HTTP client
│       ├── clinical/             # SOAP models & clinical vitals formatters
│       ├── appointments/         # Slot pickers & booking engines
│       └── video/                # LiveKit WebRTC client integration
│
├── packages/
│   ├── api-contracts/            # Shared Zod schemas & OpenAPI specifications
│   ├── database/                 # Prisma schema (25+ entities), migrations & seeds
│   ├── domain/                   # Business domain entities & clinical state machines
│   ├── validation/               # Clinical validators (GMC/MDCN, dosage, contraindications)
│   ├── video/                    # Provider-agnostic Video Gateway & LiveKit SFU driver
│   ├── auth/                     # Stateless JWT, rotating refresh, TOTP MFA, KYC, RBAC
│   └── design-system/            # DOCAAS Clinical tokens, Tailwind plugin, React UI
│
├── services/
│   └── api/                      # Fastify REST/OpenAPI core clinical server (Port 3001)
│
├── infrastructure/
│   └── docker/                   # Postgres 16 (pgvector), Redis 7, MinIO S3, LiveKit SFU
│
└── docs/
    ├── EXECUTIVE_SUMMARY.md      # Executive system specification & architecture
    ├── PHASE_1_2_COMPLETION_REPORT.md # Formal Milestone 1 verification & sign-off
    ├── CLIENT_PRESENTATION_WALKTHROUGH.md # Step-by-step client demo & pitch script
    └── architecture/adr/         # 15 Architectural Decision Records (ADR-001 to ADR-015)
```

---

## 💻 The 4 Core Web Portals

All four web portals are built with **Next.js 15 App Router**, utilizing React Server Components (RSC) for lightning-fast loads and persistent executive sidebar shells:

| Portal | Port | Target Persona | Key Capabilities |
| :--- | :---: | :--- | :--- |
| **[Patient Portal](apps/patient-web)** | `3000` | Nigerian & Global Patients | 5-Step Smart Booking Wizard, EHR Records, e-Prescriptions & Refills, Lab Reports, Cross-Border Consent |
| **[Clinician Workstation](apps/clinician-web)** | `3002` | British (GMC) & Nigerian (MDCN) Doctors | 3-Pane Telehealth Console, WebRTC Video Stage, SOAP Notes, AI Scribe, Automated Allergy Blocking Engine |
| **[Admin Command Center](apps/admin-web)** | `3003` | Clinical Operations & Compliance Officers | GMC/MDCN Credentialing Review Queue, User RBAC Governance, SHA-256 Audit Trail Explorer, NDPA/GDPR Compliance |
| **[Analytics Hub](apps/analytics-web)** | `3004` | Medical Directors & Executives | 97.2% Safe Prescription Rate Tracker, Specialty Volume Distribution, Cross-Border Transfer Ledger |

---

## 📱 Cross-Platform Native Mobile & Desktop

The mobile and desktop ecosystem is engineered with a **modular shared Flutter architecture** ([ADR-014](docs/architecture/adr/ADR-014-flutter-architecture.md)):

- **Patient Mobile App (`flutter/apps/patient`)**: Full mobile booking, appointment reminders, biometric authentication, and in-app video consultations.
- **Clinician Mobile App (`flutter/apps/clinician`)**: On-the-go consultation queue, urgent clinical alerts, and prescription authorization.
- **Clinician Desktop Workstation (`flutter/apps/desktop`)**: Hardware-accelerated multi-monitor clinical workstation for high-volume hospital clinics.

---

## 🎨 Visual Architecture: DOCAAS Clinical Design System

The **DOCAAS Clinical Design System** ([ADR-015](docs/architecture/adr/ADR-015-web-architecture-design-system.md)) eliminates visual clutter and cognitive fatigue while strictly enforcing **WCAG 2.2 AA/AAA** accessibility:

<div align="center">

| Token Name | Hex Code | Visual Sample | Clinical Semantics & Purpose |
| :--- | :---: | :---: | :--- |
| **`docaas-teal`** | `#0D746F` | ![#0D746F](https://via.placeholder.com/15/0D746F/000000?text=+) | **Primary Interactive Anchor**: Trust, surgical clarity, brand anchor |
| **`docaas-slate`** | `#0F172A` | ![#0F172A](https://via.placeholder.com/15/0F172A/000000?text=+) | **Neutral Surface / Text**: High-contrast, zero-eyestrain reading |
| **`docaas-emerald`**| `#059669` | ![#059669](https://via.placeholder.com/15/059669/000000?text=+) | **Verification & Trust**: GMC/MDCN verified badges, compliance checks |
| **`docaas-rose`** | `#E11D48` | ![#E11D48](https://via.placeholder.com/15/E11D48/000000?text=+) | **Critical Alert / Allergy**: Drug contraindications (always with icon + text) |
| **`docaas-amber`** | `#D97706` | ![#D97706](https://via.placeholder.com/15/D97706/000000?text=+) | **Safeguarding / Warning**: Expiring licenses, cross-border consent gates |

</div>

---

## 🛡️ Clinical Safety, AI & Security Guardrails

### 1. Automated Drug-Allergy & Contraindication Blocking
When a clinician issues an e-prescription, the prescription validation engine checks the patient's recorded drug allergies and active medications. Prescribing contraindicated medication (e.g., penicillin derivatives to an allergic patient) triggers an **immediate hard block** with clear alternative suggestions.

### 2. Assistive AI Scribe with Human-in-the-Loop ([ADR-007](docs/architecture/adr/ADR-007-ai-architecture.md))
- The AI Scribe listens to patient-clinician video dialogue and summarizes drafts into structured SOAP format.
- **Autonomous prescribing and diagnosis are strictly blocked**. Draft notes require explicit clinician review, modification, and electronic signature.

### 3. Cryptographic SHA-256 Audit Vault ([ADR-010](docs/architecture/adr/ADR-010-audit-compliance.md))
- Every action (clinical note creation, prescription issuance, record access, verification) creates an immutable block cryptographically chained to the previous entry (`prevHash === hash(n-1)`).
- Provides irrefutable forensic proof for Nigerian MDCN and British GMC medical malpractice audits.

---

## 📊 Contract Milestones & Delivery Status

Formally governed by the **Software Development Contract dated 1st September 2026 (Section 2)**:

| Milestone | Scope & Deliverables | Timeline | Weight & Amount | Current Status |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 1–2** | **Discovery & Technical Roadmap; Visual Architecture & UX Modeling** | 1.5 wks | **33.33%** ($4,000) | ✅ **100% Complete** (Invoiced / Awaiting Client Disbursement) |
| **Phase 3–4** | **Core Sprint & Logic Construction; System Integration & Optimization** | 2.5 wks | **33.33%** ($4,000) | ⚙️ **In Development** (Prerequisite: Phase 1 Payment) |
| **Phase 5–6\***| **Validation, QA & Compliance Audit; Deployment & Stakeholder Onboarding**| 1.0 wk | **33.34%** ($4,000) | ⏸️ **Backlog / Scheduled** (\*Final Handover) |

---

## 📜 Architectural Decision Records (ADRs)

All 15 foundational engineering boundaries are formally locked in **[`docs/architecture/adr/`](docs/architecture/adr/index.md)**:

1. [ADR-001: Backend Architecture (Fastify + TypeScript)](docs/architecture/adr/ADR-001-backend-architecture.md)
2. [ADR-002: Database & ORM Strategy (PostgreSQL 16, pgvector, Prisma)](docs/architecture/adr/ADR-002-database-architecture.md)
3. [ADR-003: Authentication & Identity Verification (JWT, TOTP, KYC)](docs/architecture/adr/ADR-003-authentication-architecture.md)
4. [ADR-004: Authorization, RBAC & Clinical Permissions](docs/architecture/adr/ADR-004-authorization-rbac.md)
5. [ADR-005: Provider-Agnostic Video Gateway (LiveKit SFU)](docs/architecture/adr/ADR-005-video-architecture.md)
6. [ADR-006: Dual-Jurisdiction Data Residency (NDPA 2023 & UK GDPR)](docs/architecture/adr/ADR-006-data-residency.md)
7. [ADR-007: Assistive Clinical AI Safety & Guardrails](docs/architecture/adr/ADR-007-ai-architecture.md)
8. [ADR-008: Secure Medical Document & Imaging Storage (AES-256 S3/MinIO)](docs/architecture/adr/ADR-008-file-document-storage.md)
9. [ADR-009: Realtime Waiting Room State Machine & Heartbeats](docs/architecture/adr/ADR-009-realtime-architecture.md)
10. [ADR-010: Tamper-Evident SHA-256 Audit Trail](docs/architecture/adr/ADR-010-audit-compliance.md)
11. [ADR-011: Disaster Recovery & Sovereign Data Portability (HL7 FHIR)](docs/architecture/adr/ADR-011-disaster-recovery.md)
12. [ADR-012: Observability, Structured Logging & Health Diagnostics](docs/architecture/adr/ADR-012-observability.md)
13. [ADR-013: API Versioning, Idempotency & Contracts](docs/architecture/adr/ADR-013-api-versioning-idempotency.md)
14. [ADR-014: Modular Shared Flutter Architecture for Mobile & Desktop](docs/architecture/adr/ADR-014-flutter-architecture.md)
15. [ADR-015: Web Architecture & DOCAAS Clinical Design System](docs/architecture/adr/ADR-015-web-architecture-design-system.md)

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose

### 1. Spin Up Core Infrastructure
```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```
Starts:
- **PostgreSQL 16 (pgvector)**: `localhost:5432`
- **Redis 7 (Pub/Sub & Cache)**: `localhost:6379`
- **MinIO S3 Object Store**: `localhost:9000` (Console: `9001`)
- **LiveKit WebRTC SFU**: `localhost:7880`

### 2. Database Migration & Realistic Clinical Seeding
```bash
pnpm run db:generate
pnpm run db:push
pnpm run db:seed
```
Seeds:
- 20 Nigerian patients (spanning Lagos, Abuja, Port Harcourt, Enugu, Kano).
- 10 British & Nigerian GMC/MDCN specialists with verified licenses.
- 50 appointments across all states (booked, waiting, completed).
- Full structured SOAP notes, allergy profiles, and electronic prescriptions.

### 3. Launch Development Servers
```bash
pnpm run dev
```

Access the applications:
- **Patient Portal**: [http://localhost:3000](http://localhost:3000)
- **Clinician Workstation**: [http://localhost:3002](http://localhost:3002)
- **Admin Command Center**: [http://localhost:3003](http://localhost:3003)
- **Analytics Intelligence Hub**: [http://localhost:3004](http://localhost:3004)
- **Clinical Fastify API**: [http://localhost:3001](http://localhost:3001)

---

## 🧪 Verification & Build Matrix

Run recursive type-checking across all 12 monorepo packages:
```bash
pnpm -r run typecheck
```

```text
✓ @clinical/database:      typecheck passed (0 errors)
✓ @clinical/design-system: typecheck passed (0 errors)
✓ @clinical/domain:        typecheck passed (0 errors)
✓ @clinical/models:        typecheck passed (0 errors)
✓ @clinical/video:         typecheck passed (0 errors)
✓ @clinical/validation:    typecheck passed (0 errors)
✓ @clinical/auth:          typecheck passed (0 errors)
✓ @clinical/patient-web:   typecheck passed (0 errors)
✓ @clinical/clinician-web: typecheck passed (0 errors)
✓ @clinical/admin-web:     typecheck passed (0 errors)
✓ @clinical/analytics-web: typecheck passed (0 errors)
✓ @clinical/api:           typecheck passed (0 errors)

Result: 12 of 12 packages passing with zero errors.
```

---

<div align="center">

**Clinical Case Management Platform (CCMP)**  
Engineered with ❤️ by **Codesphere Innovations (U) Limited**  
Confidential & Proprietary © 2026 Dr. Oluwadamilola A. T. Haastrup & Dr. Oluwatosin O. O. Haastrup

</div>