'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  Lock,
} from 'lucide-react';

interface ConsultationRecord {
  id: string;
  date: string;
  clinician: string;
  license: string;
  specialty: string;
  diagnosis: string;
  icd10: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  prescriptions: string[];
}

const CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'enc-2026-0812',
    date: '12 August 2026',
    clinician: 'Dr. Alistair Williams',
    license: 'GMC #6123456 (UK)',
    specialty: 'General Practice',
    diagnosis: 'Essential (primary) hypertension, well-controlled',
    icd10: 'I10',
    soap: {
      subjective: 'Patient reports feeling well. Adherent to daily Amlodipine. No headaches, dizziness, or chest tightness reported. Monitors home BP twice weekly.',
      objective: 'BP 126/84 mmHg, HR 72 bpm regular, BMI 23.4 kg/m². CVS: S1+S2 present, no murmurs. Resp: Clear to auscultation bilaterally.',
      assessment: 'Primary hypertension adequately controlled on single-agent calcium channel blocker.',
      plan: '1. Continue Amlodipine 5mg OD oral.\n2. Recheck fasting lipid panel in 6 months.\n3. Routine virtual follow-up in 3 months or sooner if BP >140/90 consistently.',
    },
    prescriptions: ['Amlodipine 5mg Tablets - 28 days (OD)'],
  },
  {
    id: 'enc-2026-0618',
    date: '18 June 2026',
    clinician: 'Dr. Chidiebere Okafor',
    license: 'MDCN #34591 (NG)',
    specialty: 'Endocrinology',
    diagnosis: 'Impaired fasting glucose / Pre-diabetes screening',
    icd10: 'R73.01',
    soap: {
      subjective: 'Routine metabolic health check. Maternal history of Type 2 Diabetes. Patient interested in preventative dietary and lifestyle guidance.',
      objective: 'Fasting Plasma Glucose 5.8 mmol/L. HbA1c 6.2%. Waist circumference 78cm.',
      assessment: 'Impaired fasting glycaemia with elevated risk of T2DM progression.',
      plan: '1. Initiate lifestyle modification: Mediterranean-style diet, 150 min/week moderate aerobic exercise.\n2. Metformin 500mg BD initiated as preventative insulin sensitizer.\n3. Repeat HbA1c in 3 months.',
    },
    prescriptions: ['Metformin 500mg Extended Release - 56 tablets (BD)'],
  },
  {
    id: 'enc-2026-0210',
    date: '10 February 2026',
    clinician: 'Dr. Elizabeth Adeyemi',
    license: 'GMC #7654321 • MDCN #48291',
    specialty: 'Cardiology',
    diagnosis: 'Initial Cardiology Assessment & Risk Stratification',
    icd10: 'Z01.810',
    soap: {
      subjective: 'Referred following elevated workplace clinic blood pressure readings. Occasional exertion fatigue.',
      objective: 'ECG: Normal sinus rhythm, no left ventricular hypertrophy. Echocardiogram: Normal LV function, EF 62%.',
      assessment: 'Mild Stage 1 Hypertension with favorable cardiovascular risk profile.',
      plan: '1. Dietary sodium restriction (<2g/day).\n2. Commence Amlodipine 5mg daily.\n3. Target clinic BP <130/80 mmHg.',
    },
    prescriptions: ['Amlodipine 5mg Tablets - 28 days'],
  },
];

const CLINICAL_DOCUMENTS = [
  {
    id: 'doc-01',
    title: 'Cardiology Clearance & Fitness Assessment',
    date: '15 Feb 2026',
    author: 'Dr. Elizabeth Adeyemi (Cardiology)',
    type: 'Clinical Certificate',
    size: '184 KB',
  },
  {
    id: 'doc-02',
    title: 'Referral Letter: Advanced Echocardiography',
    date: '10 Feb 2026',
    author: 'Dr. Elizabeth Adeyemi (Cardiology)',
    type: 'Referral Letter',
    size: '142 KB',
  },
  {
    id: 'doc-03',
    title: 'Annual Metabolic & Renal Function Report',
    date: '24 Aug 2026',
    author: 'Synlab / Clinix Healthcare Lagos',
    type: 'Diagnostic Dossier',
    size: '412 KB',
  },
];

export default function MedicalRecordsPage() {
  const [expandedEncounters, setExpandedEncounters] = useState<string[]>(['enc-2026-0812']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleEncounter = (id: string) => {
    setExpandedEncounters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredConsultations = CONSULTATIONS.filter(
    (c) =>
      c.clinician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Electronic Health Record (EHR)
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
            Complete medical summary, verified SOAP consultation notes, and official clinical letters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => alert('Exporting full clinical record in HL7 FHIR format...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-main)',
            }}
          >
            <Download size={15} />
            <span>Export FHIR JSON</span>
          </button>
          <button
            onClick={() => alert('Generating signed clinical summary PDF...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              background: 'var(--docaas-teal)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={15} />
            <span>Download Summary PDF</span>
          </button>
        </div>
      </div>

      {/* ─── Medical Profile Summary Dossier ─── */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 16px 0' }}>
          Patient Clinical Baseline
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '13px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Blood Group / Genotype</span>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>O Rh+ / Genotype AA</div>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Known Allergies</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>Penicillin (Severe)</div>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Chronic Diagnoses</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>Essential Hypertension</div>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Regulatory Compliance</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
              <ShieldCheck size={14} />
              <span>NDPA 2023 & UK GDPR</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Search & Consultations Timeline ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
          Consultation Encounters ({filteredConsultations.length})
        </h2>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search notes, doctor, diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Encounter Accordion Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredConsultations.map((enc) => {
          const isExpanded = expandedEncounters.includes(enc.id);
          return (
            <div
              key={enc.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Encounter Header Bar */}
              <div
                onClick={() => toggleEncounter(enc.id)}
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? '#f8fafc' : '#ffffff',
                  borderBottom: isExpanded ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--docaas-teal)' }}>{enc.date}</span>
                    <span>•</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{enc.specialty}</span>
                    <span className="badge-status info">ICD-10: {enc.icd10}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 2px 0', color: 'var(--text-main)' }}>
                    {enc.diagnosis}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Presiding Clinician: <strong>{enc.clinician}</strong> ({enc.license})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
              </div>

              {/* SOAP Details View */}
              {isExpanded && (
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Subjective */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--docaas-teal)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Subjective (Patient History)
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                      {enc.soap.subjective}
                    </p>
                  </div>

                  {/* Objective */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--docaas-teal)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Objective (Clinical Examination & Vitals)
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                      {enc.soap.objective}
                    </p>
                  </div>

                  {/* Assessment */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--docaas-teal)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Assessment & Working Diagnosis
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                      {enc.soap.assessment}
                    </p>
                  </div>

                  {/* Plan */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--docaas-teal)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Plan & Prescriptions
                    </div>
                    <div style={{ whiteSpace: 'pre-line', fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                      {enc.soap.plan}
                    </div>
                  </div>

                  {/* Cryptographic Signature Stamp */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0', fontSize: '12px', color: '#065f46' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={14} />
                      <span>Electronically Signed & Locked: <strong>{enc.clinician}</strong></span>
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>SHA-256 Verified</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Clinical Documents & Letters ─── */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '12px 0 16px 0' }}>
          Official Clinical Documents & Letters
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {CLINICAL_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge-status neutral">{doc.type}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.size}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                  {doc.title}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Issued by: {doc.author}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Date: {doc.date}</div>
              </div>

              <button
                onClick={() => alert(`Downloading ${doc.title}...`)}
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--docaas-teal)',
                }}
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
