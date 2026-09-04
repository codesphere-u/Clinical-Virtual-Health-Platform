# ADR-009: Realtime Waiting Room State Machine & Heartbeat Protocol

## Status
Accepted

## Context
In telemedicine, the transition from "Appointment Confirmed" to "Patient Waiting in Room" to "Consultation In Progress" must be synchronized instantly across patient devices, clinician workstations, and administrative monitors without aggressive client polling.

## Decision
1. **Transport**:
   - WebSockets (via Fastify `@fastify/websocket` backed by Redis Pub/Sub cluster) for bi-directional state synchronization.
   - Fallback to Server-Sent Events (SSE) / HTTP Long-Polling for networks where WebSocket handshakes are blocked by enterprise or mobile carrier firewalls.
2. **Waiting Room State Machine**:
   - `BOOKED` -> `REMINDER_SENT` -> `PATIENT_CHECKED_IN` -> `PATIENT_WAITING` -> `CLINICIAN_READY` -> `CONSULTATION_STARTED` -> `CONSULTATION_COMPLETED`.
3. **Heartbeat & Network Degradation Protocol**:
   - Active participants emit a 10-second heartbeat ping.
   - If 3 consecutive heartbeats are missed, status transitions to `DEGRADED_RECONNECTING`.
   - The clinician dashboard displays a non-intrusive warning ("Patient network reconnecting...") rather than terminating the encounter.
   - If connection restores within 120 seconds, the state machine smoothly resumes the active consultation.

## Consequences
- Redis Cluster maintains live waiting room ephemera with TTLs, preventing stale waiting indicators if a patient drops abruptly.
