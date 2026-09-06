/**
 * @docaas/api-service - JWT Authentication Plugin
 * Fastify decorator: `request.actor` containing the verified ClinicalTokenPayload
 */

import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { verifyAccessToken, type ClinicalTokenPayload } from '@docaas/auth';

declare module 'fastify' {
  interface FastifyRequest {
    actor: ClinicalTokenPayload | null;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('actor', null);

  fastify.addHook('preHandler', async (request: FastifyRequest, _reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow requests without tokens — route handlers enforce auth as needed
      return;
    }

    const token = authHeader.substring(7);
    try {
      const payload = await verifyAccessToken(token);
      request.actor = payload;
    } catch {
      // Invalid / expired token — do not set actor; protected routes will reject
      request.actor = null;
    }
  });
};

export default fp(authPlugin, { name: 'docaas-auth' });
