/**
 * @docaas/database Seed Script
 * Generates realistic clinical datasets for Nigerian patients & British/GMC clinicians
 */

import { PrismaClient, UserRole, VerificationStatus, AppointmentStatus, EncounterType, PrescriptionStatus, SeverityLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting clinical platform seed...');

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Alliance Clinical Virtual Health Network',
      jurisdiction: 'NG',
      regulatoryBody: 'MDCN & GMC Collaborative Practice',
    },
  });

  // 2. Clinicians Data (10 British / GMC & MDCN Clinicians)
  const cliniciansData = [
    {
      email: 'dr.adeyemi@alliance-health.org',
      firstName: 'Elizabeth',
      lastName: 'Adeyemi',
      title: 'Dr',
      primarySpecialty: 'Cardiology',
      subSpecialties: ['Hypertension Management', 'Heart Failure'],
      primaryLicensingBody: 'GMC',
      primaryLicenseNumber: '7654321',
      code: 'GMC-7654321',
      fee: 2500000, // 25,000 NGN
      bio: 'Consultant Cardiologist practicing at King’s College Hospital London and lead telemedicine advisor for West African diaspora care.',
    },
    {
      email: 'dr.williams@alliance-health.org',
      firstName: 'Alistair',
      lastName: 'Williams',
      title: 'Dr',
      primarySpecialty: 'General Practice',
      subSpecialties: ['Preventative Medicine', 'Family Health'],
      primaryLicensingBody: 'GMC',
      primaryLicenseNumber: '6123456',
      code: 'GMC-6123456',
      fee: 1800000,
      bio: 'NHS General Practitioner with over 15 years experience in ambulatory telehealth and chronic disease management.',
    },
    {
      email: 'dr.okafor@alliance-health.org',
      firstName: 'Chidiebere',
      lastName: 'Okafor',
      title: 'Dr',
      primarySpecialty: 'Endocrinology',
      subSpecialties: ['Type 2 Diabetes', 'Thyroid Disorders'],
      primaryLicensingBody: 'MDCN',
      primaryLicenseNumber: 'MDCN-34591',
      code: 'MDCN-34591',
      fee: 2200000,
      bio: 'Senior Endocrinologist at Lagos University Teaching Hospital and Fellow of the West African College of Physicians.',
    },
    {
      email: 'dr.morrison@alliance-health.org',
      firstName: 'Fiona',
      lastName: 'Morrison',
      title: 'Dr',
      primarySpecialty: 'Pediatrics',
      subSpecialties: ['Neonatal Follow-up', 'Childhood Asthma'],
      primaryLicensingBody: 'GMC',
      primaryLicenseNumber: '7891234',
      code: 'GMC-7891234',
      fee: 2000000,
      bio: 'Consultant Pediatrician at Great Ormond Street Hospital, London.',
    },
    {
      email: 'dr.balogun@alliance-health.org',
      firstName: 'Taiwo',
      lastName: 'Balogun',
      title: 'Prof',
      primarySpecialty: 'Neurology',
      subSpecialties: ['Stroke Rehabilitation', 'Epilepsy'],
      primaryLicensingBody: 'MDCN',
      primaryLicenseNumber: 'MDCN-18293',
      code: 'MDCN-18293',
      fee: 3000000,
      bio: 'Professor of Neurology with joint clinical appointments in Abuja and Manchester.',
    },
    {
      email: 'dr.jenkins@alliance-health.org',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      title: 'Dr',
      primarySpecialty: 'Dermatology',
      subSpecialties: ['Skin of Color', 'Eczema & Psoriasis'],
      primaryLicensingBody: 'GMC',
      primaryLicenseNumber: '7345678',
      code: 'GMC-7345678',
      fee: 2000000,
      bio: 'Consultant Dermatologist with specialist interest in tele-dermatology and dermatopathology.',
    },
    {
      email: 'dr.ezekiel@alliance-health.org',
      firstName: 'Babatunde',
      lastName: 'Ezekiel',
      title: 'Dr',
      primarySpecialty: 'Psychiatry',
      subSpecialties: ['Anxiety & Depression', 'Occupational Stress'],
      primaryLicensingBody: 'GMC',
      primaryLicenseNumber: '7984321',
      code: 'GMC-7984321',
      fee: 2500000,
      bio: 'Consultant Psychiatrist (MRCPsych) offering culturally attuned cognitive and psychopharmacological support.',
    },
    {
      email: 'dr.patel@alliance-health.org',
      firstName: 'Rohan',
      lastName: 'Patel',
      title: 'Dr',
      primarySpecialty: 'Respiratory Medicine',
      subSpecialties: ['COPD', 'Post-COVID Syndromes'],
      primaryLicensingBody: 'GMC',
      primaryLicenseNumber: '6876543',
      code: 'GMC-6876543',
      fee: 2200000,
      bio: 'Consultant Respiratory Physician at Royal Free London NHS Foundation Trust.',
    },
    {
      email: 'dr.lawal@alliance-health.org',
      firstName: 'Amina',
      lastName: 'Lawal',
      title: 'Dr',
      primarySpecialty: 'Obstetrics & Gynecology',
      subSpecialties: ['Maternal Health', 'PCOS'],
      primaryLicensingBody: 'MDCN',
      primaryLicenseNumber: 'MDCN-42110',
      code: 'MDCN-42110',
      fee: 2400000,
      bio: 'Specialist Obstetrician and Gynecologist based in Abuja with tele-triage accreditation.',
    },
    {
      email: 'dr.clarke@alliance-health.org',
      firstName: 'Edward',
      lastName: 'Clarke',
      title: 'Dr',
      primarySpecialty: 'Gastroenterology',
      subSpecialties: ['IBD', 'Liver Disorders'],
      primaryLicensingBody: 'GMC',
      primaryLicenseNumber: '6543210',
      code: 'GMC-6543210',
      fee: 2600000,
      bio: 'Consultant Gastroenterologist at St Thomas’ Hospital London.',
    },
  ];

  const createdClinicians = [];
  for (const c of cliniciansData) {
    const user = await prisma.user.create({
      data: {
        orgId: org.id,
        email: c.email,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$mock_hash_for_demo',
        role: UserRole.clinician,
        isMfaEnabled: true,
      },
    });

    const profile = await prisma.clinicianProfile.create({
      data: {
        userId: user.id,
        clinicianCode: c.code,
        title: c.title,
        firstName: c.firstName,
        lastName: c.lastName,
        primarySpecialty: c.primarySpecialty,
        subSpecialties: c.subSpecialties,
        primaryLicensingBody: c.primaryLicensingBody,
        primaryLicenseNumber: c.primaryLicenseNumber,
        compliancePassportStatus: VerificationStatus.verified,
        consultationFeeCents: c.fee,
        bio: c.bio,
      },
    });

    // Add compliance passport credentials
    await prisma.clinicianCredential.create({
      data: {
        clinicianId: profile.id,
        credentialType: 'Primary Medical Qualification',
        issuer: 'University Medical College',
        certificateNumber: `MED-${profile.primaryLicenseNumber}`,
        documentUrl: 'https://vault.alliance-health.org/credentials/primary-med.pdf',
        issueDate: new Date('2010-06-15'),
        verificationStatus: VerificationStatus.verified,
      },
    });

    await prisma.clinicianCredential.create({
      data: {
        clinicianId: profile.id,
        credentialType: 'Safeguarding Level 3',
        issuer: 'Royal College of Physicians',
        certificateNumber: `SAFE-2025-${profile.primaryLicenseNumber}`,
        documentUrl: 'https://vault.alliance-health.org/credentials/safeguarding.pdf',
        issueDate: new Date('2025-01-10'),
        expiryDate: new Date('2028-01-10'),
        verificationStatus: VerificationStatus.verified,
      },
    });

    createdClinicians.push(profile);
  }

  // 3. Nigerian Patients (20 Realistic Profiles)
  const patientsData = [
    { first: 'Olumide', last: 'Babalola', dob: '1982-04-12', gender: 'male', blood: 'O+', geno: 'AA', city: 'Lagos', state: 'Lagos State' },
    { first: 'Chioma', last: 'Eze', dob: '1990-09-23', gender: 'female', blood: 'A+', geno: 'AS', city: 'Ikeja', state: 'Lagos State' },
    { first: 'Emeka', last: 'Nwachukwu', dob: '1975-11-04', gender: 'male', blood: 'B+', geno: 'AA', city: 'Port Harcourt', state: 'Rivers State' },
    { first: 'Fatima', last: 'Danjuma', dob: '1988-02-18', gender: 'female', blood: 'O-', geno: 'AA', city: 'Abuja', state: 'Federal Capital Territory' },
    { first: 'Adekunle', last: 'Fashola', dob: '1968-07-30', gender: 'male', blood: 'AB+', geno: 'AC', city: 'Ibadan', state: 'Oyo State' },
    { first: 'Ngozi', last: 'Okeke', dob: '1995-12-05', gender: 'female', blood: 'O+', geno: 'SS', city: 'Enugu', state: 'Enugu State' }, // Sickle cell patient
    { first: 'Ibrahim', last: 'Musa', dob: '1980-03-14', gender: 'male', blood: 'A-', geno: 'AA', city: 'Kano', state: 'Kano State' },
    { first: 'Yetunde', last: 'Akintola', dob: '1992-06-25', gender: 'female', blood: 'O+', geno: 'AS', city: 'Lekki', state: 'Lagos State' },
    { first: 'Chukwudi', last: 'Obi', dob: '1986-08-19', gender: 'male', blood: 'B-', geno: 'AA', city: 'Asaba', state: 'Delta State' },
    { first: 'Halima', last: 'Suleiman', dob: '1994-01-11', gender: 'female', blood: 'O+', geno: 'AA', city: 'Kaduna', state: 'Kaduna State' },
    { first: 'Kayode', last: 'Oladipo', dob: '1979-10-08', gender: 'male', blood: 'A+', geno: 'AS', city: 'Abeokuta', state: 'Ogun State' },
    { first: 'Blessing', last: 'Umeh', dob: '1998-05-17', gender: 'female', blood: 'O+', geno: 'AA', city: 'Calabar', state: 'Cross River' },
    { first: 'Tunde', last: 'Ogunleye', dob: '1984-12-29', gender: 'male', blood: 'O-', geno: 'AA', city: 'Victoria Island', state: 'Lagos State' },
    { first: 'Amina', last: 'Bello', dob: '1991-07-03', gender: 'female', blood: 'B+', geno: 'AS', city: 'Sokoto', state: 'Sokoto State' },
    { first: 'Osas', last: 'Ighodaro', dob: '1987-03-22', gender: 'male', blood: 'A+', geno: 'AA', city: 'Benin City', state: 'Edo State' },
    { first: 'Kemi', last: 'Adewale', dob: '1993-11-15', gender: 'female', blood: 'O+', geno: 'AA', city: 'Surulere', state: 'Lagos State' },
    { first: 'Dapo', last: 'Soyinka', dob: '1972-09-09', gender: 'male', blood: 'AB-', geno: 'AA', city: 'Ilorin', state: 'Kwara State' },
    { first: 'Zainab', last: 'Gwandu', dob: '1996-04-01', gender: 'female', blood: 'O+', geno: 'AS', city: 'Abuja', state: 'Federal Capital Territory' },
    { first: 'Victor', last: 'Bassey', dob: '1983-08-16', gender: 'male', blood: 'B+', geno: 'AA', city: 'Uyo', state: 'Akwa Ibom' },
    { first: 'Funke', last: 'Oshodi', dob: '1989-10-24', gender: 'female', blood: 'O+', geno: 'AA', city: 'Yaba', state: 'Lagos State' },
  ];

  const createdPatients = [];
  for (let i = 0; i < patientsData.length; i++) {
    const p = patientsData[i]!;
    const mrn = `CVH-2026-${String(i + 1).padStart(4, '0')}`;
    const email = `patient.${p.first.toLowerCase()}.${p.last.toLowerCase()}@example.com`;

    const user = await prisma.user.create({
      data: {
        orgId: org.id,
        email,
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$mock_hash_for_demo',
        role: UserRole.patient,
      },
    });

    const profile = await prisma.patientProfile.create({
      data: {
        userId: user.id,
        mrn,
        firstName: p.first,
        lastName: p.last,
        dateOfBirth: new Date(p.dob),
        gender: p.gender,
        bloodGroup: p.blood,
        genotype: p.geno,
        verificationStatus: VerificationStatus.verified,
        livenessVerified: true,
        idCardVerified: true,
        residentialAddress: {
          city: p.city,
          state: p.state,
          country: 'Nigeria',
        },
        emergencyContact: {
          name: `${p.first} Emergency Kin`,
          relationship: 'Spouse / Next of Kin',
          phoneNumber: '+234 803 123 4567',
        },
      },
    });

    // Add allergies for select patients
    if (i % 3 === 0) {
      await prisma.patientAllergy.create({
        data: {
          patientId: profile.id,
          substance: 'Penicillin',
          reaction: 'Anaphylaxis and generalized urticaria',
          severity: SeverityLevel.life_threatening,
        },
      });
    }

    // Add chronic conditions
    if (p.geno === 'SS') {
      await prisma.patientCondition.create({
        data: {
          patientId: profile.id,
          conditionName: 'Sickle Cell Anemia (HbSS)',
          icd10Code: 'D57.1',
          status: 'active',
        },
      });
    } else if (i % 4 === 0) {
      await prisma.patientCondition.create({
        data: {
          patientId: profile.id,
          conditionName: 'Essential (Primary) Hypertension',
          icd10Code: 'I10',
          status: 'active',
        },
      });
    }

    createdPatients.push(profile);
  }

  // 4. Formulary Medications
  const formulary = [
    { generic: 'Amlodipine', brands: ['Norvasc', 'Amlovas'], form: 'Tablet', strengths: ['5mg', '10mg'], route: 'Oral' },
    { generic: 'Lisinopril', brands: ['Zestril'], form: 'Tablet', strengths: ['5mg', '10mg', '20mg'], route: 'Oral' },
    { generic: 'Metformin', brands: ['Glucophage'], form: 'Tablet', strengths: ['500mg', '850mg', '1000mg'], route: 'Oral' },
    { generic: 'Artemether-Lumefantrine', brands: ['Coartem', 'Lonart'], form: 'Tablet', strengths: ['20/120mg', '80/480mg'], route: 'Oral' },
    { generic: 'Paracetamol', brands: ['Panadol', 'Emzor'], form: 'Tablet', strengths: ['500mg', '1000mg'], route: 'Oral' },
    { generic: 'Salbutamol', brands: ['Ventolin'], form: 'Inhaler', strengths: ['100mcg/dose'], route: 'Inhalation' },
    { generic: 'Atorvastatin', brands: ['Lipitor'], form: 'Tablet', strengths: ['10mg', '20mg', '40mg'], route: 'Oral' },
    { generic: 'Hydroxyurea', brands: ['Hydrea'], form: 'Capsule', strengths: ['500mg'], route: 'Oral' },
  ];

  for (const f of formulary) {
    await prisma.formularyMedication.create({
      data: {
        jurisdiction: 'NG',
        genericName: f.generic,
        brandNames: f.brands,
        dosageForm: f.form,
        strengths: f.strengths,
        standardRoute: f.route,
      },
    });
  }

  // 5. Create 50 Realistic Appointments & Clinical Encounters
  const statuses = [
    AppointmentStatus.consultation_completed,
    AppointmentStatus.consultation_started,
    AppointmentStatus.patient_waiting,
    AppointmentStatus.booked,
    AppointmentStatus.confirmed,
  ];

  for (let i = 0; i < 50; i++) {
    const patient = createdPatients[i % createdPatients.length]!;
    const clinician = createdClinicians[i % createdClinicians.length]!;
    const status = statuses[i % statuses.length]!;

    const startTime = new Date(Date.now() - (25 - i) * 3600 * 1000 * 4);
    const endTime = new Date(startTime.getTime() + 45 * 60 * 1000);

    const appt = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        clinicianId: clinician.id,
        scheduledStart: startTime,
        scheduledEnd: endTime,
        status,
        encounterType: EncounterType.telemedicine_video,
        roomSid: `cvh-room-demo-${i + 1}`,
        idempotencyKey: `seed-idemp-appt-${i + 1}`,
      },
    });

    // If consultation completed, add structured SOAP notes and e-prescriptions
    if (status === AppointmentStatus.consultation_completed) {
      const note = await prisma.clinicalNote.create({
        data: {
          appointmentId: appt.id,
          patientId: patient.id,
          clinicianId: clinician.id,
          isLocked: true,
          lockedAt: new Date(endTime.getTime() + 5 * 60 * 1000),
          presentingComplaint: 'Follow-up on blood pressure control and recurrent mild morning headaches.',
          historyOfPresentingComplaint: 'Patient reports 3-week history of waking up with throbbing occipital headaches that resolve after hydration. No visual blurring, chest pain, or dyspnea.',
          pastMedicalHistory: 'Diagnosed with stage 1 hypertension 2 years ago. Moderately adherent to regimen.',
          drugHistory: 'Amlodipine 5mg once daily.',
          socialHistory: 'Non-smoker, drinks occasional palm wine on weekends, works long hours in banking.',
          familyHistory: 'Father had a stroke at age 62; mother living with Type 2 Diabetes.',
          vitals: {
            systolicBp: 142,
            diastolicBp: 90,
            heartRateBpm: 76,
            spo2Percentage: 98,
            temperatureCelsius: 36.6,
            bmi: 27.2,
          },
          primaryDiagnosisName: 'Suboptimally Controlled Essential Hypertension',
          primaryDiagnosisCode: 'I10',
          treatmentPlan: '1. Up-titrate Amlodipine from 5mg to 10mg daily. 2. Dietary sodium restriction (<2g/day). 3. Log home blood pressure readings twice daily for 14 days.',
          safetyNettingAdvice: 'Advised to seek immediate emergency hospital review if experiencing sudden severe chest pain, unilateral facial weakness, speech difficulty, or systolic BP exceeding 180 mmHg.',
          aiGeneratedDraft: true,
          aiModelVersion: 'gemini-clinical-assist-v2',
          clinicianReviewedAndApproved: true,
        },
      });

      // Add e-prescription
      const rx = await prisma.prescription.create({
        data: {
          prescriptionCode: `RX-2026-${String(i + 1).padStart(5, '0')}`,
          appointmentId: appt.id,
          patientId: patient.id,
          clinicianId: clinician.id,
          status: PrescriptionStatus.authorized,
          digitalSignatureHash: 'sha256-demo-sig-clinician-e-signature-verified',
          idempotencyKey: `seed-rx-idemp-${i + 1}`,
          items: {
            create: [
              {
                medicationName: 'Amlodipine',
                strength: '10mg',
                dosage: '1 tablet',
                frequency: 'Once daily in the morning',
                route: 'Oral',
                duration: '30 days',
                quantity: 30,
                specialInstructions: 'Take with or without food. Monitor for ankle edema.',
              },
            ],
          },
        },
      });

      // Add feedback
      await prisma.patientFeedback.create({
        data: {
          appointmentId: appt.id,
          patientId: patient.id,
          clinicianId: clinician.id,
          rating: 5,
          communicationRating: 5,
          clarityRating: 5,
          feedbackComments: 'Dr Adeyemi was thorough, patient, and explained the blood pressure adjustment very clearly. High-definition video with no lag.',
        },
      });
    }
  }

  // 6. Append-Only Audit Trail
  await prisma.auditEvent.create({
    data: {
      action: 'SYSTEM_INITIALIZATION',
      resourceType: 'Organization',
      resourceId: org.id,
      jurisdiction: 'NG',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      metadata: {
        environment: 'demo-production-seed',
        patientsCount: createdPatients.length,
        cliniciansCount: createdClinicians.length,
      },
    },
  });

  console.log('✅ Clinical platform seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
