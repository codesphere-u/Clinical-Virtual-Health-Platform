/**
 * @aura/api-service - Auth Routes (Register, Login, Refresh, MFA Setup/Verify, Logout)
 * Phase 2: Authentication, RBAC & Biometric KYC Onboarding
 */

import type { FastifyInstance } from 'fastify';
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateTotpSecret,
  verifyTotpToken,
  hasPermission,
} from '@aura/auth';
import { RegisterUserSchema, LoginSchema } from '@aura/models';
import { UserRole, Jurisdiction } from '@aura/domain';

// In-memory credential store (replaced by Prisma queries in full DB-wired build)
const userStore = new Map<
  string,
  {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    jurisdiction: Jurisdiction;
    mfaEnabled: boolean;
    totpSecretBase32?: string;
    backupCodes?: string[];
    sessionIndex: number;
  }
>();

// Refresh token family store (replaced by DB in production)
const refreshFamilyStore = new Map<string, { userId: string; rotationIndex: number; revoked: boolean }>();

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // ------------------------------------------------------------------
  // POST /api/v1/auth/register
  // ------------------------------------------------------------------
  fastify.post('/api/v1/auth/register', async (req, reply) => {
    const parse = RegisterUserSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Validation failed', details: parse.error.format() });
    }

    const { email, password, role, jurisdiction } = parse.data;

    if (userStore.has(email)) {
      return reply.status(409).send({ error: 'An account with this email already exists.' });
    }

    const userId = crypto.randomUUID();
    const passwordHash = hashPassword(password);
    const isMfaRequired = role === UserRole.CLINICIAN || role === UserRole.ADMIN;

    userStore.set(email, {
      id: userId,
      email,
      passwordHash,
      role,
      jurisdiction,
      mfaEnabled: false,
      sessionIndex: 0,
    });

    return reply.status(201).send({
      message: 'Account created. Please verify your email and complete identity onboarding.',
      user: { id: userId, email, role, jurisdiction },
      mfaSetupRequired: isMfaRequired,
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/auth/login  (Step 1 of 2 for MFA users)
  // ------------------------------------------------------------------
  fastify.post('/api/v1/auth/login', async (req, reply) => {
    const parse = LoginSchema.safeParse(req.body);
    if (!parse.success) {
      return reply.status(400).send({ error: 'Invalid login payload' });
    }

    const { email, password } = parse.data;

    // Demo persona passthrough for stakeholder testing
    const isDemo =
      email.endsWith('@demo.aura') ||
      email.includes('demo.patient') ||
      email.includes('demo.clinician') ||
      email.includes('demo.admin');

    let user = userStore.get(email);

    if (isDemo && !user) {
      // Auto-create ephemeral demo account
      const role = email.includes('clinician')
        ? UserRole.CLINICIAN
        : email.includes('admin')
          ? UserRole.ADMIN
          : UserRole.PATIENT;

      user = {
        id: crypto.randomUUID(),
        email,
        passwordHash: 'mock_hash_for_demo',
        role,
        jurisdiction: email.includes('.ng') ? Jurisdiction.NIGERIA : Jurisdiction.UNITED_KINGDOM,
        mfaEnabled: false,
        sessionIndex: 0,
      };
      userStore.set(email, user);
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
      // Generic error — do not hint which part failed (email vs. password)
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // If MFA is enabled, respond with an MFA challenge token instead of a full session
    if (user.mfaEnabled) {
      const mfaChallenge = Buffer.from(
        JSON.stringify({ userId: user.id, purpose: 'mfa_challenge', exp: Date.now() + 5 * 60_000 })
      ).toString('base64url');
      return reply.status(202).send({
        mfaRequired: true,
        mfaChallengeToken: mfaChallenge,
        message: 'Authenticator app verification required.',
      });
    }

    // No MFA — issue tokens directly
    const sessionId = crypto.randomUUID();
    const tokenFamily = crypto.randomUUID();
    user.sessionIndex += 1;

    refreshFamilyStore.set(tokenFamily, {
      userId: user.id,
      rotationIndex: 0,
      revoked: false,
    });

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        jurisdiction: user.jurisdiction,
        sessionId,
        tokenFamily,
      }),
      signRefreshToken({
        userId: user.id,
        sessionId,
        tokenFamily,
        rotationIndex: 0,
      }),
    ]);

    return reply.send({
      accessToken,
      refreshToken,
      expiresIn: 900,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        jurisdiction: user.jurisdiction,
      },
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/auth/mfa/verify  (Step 2 for MFA users)
  // ------------------------------------------------------------------
  fastify.post('/api/v1/auth/mfa/verify', async (req, reply) => {
    const { mfaChallengeToken, totpCode } = req.body as {
      mfaChallengeToken: string;
      totpCode: string;
    };

    if (!mfaChallengeToken || !totpCode) {
      return reply.status(400).send({ error: 'mfaChallengeToken and totpCode are required.' });
    }

    let challengeData: { userId: string; exp: number };
    try {
      challengeData = JSON.parse(Buffer.from(mfaChallengeToken, 'base64url').toString('utf-8')) as {
        userId: string;
        exp: number;
      };
    } catch {
      return reply.status(400).send({ error: 'Invalid MFA challenge token.' });
    }

    if (Date.now() > challengeData.exp) {
      return reply.status(401).send({ error: 'MFA challenge expired. Please log in again.' });
    }

    const user = [...userStore.values()].find((u) => u.id === challengeData.userId);
    if (!user || !user.totpSecretBase32) {
      return reply.status(401).send({ error: 'MFA configuration not found.' });
    }

    const isValid = verifyTotpToken(totpCode, user.totpSecretBase32);
    if (!isValid) {
      return reply.status(401).send({ error: 'Incorrect TOTP code. Please try again.' });
    }

    const sessionId = crypto.randomUUID();
    const tokenFamily = crypto.randomUUID();

    refreshFamilyStore.set(tokenFamily, {
      userId: user.id,
      rotationIndex: 0,
      revoked: false,
    });

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        jurisdiction: user.jurisdiction,
        sessionId,
        tokenFamily,
      }),
      signRefreshToken({
        userId: user.id,
        sessionId,
        tokenFamily,
        rotationIndex: 0,
      }),
    ]);

    return reply.send({
      accessToken,
      refreshToken,
      expiresIn: 900,
      tokenType: 'Bearer',
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/auth/mfa/setup  (Enroll authenticator app)
  // ------------------------------------------------------------------
  fastify.post('/api/v1/auth/mfa/setup', async (req, reply) => {
    const actor = req.actor;
    if (!actor) {
      return reply.status(401).send({ error: 'Authentication required.' });
    }

    const user = [...userStore.values()].find((u) => u.id === actor.userId);
    if (!user) {
      return reply.status(404).send({ error: 'User not found.' });
    }

    const totpSetup = generateTotpSecret(user.email, 'Aura Clinical Network');
    user.totpSecretBase32 = totpSetup.secret;
    user.backupCodes = totpSetup.backupCodes;

    return reply.send({
      otpauthUri: totpSetup.otpauthUri,
      secret: totpSetup.secret,
      backupCodes: totpSetup.backupCodes,
      message: 'Scan this QR code with your authenticator app. Submit a code from your app to confirm activation.',
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/auth/mfa/confirm  (Activate MFA after verifying first TOTP code)
  // ------------------------------------------------------------------
  fastify.post('/api/v1/auth/mfa/confirm', async (req, reply) => {
    const actor = req.actor;
    if (!actor) return reply.status(401).send({ error: 'Authentication required.' });

    const { totpCode } = req.body as { totpCode: string };
    const user = [...userStore.values()].find((u) => u.id === actor.userId);
    if (!user || !user.totpSecretBase32) {
      return reply.status(400).send({ error: 'MFA setup not initiated. Call /auth/mfa/setup first.' });
    }

    if (!verifyTotpToken(totpCode, user.totpSecretBase32)) {
      return reply.status(400).send({ error: 'TOTP confirmation failed. Authenticator code is invalid.' });
    }

    user.mfaEnabled = true;
    return reply.send({
      mfaEnabled: true,
      message: 'Multi-factor authentication successfully activated on your account.',
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/auth/refresh  (Rotating refresh token exchange)
  // ------------------------------------------------------------------
  fastify.post('/api/v1/auth/refresh', async (req, reply) => {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) {
      return reply.status(400).send({ error: 'refreshToken is required.' });
    }

    let payload: Awaited<ReturnType<typeof verifyRefreshToken>>;
    try {
      payload = await verifyRefreshToken(refreshToken);
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired refresh token.' });
    }

    const family = refreshFamilyStore.get(payload.tokenFamily);
    if (!family || family.revoked) {
      // Possible token reuse attack — revoke entire family
      if (family) {
        family.revoked = true;
      }
      return reply.status(401).send({ error: 'Refresh token reuse detected. All sessions invalidated. Please log in again.' });
    }

    if (family.rotationIndex !== payload.rotationIndex) {
      family.revoked = true;
      return reply.status(401).send({ error: 'Stale refresh token. Please log in again.' });
    }

    const user = [...userStore.values()].find((u) => u.id === payload.userId);
    if (!user) {
      return reply.status(401).send({ error: 'User account not found.' });
    }

    // Rotate: increment the rotation index
    family.rotationIndex += 1;
    const newSessionId = crypto.randomUUID();

    const [newAccessToken, newRefreshToken] = await Promise.all([
      signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        jurisdiction: user.jurisdiction,
        sessionId: newSessionId,
        tokenFamily: payload.tokenFamily,
      }),
      signRefreshToken({
        userId: user.id,
        sessionId: newSessionId,
        tokenFamily: payload.tokenFamily,
        rotationIndex: family.rotationIndex,
      }),
    ]);

    return reply.send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
      tokenType: 'Bearer',
    });
  });

  // ------------------------------------------------------------------
  // POST /api/v1/auth/logout
  // ------------------------------------------------------------------
  fastify.post('/api/v1/auth/logout', async (req, reply) => {
    const actor = req.actor;
    if (!actor) return reply.status(401).send({ error: 'Authentication required.' });

    const family = refreshFamilyStore.get(actor.tokenFamily);
    if (family) {
      family.revoked = true;
    }

    return reply.send({ message: 'Signed out successfully. Session revoked.' });
  });

  // ------------------------------------------------------------------
  // GET /api/v1/auth/me  (Session context)
  // ------------------------------------------------------------------
  fastify.get('/api/v1/auth/me', async (req, reply) => {
    const actor = req.actor;
    if (!actor) return reply.status(401).send({ error: 'Authentication required.' });



    return reply.send({
      actor: {
        userId: actor.userId,
        email: actor.email,
        role: actor.role,
        jurisdiction: actor.jurisdiction,
        sessionId: actor.sessionId,
      },
      permissions: {
        canReadRecords: hasPermission(actor.role, 'records:read'),
        canWriteRecords: hasPermission(actor.role, 'records:write'),
        canPrescribe: hasPermission(actor.role, 'prescriptions:create'),
        canOrderInvestigations: hasPermission(actor.role, 'investigations:order'),
        canReviewCompliance: hasPermission(actor.role, 'compliance:review'),
        canReadAuditLedger: hasPermission(actor.role, 'audit:read'),
      },
    });
  });
}
