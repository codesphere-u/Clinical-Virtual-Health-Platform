# Clinical Case Management Platform (CCMP)
# Master Documentation Directory

Welcome to the central technical and executive documentation vault for the **Clinical Case Management Platform (CCMP)**.

---

## 📚 Document Index & Navigation

### 1. Executive & Client Governance
- 📄 **[Executive Architecture & System Specification](EXECUTIVE_SUMMARY.md)**: High-level overview of system topology, cross-border healthcare delivery, data residency, and clinical capability matrices.
- 📄 **[Milestone 1 (Phase 1–2) Formal Completion Report](PHASE_1_2_COMPLETION_REPORT.md)**: Detailed verification matrix, contract milestone audit ($4,000 USD), code compilation results, and formal client sign-off block.
- 📄 **[Client Presentation & Demonstration Walkthrough](CLIENT_PRESENTATION_WALKTHROUGH.md)**: Slide-by-slide presentation script, live demonstration guide, and commercial next steps.

---

### 2. Architectural Decision Records (ADRs)
All architectural decisions are codified across 15 formal records in **[`docs/architecture/adr/`](architecture/adr/index.md)**:

| ADR | Title | Key Architectural Decision |
| :--- | :--- | :--- |
| **[ADR-001](architecture/adr/ADR-001-backend-architecture.md)** | Backend Architecture & Tech Stack | TypeScript + Node.js with Fastify for microsecond response times and Zod type-sharing. |
| **[ADR-002](architecture/adr/ADR-002-database-architecture.md)** | Database & ORM Strategy | PostgreSQL 16 with pgvector extension, Prisma ORM as primary schema source of truth. |
| **[ADR-003](architecture/adr/ADR-003-authentication-architecture.md)** | Auth & Identity Verification | Stateless JWTs, rotating refresh tokens, TOTP 2FA, passive liveness KYC. |
| **[ADR-004](architecture/adr/ADR-004-authorization-rbac.md)** | Authorization, RBAC & Permissions | Fine-grained RBAC/ABAC with clinical relationship verification and emergency break-glass. |
| **[ADR-005](architecture/adr/ADR-005-video-architecture.md)** | Provider-Agnostic Video Gateway | LiveKit WebRTC SFU with adaptive bitrate and automated multi-provider failover. |
| **[ADR-006](architecture/adr/ADR-006-data-residency.md)** | Dual-Jurisdiction Data Residency | Nigeria NDPA 2023 & UK GDPR compliance with sovereign regional storage and logged syncs. |
| **[ADR-007](architecture/adr/ADR-007-ai-architecture.md)** | Assistive Clinical AI Safety | Human-in-the-loop AI Scribe; strict prohibition on autonomous prescribing/diagnosis. |
| **[ADR-008](architecture/adr/ADR-008-file-document-storage.md)** | Medical Document & Imaging Storage | MinIO/S3 object storage with AES-256 server-side encryption and time-limited pre-signed URLs. |
| **[ADR-009](architecture/adr/ADR-009-realtime-architecture.md)** | Realtime Waiting Room State Machine | WebSocket server with Redis 7 Pub/Sub and 10-second heartbeats for instant queue tracking. |
| **[ADR-010](architecture/adr/ADR-010-audit-compliance.md)** | Tamper-Evident SHA-256 Audit Trail | Append-only cryptographically chained audit vault (`prevHash === hash(n-1)`). |
| **[ADR-011](architecture/adr/ADR-011-disaster-recovery.md)** | Disaster Recovery & Data Portability | HL7 FHIR export schemas, WAL continuous archiving, RPO < 15 min, RTO < 1 hour. |
| **[ADR-012](architecture/adr/ADR-012-observability.md)** | Observability & Structured Logging | Pino structured JSON logging with automated redaction of Personal Health Information (PHI). |
| **[ADR-013](architecture/adr/ADR-013-api-versioning-idempotency.md)** | API Versioning & Idempotency | Contract-first Zod schemas, `/api/v1` URL prefixes, Redis idempotency keys. |
| **[ADR-014](architecture/adr/ADR-014-flutter-architecture.md)** | Modular Shared Flutter Architecture | Cross-platform mobile (iOS/Android) and desktop workstation using decoupled packages. |
| **[ADR-015](architecture/adr/ADR-015-web-architecture-design-system.md)** | Web Architecture & Aura Design System | Next.js 15 App Router, React Server Components, Aura Clinical palette, WCAG 2.2 AA/AAA. |

---

## 🏛️ Platform Portals & Route Maps

### 1. Patient Portal (`apps/patient-web` — Port 3000)
- `/` — Patient Dashboard (Upcoming consultations, recent vitals, prescriptions summary)
- `/appointments` — 5-Step Smart Booking Wizard with UK/NG specialist matching
- `/records` — Chronological EHR Timeline with doctor addenda
- `/prescriptions` — Active medications, dosage instructions, one-click refill requests
- `/lab-results` — Diagnostic test reports and imaging viewer
- `/settings` — Profile, 2FA security, and cross-border data residency consent

### 2. Clinician Workstation (`apps/clinician-web` — Port 3002)
- `/` — Clinician Dashboard (Today's queue, pending notes, active patients)
- `/consultation` — 3-Pane Telemedicine Console (WebRTC SFU, SOAP Notes, AI Scribe, e-Rx with allergy alerts)
- `/schedule` — Virtual Waiting Room & appointment slot management
- `/history` — Historical consultations and addenda records
- `/patients` — Patient roster with medical snapshots

### 3. Admin Command Center (`apps/admin-web` — Port 3003)
- `/` — Executive Operational Dashboard (Live SFU nodes, system uptime, active sessions)
- `/clinicians` — GMC & MDCN Credentialing Queue with document inspection drawer
- `/users` — Identity directory & Role-Based Access Control (RBAC) governance
- `/audit` — Tamper-evident SHA-256 cryptographic audit chain explorer
- `/compliance` — Regulatory compliance center for NDPA 2023 & UK GDPR
- `/settings` — Global system configuration & emergency freeze controls

### 4. Analytics Intelligence Hub (`apps/analytics-web` — Port 3004)
- `/` — Executive KPI Dashboard (Consultation volumes, active clinicians, safety rate)
- `/consultations` — Specialty distribution & clinician performance metrics
- `/prescriptions` — Formulary safety analytics and allergy block statistics
- `/cross-border` — Sovereignty monitor tracking Nigerian domestic vs. UK-Nigeria transfers
- `/audit` — Cryptographic Merkle root validation and chain integrity monitor

---

## 🛡️ Regulatory & Legal Compliance Matrices
- **Nigeria**: Nigeria Data Protection Act (NDPA 2023), Federal Ministry of Health telemedicine guidelines, MDCN licensing.
- **United Kingdom**: UK General Data Protection Regulation (UK GDPR), Data Protection Act 2018, GMC Good Medical Practice.
