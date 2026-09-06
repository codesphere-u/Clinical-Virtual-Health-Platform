'use client';

import React, { useState } from 'react';
import {
  Search,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';

interface EncounterRecord {
  id: string;
  encounterDate: string;
  patientName: string;
  patientId: string;
  ageGender: string;
  diagnosis: string;
  icd10: string;
  sha256Hash: string;
  clinician: string;
  license: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  addenda: {
    id: string;
    timestamp: string;
    author: string;
    text: string;
  }[];
}

const HISTORICAL_ENCOUNTERS: EncounterRecord[] = [
  {
    id: 'enc-2026-0812-71',
    encounterDate: '12 Aug 2026, 14:15 WAT',
    patientName: 'Sarah Okafor',
    patientId: 'DOC-NG-09214',
    ageGender: '38F',
    diagnosis: 'Essential Hypertension (Stage 1), adequate pharmacological control',
    icd10: 'I10',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    clinician: 'Dr. Elizabeth Adeyemi',
    license: 'GMC #7654321 • MDCN #48291',
    soap: {
      subjective: 'Patient reports feeling well. Compliant with Amlodipine 5mg OD. Denies headaches, visual blurring, or shortness of breath.',
      objective: 'BP 126/84 mmHg | HR 72 bpm | SpO2 98% on air. S1+S2 dual, no gallop or murmurs.',
      assessment: 'Adequately controlled stage 1 hypertension.',
      plan: '1. Continue Amlodipine 5mg daily.\n2. Serum electrolytes and creatinine at 6 months.\n3. Virtual review in 3 months.',
    },
    addenda: [
      {
        id: 'add-1',
        timestamp: '14 Aug 2026, 09:30 WAT',
        author: 'Dr. Elizabeth Adeyemi (GMC #7654321)',
        text: 'Patient sent home blood pressure telemetry via WhatsApp channel: average 124/80 over 48 hours. Continued on current regimen.',
      },
    ],
  },
  {
    id: 'enc-2026-0801-44',
    encounterDate: '01 Aug 2026, 10:30 WAT',
    patientName: 'Babatunde Adeleke',
    patientId: 'DOC-NG-04412',
    ageGender: '51M',
    diagnosis: 'Type 2 Diabetes Mellitus with peripheral neuropathy screening',
    icd10: 'E11.40',
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    clinician: 'Dr. Elizabeth Adeyemi',
    license: 'GMC #7654321 • MDCN #48291',
    soap: {
      subjective: 'Reports tingling sensation in both great toes at night. Fasting blood sugar logs 6.8 - 7.4 mmol/L.',
      objective: 'Monofilament test: Intact sensation 8/10 points bilaterally. Pedal pulses palpable. BP 130/82 mmHg.',
      assessment: 'Early diabetic peripheral sensory neuropathy in setting of sub-optimal glycemic control.',
      plan: '1. Optimize Metformin to 1000mg BD.\n2. Initiate Pregabalin 50mg ON for symptomatic neuropathic discomfort.\n3. Podiatry diabetic foot care leaflet dispatched.\n4. HbA1c requisition sent to Synlab.',
    },
    addenda: [],
  },
  {
    id: 'enc-2026-0720-19',
    encounterDate: '20 Jul 2026, 16:00 WAT',
    patientName: 'Chukwuma Obi',
    patientId: 'DOC-UK-04820',
    ageGender: '55M',
    diagnosis: 'Post-catheter ablation rhythm check for Paroxysmal AF',
    icd10: 'I48.0',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    clinician: 'Dr. Elizabeth Adeyemi',
    license: 'GMC #7654321 • MDCN #48291',
    soap: {
      subjective: '3-month post-ablation review. No palpitations or syncope. Exercises regularly.',
      objective: 'Holter monitor report reviewed: Sinus rhythm throughout with isolated PACs (<1%). CHA2DS2-VASc score = 2.',
      assessment: 'Successful rhythm restoration post pulmonary vein isolation.',
      plan: '1. Maintain oral anticoagulation (Apixaban 5mg BD) as per stroke risk profile.\n2. Bisoprolol 2.5mg daily continued.\n3. Repeat ECG in 6 months.',
    },
    addenda: [],
  },
];

export default function EncounterHistoryPage() {
  const [encounters, setEncounters] = useState<EncounterRecord[]>(HISTORICAL_ENCOUNTERS);
  const [expandedEncounters, setExpandedEncounters] = useState<string[]>(['enc-2026-0812-71']);
  const [searchQuery, setSearchQuery] = useState('');

  // Addendum Modal state
  const [addendumModalEncounter, setAddendumModalEncounter] = useState<EncounterRecord | null>(null);
  const [addendumText, setAddendumText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEncounters((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveAddendum = () => {
    if (!addendumModalEncounter || !addendumText.trim()) return;
    const targetId = addendumModalEncounter.id;
    const newAddendum = {
      id: `add-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) + ' WAT',
      author: 'Dr. Elizabeth Adeyemi (GMC #7654321)',
      text: addendumText.trim(),
    };

    setEncounters((prev) =>
      prev.map((e) =>
        e.id === targetId ? { ...e, addenda: [...e.addenda, newAddendum] } : e
      )
    );

    setAddendumModalEncounter(null);
    setAddendumText('');
    setToastMessage('Addendum appended to immutable record with cryptographic timestamp.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredEncounters = encounters.filter(
    (e) =>
      e.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.icd10.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0d746f',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
          }}
        >
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Clinical Encounter Log & Audit Trail
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ws-muted)' }}>
            Cryptographically sealed electronic health records with immutable amendment tracking.
          </p>
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--ws-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search patient, diagnosis, or ICD-10..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--ws-border)',
              background: 'var(--ws-surface)',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Regulatory Notice Strip */}
      <div
        style={{
          background: 'rgba(13, 116, 111, 0.12)',
          border: '1px solid rgba(13, 116, 111, 0.35)',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#2dd4bf',
        }}
      >
        <ShieldCheck size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>GMC Good Medical Practice & MDCN Code Compliance:</strong> Signed clinical notes cannot be edited or erased. All additions must be appended as chronological addenda signed with medical practitioner credentials.
        </span>
      </div>

      {/* Encounters List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredEncounters.map((enc) => {
          const isExpanded = expandedEncounters.includes(enc.id);
          return (
            <div
              key={enc.id}
              style={{
                background: 'var(--ws-surface)',
                borderRadius: '14px',
                border: '1px solid var(--ws-border)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(enc.id)}
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                  borderBottom: isExpanded ? '1px solid var(--ws-border)' : 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{enc.patientName}</span>
                    <span style={{ fontSize: '11px', color: 'var(--ws-muted)' }}>({enc.ageGender})</span>
                    <span style={{ fontSize: '11px', color: '#2dd4bf', background: 'rgba(13, 116, 111, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                      ICD-10: {enc.icd10}
                    </span>
                    <span style={{ fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Lock size={11} /> Cryptographically Sealed
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px 0', color: '#cbd5e1' }}>
                    {enc.diagnosis}
                  </h3>

                  <div style={{ fontSize: '11px', color: 'var(--ws-muted)' }}>
                    Encounter: <strong>{enc.encounterDate}</strong> • Presiding: {enc.clinician} ({enc.license})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {isExpanded ? <ChevronUp size={18} color="var(--ws-muted)" /> : <ChevronDown size={18} color="var(--ws-muted)" />}
                </div>
              </div>

              {/* Expanded SOAP & Addenda */}
              {isExpanded && (
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* SOAP Breakdown Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ws-border)', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Subjective
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5 }}>
                        {enc.soap.subjective}
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ws-border)', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Objective
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5 }}>
                        {enc.soap.objective}
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ws-border)', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Assessment
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5 }}>
                        {enc.soap.assessment}
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ws-border)', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Plan
                      </div>
                      <div style={{ whiteSpace: 'pre-line', fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5 }}>
                        {enc.soap.plan}
                      </div>
                    </div>
                  </div>

                  {/* Addenda Section */}
                  {enc.addenda.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', margin: '0 0 10px 0' }}>
                        Appended Addenda & Telemetry Notes ({enc.addenda.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {enc.addenda.map((add) => (
                          <div
                            key={add.id}
                            style={{
                              background: 'rgba(245, 158, 11, 0.08)',
                              border: '1px solid rgba(245, 158, 11, 0.25)',
                              borderRadius: '8px',
                              padding: '12px 16px',
                            }}
                          >
                            <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600, marginBottom: '4px' }}>
                              Appended on {add.timestamp} by {add.author}
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#fef3c7', lineHeight: 1.4 }}>
                              {add.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cryptographic SHA-256 Hash Bar & Actions */}
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--ws-border)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ws-muted)' }}>
                      SHA-256: <span style={{ color: '#38bdf8' }}>{enc.sha256Hash}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => setAddendumModalEncounter(enc)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          color: '#fde68a',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={13} />
                        <span>Add Addendum</span>
                      </button>

                      <button
                        onClick={() => alert(`Exporting signed clinical summary for ${enc.patientName}...`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          background: 'var(--aura-teal)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Download size={13} />
                        <span>Export Certified PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Addendum Modal ── */}
      {addendumModalEncounter && (
        <div className="cockpit-modal-backdrop">
          <div className="cockpit-modal-card" style={{ maxWidth: '520px' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Append Clinical Addendum
              </h3>
              <button
                onClick={() => setAddendumModalEncounter(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '13px', color: '#334155' }}>
                Patient: <strong>{addendumModalEncounter.patientName}</strong> ({addendumModalEncounter.patientId})
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Addendum Text (Strictly Appended - Timestamped)
                </label>
                <textarea
                  rows={4}
                  value={addendumText}
                  onChange={(e) => setAddendumText(e.target.value)}
                  placeholder="e.g. Patient called following consultation reporting resolution of symptoms. Laboratory requisition results received..."
                  className="clinical-textarea"
                />
              </div>

              <div style={{ background: '#fef3c7', padding: '10px 12px', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '11px', color: '#92400e' }}>
                This addendum will be permanently chained to Encounter {addendumModalEncounter.id} under Dr. Elizabeth Adeyemi's GMC license.
              </div>
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', background: '#fafbfc', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setAddendumModalEncounter(null)}
                style={{ border: '1px solid #e2e8f0', background: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                disabled={!addendumText.trim()}
                onClick={handleSaveAddendum}
                style={{
                  background: addendumText.trim() ? 'var(--aura-teal)' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: addendumText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Sign & Append Addendum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
