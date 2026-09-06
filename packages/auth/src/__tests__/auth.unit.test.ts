/**
 * Unit Tests for @docaas/auth
 * Validates JWT signing/verification, Password hashing, TOTP MFA, and RBAC permissions
 */

import assert from 'node:assert/strict';
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashPassword,
  verifyPassword,
  generateTotpSecret,
  verifyTotpToken,
  hasPermission,
} from '../index.js';
import { UserRole, Jurisdiction } from '@docaas/domain';
import * as OTPAuth from 'otpauth';

async function runAuthTests() {
  console.log('🧪 Running @docaas/auth unit tests...');

  // 1. Password Hashing
  const rawPassword = 'ClinicalSecurePass2026!';
  const hash = await hashPassword(rawPassword);
  assert.ok(hash.startsWith('scrypt$'), 'Hash should be scrypt encoded');
  assert.equal(await verifyPassword(rawPassword, hash), true);
  assert.equal(await verifyPassword('WrongPassword', hash), false);
  console.log('  ✅ Scrypt password hashing & verification passed');

  // 2. JWT Access Token Signing & Verification
  const tokenPayload = {
    userId: 'u1111111-1111-1111-1111-111111111111',
    email: 'dr.alistair@docaas.clinical',
    role: UserRole.CLINICIAN,
    jurisdiction: Jurisdiction.UNITED_KINGDOM,
    sessionId: 's1111111-1111-1111-1111-111111111111',
    tokenFamily: 'tf-alistair-01',
  };

  const accessToken = await signAccessToken(tokenPayload);
  assert.ok(accessToken.length > 50);

  const decoded = await verifyAccessToken(accessToken);
  assert.equal(decoded.userId, tokenPayload.userId);
  assert.equal(decoded.email, tokenPayload.email);
  assert.equal(decoded.role, UserRole.CLINICIAN);
  assert.equal(decoded.jurisdiction, Jurisdiction.UNITED_KINGDOM);
  console.log('  ✅ JWT access token signing and verification passed');

  // 3. Refresh Token Signing & Verification
  const refreshToken = await signRefreshToken({
    userId: tokenPayload.userId,
    sessionId: tokenPayload.sessionId,
    tokenFamily: tokenPayload.tokenFamily,
    rotationIndex: 1,
  });
  const decodedRefresh = await verifyRefreshToken(refreshToken);
  assert.equal(decodedRefresh.userId, tokenPayload.userId);
  assert.equal(decodedRefresh.tokenFamily, tokenPayload.tokenFamily);
  assert.equal(decodedRefresh.rotationIndex, 1);
  console.log('  ✅ Refresh token signing and verification passed');

  // 4. TOTP RFC 6238 Multi-Factor Authentication
  const totpSetup = generateTotpSecret('patient@docaas.clinical', 'DOCAAS Virtual Health');
  assert.ok(totpSetup.secret);
  assert.equal(totpSetup.backupCodes.length, 8);
  assert.ok(totpSetup.otpauthUri.startsWith('otpauth://totp/'));

  // Generate valid current OTP token from the secret
  const testTotp = new OTPAuth.TOTP({
    issuer: 'DOCAAS Virtual Health',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(totpSetup.secret),
  });
  const currentOtp = testTotp.generate();
  assert.equal(verifyTotpToken(currentOtp, totpSetup.secret), true);
  assert.equal(verifyTotpToken('000000', totpSetup.secret), false);
  console.log('  ✅ TOTP RFC 6238 generation and verification passed');

  // 5. RBAC Permissions Engine
  assert.equal(hasPermission(UserRole.CLINICIAN, 'prescriptions:sign'), true);
  assert.equal(hasPermission(UserRole.PATIENT, 'prescriptions:sign'), false);
  assert.equal(hasPermission(UserRole.ADMIN, 'audit:read'), true);
  assert.equal(hasPermission(UserRole.PATIENT, 'records:read'), true);
  console.log('  ✅ Role-based access control (RBAC) permission check passed');

  console.log('🎉 ALL @docaas/auth UNIT TESTS PASSED!\n');
}

runAuthTests().catch((err) => {
  console.error('Auth test failed:', err);
  process.exit(1);
});
