/**
 * @aura/auth - TOTP Multi-Factor Authentication (RFC 6238)
 * Next-Generation Clinical & Virtual Health Platform
 */

import * as OTPAuth from 'otpauth';

export interface TotpSetupResult {
  secret: string;
  otpauthUri: string;
  backupCodes: string[];
}

/**
 * Generates a new TOTP secret, backup codes, and an otpauth URI for QR code presentation.
 */
export function generateTotpSecret(email: string, issuer = 'Aura Clinical Network'): TotpSetupResult {
  const secret = new OTPAuth.Secret({ size: 20 });
  const totp = new OTPAuth.TOTP({
    issuer,
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });

  // Generate 8 8-character backup recovery codes
  const backupCodes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    backupCodes.push(code);
  }

  return {
    secret: secret.base32,
    otpauthUri: totp.toString(),
    backupCodes,
  };
}

/**
 * Validates a 6-digit TOTP token against a user's base32 secret.
 * Allows a drift window of +/- 1 period (30s) to handle clock skew.
 */
export function verifyTotpToken(token: string, secretBase32: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: 'Aura Clinical Network',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secretBase32),
    });

    // delta returns null if invalid, or an integer representing period offset if valid
    const delta = totp.validate({
      token: token.trim(),
      window: 1,
    });

    return delta !== null;
  } catch {
    return false;
  }
}
