/**
 * @docaas/validation - Healthcare, Clinical & Statutory Validation Rules
 * Next-Generation Clinical & Virtual Health Platform
 */

import { Jurisdiction, SeverityLevel } from '@docaas/domain';

// ==========================================
// 1. Regulatory License Validators
// ==========================================

/**
 * Validates UK General Medical Council (GMC) reference number:
 * Exactly 7 numerical digits.
 */
export function validateGmcNumber(gmcNumber: string): boolean {
  const clean = gmcNumber.trim();
  return /^[0-9]{7}$/.test(clean);
}

/**
 * Validates Nigerian Medical and Dental Council of Nigeria (MDCN) folio number.
 * Format typically starts with letters followed by digits (e.g., MDCN/R/12345 or similar).
 */
export function validateMdcnNumber(folio: string): boolean {
  const clean = folio.trim();
  return clean.length >= 5 && clean.length <= 30;
}

// ==========================================
// 2. Nigerian Identity KYC Validators
// ==========================================

/**
 * Validates Nigerian National Identification Number (NIN):
 * Exactly 11 numeric digits.
 */
export function validateNigerianNin(nin: string): boolean {
  const clean = nin.replace(/\s+/g, '');
  return /^[0-9]{11}$/.test(clean);
}

/**
 * Validates Nigerian Bank Verification Number (BVN):
 * Exactly 11 numeric digits.
 */
export function validateNigerianBvn(bvn: string): boolean {
  const clean = bvn.replace(/\s+/g, '');
  return /^[0-9]{11}$/.test(clean);
}

// ==========================================
// 3. Age & Minor Consent Policy Engine
// ==========================================

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  isMinor: boolean;
  requiresGuardianConsent: boolean;
  jurisdictionThreshold: number;
}

/**
 * Configurable jurisdictional age of majority:
 * UK: 18 (with Gillick competence evaluation for 16-17)
 * Nigeria: 18 (Child Rights Act)
 */
const AGE_OF_MAJORITY_BY_JURISDICTION: Record<Jurisdiction, number> = {
  [Jurisdiction.NIGERIA]: 18,
  [Jurisdiction.UNITED_KINGDOM]: 18,
  [Jurisdiction.INTERNATIONAL]: 18,
};

export function calculatePatientAge(
  dobString: string,
  jurisdiction: Jurisdiction = Jurisdiction.NIGERIA
): AgeCalculationResult {
  const dob = new Date(dobString);
  const now = new Date();

  if (isNaN(dob.getTime()) || dob > now) {
    throw new Error('Invalid date of birth provided');
  }

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const threshold = AGE_OF_MAJORITY_BY_JURISDICTION[jurisdiction] ?? 18;
  const isMinor = years < threshold;

  return {
    years,
    months,
    days,
    isMinor,
    requiresGuardianConsent: isMinor,
    jurisdictionThreshold: threshold,
  };
}

// ==========================================
// 4. Clinical Allergy & Safety Cross-Matching
// ==========================================

export interface AllergyConflictCheck {
  hasConflict: boolean;
  conflictingAllergy?: string;
  prescribedDrug?: string;
  reactionSeverity?: SeverityLevel;
  clinicalWarning?: string;
}

// Common known cross-reactivities for clinical safety checking
const DRUG_ALLERGY_EQUIVALENCE_MAP: Record<string, string[]> = {
  penicillin: ['amoxicillin', 'ampicillin', 'co-amoxiclav', 'augmentin', 'piperacillin', 'flucloxacillin'],
  sulfa: ['sulfamethoxazole', 'co-trimoxazole', 'septrin', 'bactrim', 'sulfasalazine'],
  nsaid: ['ibuprofen', 'naproxen', 'diclofenac', 'aspirin', 'meloxicam', 'celecoxib'],
  cephalosporin: ['cephalexin', 'ceftriaxone', 'cefuroxime', 'cefixime'],
  macrolide: ['erythromycin', 'clarithromycin', 'azithromycin'],
};

export function checkAllergyConflict(
  patientAllergies: Array<{ substance: string; severity: SeverityLevel }>,
  prescribedMedicationName: string
): AllergyConflictCheck {
  const target = prescribedMedicationName.toLowerCase().trim();

  for (const allergy of patientAllergies) {
    const allergen = allergy.substance.toLowerCase().trim();

    // 1. Exact or substring match
    if (target.includes(allergen) || allergen.includes(target)) {
      return {
        hasConflict: true,
        conflictingAllergy: allergy.substance,
        prescribedDrug: prescribedMedicationName,
        reactionSeverity: allergy.severity,
        clinicalWarning: `CRITICAL ALLERGY CONFLICT: Patient has documented allergy to "${allergy.substance}" (${allergy.severity}).`,
      };
    }

    // 2. Class equivalence check (matched by class key or class member)
    const matchedClassEntry = Object.entries(DRUG_ALLERGY_EQUIVALENCE_MAP).find(
      ([cls, members]) =>
        allergen.includes(cls) ||
        cls.includes(allergen) ||
        members.some((m) => allergen.includes(m))
    );

    if (matchedClassEntry) {
      const [matchedClass, classMembers] = matchedClassEntry;
      if (classMembers.some((member) => target.includes(member))) {
        return {
          hasConflict: true,
          conflictingAllergy: `${allergy.substance} (${matchedClass.toUpperCase()} class)`,
          prescribedDrug: prescribedMedicationName,
          reactionSeverity: allergy.severity,
          clinicalWarning: `CROSS-REACTIVITY WARNING: "${prescribedMedicationName}" belongs to the ${matchedClass.toUpperCase()} family, conflicting with patient's allergy to ${allergy.substance}.`,
        };
      }
    }
  }

  return { hasConflict: false };
}
