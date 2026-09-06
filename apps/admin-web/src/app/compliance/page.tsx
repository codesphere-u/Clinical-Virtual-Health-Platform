'use client';

import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  FileText,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

type ComplianceStatus = 'compliant' | 'review_required' | 'non_compliant' | 'pending';

interface ComplianceControl {
  id: string;
  framework: 'NDPA 2023' | 'UK GDPR';
  article: string;
  title: string;
  description: string;
  status: ComplianceStatus;
  lastAudit: string;
  evidence: string;
  owner: string;
}

const CONTROLS: ComplianceControl[] = [
  {
    id: 'ndpa-1', framework: 'NDPA 2023', article: 'Art. 24', title: 'Data Controller Registration',
    description: 'Registration with the Nigeria Data Protection Commission (NDPC) as a health data controller.',
    status: 'compliant', lastAudit: '2026-08-01', evidence: 'NDPC Certificate #HC-2026-04411',
    owner: 'Data Protection Officer',
  },
  {
    id: 'ndpa-2', framework: 'NDPA 2023', article: 'Art. 25', title: 'Health Data Processing Consent',
    description: 'Explicit consent obtained from all patients prior to processing special category health data.',
    status: 'compliant', lastAudit: '2026-09-01', evidence: 'Consent logs in patient registry (100% coverage)',
    owner: 'Medical Records',
  },
  {
    id: 'ndpa-3', framework: 'NDPA 2023', article: 'Art. 32', title: 'Data Breach Notification',
    description: 'Breach notification to NDPC within 72 hours. Documented incident response playbook active.',
    status: 'compliant', lastAudit: '2026-07-15', evidence: 'IR-2026-001 (No active breaches)',
    owner: 'CISO',
  },
  {
    id: 'ndpa-4', framework: 'NDPA 2023', article: 'Art. 19', title: 'Cross-Border Transfer Safeguards',
    description: 'Standard Contractual Clauses (SCCs) in place for all NG→UK patient data transfers.',
    status: 'review_required', lastAudit: '2026-06-10', evidence: 'SCC review pending (UK adequacy decision update)',
    owner: 'Legal Counsel',
  },
  {
    id: 'gdpr-1', framework: 'UK GDPR', article: 'Art. 6 & 9', title: 'Lawful Basis for Processing',
    description: 'Health data processed under Art. 9(2)(h) for medical treatment. Consent as secondary basis.',
    status: 'compliant', lastAudit: '2026-08-20', evidence: 'ROPA v2.3 — current with ICO guidance',
    owner: 'DPO',
  },
  {
    id: 'gdpr-2', framework: 'UK GDPR', article: 'Art. 30', title: 'Records of Processing Activities',
    description: 'Maintained ROPA covering all clinical, admin, and analytics processing operations.',
    status: 'compliant', lastAudit: '2026-09-01', evidence: 'ROPA v2.3 — signed off 2026-09-01',
    owner: 'DPO',
  },
  {
    id: 'gdpr-3', framework: 'UK GDPR', article: 'Art. 35', title: 'Data Protection Impact Assessment',
    description: 'DPIA conducted for telemedicine video processing and AI clinical scribe features.',
    status: 'compliant', lastAudit: '2026-07-28', evidence: 'DPIA-2026-001 · DPIA-2026-002',
    owner: 'Product & Security',
  },
  {
    id: 'gdpr-4', framework: 'UK GDPR', article: 'Art. 17', title: 'Right to Erasure (Patients)',
    description: 'Automated erasure pipeline with clinical hold exceptions for mandatory retention periods.',
    status: 'pending', lastAudit: '2026-05-12', evidence: 'Implementation in progress — target Q4 2026',
    owner: 'Engineering',
  },
  {
    id: 'gdpr-5', framework: 'UK GDPR', article: 'Art. 32', title: 'Security of Processing',
    description: 'AES-256 at rest, TLS 1.3 in transit, MFA enforced, SHA-256 audit sealing.',
    status: 'compliant', lastAudit: '2026-09-01', evidence: 'Pen Test Report #PT-2026-Q3 (0 critical findings)',
    owner: 'CISO',
  },
];

