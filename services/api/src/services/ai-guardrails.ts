/**
 * @docaas/api-service - Assistive Clinical AI Safety & Guardrails Engine
 * Conforms to ADR-007: Assistive Clinical AI Safety & Guardrails
 */

export interface TriageEvaluationRequest {
  patientSymptoms: string[];
  patientAge: number;
  durationHours?: number;
  vitalSigns?: {
    heartRateBpm?: number;
    systolicBp?: number;
    diastolicBp?: number;
    spo2Percentage?: number;
  };
}

export interface TriageResult {
  isEmergencyRedFlag: boolean;
  triageCategory: 'EMERGENCY_REDIRECT' | 'URGENT_PRIORITY' | 'STANDARD_VIRTUAL_CARE';
  immediateActions: string[];
  emergencyContactNumbers: { nigeria: string; uk: string };
  redFlagReason?: string;
  disclaimer: string;
}

export interface DifferentialDiagnosisSuggestion {
  condition: string;
  icd10Code: string;
  confidenceScore: number;
  clinicalRationale: string;
  recommendedInvestigations: string[];
}

export interface DifferentialResult {
  suggestions: DifferentialDiagnosisSuggestion[];
  contraindicationsNoted: string[];
  mandatoryDisclaimer: string;
  requiresClinicianSignOff: true;
}

const RED_FLAG_KEYWORDS = [
  'chest pain',
  'crushing chest pressure',
  'radiating pain to arm or jaw',
  'severe shortness of breath',
  'difficulty breathing',
  'stridor',
  'facial drooping',
  'arm weakness',
  'slurred speech',
  'loss of consciousness',
  'severe anaphylaxis',
  'throat swelling',
  'coughing blood',
  'active uncontrolled hemorrhage',
  'sudden worst headache of life',
];

class ClinicalAiGuardrailsEngine {
  public evaluateTriage(request: TriageEvaluationRequest): TriageResult {
    const combined = request.patientSymptoms.join(' ').toLowerCase();

    // Check for life-threatening keywords
    const matchedKeyword = RED_FLAG_KEYWORDS.find((keyword) => combined.includes(keyword));

    // Check abnormal vitals
    let vitalsEmergency = false;
    let vitalsReason = '';
    if (request.vitalSigns) {
      if (request.vitalSigns.spo2Percentage && request.vitalSigns.spo2Percentage < 90) {
        vitalsEmergency = true;
        vitalsReason = `Critical hypoxia (SpO2 ${request.vitalSigns.spo2Percentage}%)`;
      } else if (request.vitalSigns.systolicBp && request.vitalSigns.systolicBp > 190) {
        vitalsEmergency = true;
        vitalsReason = `Hypertensive emergency (Systolic BP ${request.vitalSigns.systolicBp} mmHg)`;
      }
    }

    const isEmergency = Boolean(matchedKeyword) || vitalsEmergency;

    if (isEmergency) {
      return {
        isEmergencyRedFlag: true,
        triageCategory: 'EMERGENCY_REDIRECT',
        redFlagReason: matchedKeyword
          ? `Emergency clinical presentation detected: "${matchedKeyword}" requires immediate in-person emergency department evaluation.`
          : vitalsReason,
        immediateActions: [
          'DO NOT DELAY - Proceed immediately to the nearest Emergency Department.',
          'If in Nigeria, dial 112 for emergency ambulance assistance or dispatch to the nearest tertiary hospital.',
          'If in the United Kingdom, dial 999 immediately.',
          'Keep patient seated upright and do not administer oral fluids or medications.',
        ],
        emergencyContactNumbers: {
          nigeria: '112 / 0800-EMERGENCY',
          uk: '999',
        },
        disclaimer:
          'EMERGENCY CLINICAL SAFETY INTERCEPT: Virtual consultation is contraindicated for immediate life-threatening symptoms. This platform cannot replace emergency resuscitation or critical care transport.',
      };
    }

    return {
      isEmergencyRedFlag: false,
      triageCategory: 'STANDARD_VIRTUAL_CARE',
      immediateActions: [
        'Proceed with virtual telemedicine consultation.',
        'Have current medications and previous medical records ready for the clinician.',
      ],
      emergencyContactNumbers: {
        nigeria: '112',
        uk: '999',
      },
      disclaimer:
        'DOCAAS CLINICAL AI ASSIST: Decision support only. All clinical assessments and treatment decisions must be independently validated by a licensed physician.',
    };
  }

  public generateDifferentialSuggestions(
    chiefComplaint: string,
    symptoms: string[],
    vitalsSummary?: string
  ): DifferentialResult {
    const query = `${chiefComplaint} ${symptoms.join(' ')} ${vitalsSummary || ''}`.toLowerCase();

    const suggestions: DifferentialDiagnosisSuggestion[] = [];

    if (query.includes('headache') || query.includes('migraine')) {
      suggestions.push({
        condition: 'Tension-Type Headache',
        icd10Code: 'G44.2',
        confidenceScore: 0.78,
        clinicalRationale: 'Bilateral band-like pressure without focal neurological deficits.',
        recommendedInvestigations: ['Fundoscopy (in clinic)', 'Blood pressure monitoring'],
      });
      suggestions.push({
        condition: 'Migraine without docaas',
        icd10Code: 'G43.0',
        confidenceScore: 0.65,
        clinicalRationale: 'Unilateral or throbbing character with possible photophobia or nausea.',
        recommendedInvestigations: ['Headache diary', 'Neurological screening'],
      });
    } else if (query.includes('fever') || query.includes('malaria') || query.includes('chills')) {
      suggestions.push({
        condition: 'Uncomplicated Plasmodium falciparum Malaria',
        icd10Code: 'B50.9',
        confidenceScore: 0.85,
        clinicalRationale: 'Endemic area presentation with intermittent febrile episodes and myalgia.',
        recommendedInvestigations: ['Malaria Rapid Diagnostic Test (RDT)', 'Thick and thin blood film microscopy', 'Full Blood Count (FBC)'],
      });
      suggestions.push({
        condition: 'Viral Upper Respiratory Infection',
        icd10Code: 'J06.9',
        confidenceScore: 0.62,
        clinicalRationale: 'Low grade fever with associated coryzal symptoms.',
        recommendedInvestigations: ['Full Blood Count (FBC)', 'Observation'],
      });
    } else if (query.includes('cough') || query.includes('chest')) {
      suggestions.push({
        condition: 'Acute Bronchitis',
        icd10Code: 'J20.9',
        confidenceScore: 0.72,
        clinicalRationale: 'Cough lasting < 3 weeks without signs of consolidation or tachypnea.',
        recommendedInvestigations: ['Chest X-ray (if cough > 3 weeks or persistent fever)', 'SpO2 monitoring'],
      });
    } else {
      suggestions.push({
        condition: 'General Medical Symptom Evaluation',
        icd10Code: 'R68.89',
        confidenceScore: 0.5,
        clinicalRationale: 'Non-specific presentation requiring full clinical history and review of systems.',
        recommendedInvestigations: ['Basic Metabolic Panel', 'Full Blood Count'],
      });
    }

    return {
      suggestions,
      contraindicationsNoted: [
        'Avoid empiric antibiotics without objective evidence of bacterial infection.',
      ],
      mandatoryDisclaimer:
        'AI CLINICAL DECISION SUPPORT: Generated solely to assist qualified clinicians. Under ADR-007, AI algorithms do not possess autonomous diagnostic authority. The attending physician retains 100% medicolegal responsibility.',
      requiresClinicianSignOff: true,
    };
  }
}

export const clinicalAiGuardrails = new ClinicalAiGuardrailsEngine();
