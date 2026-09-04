/**
 * @aura/models - Zod Schemas and Validated DTOs
 * Next-Generation Clinical & Virtual Health Platform
 */

import { z } from 'zod';
import {
  UserRole,
  Jurisdiction,
  EncounterType,
} from '@aura/domain';

export * from '@aura/domain';


// ==========================================
// 1. Authentication Schemas
// ==========================================

export const RegisterUserSchema = z.object({
  email: z.string().email('Invalid clinical email address'),
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.nativeEnum(UserRole).default(UserRole.PATIENT),
  jurisdiction: z.nativeEnum(Jurisdiction).default(Jurisdiction.NIGERIA),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  mfaCode: z.string().length(6).optional(),
  deviceFingerprint: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ==========================================
// 2. Patient Profile & KYC Schemas
// ==========================================

export const PatientProfileSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name required'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD required'),
  gender: z.enum(['male', 'female', 'other']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  genotype: z.enum(['AA', 'AS', 'SS', 'AC', 'SC']).optional(),
  nin: z.string().length(11, 'Nigerian NIN must be exactly 11 digits').optional(),
  bvn: z.string().length(11, 'Nigerian BVN must be exactly 11 digits').optional(),
  residentialAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(), // e.g. Lagos, Abuja FCT, Rivers
    country: z.string().default('Nigeria'),
  }),
  emergencyContact: z.object({
    name: z.string().min(2),
    relationship: z.string().min(2),
    phoneNumber: z.string().min(10),
  }),
  preferredLanguage: z.string().default('en'),
});

export type PatientProfileInput = z.infer<typeof PatientProfileSchema>;

// ==========================================
// 3. Clinician Profile & Compliance Passport
// ==========================================

export const ClinicianProfileSchema = z.object({
  title: z.enum(['Dr', 'Prof', 'Mr', 'Mrs', 'Ms']),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  primarySpecialty: z.string().min(2),
  subSpecialties: z.array(z.string()).default([]),
  primaryLicensingBody: z.enum(['GMC', 'MDCN', 'OTHER']),
  primaryLicenseNumber: z.string().min(5, 'Valid license registration number required'),
  gmcRevalidationDueDate: z.string().optional(),
  consultationFeeCents: z.number().int().nonnegative(),
  currency: z.enum(['NGN', 'GBP', 'USD']).default('NGN'),
  bio: z.string().max(2000).optional(),
});

export type ClinicianProfileInput = z.infer<typeof ClinicianProfileSchema>;

export const UploadCredentialSchema = z.object({
  credentialType: z.enum([
    'Primary Medical Qualification',
    'Specialist Registration',
    'GMC Annual Practicing Certificate',
    'MDCN License',
    'Safeguarding Level 3',
    'Infection Control',
    'Medical Indemnity Insurance',
  ]),
  issuer: z.string().min(2),
  certificateNumber: z.string().optional(),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  documentUrl: z.string().url('Document file URL required'),
});

export type UploadCredentialInput = z.infer<typeof UploadCredentialSchema>;

// ==========================================
// 4. Appointment & Booking Schemas
// ==========================================

export const BookAppointmentSchema = z.object({
  clinicianId: z.string().uuid(),
  slotId: z.string().uuid().optional(),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  encounterType: z.nativeEnum(EncounterType).default(EncounterType.TELEMEDICINE_VIDEO),
  presentingReason: z.string().min(5, 'Please provide a brief reason for the consultation'),
  idempotencyKey: z.string().uuid('Idempotency key required'),
});

export type BookAppointmentInput = z.infer<typeof BookAppointmentSchema>;

export const WaitingRoomHeartbeatSchema = z.object({
  appointmentId: z.string().uuid(),
  participantRole: z.nativeEnum(UserRole),
  audioMuted: z.boolean().default(false),
  videoMuted: z.boolean().default(false),
  networkQuality: z.enum(['excellent', 'good', 'fair', 'poor']).default('good'),
});

export type WaitingRoomHeartbeatInput = z.infer<typeof WaitingRoomHeartbeatSchema>;

// ==========================================
// 5. Clinical Encounter Note (Structured SOAP)
// ==========================================

