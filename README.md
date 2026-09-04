# Next-Generation Clinical & Virtual Health Platform

An enterprise-grade, high-assurance telemedicine and electronic clinical management system engineered for cross-border healthcare delivery—connecting **patients in Nigeria** with **predominantly British/GMC-registered clinicians**, built for worldwide multi-jurisdiction scalability.

---

## 🏗️ Architecture & Monorepo Structure

```text
clinical-platform/
├── apps/
│   ├── patient-web/              # Next.js 15 App Router (Consumer Patient Portal)
│   ├── clinician-web/            # Next.js 15 App Router (Clinician Workstation & Video Room)
│   ├── admin-web/                # Next.js 15 App Router (Admin Command Center & Audit Vault)
│   └── analytics-web/            # Next.js 15 App Router (Executive Clinical Analytics & Compliance)
│
├── flutter/
│   ├── apps/
│   │   ├── patient/              # Flutter Mobile (iOS / Android)
│   │   ├── clinician/            # Flutter Mobile for Clinicians
│   │   └── desktop/              # Flutter Desktop Workstation (Windows, macOS, Linux)
│   └── packages/
│       ├── core/                 # Shared Flutter primitives & results
│       ├── design_system/        # Flutter Aura Clinical theme & widgets
│       ├── auth/                 # Biometric KYC & secure token storage
│       ├── networking/           # Dio client with offline resilience
│       ├── clinical/             # SOAP models & vitals formatters
│       ├── appointments/         # Slot pickers & booking state
│       └── video/                # LiveKit WebRTC client integration
│
├── packages/
│   ├── api-contracts/            # Zod schemas & OpenAPI specifications
│   ├── database/                 # Prisma schema, migrations & seed scripts
│   ├── domain/                   # Business entities, state machines & rules
│   ├── validation/               # Clinical validators (GMC/MDCN, dosage, age)
│   ├── video/                    # Provider-agnostic VideoGateway & LiveKit driver
│   └── design-system/            # Aura Clinical tokens, Tailwind plugin, React UI
│
├── services/
│   └── api/                      # Fastify REST/OpenAPI core clinical server
│
├── infrastructure/
│   └── docker/                   # Postgres 16 (pgvector), Redis 7, MinIO, LiveKit
│
└── docs/
    └── architecture/
        └── adr/                  # 15 Architecture Decision Records (ADR-001 to ADR-015)
```

---

## 📜 Architectural Decision Records (ADRs)

All foundational engineering boundaries are formally locked through 15 ADRs in `docs/architecture/adr/`:

1. [ADR-001: Backend Architecture (Fastify + TypeScript)](docs/architecture/adr/ADR-001-backend-architecture.md)
2. [ADR-002: Database & ORM Strategy (Prisma primary, Kysely exceptional)](docs/architecture/adr/ADR-002-database-architecture.md)
3. [ADR-003: Authentication & Identity Verification](docs/architecture/adr/ADR-003-authentication-architecture.md)
4. [ADR-004: Authorization, RBAC & Clinical Permissions](docs/architecture/adr/ADR-004-authorization-rbac.md)
5. [ADR-005: Provider-Agnostic Video Gateway Architecture](docs/architecture/adr/ADR-005-video-architecture.md)
6. [ADR-006: Dual-Jurisdiction Data Residency Policy Engine (NG NDPA & UK GDPR)](docs/architecture/adr/ADR-006-data-residency.md)
7. [ADR-007: Assistive Clinical AI Safety & Guardrails](docs/architecture/adr/ADR-007-ai-architecture.md)
8. [ADR-008: Secure Document & Medical Imaging Storage](docs/architecture/adr/ADR-008-file-document-storage.md)
9. [ADR-009: Realtime Waiting Room State Machine & Heartbeats](docs/architecture/adr/ADR-009-realtime-architecture.md)
10. [ADR-010: Tamper-Evident SHA-256 Audit Trail](docs/architecture/adr/ADR-010-audit-compliance.md)
11. [ADR-011: Disaster Recovery & Sovereign Data Portability](docs/architecture/adr/ADR-011-disaster-recovery.md)
12. [ADR-012: Observability, Structured Logging & Health Diagnostics](docs/architecture/adr/ADR-012-observability.md)
13. [ADR-013: API Versioning, Idempotency & Contracts](docs/architecture/adr/ADR-013-api-versioning-idempotency.md)
14. [ADR-014: Modular Shared Flutter Architecture for Mobile & Desktop](docs/architecture/adr/ADR-014-flutter-architecture.md)
15. [ADR-015: Web Architecture & Aura Clinical Design System](docs/architecture/adr/ADR-015-web-architecture-design-system.md)

---

## 🚀 Quickstart & Development

### 1. Start Local Infrastructure
```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```
Starts:
- PostgreSQL 16 on `localhost:5432`
- Redis on `localhost:6379`
- MinIO Object Store on `localhost:9000` (Console: `9001`)
- LiveKit WebRTC SFU on `localhost:7880`

### 2. Generate Prisma Database & Seed Realistic Data
```bash
pnpm run db:generate
pnpm run db:push
pnpm run db:seed
```
Seeds:
- 20 Nigerian patients (spanning Lagos, Abuja, Port Harcourt, Enugu, etc.)
- 10 British & Nigerian GMC/MDCN specialists
- 50 appointments across all states (booked, waiting, completed)
- Full structured SOAP notes and authorized e-prescriptions

### 3. Launch Development Servers
```bash
pnpm run dev
```
- Patient Portal: [http://localhost:3000](http://localhost:3000)
- Clinician Workstation: [http://localhost:3002](http://localhost:3002)
- Admin Command Center: [http://localhost:3003](http://localhost:3003)
- Executive Analytics: [http://localhost:3004](http://localhost:3004)
- Clinical Fastify API: [http://localhost:3001](http://localhost:3001) (or `4000` standalone)