const STATUS_CONFIG: Record<ComplianceStatus, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  compliant: { label: 'Compliant', bg: '#dcfce7', color: '#166534', icon: <CheckCircle2 style={{ width: 11, height: 11 }} /> },
  review_required: { label: 'Review Required', bg: '#fef3c7', color: '#92400e', icon: <Clock style={{ width: 11, height: 11 }} /> },
  non_compliant: { label: 'Non-Compliant', bg: '#fee2e2', color: '#991b1b', icon: <AlertTriangle style={{ width: 11, height: 11 }} /> },
  pending: { label: 'In Progress', bg: '#dbeafe', color: '#1e40af', icon: <RefreshCw style={{ width: 11, height: 11 }} /> },
};

export default function CompliancePage() {
  const [frameworkFilter, setFrameworkFilter] = useState<'all' | 'NDPA 2023' | 'UK GDPR'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplianceStatus>('all');

  const filtered = CONTROLS.filter((c) => {
    const matchF = frameworkFilter === 'all' || c.framework === frameworkFilter;
    const matchS = statusFilter === 'all' || c.status === statusFilter;
    return matchF && matchS;
  });

  const counts = {
    compliant: CONTROLS.filter(c => c.status === 'compliant').length,
    review_required: CONTROLS.filter(c => c.status === 'review_required').length,
    non_compliant: CONTROLS.filter(c => c.status === 'non_compliant').length,
    pending: CONTROLS.filter(c => c.status === 'pending').length,
  };

  const overallScore = Math.round((counts.compliant / CONTROLS.length) * 100);

  return (
    <div className="animate-fadeIn">
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="admin-page-title">Compliance Centre</h1>
          <p className="admin-page-subtitle">NDPA 2023 (Nigeria) & UK GDPR regulatory control tracking · {CONTROLS.length} controls monitored</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            <Download style={{ width: 13, height: 13 }} /> Export Report
          </button>
        </div>
      </div>

      {/* Compliance Score Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0d746f, #0a5f5b)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
            <svg viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
              <circle
                cx="36" cy="36" r="30" fill="none" stroke="white" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - overallScore / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'white' }}>{overallScore}%</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Overall Compliance Score</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{counts.compliant}/{CONTROLS.length} controls fully compliant</p>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Compliant', value: counts.compliant, color: '#86efac' },
            { label: 'Review Req.', value: counts.review_required, color: '#fcd34d' },
            { label: 'In Progress', value: counts.pending, color: '#93c5fd' },
            { label: 'Non-Compliant', value: counts.non_compliant, color: '#fca5a5' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color }}>{value}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
          {(['all', 'NDPA 2023', 'UK GDPR'] as const).map((tab) => (
            <button key={tab} className={`admin-nav-tab ${frameworkFilter === tab ? 'active' : ''}`} onClick={() => setFrameworkFilter(tab)}>
              {tab === 'all' ? 'All Frameworks' : tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
          {(['all', 'compliant', 'review_required', 'pending', 'non_compliant'] as const).map((tab) => (
            <button key={tab} className={`admin-nav-tab ${statusFilter === tab ? 'active' : ''}`} onClick={() => setStatusFilter(tab)}>
              {tab === 'all' ? 'All' : STATUS_CONFIG[tab as ComplianceStatus]?.label ?? tab}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((control) => {
          const { label, bg, color, icon } = STATUS_CONFIG[control.status];
          return (
            <div key={control.id} className="admin-section-card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                {/* Framework Badge */}
                <div style={{ flexShrink: 0 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}
                    className={control.framework === 'NDPA 2023' ? 'admin-jurisdiction-badge ng' : 'admin-jurisdiction-badge uk'}>
                    <Globe style={{ width: 9, height: 9 }} />
                    {control.framework}
                  </span>
                  <p style={{ margin: '4px 0 0', fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: '#64748b' }}>{control.article}</p>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{control.title}</p>
                  <p style={{ margin: '0 0 8px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{control.description}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>Evidence</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#0f172a' }}>{control.evidence}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>Owner</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#0f172a' }}>{control.owner}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>Last Audit</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#0f172a' }}>{control.lastAudit}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className="badge" style={{ background: bg, color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {icon} {label}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                      <FileText style={{ width: 11, height: 11 }} /> Evidence
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                      <ExternalLink style={{ width: 11, height: 11 }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning bar for review required */}
              {control.status === 'review_required' && (
                <div style={{ padding: '10px 20px', background: '#fef3c7', borderTop: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle style={{ width: 13, height: 13, color: '#92400e', flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 12, color: '#92400e' }}>
                    Action required: This control needs review before your next compliance reporting cycle.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
