/**
 * @aura/api-service - Tamper-Evident SHA-256 Audit Trail Vault
 * Conforms to ADR-010: Tamper-Evident Cryptographic Audit Chaining
 */

import crypto from 'node:crypto';
import { UserRole, Jurisdiction } from '@aura/domain';

export interface AuditEventInput {
  actorId: string;
  actorRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  jurisdiction: Jurisdiction;
  details?: Record<string, unknown>;
  ipAddress?: string;
  correlationId?: string;
}

export interface AuditRecord extends AuditEventInput {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

class AuditVaultService {
  private chain: AuditRecord[] = [];
  private genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';

  constructor() {
    // Initialize with genesis block
    this.recordEvent({
      actorId: 'system-genesis',
      actorRole: UserRole.AUDITOR,
      action: 'AUDIT_VAULT_INITIALIZED',
      resourceType: 'system',
      resourceId: 'genesis',
      jurisdiction: Jurisdiction.NIGERIA,
      details: { environment: process.env.NODE_ENV || 'development' },
    });
  }

  private calculateHash(
    previousHash: string,
    sequenceNumber: number,
    timestamp: string,
    actorId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    detailsString: string
  ): string {
    const payload = `${previousHash}:${sequenceNumber}:${timestamp}:${actorId}:${action}:${resourceType}:${resourceId}:${detailsString}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  public recordEvent(input: AuditEventInput): AuditRecord {
    const sequenceNumber = this.chain.length;
    const lastBlock = sequenceNumber > 0 ? this.chain[sequenceNumber - 1] : undefined;
    const previousHash = lastBlock ? lastBlock.currentHash : this.genesisHash;
    const timestamp = new Date().toISOString();
    const detailsString = JSON.stringify(input.details || {});

    const currentHash = this.calculateHash(
      previousHash,
      sequenceNumber,
      timestamp,
      input.actorId,
      input.action,
      input.resourceType,
      input.resourceId,
      detailsString
    );

    const record: AuditRecord = {
      id: crypto.randomUUID(),
      sequenceNumber,
      timestamp,
      previousHash,
      currentHash,
      ...input,
    };

    this.chain.push(record);
    return record;
  }

  public getChain(limit = 100): AuditRecord[] {
    return this.chain.slice(-limit);
  }

  public verifyIntegrity(): { isValid: boolean; totalRecords: number; brokenIndex?: number } {
    for (let i = 0; i < this.chain.length; i++) {
      const record = this.chain[i];
      if (!record) {
        return { isValid: false, totalRecords: this.chain.length, brokenIndex: i };
      }

      const prevBlock = i > 0 ? this.chain[i - 1] : undefined;
      const expectedPrev = prevBlock ? prevBlock.currentHash : this.genesisHash;

      if (record.previousHash !== expectedPrev) {
        return { isValid: false, totalRecords: this.chain.length, brokenIndex: i };
      }

      const calculated = this.calculateHash(
        record.previousHash,
        record.sequenceNumber,
        record.timestamp,
        record.actorId,
        record.action,
        record.resourceType,
        record.resourceId,
        JSON.stringify(record.details || {})
      );

      if (calculated !== record.currentHash) {
        return { isValid: false, totalRecords: this.chain.length, brokenIndex: i };
      }
    }

    return { isValid: true, totalRecords: this.chain.length };
  }
}

export const auditVault = new AuditVaultService();
