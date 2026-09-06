'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Globe,
  FileCheck,
  Lock,
  ArrowRightLeft,
  CheckCircle2,
  Download,
  Filter,
} from 'lucide-react';

const JURISDICTION_FLOWS = [
  { month: 'Apr', ukToNg: 142, ngToUk: 98, localNg: 420, localUk: 310 },
  { month: 'May', ukToNg: 168, ngToUk: 112, localNg: 445, localUk: 325 },
  { month: 'Jun', ukToNg: 195, ngToUk: 135, localNg: 480, localUk: 340 },
  { month: 'Jul', ukToNg: 210, ngToUk: 148, localNg: 510, localUk: 360 },
  { month: 'Aug', ukToNg: 235, ngToUk: 162, localNg: 535, localUk: 380 },
  { month: 'Sep', ukToNg: 260, ngToUk: 180, localNg: 560, localUk: 395 },
];

const TRANSFER_LOGS = [
  {
    id: 'xfer_99a8b1c',
    timestamp: '2026-09-06 04:42:18',
    type: 'Teleconsultation Stream',
    source: 'GB-LON (UK)',
    dest: 'NG-LOS (Nigeria)',
    legalBasis: 'NDPA 2023 s.41 / UK GDPR Art 49(1)(a)',
    consentStatus: 'Explicit Verified',
    encryption: 'TLS 1.3 + AES-256-GCM',
    status: 'Compliant',
  },
  {
    id: 'xfer_87c2e4d',
    timestamp: '2026-09-06 04:31:05',
    type: 'EHR Summary Replication',
    source: 'NG-ABJ (Nigeria)',
    dest: 'GB-MAN (UK)',
    legalBasis: 'Standard Contractual Clauses (SCCs)',
    consentStatus: 'Explicit Verified',
    encryption: 'TLS 1.3 + AES-256-GCM',
    status: 'Compliant',
  },
  {
    id: 'xfer_76d3f2a',
    timestamp: '2026-09-06 04:15:49',
    type: 'Radiology DICOM Transfer',
    source: 'GB-LON (UK)',
    dest: 'NG-LOS (Nigeria)',
    legalBasis: 'Clinical Emergency Derogation',
    consentStatus: 'Emergency Override Logged',
    encryption: 'TLS 1.3 + AES-256-GCM',
    status: 'Compliant',
  },
  {
    id: 'xfer_65e4a1b',
    timestamp: '2026-09-06 03:58:22',
    type: 'Electronic Prescription Sync',
    source: 'GB-BIR (UK)',
    dest: 'NG-PHC (Nigeria)',
    legalBasis: 'NDPA 2023 s.41 / Cross-Border Rx',
    consentStatus: 'Explicit Verified',
    encryption: 'TLS 1.3 + AES-256-GCM',
    status: 'Compliant',
  },
  {
    id: 'xfer_54f5b9c',
    timestamp: '2026-09-06 03:30:10',
    type: 'Lab Result Telemetry',
    source: 'NG-LOS (Nigeria)',
    dest: 'GB-LON (UK)',
    legalBasis: 'Explicit Patient Consent (Direct)',
    consentStatus: 'Explicit Verified',
    encryption: 'TLS 1.3 + AES-256-GCM',
    status: 'Compliant',
  },
];

