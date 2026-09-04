'use client';

import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  AlertCircle,
  Sparkles,
  Lock,
  Keyboard,
  ShieldCheck,
  FileSignature,
  User,
} from 'lucide-react';
import { Button, Badge } from '@aura/design-system';

export default function ClinicianWorkstationPage() {
  const [activeTab, setActiveTab] = useState<'soap' | 'rx' | 'investigations'>('soap');
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [aiDraftGenerated, setAiDraftGenerated] = useState(false);
  const [rxMedication, setRxMedication] = useState('Amlodipine 10mg');
  const [rxAlert, setRxAlert] = useState<string | null>(null);
  const [noteSigned, setNoteSigned] = useState(false);

  // SOAP fields
  const [history, setHistory] = useState(
    'Patient has known stage 1 hypertension diagnosed 2 years ago. Regimen: Amlodipine 5mg once daily with moderate compliance. No chest pain, visual disturbances, or shortness of breath.'
  );
  const [assessment, setAssessment] = useState('Suboptimally Controlled Essential Hypertension (ICD-10: I10)');
  const [treatmentPlan, setTreatmentPlan] = useState(
    '1. Up-titrate Amlodipine from 5mg to 10mg once daily.\n2. Advise dietary sodium restriction (<2g/day).\n3. Keep home BP log twice daily for 14 days and follow-up virtually.'
  );

  const handleTriggerAiScribe = () => {
    setAiDraftLoading(true);
    setTimeout(() => {
      setAiDraftLoading(false);
      setAiDraftGenerated(true);
      setTreatmentPlan(
        '1. Up-titrate Amlodipine to 10mg daily in the morning.\n2. Dietary sodium reduction & lifestyle counseling.\n3. Patient to monitor home blood pressure morning and evening.\n4. Virtual review in 14 days or earlier if BP > 170/100 mmHg.'
      );
    }, 900);
  };

  const handleTestRxAllergyCheck = (medName: string) => {
    setRxMedication(medName);
    if (medName.toLowerCase().includes('amoxicillin') || medName.toLowerCase().includes('penicillin') || medName.toLowerCase().includes('augmentin')) {
      setRxAlert('CRITICAL ALLERGY BLOCK: Patient has documented life-threatening allergy to Penicillin!');
    } else {
      setRxAlert(null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-slate-100 select-none">
      {/* Top Workstation Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 px-2.5 rounded bg-[#0D746F] flex items-center justify-center font-bold text-white text-xs tracking-wider">
            AURA CLINICAL
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
            <span className="font-semibold text-sm text-slate-200">Dr. Elizabeth Adeyemi</span>
            <span className="text-xs text-slate-400">Consultant Cardiologist</span>
            <Badge variant="verified" size="sm" dot>
              GMC #7654321
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Encrypted Room: <strong>cvh-room-001</strong></span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Keyboard className="h-4 w-4" />
            <span>Shortcuts: <strong>Alt+S</strong> (Sign) • <strong>Ctrl+K</strong> (Search)</span>
          </div>
        </div>
      </header>

      {/* Main 3-Column Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Patient Snapshot & Records (Width: 320px) */}
        <aside className="w-80 bg-white text-slate-900 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#0D746F]/10 border border-[#0D746F]/20 flex items-center justify-center text-[#0D746F] font-bold text-base">
                OB
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base leading-tight">Olumide Babalola</h2>
                <p className="text-xs font-mono text-slate-500">MRN: CVH-2026-0001</p>
                <p className="text-[11px] text-slate-600 font-medium">44y (1982-04-12) • Male</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 flex-1">
            {/* Severe Allergy Warning */}
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>ALLERGIES RECORDED</span>
              </div>
              <p className="font-semibold">• Penicillin (Anaphylaxis / Life-Threatening)</p>
            </div>

            {/* Baseline Vitals Box */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Encounter Vitals
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-800">
                <div>BP: <strong className="text-rose-700">142/90 mmHg</strong></div>
                <div>Pulse: <strong>76 bpm</strong></div>
                <div>SpO2: <strong>98%</strong></div>
                <div>Temp: <strong>36.6°C</strong></div>
                <div>Blood: <strong>O+</strong></div>
                <div>Geno: <strong>AA</strong></div>
              </div>
            </div>

            {/* Past Medical History */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Chronic Conditions
              </span>
              <p className="text-slate-600">• Essential Hypertension (Dx 2024)</p>
            </div>

            {/* Active Medications */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Current Regimen
              </span>
              <p className="text-slate-600">• Amlodipine 5mg oral daily</p>
            </div>

            {/* Data Residency Attestation */}
            <div className="p-2.5 rounded bg-teal-50/50 border border-teal-100 text-[11px] text-[#0D746F] space-y-0.5">
              <div className="flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Cross-Border Direct Care</span>
              </div>
              <p className="text-slate-500">Nigeria Primary Sovereign Vault (Lagos). Transfer token: <strong>TRF-9821</strong></p>
            </div>
          </div>
        </aside>

        {/* Center Column: Telemedicine Cinema Viewport */}
        <main className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
          {/* Top Video Header */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE CONSULTATION • 14:28</span>
            </div>
            <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-emerald-400 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>E2EE • LiveKit SFU (0% loss)</span>
            </div>
          </div>

          {/* Main Video Surface */}
          <div className="flex-1 flex items-center justify-center relative p-6">
            <div className="w-full h-full max-w-4xl max-h-[580px] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center p-8 relative shadow-2xl overflow-hidden">
              <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-[#0D746F] flex items-center justify-center text-slate-400 mb-4">
                <User className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="font-bold text-lg text-white">Olumide Babalola</h3>
              <p className="text-xs text-slate-400 mt-1">Connecting from Lagos, Nigeria (1080p WebRTC)</p>

              {/* Self View Floating Thumbnail */}
              <div className="absolute bottom-5 right-5 w-44 h-32 bg-slate-800 border-2 border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dr. Elizabeth (Self)</span>
                <span className="text-[10px] text-emerald-400">London, UK</span>
              </div>
            </div>
          </div>

          {/* Bottom Call Controls */}
          <div className="h-20 bg-slate-900/90 backdrop-blur border-t border-slate-800 px-6 flex items-center justify-center gap-4 shrink-0">
            <button
              onClick={() => setMicMuted(!micMuted)}
              className={`p-3.5 rounded-full transition ${
                micMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {micMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setCameraOff(!cameraOff)}
              className={`p-3.5 rounded-full transition ${
                cameraOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>

            <button className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg active:scale-95">
              <PhoneOff className="h-4 w-4" />
              <span>Conclude Consultation</span>
            </button>
          </div>
        </main>

        {/* Right Column: Tabbed Documentation Workspace (Width: 460px) */}
        <aside className="w-[460px] bg-white text-slate-900 border-l border-slate-200 flex flex-col shrink-0">
          {/* Workspace Tabs Header */}
          <div className="h-12 border-b border-slate-200 px-4 flex items-center justify-between bg-slate-50 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('soap')}
                className={`text-xs px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === 'soap' ? 'bg-white text-[#0D746F] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SOAP Encounter
              </button>
              <button
                onClick={() => setActiveTab('rx')}
                className={`text-xs px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === 'rx' ? 'bg-white text-[#0D746F] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                E-Prescription
              </button>
              <button
                onClick={() => setActiveTab('investigations')}
                className={`text-xs px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === 'investigations' ? 'bg-white text-[#0D746F] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Orders & Labs
              </button>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={handleTriggerAiScribe}
              disabled={aiDraftLoading}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm hover:opacity-95 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{aiDraftLoading ? 'Synthesizing...' : 'AI Assist Scribe'}</span>
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {activeTab === 'soap' && (
              <div className="space-y-3.5 text-xs">
                {aiDraftGenerated && (
                  <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-[#0D746F] flex items-center justify-between">
                    <span className="font-semibold text-[11px]">
                      [AI Scribe Draft Applied - Human Approval Required]
                    </span>
                    <span className="text-[10px] text-slate-500">Gemini Clinical v2</span>
                  </div>
                )}

                {/* History & Presenting Complaint */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Presenting Complaint & History
                  </label>
                  <textarea
                    rows={3}
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D746F]"
                  />
                </div>

                {/* Assessment & Diagnosis */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Assessment & Primary Diagnosis (ICD-10)
                  </label>
                  <input
                    type="text"
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D746F]"
                  />
                </div>

                {/* Treatment Plan */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Intervention & Treatment Plan
                  </label>
                  <textarea
                    rows={4}
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D746F]"
                  />
                </div>

                {/* Safety-Netting Advice */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Safety-Netting & Red-Flag Warnings
                  </label>
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                    Advised to present to nearest emergency department (or dial 112) if experiencing sudden severe chest tightness, unilateral limb weakness, visual loss, or acute dyspnea.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'rx' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-2">New Prescription Item</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-slate-600 block mb-0.5">Select Formulary Drug:</label>
                      <select
                        value={rxMedication}
                        onChange={(e) => handleTestRxAllergyCheck(e.target.value)}
                        className="w-full p-2 rounded border border-slate-300 bg-white"
                      >
                        <option value="Amlodipine 10mg">Amlodipine 10mg (Calcium Channel Blocker)</option>
                        <option value="Lisinopril 10mg">Lisinopril 10mg (ACE Inhibitor)</option>
                        <option value="Amoxicillin 500mg">Amoxicillin 500mg (Penicillin Class - ALLERGY TEST)</option>
                        <option value="Metformin 500mg">Metformin 500mg (Biguanide)</option>
                      </select>
                    </div>

                    {rxAlert && (
                      <div className="p-2.5 rounded bg-rose-50 border border-rose-300 text-rose-800 font-bold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                        <span>{rxAlert}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-600 block mb-0.5">Dosage / Freq:</label>
                        <input type="text" defaultValue="1 tab daily" className="w-full p-1.5 rounded border border-slate-300" />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-0.5">Duration:</label>
                        <input type="text" defaultValue="30 days (Qty 30)" className="w-full p-1.5 rounded border border-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-[#0D746F] text-[11px] space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Cross-Jurisdiction Prescription Attestation</span>
                  </div>
                  <p>Authorized under GMC Good Medical Practice Standards for remote prescribing and Nigerian registered pharmacy dispensing.</p>
                </div>
              </div>
            )}

            {activeTab === 'investigations' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <span className="font-bold text-slate-800 block">Diagnostic Investigations Ordered</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                      <div>
                        <p className="font-semibold text-slate-800">Lipid Profile & Serum Creatinine</p>
                        <p className="text-[11px] text-slate-500">Ordered today • Routine priority</p>
                      </div>
                      <Badge variant="info" size="sm">Pending Lab</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action: Sign & Lock Record */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[11px] text-slate-500 font-mono">Status: {noteSigned ? 'LOCKED & SIGNED' : 'UNSAVED DRAFT'}</p>
            </div>
            <Button
              size="md"
              variant={noteSigned ? 'secondary' : 'primary'}
              disabled={noteSigned}
              onClick={() => setNoteSigned(true)}
              leftIcon={<FileSignature className="h-4 w-4" />}
            >
              {noteSigned ? 'Record Signed (SHA-256)' : 'Sign Note & E-Prescription'}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
