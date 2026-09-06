'use client';

import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  FileSignature,
  Activity,
  CheckCircle2,
  X,
  Share2,
  Clock,
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  ageGender: string;
  reason: string;
  waitDuration: string;
  urgency: 'urgent' | 'routine';
  bp: string;
  hr: string;
  spo2: string;
  temp: string;
  allergies: string[];
}

const QUEUE_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Olumide Babalola',
    ageGender: '42M',
    reason: 'Hypertension Review & Medication Adjustment',
    waitDuration: '4 min',
    urgency: 'urgent',
    bp: '142/90 mmHg',
    hr: '76 bpm',
    spo2: '98%',
    temp: '36.7°C',
    allergies: ['Penicillin (Anaphylaxis)', 'Amoxicillin'],
  },
  {
    id: 'p2',
    name: 'Amina Bello',
    ageGender: '29F',
    reason: 'Thyroid Panel & Levothyroxine Dose Check',
    waitDuration: '8 min',
    urgency: 'routine',
    bp: '118/76 mmHg',
    hr: '68 bpm',
    spo2: '99%',
    temp: '36.5°C',
    allergies: ['None Documented'],
  },
  {
    id: 'p3',
    name: 'Chukwuma Obi',
    ageGender: '55M',
    reason: 'Post-ECG Arrhythmia Assessment',
    waitDuration: '14 min',
    urgency: 'routine',
    bp: '135/85 mmHg',
    hr: '82 bpm',
    spo2: '97%',
    temp: '36.9°C',
    allergies: ['Sulfa drugs'],
  },
];

