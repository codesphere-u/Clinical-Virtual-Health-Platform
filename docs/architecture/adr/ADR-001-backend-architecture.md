# ADR-001: Backend Architecture & Technology Stack

## Status
Accepted

## Context
The Clinical & Virtual Health Platform requires an enterprise-grade, high-throughput, low-latency API tier that handles cross-border clinical consultations, scheduling, real-time waiting room state machines, electronic prescriptions, and medical records. We evaluated Node.js (Fastify vs Express vs NestJS), Go, and Python.

## Decision
We select **TypeScript + Node.js with Fastify** as the primary backend runtime and web framework.

### Key Architectural Rationale:
1. **End-to-End Type Safety**: Fastify integrates natively with Zod and JSON Schema, enabling 100% shared typed contracts between the Fastify routes, Prisma database models, Next.js web applications, and generated Dart DTOs.
2. **High Throughput & Low Overhead**: Fastify delivers benchmark performance up to 2x faster than Express, approaching Go HTTP servers for JSON serialization via `fast-json-stringify`.
3. **Plugin Architecture & Encapsulation**: Fastify's encapsulated plugin model (`fp`) enables clean micro-service or modular monolith boundaries for Clinical Encounters, Realtime, Billing/Appointments, Identity/KYC, and AI Gateways.
4. **First-Class Observability**: Native Pino structured logging provides correlation IDs (`x-correlation-id`) on every clinical request without external monkey-patching.

## Consequences
- All backend services (`services/api`, `services/realtime`) will use Fastify with strict TypeScript configuration (`strict: true`).
- Zod will serve as the single source of truth for request and response validation.
