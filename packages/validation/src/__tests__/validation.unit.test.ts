/**
 * Unit Tests for @docaas/validation
 * Validates GMC, MDCN, NIN, BVN, Age Calculation, and Allergy Safety Cross-Matching
 */

import assert from 'node:assert/strict';
import {
  validateGmcNumber,
  validateMdcnNumber,
  validateNigerianNin,
  validateNigerianBvn,
  calculatePatientAge,
  checkAllergyConflict,
} from '../index.js';
import { Jurisdiction, SeverityLevel } from '@docaas/domain';

async function runValidationTests() {
  console.log('🧪 Running @docaas/validation unit tests...');

  // 1. GMC Validation
  assert.equal(validateGmcNumber('7654321'), true);
  assert.equal(validateGmcNumber('1234567'), true);
  assert.equal(validateGmcNumber('123456'), false, 'Should fail for 6 digits');
  assert.equal(validateGmcNumber('12345678'), false, 'Should fail for 8 digits');
  assert.equal(validateGmcNumber('GMC1234'), false, 'Should fail for alpha characters');
  console.log('  ✅ GMC registration validator passed');

  // 2. MDCN Folio Validation
  assert.equal(validateMdcnNumber('MDCN/R/12345'), true);
  assert.equal(validateMdcnNumber('MDCN/F/98765'), true);
  assert.equal(validateMdcnNumber('123'), false, 'Too short');
  console.log('  ✅ MDCN folio validator passed');

  // 3. Nigerian NIN & BVN
  assert.equal(validateNigerianNin('12345678901'), true);
  assert.equal(validateNigerianNin('1234 5678 901'), true, 'Should tolerate internal spacing');
  assert.equal(validateNigerianNin('1234567890'), false, 'Must be 11 digits');
  assert.equal(validateNigerianBvn('22334455667'), true);
  assert.equal(validateNigerianBvn('223344'), false, 'Must be 11 digits');
  console.log('  ✅ Nigerian NIN & BVN validators passed');

  // 4. Age Calculation & Jurisdictional Majority
  const adultDob = '1990-05-15';
  const adultResult = calculatePatientAge(adultDob, Jurisdiction.NIGERIA);
  assert.equal(adultResult.isMinor, false);
  assert.equal(adultResult.requiresGuardianConsent, false);

  const minorDob = new Date();
  minorDob.setFullYear(minorDob.getFullYear() - 10);
  const minorResult = calculatePatientAge(minorDob.toISOString(), Jurisdiction.NIGERIA);
  assert.equal(minorResult.isMinor, true);
  assert.equal(minorResult.requiresGuardianConsent, true);
  console.log('  ✅ Age calculation and minor consent rules passed');

  // 5. Clinical Allergy Cross-Matching
  const allergies = [
    { substance: 'Penicillin', severity: SeverityLevel.LIFE_THREATENING },
    { substance: 'Ibuprofen', severity: SeverityLevel.SEVERE },
  ];

  // Direct conflict
  const directConflict = checkAllergyConflict(allergies, 'Penicillin V');
  assert.equal(directConflict.hasConflict, true);
  assert.equal(directConflict.reactionSeverity, SeverityLevel.LIFE_THREATENING);

  // Cross-reactivity: Amoxicillin belongs to Penicillin class
  const classConflict = checkAllergyConflict(allergies, 'Amoxicillin');
  assert.equal(classConflict.hasConflict, true);
  assert.ok(classConflict.clinicalWarning?.includes('CROSS-REACTIVITY'));

  // Cross-reactivity: Naproxen belongs to NSAID class
  const nsaidConflict = checkAllergyConflict(allergies, 'Naproxen 500mg');
  assert.equal(nsaidConflict.hasConflict, true);

  // Safe medication
  const safeMed = checkAllergyConflict(allergies, 'Paracetamol');
  assert.equal(safeMed.hasConflict, false);
  console.log('  ✅ Clinical allergy & cross-reactivity blocks passed');

  console.log('🎉 ALL @docaas/validation UNIT TESTS PASSED!\n');
}

runValidationTests().catch((err) => {
  console.error('Validation test failed:', err);
  process.exit(1);
});