export default function ConsultationRoomPage() {
  const [activePatient, setActivePatient] = useState<Patient>(QUEUE_PATIENTS[0]!);
  const [activeTab, setActiveTab] = useState<'soap' | 'ai' | 'rx'>('soap');
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [noteSigned, setNoteSigned] = useState(false);
  const [emergencyModal, setEmergencyModal] = useState(false);

  // SOAP Inputs
  const [subjective, setSubjective] = useState(
    'Patient reports mild episodic occipital headaches in the evenings. Compliant with daily Amlodipine 5mg. Denies chest pain, palpitations, or visual disturbance.'
  );
  const [objective, setObjective] = useState(
    'BP: 142/90 mmHg | HR: 76 bpm regular | SpO₂: 98% on room air. JVP normal. Heart sounds S1+S2, no murmurs. Chest auscultation clear.'
  );
  const [assessment, setAssessment] = useState('Essential Stage 1 Hypertension with sub-target daytime control (ICD-10: I10).');
  const [plan, setPlan] = useState(
    '1. Increase Amlodipine to 10mg once daily in morning.\n2. Serum urea, electrolytes & creatinine in 4 weeks.\n3. Patient to log blood pressure daily.\n4. Virtual review in 14 days.'
  );

  // Prescription input
  const [rxInput, setRxInput] = useState('Amlodipine 10mg PO Daily');
  const [rxSafetyAlert, setRxSafetyAlert] = useState<string | null>(null);

  const handleRxChange = (val: string) => {
    setRxInput(val);
    const danger = ['amoxicillin', 'penicillin', 'augmentin'];
    if (danger.some((d) => val.toLowerCase().includes(d))) {
      setRxSafetyAlert('CRITICAL ALLERGY BLOCK: Patient has a documented severe allergy to Penicillin!');
    } else {
      setRxSafetyAlert(null);
    }
  };

  const handleApplyAiScribe = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setSubjective(
        'Ambient Audio Transcription: Patient confirms daily compliance with Amlodipine 5mg. Reports mild evening headaches 3x/week. Denies shortness of breath, chest pressure, orthopnea.'
      );
      setPlan(
        '1. Step up Amlodipine to 10mg daily.\n2. Lifestyle sodium restriction <2g/day.\n3. Two-week remote BP telemetry follow-up.'
      );
      setActiveTab('soap');
    }, 700);
  };

  return (
    <div style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', background: 'var(--ws-bg)', color: 'var(--ws-text)', overflow: 'hidden' }}>
      
      {/* ── Sub-header with Session Stats & Emergency Trigger ── */}
      <div
        style={{
          height: '42px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid var(--ws-border)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot" style={{ background: '#34d399' }} />
            <span>Consultation Session Active: <strong>08:14</strong></span>
          </div>
          <span style={{ color: 'var(--ws-dim)' }}>|</span>
          <span style={{ color: '#38bdf8' }}>Lagos-1 SFU (34ms) • 1080p WebRTC</span>
        </div>

        <button
          onClick={() => setEmergencyModal(true)}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <AlertTriangle size={13} />
          <span>Emergency Red-Flag</span>
        </button>
      </div>

      {/* ── Main Cockpit Body (3 Columns) ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 390px', overflow: 'hidden' }}>
        
        {/* ── Column 1: Patient Triage Queue ── */}
        <aside
          style={{
            background: 'var(--ws-surface)',
            borderRight: '1px solid var(--ws-border)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '16px',
            gap: '14px',
          }}
        >
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ws-muted)', letterSpacing: '0.08em', margin: '0 0 10px' }}>
              Virtual Waiting Queue (3)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUEUE_PATIENTS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActivePatient(p)}
                  className={`triage-patient-item ${activePatient.id === p.id ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{p.name}</span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        background: p.urgency === 'urgent' ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.15)',
                        color: p.urgency === 'urgent' ? '#fca5a5' : '#7dd3fc',
                      }}
                    >
                      {p.urgency}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--ws-muted)', margin: '0 0 4px', lineHeight: 1.3 }}>{p.reason}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--ws-dim)' }}>
                    <Clock size={11} /> <span>Waiting {p.waitDuration}</span>
                    <span>•</span>
                    <span>{p.ageGender}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Patient Allergy Alert */}
          <div
            style={{
              marginTop: 'auto',
              background: 'rgba(239,68,68,0.10)',
              border: '1px solid rgba(239,68,68,0.28)',
              borderRadius: '10px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fca5a5', fontWeight: 700, fontSize: '11px', marginBottom: '4px' }}>
              <AlertTriangle size={13} />
              Documented Allergies
            </div>
            {activePatient.allergies.map((a, i) => (
              <p key={i} style={{ fontSize: '11px', color: '#fecaca', margin: '2px 0 0', fontWeight: 600 }}>
                • {a}
              </p>
            ))}
          </div>
        </aside>

        {/* ── Column 2: WebRTC Video Stage & Continuous Vitals ── */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--ws-bg)',
            padding: '16px',
            gap: '14px',
            overflow: 'hidden',
          }}
        >
          {/* Main Video Screen */}
          <div
            style={{
              flex: 1,
              background: 'radial-gradient(ellipse at 50% 50%, #0f2038 0%, #060b13 80%)',
              borderRadius: '16px',
              border: '1px solid var(--ws-border)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Active Patient Feed (Simulated) */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d746f 0%, #0369a1 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 800,
                  margin: '0 auto 14px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                {activePatient.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#f1f5f9' }}>
                {activePatient.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--ws-muted)', margin: 0 }}>
                HD 1080p Stream Active · Latency 34ms · End-to-End Encrypted
              </p>
            </div>

            {/* Self-view PiP (Doctor) */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '140px',
                height: '95px',
                borderRadius: '10px',
                background: '#0c1421',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: 'var(--ws-muted)',
              }}
            >
              <span style={{ fontWeight: 700, color: '#f1f5f9' }}>Dr. Adeyemi (You)</span>
              <span style={{ fontSize: '9px', color: '#34d399', marginTop: '2px' }}>● 1080p 60fps</span>
            </div>

            {/* Floating Call Control Dock */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(12, 20, 33, 0.85)',
                backdropFilter: 'blur(16px)',
                padding: '8px 18px',
                borderRadius: '40px',
                border: '1px solid var(--ws-border)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
              }}
            >
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`dock-control-btn ${micMuted ? 'active-danger' : ''}`}
                title={micMuted ? 'Unmute' : 'Mute'}
              >
                {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                onClick={() => setCameraOff(!cameraOff)}
                className={`dock-control-btn ${cameraOff ? 'active-danger' : ''}`}
                title={cameraOff ? 'Turn on Camera' : 'Turn off Camera'}
              >
                {cameraOff ? <VideoOff size={18} /> : <Video size={18} />}
              </button>

              <button className="dock-control-btn" title="Share Screen">
                <Share2 size={18} />
              </button>

              <button
                onClick={() => alert('Consultation completed. Generating cryptographic audit entry...')}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '10px 18px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                }}
              >
                <PhoneOff size={15} />
                End Encounter
              </button>
            </div>
          </div>

          {/* Continuous Vitals Bar */}
          <div
            style={{
              background: 'var(--ws-surface)',
              border: '1px solid var(--ws-border)',
              borderRadius: '12px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ws-muted)' }}>
              <Activity size={15} style={{ color: 'var(--aura-teal)' }} />
              Live Patient Telemetry
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '12px' }}>
              <div>
                <span style={{ color: 'var(--ws-muted)', marginRight: '6px' }}>BP:</span>
                <span style={{ fontWeight: 800, color: '#fca5a5' }}>{activePatient.bp} (High)</span>
              </div>
              <div>
                <span style={{ color: 'var(--ws-muted)', marginRight: '6px' }}>HR:</span>
                <span style={{ fontWeight: 800, color: '#34d399' }}>{activePatient.hr} (Normal)</span>
              </div>
              <div>
                <span style={{ color: 'var(--ws-muted)', marginRight: '6px' }}>SpO₂:</span>
                <span style={{ fontWeight: 800, color: '#38bdf8' }}>{activePatient.spo2}</span>
              </div>
              <div>
                <span style={{ color: 'var(--ws-muted)', marginRight: '6px' }}>Temp:</span>
                <span style={{ fontWeight: 800, color: '#f1f5f9' }}>{activePatient.temp}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Column 3: SOAP Notes & AI Ambient Copilot ── */}
        <section
          style={{
            background: 'var(--panel-bg)',
            color: 'var(--panel-text)',
            borderLeft: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Header Tabs */}
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <button
              onClick={() => setActiveTab('soap')}
              className={`editor-tab-btn ${activeTab === 'soap' ? 'active' : ''}`}
            >
              SOAP Record
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`editor-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            >
              AI Ambient Scribe
            </button>
            <button
              onClick={() => setActiveTab('rx')}
              className={`editor-tab-btn ${activeTab === 'rx' ? 'active' : ''}`}
            >
              E-Prescription
            </button>
          </div>

          {/* Tab 1: SOAP Form */}
          {activeTab === 'soap' && (
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Subjective (Patient Symptoms)
                </label>
                <textarea
                  rows={3}
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  className="clinical-textarea"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Objective (Clinical Findings & Vitals)
                </label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="clinical-textarea"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Assessment (ICD-10 Code)
                </label>
                <input
                  type="text"
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '12px',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Plan & Orders
                </label>
                <textarea
                  rows={3}
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="clinical-textarea"
                />
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {noteSigned ? '✅ Signed & Sealed' : 'Draft Auto-saved'}
                </span>

                <button
                  onClick={() => setShowSignModal(true)}
                  disabled={noteSigned}
                  style={{
                    background: noteSigned ? '#f1f5f9' : 'var(--aura-teal)',
                    color: noteSigned ? '#94a3b8' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: noteSigned ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: noteSigned ? 'none' : '0 2px 8px rgba(13, 116, 111, 0.3)',
                  }}
                >
                  <FileSignature size={15} />
                  {noteSigned ? 'Record Sealed' : 'Sign & Cryptographically Seal'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: AI Ambient Scribe */}
          {activeTab === 'ai' && (
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ background: '#f0fdf9', border: '1px solid var(--aura-teal-border)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--aura-teal)', fontWeight: 800, fontSize: '13px' }}>
                  <Sparkles size={16} />
                  Live Clinical Audio Transcription
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: '6px 0 12px' }}>
                  Speech recognition model continuously listening and synthesizing clinical points in real-time.
                </p>

                {/* Animated Waveform */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '28px' }}>
                  {[10, 18, 24, 12, 8, 26, 14, 20, 9, 16, 22].map((h, i) => (
                    <span key={i} className="scribe-wave-bar" style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>

              <div style={{ background: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                  Synthesized Clinical Findings:
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  <li>Patient confirms adherence to Amlodipine 5mg.</li>
                  <li>Occipital headaches present in the evenings (3-4 times per week).</li>
                  <li>Denies orthopnea, chest pressure, visual aura, or pedal edema.</li>
                  <li>Clinician recommendation: Up-titrate dose to 10mg daily with home telemetry.</li>
                </ul>
              </div>

              <button
                onClick={handleApplyAiScribe}
                disabled={aiGenerating}
                style={{
                  background: 'linear-gradient(135deg, #0d746f 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(13, 116, 111, 0.25)',
                }}
              >
                <Sparkles size={15} />
                {aiGenerating ? 'Synthesizing...' : 'Insert Synthesized Points into SOAP Note'}
              </button>
            </div>
          )}

          {/* Tab 3: E-Prescription */}
          {activeTab === 'rx' && (
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Prescribe Medication (Automated Cross-Check)
                </label>
                <input
                  type="text"
                  value={rxInput}
                  onChange={(e) => handleRxChange(e.target.value)}
                  placeholder="Type medication name (try 'Amoxicillin' to test allergy block)..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '12px',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                />
              </div>

              {rxSafetyAlert && (
                <div
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #f87171',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#991b1b',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {rxSafetyAlert}
                </div>
              )}

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: '0 0 6px' }}>
                  ACTIVE REGULATORY DISPENSING JURISDICTION:
                </p>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  Nigeria Pharmacists Council (PCN) & UK GPhC Cross-Border Protocol
                </p>
              </div>

              <button
                disabled={!!rxSafetyAlert}
                onClick={() => alert(`Prescription authorized: ${rxInput}`)}
                style={{
                  marginTop: 'auto',
                  background: rxSafetyAlert ? '#cbd5e1' : 'var(--aura-teal)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: rxSafetyAlert ? 'not-allowed' : 'pointer',
                }}
              >
                Sign & Transmit Electronic Prescription
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ── Cryptographic Seal Confirmation Modal ── */}
      {showSignModal && (
        <div className="cockpit-modal-backdrop">
          <div className="cockpit-modal-card">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} style={{ color: '#0d746f' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Cryptographic Note Signing</h3>
              </div>
              <button onClick={() => setShowSignModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                You are locking the clinical encounter note for <strong>{activePatient.name}</strong>. This generates an immutable SHA-256 hash record recorded in the bilateral audit vault.
              </p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#0f172a' }}>
                <p style={{ margin: '0 0 4px', color: '#64748b' }}>// SHA-256 HASH CHAIN BLOCK</p>
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#065f46', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                Verified Doctor Certificate: GMC #7654321 · MDCN #38910
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#fafbfc', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowSignModal(false)}
                style={{ background: 'none', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setNoteSigned(true);
                  setShowSignModal(false);
                }}
                style={{
                  background: 'var(--aura-teal)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(13, 116, 111, 0.25)',
                }}
              >
                Affix Digital Signature & Seal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Emergency Red-Flag Intercept Modal ── */}
      {emergencyModal && (
        <div className="cockpit-modal-backdrop">
          <div className="cockpit-modal-card" style={{ maxWidth: '460px' }}>
            <div style={{ padding: '20px', background: '#dc2626', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Emergency Red-Flag Trigger</h3>
              </div>
              <button onClick={() => setEmergencyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px', fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
              Triggering this alert halts virtual consultation and routes immediate dispatch telemetry to local emergency responders:
              <div style={{ marginTop: '12px', padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', fontWeight: 700, color: '#991b1b' }}>
                Nigeria: 112 / LASAMBUS · United Kingdom: 999 (NHS Ambulance)
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setEmergencyModal(false)} style={{ border: '1px solid #e2e8f0', background: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                Dismiss
              </button>
              <button onClick={() => { alert('Emergency dispatch signal transmitted.'); setEmergencyModal(false); }} style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Confirm Emergency Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