export default function CrossBorderPage() {
  return (
    <div className="page-content animate-fadeIn">
      {/* Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Cross-Border Data Sovereignty & Telemedicine Flows
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>
            Multi-jurisdiction governance monitoring: NDPA 2023 (Nigeria) & UK GDPR / Data Protection Act 2018
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline">
            <Filter style={{ width: 13, height: 13 }} /> Filter Jurisdiction
          </button>
          <button className="btn-outline">
            <Download style={{ width: 13, height: 13 }} /> Export Compliance Dossier
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Cross-Border Transfers (30d)</span>
            <div className="kpi-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <ArrowRightLeft style={{ width: 15, height: 15 }} />
            </div>
          </div>
          <div className="kpi-card-value">1,428</div>
          <div className="kpi-delta positive">
            <CheckCircle2 style={{ width: 12, height: 12 }} />
            <span>100% compliant with NDPA & UK GDPR</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Verified Patient Consents</span>
            <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <FileCheck style={{ width: 15, height: 15 }} />
            </div>
          </div>
          <div className="kpi-card-value">99.8%</div>
          <div className="kpi-delta positive">
            <span>Cryptographically anchored in Audit Vault</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Data Localization Enforcement</span>
            <div className="kpi-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Globe style={{ width: 15, height: 15 }} />
            </div>
          </div>
          <div className="kpi-card-value">Zero Leakage</div>
          <div className="kpi-delta positive">
            <span>Primary storage strictly in local sovereign clouds</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">In-Transit Security Protocol</span>
            <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Lock style={{ width: 15, height: 15 }} />
            </div>
          </div>
          <div className="kpi-card-value">mTLS + AES-GCM</div>
          <div className="kpi-delta neutral">
            <span>Mutual certificate validation active</span>
          </div>
        </div>
      </div>

      {/* Compliance Frameworks Dual Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Nigeria Data Protection Act 2023 (NDPA)</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#dcfce7', color: '#166534', fontWeight: 700 }}>
              NDPC Compliant
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
            Section 41-43 compliance active. Health data classified as Sensitive Personal Data. Cross-border transfers bound to verified adequacy mechanisms and explicit encrypted consent tokens.
          </p>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#0f172a', fontWeight: 600 }}>
            <span>• DPO Registration: Current</span>
            <span>• DPIA Audits: Completed Q3</span>
            <span>• Breach Protocol: 72h Notice Ready</span>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>UK GDPR & Data Protection Act 2018</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#e0f2fe', color: '#075985', fontWeight: 700 }}>
              ICO Registered
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
            Article 9 Special Category Data safeguards active. International transfers under Chapter V regulated via International Data Transfer Agreements (IDTAs) & Section 49 clinical emergency derogations.
          </p>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#0f172a', fontWeight: 600 }}>
            <span>• Caldicott Principles: Enforced</span>
            <span>• NHS DSP Toolkit: Standard Met</span>
            <span>• Cyber Essentials+: Certified</span>
          </div>
        </div>
      </div>

      {/* Chart: Transfer Volume Trends */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <p className="chart-card-title">Cross-Border vs Sovereign Domestic Data Transfers</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>
              Comparison of intra-national sovereign routing versus bi-directional international clinical syncs
            </p>
          </div>
          <span className="chart-badge">Past 6 Months</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={JURISDICTION_FLOWS} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 11 }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
            <Bar dataKey="localNg" name="Domestic NG Sovereign" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="localUk" name="Domestic UK Sovereign" fill="#0284c7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ukToNg" name="Transfer UK → NG" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ngToUk" name="Transfer NG → UK" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Audit Log Table */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <p className="chart-card-title">Real-Time Sovereign Transfer Ledger</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>
              Immutable telemetry for all cross-jurisdiction clinical sessions and payload syncs
            </p>
          </div>
          <span className="chart-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
            Live Feed
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Transfer ID</th>
                <th>Timestamp (UTC)</th>
                <th>Payload Type</th>
                <th>Routing Path</th>
                <th>Legal Derogation / Basis</th>
                <th>Consent Token</th>
                <th>Encryption</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSFER_LOGS.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>{log.id}</td>
                  <td style={{ fontSize: 11, color: '#64748b' }}>{log.timestamp}</td>
                  <td style={{ fontWeight: 600, color: '#334155' }}>{log.type}</td>
                  <td>
                    <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                      {log.source} ➔ {log.dest}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: '#64748b' }}>{log.legalBasis}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#16a34a', fontWeight: 600 }}>
                      <CheckCircle2 style={{ width: 12, height: 12 }} />
                      {log.consentStatus}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569' }}>{log.encryption}</td>
                  <td>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
