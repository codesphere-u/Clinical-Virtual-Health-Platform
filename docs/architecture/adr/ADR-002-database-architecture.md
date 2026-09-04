# ADR-002: Database Architecture & ORM Strategy

## Status
Accepted

## Context
The platform manages deeply relational healthcare entities (Patients, Clinicians, Appointments, Consultations, Structured SOAP Notes, Allergies, Formulary Medications, Lab Orders, Audit Trails). We need a clear, consistent data access pattern that prevents architectural drift, maintains type safety, and avoids the maintenance overhead of multiple competing ORMs.

## Decision
1. **PostgreSQL 16+** is selected as the primary relational database with `pgvector` for semantic medical search and `uuid-ossp` / `pgcrypto` for cryptographically strong identifiers.
2. **Prisma is designated as the sole PRIMARY ORM** for:
   - Data modeling and schema migrations (`prisma migrate`).
   - Standard CRUD operations across all services.
   - Relation management, transactions, and entity lifecycle hooks.
3. **Kysely is strictly restricted to exceptional cases**:
   - Complex analytical reporting queries across high-volume audit logs.
   - High-performance aggregation queries that cannot be expressively or performantly executed via Prisma Client.
   - Kysely must NEVER be introduced merely because a query can be written in raw SQL.

## Consequences
- Single authoritative `schema.prisma` file located in `packages/database/prisma/schema.prisma`.
- No duplication of schema definitions. Any Kysely instance must type-check against types generated from the primary Prisma schema.
