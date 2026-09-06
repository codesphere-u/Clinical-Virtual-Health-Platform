/**
 * @docaas/auth - Stateless JWTs & Rotating Refresh Tokens
 * Next-Generation Clinical & Virtual Health Platform
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { UserRole, Jurisdiction } from '@docaas/domain';

const DEFAULT_SECRET = 'clinical-docaas-super-secret-encryption-key-for-development-32chars!';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || DEFAULT_SECRET);

export interface ClinicalTokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  jurisdiction: Jurisdiction;
  sessionId: string;
  tokenFamily: string;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

/**
 * Signs a short-lived access token (15 minutes).
 */
export async function signAccessToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
  jurisdiction: Jurisdiction;
  sessionId: string;
  tokenFamily: string;
}): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    jurisdiction: payload.jurisdiction,
    sessionId: payload.sessionId,
    tokenFamily: payload.tokenFamily,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('docaas:clinical:auth')
    .setAudience('docaas:clinical:clients')
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

/**
 * Signs a long-lived refresh token (30 days).
 */
export async function signRefreshToken(payload: {
  userId: string;
  sessionId: string;
  tokenFamily: string;
  rotationIndex: number;
}): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    sessionId: payload.sessionId,
    tokenFamily: payload.tokenFamily,
    rotationIndex: payload.rotationIndex,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('docaas:clinical:auth')
    .setAudience('docaas:clinical:refresh')
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

/**
 * Verifies and decodes an access token.
 */
export async function verifyAccessToken(token: string): Promise<ClinicalTokenPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    issuer: 'docaas:clinical:auth',
    audience: 'docaas:clinical:clients',
  });

  return payload as ClinicalTokenPayload;
}

/**
 * Verifies and decodes a refresh token.
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload & {
  userId: string;
  sessionId: string;
  tokenFamily: string;
  rotationIndex: number;
}> {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    issuer: 'docaas:clinical:auth',
    audience: 'docaas:clinical:refresh',
  });

  return payload as JWTPayload & {
    userId: string;
    sessionId: string;
    tokenFamily: string;
    rotationIndex: number;
  };
}
