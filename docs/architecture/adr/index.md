# Architecture Decision Records (ADRs)

| ADR | Title | Status | Primary Focus |
| :--- | :--- | :--- | :--- |
| [ADR-001](ADR-001-backend-architecture.md) | Backend Architecture & Technology Stack | Accepted | Fastify, TypeScript, Node.js runtime |
| [ADR-002](ADR-002-database-architecture.md) | Database Architecture & ORM Strategy | Accepted | PostgreSQL 16, pgvector, Prisma (sole primary ORM), Kysely (exceptional queries only) |
| [ADR-003](ADR-003-authentication-architecture.md) | Authentication & Identity Verification | Accepted | Stateless JWTs, rotating refresh tokens, TOTP MFA, passive liveness KYC |
| [ADR-004](ADR-004-authorization-rbac.md) | Authorization, RBAC & Clinical Permissions | Accepted | Fine-grained RBAC/ABAC with clinical relationship validation & break-glass |
| [ADR-005](ADR-005-video-architecture.md) | Provider-Agnostic Video Gateway Architecture | Accepted | Decoupled `VideoService` with LiveKit default driver and failover |
| [ADR-006](ADR-006-data-residency.md) | Dual-Jurisdiction Data Residency Policy Engine | Accepted | Nigeria NDPA & UK GDPR compliant regional storage & logged transfers |
| [ADR-007](ADR-007-ai-architecture.md) | Assistive Clinical AI Safety & Guardrails | Accepted | Human-in-the-loop, no autonomous prescribing/diagnosis, emergency redirection |
| [ADR-008](ADR-008-file-document-storage.md) | Secure Document & Medical Imaging Storage | Accepted | AES-256 S3/MinIO, pre-signed URLs, ClamAV malware quarantine |
| [ADR-009](ADR-009-realtime-architecture.md) | Realtime Waiting Room State Machine | Accepted | WebSockets, Redis Pub/Sub, 10s heartbeats, reconnection resilience |
| [ADR-010](ADR-010-audit-compliance.md) | Tamper-Evident SHA-256 Audit Trail | Accepted | Append-only cryptographically chained audit vault with DB level protection |
| [ADR-011](ADR-011-disaster-recovery.md) | Disaster Recovery & Sovereign Data Portability | Accepted | HL7 FHIR exports, WAL continuous archiving, quarterly DR drills |
| [ADR-012](ADR-012-observability.md) | Observability, Structured Logging & Health | Accepted | Pino structured logging, zero PHI leaks, health probes (`/health/ready`) |
| [ADR-013](ADR-013-api-versioning-idempotency.md) | API Versioning, Idempotency & Contracts | Accepted | Contract-first Zod schemas, `/api/v1` prefix, `X-Idempotency-Key` via Redis |
| [ADR-014](ADR-014-flutter-architecture.md) | Modular Shared Flutter Architecture | Accepted | Decoupled `/flutter/packages` consumed by patient, clinician, and desktop apps |
| [ADR-015](ADR-015-web-architecture-design-system.md) | Web Architecture & Aura Clinical Design System | Accepted | Next.js 15 App Router, WCAG 2.2 AA/AAA, calm uncluttered modern aesthetic |
