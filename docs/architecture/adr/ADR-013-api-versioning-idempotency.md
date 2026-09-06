# ADR-013: API Versioning, Strict Idempotency & Contract-First Design

## Status
Accepted

## Context
In healthcare platforms, network drops during critical actions (e.g. paying for an appointment, signing an electronic prescription, locking a consultation note) can cause duplicate prescriptions, double bookings, or corrupted state if retried naively.

## Decision
1. **URI Prefix Versioning**:
   - APIs are versioned via URL path (`/api/v1/...`). Backward-incompatible changes require a major version bump (`/api/v2/...`).
2. **Strict Mutation Idempotency**:
   - All state-mutating endpoints (`POST /api/v1/appointments/book`, `POST /api/v1/prescriptions`, `POST /api/v1/consultations/:id/sign`) enforce the `X-Idempotency-Key` header (UUIDv4).
   - Fastify middleware checks Redis for existing keys. If a request with the same idempotency key is in-flight, subsequent requests receive `409 Conflict`. If already completed, the cached response is returned with an `X-Cache: IDEMPOTENT-HIT` header.
3. **Contract-First Specification**:
   - Single source of truth in `@docaas/api-contracts` using Zod schemas.
   - OpenAPI 3.1 definitions auto-generated at build time to provide interactive Swagger documentation and generate typed client SDKs for web and mobile.

## Consequences
- Client SDKs automatically generate an idempotency key per user interaction attempt.
