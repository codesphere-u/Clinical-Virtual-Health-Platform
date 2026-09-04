/**
 * @aura/api-service - Tamper-Evident SHA-256 Audit Trail Inspection & Verification
 * Conforms to ADR-010: Tamper-Evident SHA-256 Audit Trail
 */

import { FastifyPluginAsync } from 'fastify';
import { auditVault } from '../services/audit-vault.js';

export const auditRoutes: FastifyPluginAsync = async (fastify) => {
  // 1. Inspect Recent Audit Trail Records
  fastify.get('/api/v1/audit/records', async (req) => {
    const { limit } = req.query as { limit?: string };
    const records = auditVault.getChain(Number(limit) || 100);

    return {
      count: records.length,
      records,
    };
  });

  // 2. Cryptographically Verify Audit Chain Integrity (ADR-010)
  fastify.get('/api/v1/audit/verify', async () => {
    const verification = auditVault.verifyIntegrity();

    return {
      status: verification.isValid ? 'VERIFIED_SECURE' : 'COMPROMISED',
      algorithm: 'SHA-256 Chained Hash',
      totalBlocksVerified: verification.totalRecords,
      chainIntact: verification.isValid,
      brokenIndex: verification.brokenIndex,
      verifiedAt: new Date().toISOString(),
    };
  });
};
