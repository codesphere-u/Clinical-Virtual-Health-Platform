# ADR-012: Observability, Structured Logging & Health Diagnostics

## Status
Accepted

## Context
High-reliability clinical platforms require real-time visibility into database connection pool contention, video session drops, background queue backlogs, and anomalous API failures without leaking sensitive Protected Health Information (PHI).

## Decision
1. **Zero-PHI Structured Logging**:
   - High-performance logging via Pino with JSON output format.
   - Built-in redaction rules automatically scrubbing fields like `password`, `token`, `nin`, `bvn`, `medical_history`, and `blood_group`.
   - Injected correlation headers (`x-correlation-id`, `x-request-id`) spanning edge, Fastify services, and client applications.
2. **Standardized Health Check Endpoints**:
   - `GET /health/live`: Fast liveness check verifying the HTTP process is responsive.
   - `GET /health/ready`: Deep readiness probe checking PostgreSQL connectivity, Redis latency, S3 access, and LiveKit gateway availability.
3. **Clinical Operational Metrics**:
   - Prometheus metrics exposed via `/metrics` tracking:
     - `consultation_duration_seconds`
     - `waiting_room_wait_time_seconds`
     - `prescription_generation_duration_ms`
     - `video_network_degradation_events_total`

## Consequences
- Health endpoints are monitored by edge load balancers for automatic failover.
