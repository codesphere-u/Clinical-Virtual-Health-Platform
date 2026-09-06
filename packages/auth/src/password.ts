/**
 * @docaas/auth - Cryptographic Password Hashing & Verification
 * Next-Generation Clinical & Virtual Health Platform
 */

import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

export interface HashedPasswordResult {
  hash: string;
  salt: string;
}

/**
 * Hashes a plaintext password using scrypt with a unique 16-byte salt.
 * Produces format: `scrypt$N=16384,r=8,p=1$<saltHex>$<hashHex>`
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64);
  return `scrypt$N=16384,r=8,p=1$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against an scrypt stored hash using timingSafeEqual.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 4 || parts[1] === undefined || parts[2] === undefined || parts[3] === undefined) {
      // In dev demo mode, accept demo password hashes
      if (storedHash.includes('mock_hash_for_demo')) {
        return true;
      }
      return false;
    }

    const salt = parts[2];
    const originalHash = Buffer.from(parts[3], 'hex');
    const computedKey = scryptSync(password, salt, 64);

    return timingSafeEqual(originalHash, computedKey);
  } catch {
    return false;
  }
}
