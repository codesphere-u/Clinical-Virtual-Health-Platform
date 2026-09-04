# ADR-007: Assistive Clinical AI Safety & Human-in-the-Loop Architecture

## Status
Accepted

## Context
Generative AI offers transformative value in drafting clinical encounter summaries, checking duplicate medications, and parsing medical history. However, hallucination or autonomous actions in healthcare pose severe patient safety risks and regulatory violations.

## Decision
We enforce strict **Clinical Safety Guardrails & Human-in-the-Loop Architecture**:

1. **Zero Autonomous Clinical Decisions**:
   - AI is strictly prohibited from autonomously issuing diagnoses, signing prescriptions, or writing directly to the official medical record.
   - All AI output is classified as ephemeral draft material until explicitly reviewed, modified, and cryptographically signed by a licensed clinician.
2. **Visual Transparency & Source Attribution**:
   - Every AI-assisted draft displays a prominent badge: `[AI Draft - Unsigned]`.
   - The UI presents an interactive side-by-side diff allowing the clinician to accept, edit, or discard individual suggestions.
   - Clinical summaries must provide provenance links back to source notes or lab values.
3. **Patient Query Guardrails**:
   - The patient assistant chatbot is restricted to administrative workflows (scheduling, profile help, how to prepare for tests).
   - High-risk clinical keyword triggers (e.g. "severe headache", "chest pain", "shortness of breath", "bleeding") immediately halt the conversation and render a prominent **Emergency Redirection Banner** with Nigerian emergency dispatch contacts (112) and urgent care guidance.

## Consequences
- AI pipelines must log prompt tokens, response hashes, model version, and clinician override rate in the audit system.
