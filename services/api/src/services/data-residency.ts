/**
 * @aura/api-service - Dual-Jurisdiction Data Residency Policy Engine
 * Conforms to ADR-006: Dual-Jurisdiction Data Residency Policy Engine (Nigeria NDPA 2023 & UK GDPR)
 */

import { Jurisdiction, UserRole } from '@aura/domain';
import { auditVault } from './audit-vault.js';

export interface DataTransferRequest {
  patientId: string;
  sourceJurisdiction: Jurisdiction;
  destinationJurisdiction: Jurisdiction;
  clinicianId: string;
  clinicianLicensingBody: 'GMC' | 'MDCN';
  purpose: 'telemedicine_consultation' | 'emergency_break_glass' | 'clinical_audit';
  hasExplicitConsent: boolean;
  dataCategories: string[];
}

export interface DataTransferResult {
  isPermitted: boolean;
  transferId: string;
  legalBasis: string;
  appliedSafeguards: string[];
  rejectionReason?: string;
  timestamp: string;
}

class DataResidencyEngine {
  public evaluateTransfer(request: DataTransferRequest): DataTransferResult {
    const timestamp = new Date().toISOString();
    const transferId = `XFER-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Intra-jurisdiction: Always permitted
    if (request.sourceJurisdiction === request.destinationJurisdiction) {
      return {
        isPermitted: true,
        transferId,
        legalBasis: 'Intra-territorial processing',
        appliedSafeguards: ['Standard TLS 1.3 encryption', 'RBAC access policy'],
        timestamp,
      };
    }

    // Cross-border from Nigeria to UK: Requires explicit consent under NDPA 2023 Section 41-43
    // or emergency break-glass for life-threatening scenarios
    if (request.sourceJurisdiction === Jurisdiction.NIGERIA && request.destinationJurisdiction === Jurisdiction.UNITED_KINGDOM) {
      if (!request.hasExplicitConsent && request.purpose !== 'emergency_break_glass') {
        return {
          isPermitted: false,
          transferId,
          legalBasis: 'NDPA 2023 Cross-Border Restriction',
          appliedSafeguards: [],
          rejectionReason: 'Cross-border transfer rejected: Explicit patient consent is required under NDPA 2023 Section 42.',
          timestamp,
        };
      }

      // Record in immutable audit vault
      auditVault.recordEvent({
        actorId: request.clinicianId,
        actorRole: UserRole.CLINICIAN,
        action: 'CROSS_BORDER_DATA_TRANSFER_AUTHORIZED',
        resourceType: 'PatientClinicalRecord',
        resourceId: request.patientId,
        jurisdiction: Jurisdiction.NIGERIA,
        details: {
          transferId,
          source: request.sourceJurisdiction,
          destination: request.destinationJurisdiction,
          licensingBody: request.clinicianLicensingBody,
          purpose: request.purpose,
          dataCategories: request.dataCategories,
        },
      });

      return {
        isPermitted: true,
        transferId,
        legalBasis: request.purpose === 'emergency_break_glass'
          ? 'NDPA 2023 Vital Interests Exemption (Emergency)'
          : 'NDPA 2023 Section 43 Explicit Consent & UK GDPR Adequacy Safeguards',
        appliedSafeguards: [
          'End-to-end Ephemeral Video Encryption',
          'UK Data Protection Act 2018 Special Category Health Data processing compliance',
          'SHA-256 Chained Cross-Border Audit Entry',
          'Zero local persistent storage on clinician personal device',
        ],
        timestamp,
      };
    }

    // Default fallback check
    return {
      isPermitted: true,
      transferId,
      legalBasis: 'Standard cross-jurisdiction clinical consultation agreement',
      appliedSafeguards: ['AES-256 encryption at rest', 'TLS 1.3 in transit'],
      timestamp,
    };
  }
}

export const dataResidencyEngine = new DataResidencyEngine();
