/**
 * @docaas/domain - Core Domain Models, Enums, and State Machines
 * Next-Generation Clinical & Virtual Health Platform
 */

// ==========================================
// 1. Core Domain Enums
// ==========================================

export enum UserRole {
  PATIENT = 'patient',
  CLINICIAN = 'clinician',
  ADMIN = 'admin',
  SAFEGUARDING_LEAD = 'safeguarding_lead',
  AUDITOR = 'auditor',
}

export enum Jurisdiction {
  NIGERIA = 'NG',
  UNITED_KINGDOM = 'GB',
  INTERNATIONAL = 'INTL',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING_REVIEW = 'pending_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum AppointmentStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  CONFIRMED = 'confirmed',
  REMINDER_SENT = 'reminder_sent',
  PATIENT_CHECKED_IN = 'patient_checked_in',
  PATIENT_WAITING = 'patient_waiting',
  CLINICIAN_READY = 'clinician_ready',
  CONSULTATION_STARTED = 'consultation_started',
  CONSULTATION_COMPLETED = 'consultation_completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum EncounterType {
  TELEMEDICINE_VIDEO = 'telemedicine_video',
  TELEMEDICINE_AUDIO = 'telemedicine_audio',
  ASYNC_REVIEW = 'async_review',
  IN_PERSON = 'in_person',
}

export enum PrescriptionStatus {
  DRAFT = 'draft',
  AUTHORIZED = 'authorized',
  DISPENSED = 'dispensed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum SeverityLevel {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening',
}

export enum InvestigationStatus {
  ORDERED = 'ordered',
  SAMPLE_COLLECTED = 'sample_collected',
  IN_PROGRESS = 'in_progress',
  RESULTED = 'resulted',
  REVIEWED = 'reviewed',
  CANCELLED = 'cancelled',
}

export enum DataClassificationTier {
  TIER_1_IDENTIFIER = 'tier_1_identifier', // PII: Name, phone, NIN, BVN, photo
  TIER_2_CLINICAL_NOTE = 'tier_2_clinical_note', // SOAP notes, diagnoses, medications
  TIER_3_RAW_MEDIA = 'tier_3_raw_media', // DICOM imaging, consultation audio/video
  TIER_4_AUDIT_TELEMETRY = 'tier_4_audit_telemetry', // Logs, connection stats
}

// ==========================================
// 2. Appointment State Machine
// ==========================================

const VALID_APPOINTMENT_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  [AppointmentStatus.AVAILABLE]: [AppointmentStatus.BOOKED],
  [AppointmentStatus.BOOKED]: [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.REMINDER_SENT,
    AppointmentStatus.PATIENT_CHECKED_IN,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.RESCHEDULED,
    AppointmentStatus.NO_SHOW,
  ],
  [AppointmentStatus.CONFIRMED]: [
    AppointmentStatus.REMINDER_SENT,
    AppointmentStatus.PATIENT_CHECKED_IN,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.RESCHEDULED,
    AppointmentStatus.NO_SHOW,
  ],
  [AppointmentStatus.REMINDER_SENT]: [
    AppointmentStatus.PATIENT_CHECKED_IN,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.NO_SHOW,
  ],
  [AppointmentStatus.PATIENT_CHECKED_IN]: [
    AppointmentStatus.PATIENT_WAITING,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.NO_SHOW,
  ],
  [AppointmentStatus.PATIENT_WAITING]: [
    AppointmentStatus.CLINICIAN_READY,
    AppointmentStatus.CONSULTATION_STARTED,
    AppointmentStatus.NO_SHOW,
    AppointmentStatus.CANCELLED,
  ],
  [AppointmentStatus.CLINICIAN_READY]: [
    AppointmentStatus.CONSULTATION_STARTED,
    AppointmentStatus.CANCELLED,
  ],
  [AppointmentStatus.CONSULTATION_STARTED]: [
    AppointmentStatus.CONSULTATION_COMPLETED,
    AppointmentStatus.CANCELLED,
  ],
  [AppointmentStatus.CONSULTATION_COMPLETED]: [],
  [AppointmentStatus.CANCELLED]: [],
  [AppointmentStatus.NO_SHOW]: [],
  [AppointmentStatus.RESCHEDULED]: [AppointmentStatus.BOOKED],
};

export function canTransitionAppointment(
  from: AppointmentStatus,
  to: AppointmentStatus
): boolean {
  return VALID_APPOINTMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

// ==========================================
// 3. Clinical Entities & Types
// ==========================================

export interface ClinicalVitals {
  systolicBp?: number;
  diastolicBp?: number;
  heartRateBpm?: number;
  spo2Percentage?: number;
  temperatureCelsius?: number;
  respiratoryRate?: number;
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
}

export interface StructuredDiagnosis {
  code: string; // ICD-10 or SNOMED CT
  name: string;
  isPrimary: boolean;
  classification: 'confirmed' | 'differential' | 'provisional' | 'resolved';
}

export interface ClinicalEncounterNote {
  id: string;
  appointmentId: string;
  patientId: string;
  clinicianId: string;
  version: number;
  isLocked: boolean;
  lockedAt?: Date;

  // History
  presentingComplaint: string;
  historyOfPresentingComplaint: string;
  pastMedicalHistory?: string;
  pastSurgicalHistory?: string;
  drugHistory?: string;
  socialHistory?: string;
  familyHistory?: string;
  reviewOfSystems?: Record<string, string>;

  // Examination
  examinationFindings?: string;
  vitals?: ClinicalVitals;

  // Assessment
  primaryDiagnosis: StructuredDiagnosis;
  secondaryDiagnoses: StructuredDiagnosis[];
  differentialDiagnoses?: string;
  clinicalReasoning?: string;

  // Plan & Safety
  treatmentPlan: string;
  followUpInstructions?: string;
  safetyNettingAdvice: string;

  // AI Assistance Attestation
  aiGeneratedDraft: boolean;
  aiModelVersion?: string;
  clinicianReviewedAndApproved: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 4. Data Residency Policy Types
// ==========================================

export interface ResidencyRequestContext {
  patientId: string;
  patientJurisdiction: Jurisdiction;
  clinicianId: string;
  clinicianJurisdiction: Jurisdiction;
  dataTier: DataClassificationTier;
  legalBasis: 'direct_clinical_care' | 'explicit_consent' | 'safeguarding_emergency' | 'regulatory_audit';
  appointmentId?: string;
}

export interface ResidencyEvaluationResult {
  isPermitted: boolean;
  routingMode: 'domestic_direct' | 'authorized_cross_border_ephemeral' | 'denied';
  denialReason?: string;
  requiresRedaction: boolean;
  redactedFields?: string[];
  auditMetadata: {
    transferToken?: string;
    evaluatedAt: Date;
    policyVersion: string;
  };
}

// ==========================================
// 5. Patient Demographics & Genotype (Nigerian Context)
// ==========================================

export type NigerianGenotype = 'AA' | 'AS' | 'SS' | 'AC' | 'SC';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
