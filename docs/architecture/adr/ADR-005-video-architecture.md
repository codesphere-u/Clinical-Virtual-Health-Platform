# ADR-005: Provider-Agnostic Video Gateway Architecture

## Status
Accepted

## Context
Virtual healthcare relies on reliable, encrypted, low-latency audio/video communication. Hardcoding direct vendor APIs (such as Zoom, Twilio Video, or Daily.co) creates vendor lock-in, increases switching costs, and exposes clinical workflows to third-party outages.

## Decision
We establish a strict **Provider-Agnostic Video Gateway Abstraction** (`VideoService` and `VideoProvider`).

```text
Clinical Consultation Workflow
               │
               ▼
          VideoService
               │
               ▼
     interface VideoProvider
         ├── createConsultationRoom(appointmentId, options)
         ├── generateParticipantToken(roomSid, user, role)
         ├── endConsultationRoom(roomSid)
         ├── muteParticipant(roomSid, participantId)
         └── getQualityMetrics(roomSid)
               │
      ┌────────┼─────────┐
      ▼        ▼         ▼
   LiveKit   Agora     Daily
  (Default) (Backup)  (Backup)
```

1. **Primary Provider**: **LiveKit** (WebRTC SFU), offering open-source self-hostable capability or LiveKit Cloud, ultra-low latency, simulcast, network resilience, and end-to-end encryption support.
2. **Clinical Business Decoupling**: Business logic invokes only high-level domain operations (`joinConsultation`, `endConsultation`, `getConnectionStatus`).
3. **Resilience & Fallback**: If health checks detect latency spikes or regional packet drops, the gateway can switch room allocations to secondary providers transparently to the client interface.

## Consequences
- Video credentials and tokens are short-lived ($\le 1\text{ hour}$) and generated exclusively server-side.
- Zero client-side vendor SDK pollution in the core clinical state machines.
