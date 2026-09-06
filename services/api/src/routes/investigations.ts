/**
 * @docaas/api-service - Diagnostic Investigations & Laboratory Orders
 * Conforms to ADR-002, ADR-008 (Secure Document Storage)
 */

import { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import { UserRole, Jurisdiction } from '@docaas/domain';
import { auditVault } from '../services/audit-vault.js';

export interface StoredInvestigation {
  id: string;
  orderNumber: string;
  patientId: string;
  clinicianId: string;
  appointmentId?: string;
  testCategory: 'pathology' | 'radiology' | 'cardiology' | 'microbiology';
  testName: string;
  clinicalIndication: string;
  status: 'ordered' | 'sample_collected' | 'in_progress' | 'resulted' | 'reviewed';
  resultsSummary?: string;
  attachmentUrls: string[];
  orderedAt: string;
  resultedAt?: string;
}

export const investigationsDb = new Map<string, StoredInvestigation>([
  [
    'inv-001',
    {
      id: 'inv-001',
      orderNumber: 'LAB-2026-10492',
      patientId: 'p1111111-1111-1111-1111-111111111111',
      clinicianId: 'c1111111-1111-1111-1111-111111111111',
      appointmentId: 'apt-seed-001',
      testCategory: 'pathology',
      testName: 'Lipid Profile & Serum Creatinine',
      clinicalIndication: 'Cardiovascular risk stratification in hypertension',
      status: 'resulted',
      resultsSummary: 'Total Cholesterol: 4.8 mmol/L (Normal), eGFR: 88 mL/min (Normal)',
      attachmentUrls: [
        'https://vault.alliance-health.org/investigations/LAB-2026-10492-report.pdf',
      ],
      orderedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      resultedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
  ],
]);

export const investigationRoutes: FastifyPluginAsync = async (fastify) => {
  // 1. Order New Diagnostic Investigation
  fastify.post('/api/v1/investigations', async (req, reply) => {
    const body = req.body as {
      patientId?: string;
      clinicianId?: string;
      appointmentId?: string;
      testCategory?: 'pathology' | 'radiology' | 'cardiology' | 'microbiology';
      testName?: string;
      clinicalIndication?: string;
    };

    if (!body.patientId || !body.testName || !body.clinicalIndication) {
      return reply.status(400).send({ error: 'Missing required investigation order fields' });
    }

    const id = crypto.randomUUID();
    const orderNumber = `LAB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const clinicianId = body.clinicianId || req.actor?.userId || 'c1111111-1111-1111-1111-111111111111';

    const record: StoredInvestigation = {
      id,
      orderNumber,
      patientId: body.patientId,
      clinicianId,
      appointmentId: body.appointmentId,
      testCategory: body.testCategory || 'pathology',
      testName: body.testName,
      clinicalIndication: body.clinicalIndication,
      status: 'ordered',
      attachmentUrls: [],
      orderedAt: now,
    };

    investigationsDb.set(id, record);

    auditVault.recordEvent({
      actorId: record.clinicianId,
      actorRole: UserRole.CLINICIAN,
      action: 'INVESTIGATION_ORDERED',
      resourceType: 'InvestigationOrder',
      resourceId: id,
      jurisdiction: Jurisdiction.NIGERIA,
      details: {
        orderNumber,
        testName: record.testName,
        testCategory: record.testCategory,
      },
    });

    return reply.status(201).send({
      investigationId: id,
      orderNumber,
      status: 'ordered',
      message: 'Diagnostic investigation successfully ordered.',
    });
  });

  // 2. List Patient Investigations
  fastify.get('/api/v1/investigations', async (req) => {
    const { patientId } = req.query as { patientId?: string };
    let list = Array.from(investigationsDb.values());

    if (patientId) {
      list = list.filter((i) => i.patientId === patientId);
    }

    return { investigations: list, total: list.length };
  });

  // 3. Generate Pre-signed Upload URL for Report PDF (ADR-008)
  fastify.post('/api/v1/investigations/:id/upload-url', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { filename, contentType } = req.body as { filename: string; contentType: string };

    const inv = investigationsDb.get(id);
    if (!inv) {
      return reply.status(404).send({ error: 'Investigation order not found' });
    }

    const secureUploadToken = crypto.randomUUID();
    const uploadUrl = `https://storage.alliance-health.org/upload/${id}/${secureUploadToken}?file=${encodeURIComponent(filename || 'lab-report.pdf')}`;
    const downloadUrl = `https://vault.alliance-health.org/investigations/${id}/${filename || 'lab-report.pdf'}`;

    return reply.send({
      investigationId: id,
      uploadUrl,
      publicReadUrl: downloadUrl,
      expiresInSeconds: 900,
      headers: {
        'content-type': contentType || 'application/pdf',
        'x-amz-server-side-encryption': 'AES256',
      },
    });
  });
};
