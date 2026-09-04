/**
 * @aura/api-service - Assistive Clinical AI Safety & Guardrail Routes
 * Conforms to ADR-007: Assistive Clinical AI Safety & Guardrails
 */

import { FastifyPluginAsync } from 'fastify';
import { clinicalAiGuardrails, TriageEvaluationRequest } from '../services/ai-guardrails.js';

export const aiAssistRoutes: FastifyPluginAsync = async (fastify) => {
  // 1. Pre-Consultation Triage Red-Flag Safety Check (ADR-007)
  fastify.post('/api/v1/ai/triage-check', async (req, reply) => {
    const body = req.body as TriageEvaluationRequest;

    if (!body.patientSymptoms || !Array.isArray(body.patientSymptoms)) {
      return reply.status(400).send({ error: 'patientSymptoms must be an array of strings' });
    }

    const triageResult = clinicalAiGuardrails.evaluateTriage(body);

    if (triageResult.isEmergencyRedFlag) {
      return reply.status(422).send({
        status: 'EMERGENCY_INTERCEPT',
        ...triageResult,
      });
    }

    return reply.send(triageResult);
  });

  // 2. Clinician Workstation: Differential Diagnosis Suggestions (Decision Support)
  fastify.post('/api/v1/ai/differential-suggestions', async (req, reply) => {
    const { chiefComplaint, symptoms, vitalsSummary } = req.body as {
      chiefComplaint: string;
      symptoms: string[];
      vitalsSummary?: string;
    };

    if (!chiefComplaint) {
      return reply.status(400).send({ error: 'chiefComplaint is required' });
    }

    const result = clinicalAiGuardrails.generateDifferentialSuggestions(
      chiefComplaint,
      symptoms || [],
      vitalsSummary
    );

    return reply.send(result);
  });
};