export const ClinicalVitalsSchema = z.object({
  systolicBp: z.number().int().min(50).max(300).optional(),
  diastolicBp: z.number().int().min(30).max(200).optional(),
  heartRateBpm: z.number().int().min(30).max(250).optional(),
  spo2Percentage: z.number().int().min(50).max(100).optional(),
  temperatureCelsius: z.number().min(30).max(45).optional(),
  respiratoryRate: z.number().int().min(5).max(60).optional(),
  weightKg: z.number().min(1).max(400).optional(),
  heightCm: z.number().min(30).max(250).optional(),
  bmi: z.number().optional(),
});

export const DiagnosisItemSchema = z.object({
  code: z.string(),
  name: z.string().min(2),
  isPrimary: z.boolean().default(false),
  classification: z.enum(['confirmed', 'differential', 'provisional', 'resolved']).default('provisional'),
});

export const SaveClinicalNoteSchema = z.object({
  appointmentId: z.string().uuid(),
  presentingComplaint: z.string().min(3, 'Presenting complaint required'),
  historyOfPresentingComplaint: z.string().min(5, 'History required'),
  pastMedicalHistory: z.string().optional(),
  pastSurgicalHistory: z.string().optional(),
  drugHistory: z.string().optional(),
  socialHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  examinationFindings: z.string().optional(),
  vitals: ClinicalVitalsSchema.optional(),
  primaryDiagnosis: DiagnosisItemSchema,
  secondaryDiagnoses: z.array(DiagnosisItemSchema).default([]),
  differentialDiagnoses: z.string().optional(),
  clinicalReasoning: z.string().optional(),
  treatmentPlan: z.string().min(5, 'Treatment plan required'),
  followUpInstructions: z.string().optional(),
  safetyNettingAdvice: z.string().min(5, 'Safety-netting advice required'),
  aiGeneratedDraft: z.boolean().default(false),
  aiModelVersion: z.string().optional(),
  clinicianReviewedAndApproved: z.boolean().default(true),
  idempotencyKey: z.string().uuid().optional(),
});

export type SaveClinicalNoteInput = z.infer<typeof SaveClinicalNoteSchema>;

// ==========================================
// 6. Prescription & Medication Schemas
// ==========================================

export const PrescriptionItemSchema = z.object({
  medicationName: z.string().min(2),
  strength: z.string().min(1), // e.g. 500mg, 10mg/5ml
  dosage: z.string().min(1), // e.g. 1 tablet, 5ml
  frequency: z.string().min(1), // e.g. Twice daily, Once at night
  route: z.string().default('Oral'), // Oral, Topical, Inhalation, IV, IM
  duration: z.string().min(1), // e.g. 7 days, 1 month
  quantity: z.number().int().positive(),
  specialInstructions: z.string().optional(),
  repeatsAllowed: z.number().int().nonnegative().default(0),
});

export const CreatePrescriptionSchema = z.object({
  appointmentId: z.string().uuid(),
  patientId: z.string().uuid(),
  items: z.array(PrescriptionItemSchema).min(1, 'At least one medication item required'),
  dispensingPharmacyNotes: z.string().optional(),
  idempotencyKey: z.string().uuid('Idempotency key required'),
});

export type CreatePrescriptionInput = z.infer<typeof CreatePrescriptionSchema>;

// ==========================================
// 7. Investigation & Lab Order Schemas
// ==========================================

export const OrderInvestigationSchema = z.object({
  appointmentId: z.string().uuid(),
  patientId: z.string().uuid(),
  testType: z.string().min(2), // e.g. Full Blood Count, Lipid Profile, Chest X-Ray
  clinicalIndication: z.string().min(5, 'Clinical indication required'),
  priority: z.enum(['routine', 'urgent', 'two_week_wait']).default('routine'),
  requiresClinicianReview: z.boolean().default(true),
});

export type OrderInvestigationInput = z.infer<typeof OrderInvestigationSchema>;

// ==========================================
// 8. Patient Feedback Schema
// ==========================================

export const SubmitFeedbackSchema = z.object({
  appointmentId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  communicationRating: z.number().int().min(1).max(5).optional(),
  clarityRating: z.number().int().min(1).max(5).optional(),
  feedbackComments: z.string().max(1000).optional(),
});

export type SubmitFeedbackInput = z.infer<typeof SubmitFeedbackSchema>;
