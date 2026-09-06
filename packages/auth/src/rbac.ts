/**
 * @docaas/auth - RBAC & Attribute-Based Clinical Access Control (ABAC)
 * Next-Generation Clinical & Virtual Health Platform
 */

import { UserRole } from '@docaas/domain';

export type ClinicalPermission =
  | 'records:read'
  | 'records:write'
  | 'records:amend'
  | 'prescriptions:create'
  | 'prescriptions:sign'
  | 'prescriptions:cancel'
  | 'investigations:order'
  | 'investigations:release'
  | 'appointments:book'
  | 'appointments:manage'
  | 'compliance:review'
  | 'compliance:approve'
  | 'feedback:submit'
  | 'feedback:view_reports'
  | 'safeguarding:escalate'
  | 'safeguarding:manage'
  | 'audit:read'
  | 'system:manage';

const ROLE_PERMISSIONS: Record<UserRole, ClinicalPermission[]> = {
  [UserRole.PATIENT]: [
    'records:read',
    'appointments:book',
    'feedback:submit',
  ],
  [UserRole.CLINICIAN]: [
    'records:read',
    'records:write',
    'records:amend',
    'prescriptions:create',
    'prescriptions:sign',
    'prescriptions:cancel',
    'investigations:order',
    'investigations:release',
    'appointments:manage',
    'feedback:view_reports',
    'safeguarding:escalate',
  ],
  [UserRole.ADMIN]: [
    'appointments:manage',
    'compliance:review',
    'compliance:approve',
    'feedback:view_reports',
    'safeguarding:escalate',
    'audit:read',
    'system:manage',
  ],
  [UserRole.SAFEGUARDING_LEAD]: [
    'records:read',
    'safeguarding:escalate',
    'safeguarding:manage',
    'audit:read',
  ],
  [UserRole.AUDITOR]: [
    'audit:read',
    'compliance:review',
  ],
};

/**
 * Checks if a given role possesses a base permission.
 */
export function hasPermission(role: UserRole, permission: ClinicalPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export interface ClinicalAccessContext {
  requesterUserId: string;
  requesterRole: UserRole;
  targetPatientId: string;
  isBreakGlassEmergency?: boolean;
  breakGlassReason?: string;
  hasConfirmedAppointment?: boolean;
}

export interface AccessEvaluationResult {
  granted: boolean;
  reason?: string;
  isBreakGlassActive: boolean;
  auditFlagRequired: boolean;
}

/**
 * Evaluates contextual ABAC access to a patient's medical records.
 * Per ADR-004:
 * 1. Patients can access their own records.
 * 2. Clinicians must have a confirmed active clinical relationship or use audited break-glass override.
 * 3. Administrators are blocked from unmasked clinical records.
 */
export function evaluateRecordAccess(
  context: ClinicalAccessContext
): AccessEvaluationResult {
  // 1. Patient self-access
  if (context.requesterRole === UserRole.PATIENT) {
    if (context.requesterUserId === context.targetPatientId) {
      return { granted: true, isBreakGlassActive: false, auditFlagRequired: false };
    }
    return { granted: false, reason: 'Patients cannot access records of other patients', isBreakGlassActive: false, auditFlagRequired: true };
  }

  // 2. Clinician access
  if (context.requesterRole === UserRole.CLINICIAN) {
    if (context.hasConfirmedAppointment) {
      return { granted: true, isBreakGlassActive: false, auditFlagRequired: false };
    }

    // Emergency break-glass override
    if (context.isBreakGlassEmergency) {
      if (!context.breakGlassReason || context.breakGlassReason.trim().length < 10) {
        return { granted: false, reason: 'Break-glass emergency override requires a detailed clinical justification (min 10 characters)', isBreakGlassActive: false, auditFlagRequired: true };
      }

      return {
        granted: true,
        isBreakGlassActive: true,
        auditFlagRequired: true, // High-priority immediate alert to DPO
      };
    }

    return {
      granted: false,
      reason: 'No active clinical relationship or scheduled appointment exists with this patient. Use emergency override if required.',
      isBreakGlassActive: false,
      auditFlagRequired: true,
    };
  }

  // 3. Safeguarding lead
  if (context.requesterRole === UserRole.SAFEGUARDING_LEAD) {
    return { granted: true, isBreakGlassActive: false, auditFlagRequired: true };
  }

  // 4. Admins and Auditors: blocked from unredacted EMR notes
  return {
    granted: false,
    reason: 'Administrative and auditing roles are restricted from unmasked clinical encounter notes under data minimization principles.',
    isBreakGlassActive: false,
    auditFlagRequired: true,
  };
}
