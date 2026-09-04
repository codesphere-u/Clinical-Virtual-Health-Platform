'use client';

import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  type ReportKey,
} from '../components/Sidebar';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Globe,
  ShieldCheck,
  AlertTriangle,
  Download,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Lock,
  UserCheck,
} from 'lucide-react';

// ==========================================
// MOCK DATASETS
// ==========================================

const CONSULTATION_TRENDS = [
  { month: 'Apr', consultations: 520, generalPractice: 280, cardiology: 90, pediatrics: 85, psychiatry: 65 },
  { month: 'May', consultations: 610, generalPractice: 320, cardiology: 110, pediatrics: 105, psychiatry: 75 },
  { month: 'Jun', consultations: 680, generalPractice: 350, cardiology: 130, pediatrics: 120, psychiatry: 80 },
  { month: 'Jul', consultations: 740, generalPractice: 390, cardiology: 140, pediatrics: 130, psychiatry: 80 },
  { month: 'Aug', consultations: 790, generalPractice: 410, cardiology: 155, pediatrics: 135, psychiatry: 90 },
  { month: 'Sep', consultations: 847, generalPractice: 435, cardiology: 172, pediatrics: 145, psychiatry: 95 },
];

const SPECIALTY_DISTRIBUTION = [
  { name: 'General Practice', count: 435, share: '51.4%', color: '#0d746f' },
  { name: 'Cardiology', count: 172, share: '20.3%', color: '#0ea5e9' },
  { name: 'Pediatrics', count: 145, share: '17.1%', color: '#8b5cf6' },
  { name: 'Psychiatry', count: 95, share: '11.2%', color: '#f59e0b' },
];

const PRESCRIPTION_DISPENSE_DATA = [
  { name: 'Dispensed & Verified', value: 780, color: '#10b981' },
  { name: 'Pending Fulfillment', value: 92, color: '#38bdf8' },
  { name: 'Allergy Blocked', value: 18, color: '#f43f5e' },
  { name: 'Interactions Blocked', value: 7, color: '#f59e0b' },
];

const CROSS_BORDER_FLOW = [
  { month: 'May', nigeriaToUK: 12, ukToNigeria: 8 },
  { month: 'Jun', nigeriaToUK: 15, ukToNigeria: 11 },
  { month: 'Jul', nigeriaToUK: 19, ukToNigeria: 14 },
  { month: 'Aug', nigeriaToUK: 23, ukToNigeria: 18 },
  { month: 'Sep', nigeriaToUK: 31, ukToNigeria: 22 },
];

const RECENT_AUDIT_LOGS = [
  {
    id: 'aud_984102',
    action: 'VIDEO_TOKEN_ISSUED',
    actor: 'dr.adeyemi@aura.health',
    role: 'CLINICIAN',
    target: 'apt_c8919b4e',
    jurisdiction: 'NG (Lagos)',
    hash: '8f3b...19a2',
    timestamp: '2 mins ago',
    verified: true,
  },
  {
    id: 'aud_984101',
    action: 'PRESCRIPTION_ALLERGY_BLOCKED',
    actor: 'system.safety_engine',
    role: 'SYSTEM',
    target: 'rx_82a17f30',
    jurisdiction: 'GB (London)',
    hash: '4d1e...90ef',
    timestamp: '11 mins ago',
    verified: true,
  },
  {
    id: 'aud_984100',
    action: 'CROSS_BORDER_EHR_EXPORT',
    actor: 'dr.smith@aura.health',
    role: 'CLINICIAN',
    target: 'pat_4917b209',
    jurisdiction: 'NG ➔ GB',
    hash: '6a82...ff33',
    timestamp: '28 mins ago',
    verified: true,
  },
  {
    id: 'aud_984099',
    action: 'CONSULTATION_COMPLETED',
    actor: 'dr.okonkwo@aura.health',
    role: 'CLINICIAN',
    target: 'apt_01948ba2',
    jurisdiction: 'NG (Abuja)',
    hash: '3e7c...1012',
    timestamp: '42 mins ago',
    verified: true,
  },
  {
    id: 'aud_984098',
    action: 'PATIENT_CONSENT_RECORDED',
    actor: 'pat_83017244',
    role: 'PATIENT',
    target: 'cst_90184b91',
    jurisdiction: 'GB (Manchester)',
    hash: '9a4f...331b',
    timestamp: '1 hour ago',
    verified: true,
  },
];

export default function AnalyticsDashboardPage() {
  const [activeReport, setActiveReport] = useState<ReportKey>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [mounted, setMounted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCount, setVerifiedCount] = useState(1429);
  const [verifyComplete, setVerifyComplete] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerVerification = () => {
    setIsVerifying(true);
    setVerifyComplete(false);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyComplete(true);
      setVerifiedCount(1430);
    }, 1200);
  };

  const handleExportCsv = (filename: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,Timestamp,Action,Actor,Target,Jurisdiction,SHA256_Hash\n' +
      RECENT_AUDIT_LOGS.map(
        (l) => `${l.timestamp},${l.action},${l.actor},${l.target},${l.jurisdiction},${l.hash}`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-shell">
      {/* Sidebar navigation */}
      <Sidebar activeReport={activeReport} onNavigate={setActiveReport} />

      {/* Main workspace */}
      <main className="main-content" role="main">
        {/* Header bar */}
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                {activeReport === 'overview' && 'Executive Clinical Intelligence'}
                {activeReport === 'consultations' && 'Consultation Volumes & Telemetry'}
                {activeReport === 'prescriptions' && 'Prescription Safety & Formulary Intelligence'}
                {activeReport === 'cross-border' && 'Cross-Border Governance (NDPA & UK GDPR)'}
                {activeReport === 'audit' && 'Cryptographic Audit Vault Verification'}
              </h1>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                Live production telemetry across Nigeria & United Kingdom zones
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Compliance badges */}
            <div className="compliance-badge compliance-ng" title="Nigeria Data Protection Act 2023 Compliant">
              <span className="pulse-dot" style={{ background: '#10b981' }} />
              <span>NDPA 2023</span>
            </div>
            <div className="compliance-badge compliance-gb" title="UK General Data Protection Regulation Compliant">
              <span className="pulse-dot" style={{ background: '#0ea5e9' }} />
              <span>UK GDPR</span>
            </div>

            {/* Date range switcher */}
            <div
              style={{
                display: 'flex',
                background: '#f1f5f9',
                padding: 3,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
            >
              {(['7d', '30d', '90d', '1y'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 6,
                    border: 'none',
                    background: dateRange === r ? '#ffffff' : 'transparent',
                    color: dateRange === r ? '#0f172a' : '#64748b',
                    boxShadow: dateRange === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Export CSV action */}
            <button
              onClick={() => handleExportCsv(`aura_${activeReport}_telemetry`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: 12,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <Download style={{ width: 13, height: 13 }} />
              Export CSV
            </button>
          </div>
        </header>

        {/* Scrollable Report Body */}
        <div className="page-body">
          {/* ========================================================= */}
          {/* REPORT 1: OVERVIEW DASHBOARD */}
          {/* ========================================================= */}
          {activeReport === 'overview' && (
            <>
              {/* 6 Key Performance Indicators */}
              <section className="kpi-grid" aria-label="Key Performance Indicators">
                <div className="kpi-card" style={{ '--accent-color': '#0d746f' } as React.CSSProperties}>
                  <div className="kpi-label">Consultations MTD</div>
                  <div className="kpi-value">847</div>
                  <div className="kpi-sub">
                    <span className="kpi-trend-up">▲ 12.4%</span> vs previous period
                  </div>
                </div>

                <div className="kpi-card" style={{ '--accent-color': '#0ea5e9' } as React.CSSProperties}>
                  <div className="kpi-label">Active Clinicians</div>
                  <div className="kpi-value">24</div>
                  <div className="kpi-sub">
                    <UserCheck style={{ width: 12, height: 12, color: '#0ea5e9' }} /> 6 clinical specialties
                  </div>
                </div>

                <div className="kpi-card" style={{ '--accent-color': '#10b981' } as React.CSSProperties}>
                  <div className="kpi-label">Avg Consultation Wait</div>
                  <div className="kpi-value">3.8m</div>
                  <div className="kpi-sub">
                    <span className="kpi-trend-up">▼ 0.6m</span> queue efficiency
                  </div>
                </div>

                <div className="kpi-card" style={{ '--accent-color': '#f43f5e' } as React.CSSProperties}>
                  <div className="kpi-label">Rx Safety Protection</div>
                  <div className="kpi-value">98.2%</div>
                  <div className="kpi-sub">
                    <AlertTriangle style={{ width: 12, height: 12, color: '#f43f5e' }} /> 18 allergy blocks intercepted
                  </div>
                </div>

                <div className="kpi-card" style={{ '--accent-color': '#8b5cf6' } as React.CSSProperties}>
                  <div className="kpi-label">Cross-Border Transfers</div>
                  <div className="kpi-value">31</div>
                  <div className="kpi-sub">
                    <Globe style={{ width: 12, height: 12, color: '#8b5cf6' }} /> NG ⇄ GB legal adequacy
                  </div>
                </div>

                <div className="kpi-card" style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}>
                  <div className="kpi-label">Audit Chain Integrity</div>
                  <div className="kpi-value">100%</div>
                  <div className="kpi-sub">
                    <ShieldCheck style={{ width: 12, height: 12, color: '#10b981' }} /> {verifiedCount} blocks intact
                  </div>
                </div>
              </section>

              {/* 2-Column Visual Charts */}
              <div className="grid-2">
                {/* Consultation Volume Growth */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <h2 className="chart-title">Consultation Growth (Trailing 6 Months)</h2>
                      <p className="chart-sub">Platform total completed video & asynchronous consultations</p>
                    </div>
                    <span className="badge badge-healthy">+62.8% Total H1/H2</span>
                  </div>
                  {mounted ? (
                    <div style={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CONSULTATION_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="consultationGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0d746f" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#0d746f" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: '#0f172a',
                              border: 'none',
                              borderRadius: 8,
                              color: '#ffffff',
                              fontSize: 12,
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="consultations"
                            stroke="#0d746f"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#consultationGrad)"
                            name="Completed Consultations"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ height: 260, background: '#f8fafc', borderRadius: 8 }} />
                  )}
                </div>

                {/* Specialty Distribution */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <h2 className="chart-title">Volume by Clinical Specialty</h2>
                      <p className="chart-sub">Clinical resource distribution across virtual consultation pods</p>
                    </div>
                    <span className="badge badge-info">6 Registered Pods</span>
                  </div>
                  {mounted ? (
                    <div style={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={SPECIALTY_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: '#0f172a',
                              border: 'none',
                              borderRadius: 8,
                              color: '#ffffff',
                              fontSize: 12,
                            }}
                          />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {SPECIALTY_DISTRIBUTION.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ height: 260, background: '#f8fafc', borderRadius: 8 }} />
                  )}
                </div>
              </div>

              {/* Real-Time Immutable Audit Stream */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Recent Clinical Audit Events (SHA-256 Ledger)</h2>
                    <p className="chart-sub">Real-time cryptographically linked trail of sensitive operations</p>
                  </div>
                  <button
                    onClick={() => setActiveReport('audit')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0d746f',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    View Complete Vault <ExternalLink style={{ width: 12, height: 12 }} />
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Event ID</th>
                        <th>Action</th>
                        <th>Actor</th>
                        <th>Role</th>
                        <th>Jurisdiction</th>
                        <th>Target ID</th>
                        <th>Cryptographic Proof</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_AUDIT_LOGS.map((log) => (
                        <tr key={log.id}>
                          <td className="mono">{log.id}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{log.action}</span>
                          </td>
                          <td style={{ color: '#475569' }}>{log.actor}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background:
                                  log.role === 'CLINICIAN'
                                    ? '#e0f2f1'
                                    : log.role === 'SYSTEM'
                                    ? '#fee2e2'
                                    : '#f1f5f9',
                                color:
                                  log.role === 'CLINICIAN'
                                    ? '#0d746f'
                                    : log.role === 'SYSTEM'
                                    ? '#991b1b'
                                    : '#475569',
                              }}
                            >
                              {log.role}
                            </span>
                          </td>
                          <td>{log.jurisdiction}</td>
                          <td className="mono">{log.target}</td>
                          <td className="mono" style={{ color: '#64748b' }}>
                            {log.hash}
                          </td>
                          <td>
                            <span className="badge badge-verified">
                              <CheckCircle2 style={{ width: 10, height: 10 }} /> Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* REPORT 2: CONSULTATION VOLUMES */}
          {/* ========================================================= */}
          {activeReport === 'consultations' && (
            <>
              <div className="grid-3">
                <div className="kpi-card" style={{ '--accent-color': '#0d746f' } as React.CSSProperties}>
                  <div className="kpi-label">General Practice Sessions</div>
                  <div className="kpi-value">435</div>
                  <div className="kpi-sub">Avg duration: 16.4 mins</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#0ea5e9' } as React.CSSProperties}>
                  <div className="kpi-label">Specialist Consultations</div>
                  <div className="kpi-value">412</div>
                  <div className="kpi-sub">Cardiology, Pediatrics, Psych</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#10b981' } as React.CSSProperties}>
                  <div className="kpi-label">Video Call Quality (LiveKit)</div>
                  <div className="kpi-value">99.9%</div>
                  <div className="kpi-sub">Packet loss &lt; 0.2%, adaptive bitrate</div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Specialty Trend Breakdown Over Time</h2>
                    <p className="chart-sub">Monthly case volume progression across medical departments</p>
                  </div>
                </div>
                {mounted ? (
                  <div style={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CONSULTATION_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: '#0f172a',
                            border: 'none',
                            borderRadius: 8,
                            color: '#ffffff',
                            fontSize: 12,
                          }}
                        />
                        <Legend />
                        <Bar dataKey="generalPractice" name="General Practice" fill="#0d746f" stackId="a" />
                        <Bar dataKey="cardiology" name="Cardiology" fill="#0ea5e9" stackId="a" />
                        <Bar dataKey="pediatrics" name="Pediatrics" fill="#8b5cf6" stackId="a" />
                        <Bar dataKey="psychiatry" name="Psychiatry" fill="#f59e0b" stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ height: 320, background: '#f8fafc', borderRadius: 8 }} />
                )}
              </div>

              {/* Clinician Performance Table */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Clinician Virtual Pod Performance</h2>
                    <p className="chart-sub">Active medical officers and virtual attendance statistics</p>
                  </div>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Clinician Name</th>
                      <th>Primary Specialty</th>
                      <th>License Jurisdiction</th>
                      <th>Consultations MTD</th>
                      <th>Avg Patient Wait</th>
                      <th>Patient Rating</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 700 }}>Dr. Adebayo Adeyemi</td>
                      <td>General Practice / Internal Med</td>
                      <td>MDCN (Nigeria) & GMC (UK)</td>
                      <td className="mono">142</td>
                      <td>2.4 min</td>
                      <td>⭐ 4.92</td>
                      <td>
                        <span className="badge badge-healthy">Active Now</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700 }}>Dr. Fiona Gallagher</td>
                      <td>Cardiology</td>
                      <td>GMC (UK)</td>
                      <td className="mono">88</td>
                      <td>4.1 min</td>
                      <td>⭐ 4.88</td>
                      <td>
                        <span className="badge badge-healthy">Active Now</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700 }}>Dr. Chinedu Okonkwo</td>
                      <td>Pediatrics</td>
                      <td>MDCN (Nigeria)</td>
                      <td className="mono">114</td>
                      <td>3.2 min</td>
                      <td>⭐ 4.95</td>
                      <td>
                        <span className="badge badge-info">Consulting</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700 }}>Dr. Sarah Jenkins</td>
                      <td>Psychiatry</td>
                      <td>GMC (UK)</td>
                      <td className="mono">62</td>
                      <td>5.0 min</td>
                      <td>⭐ 4.90</td>
                      <td>
                        <span className="badge badge-warning">On Break</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* REPORT 3: PRESCRIPTION SAFETY */}
          {/* ========================================================= */}
          {activeReport === 'prescriptions' && (
            <>
              <div className="grid-3">
                <div className="kpi-card" style={{ '--accent-color': '#10b981' } as React.CSSProperties}>
                  <div className="kpi-label">Formulary Adherence</div>
                  <div className="kpi-value">99.1%</div>
                  <div className="kpi-sub">872 of 880 prescriptions in formulary</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#f43f5e' } as React.CSSProperties}>
                  <div className="kpi-label">Allergy Interceptions</div>
                  <div className="kpi-value">18</div>
                  <div className="kpi-sub">100% prevented before dispatch</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}>
                  <div className="kpi-label">Drug Interaction Warnings</div>
                  <div className="kpi-value">7</div>
                  <div className="kpi-sub">Contraindications flagged to doctor</div>
                </div>
              </div>

              <div className="grid-2">
                {/* Dispensing Distribution Donut */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <h2 className="chart-title">Prescription Status Breakdown</h2>
                      <p className="chart-sub">Fulfillment pipeline and safety gate intercept rates</p>
                    </div>
                  </div>
                  {mounted ? (
                    <div style={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={PRESCRIPTION_DISPENSE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={95}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {PRESCRIPTION_DISPENSE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: '#0f172a',
                              border: 'none',
                              borderRadius: 8,
                              color: '#ffffff',
                              fontSize: 12,
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ height: 260, background: '#f8fafc', borderRadius: 8 }} />
                  )}
                </div>

                {/* Safety Interception Protocol */}
                <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="chart-header">
                      <div>
                        <h2 className="chart-title">Clinical Decision Support Protocols</h2>
                        <p className="chart-sub">Real-time safety checks executed per prescription</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CheckCircle2 style={{ width: 16, height: 16, color: '#16a34a' }} />
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#166534' }}>Allergy Cross-Matching</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#15803d', marginTop: 4 }}>
                          Compares prescribed ATC molecule classes against verified patient medical profile and allergen antibodies.
                        </p>
                      </div>

                      <div style={{ padding: 12, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CheckCircle2 style={{ width: 16, height: 16, color: '#2563eb' }} />
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#1e40af' }}>DDI (Drug-Drug Interaction) Matrix</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#1d4ed8', marginTop: 4 }}>
                          Multi-active medication matrix evaluates concurrent hepatic/renal clearance conflicts and CYP450 inhibitors.
                        </p>
                      </div>

                      <div style={{ padding: 12, background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CheckCircle2 style={{ width: 16, height: 16, color: '#d97706' }} />
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>Cross-Border Formulary Harmonization</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#b45309', marginTop: 4 }}>
                          Maps UK BNF brand names to Nigerian NAFDAC registered equivalents with dosage reconciliation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Interception Log */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Safety Interceptions Audit Log</h2>
                    <p className="chart-sub">Recent automated prescription blocks that prevented potential adverse events</p>
                  </div>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient ID</th>
                      <th>Prescribed Drug</th>
                      <th>Interception Reason</th>
                      <th>Severity</th>
                      <th>Clinician Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Today, 14:12</td>
                      <td className="mono">pat_83017244</td>
                      <td>Amoxicillin 500mg TDS</td>
                      <td>Severe Penicillin Allergy documented in profile</td>
                      <td>
                        <span className="badge badge-critical">CRITICAL</span>
                      </td>
                      <td>Substituted with Clarithromycin 500mg</td>
                    </tr>
                    <tr>
                      <td>Today, 11:05</td>
                      <td className="mono">pat_19842091</td>
                      <td>Warfarin 5mg OD</td>
                      <td>High-risk interaction with existing Miconazole oral gel</td>
                      <td>
                        <span className="badge badge-warning">HIGH</span>
                      </td>
                      <td>Alternative antifungal prescribed</td>
                    </tr>
                    <tr>
                      <td>Yesterday</td>
                      <td className="mono">pat_4917b209</td>
                      <td>Ciprofloxacin 500mg</td>
                      <td>Contraindicated in concurrent QT prolongation medication</td>
                      <td>
                        <span className="badge badge-warning">HIGH</span>
                      </td>
                      <td>Swapped to Cefuroxime Axetil</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* REPORT 4: CROSS-BORDER COMPLIANCE */}
          {/* ========================================================= */}
          {activeReport === 'cross-border' && (
            <>
              <div className="grid-2">
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #6ee7b7',
                    borderRadius: 12,
                    padding: 20,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Globe style={{ width: 18, height: 18, color: '#059669' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#065f46' }}>Nigeria NDPA 2023 Compliance</h2>
                      <p style={{ fontSize: 11, color: '#047857' }}>Sections 41-43: Cross-Border Transfers of Personal Data</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}>
                    All patient clinical records originating in Nigeria are protected under statutory Data Protection Officer (DPO) oversight. International transfers to UK clinicians operate strictly with explicit recorded patient consent and adequacy mechanisms registered with the Nigeria Data Protection Commission (NDPC).
                  </p>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <span className="badge badge-healthy">NDPC Registered</span>
                    <span className="badge badge-healthy">DPO Certified</span>
                    <span className="badge badge-healthy">AES-256 At Rest</span>
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #93c5fd',
                    borderRadius: 12,
                    padding: 20,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lock style={{ width: 18, height: 18, color: '#2563eb' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1e40af' }}>United Kingdom GDPR & DPA 2018</h2>
                      <p style={{ fontSize: 11, color: '#1d4ed8' }}>Chapter V: Transfers of personal data to third countries</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}>
                    UK clinicians treating Nigerian residents abide by GMC telehealth guidelines and International Data Transfer Agreements (IDTA). Full right-to-erasure and data portability controls are mirrored across the cross-border audit vault.
                  </p>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <span className="badge badge-info">ICO Registered</span>
                    <span className="badge badge-info">GMC Compliant</span>
                    <span className="badge badge-info">IDTA Active</span>
                  </div>
                </div>
              </div>

              {/* Data Flow Volume */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Jurisdictional Transfer Flow (Monthly Trend)</h2>
                    <p className="chart-sub">Authenticated medical transfers between Lagos (NG) and London (GB) nodes</p>
                  </div>
                </div>
                {mounted ? (
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CROSS_BORDER_FLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: '#0f172a',
                            border: 'none',
                            borderRadius: 8,
                            color: '#ffffff',
                            fontSize: 12,
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="nigeriaToUK"
                          name="Nigeria ➔ UK Consultations"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="ukToNigeria"
                          name="UK ➔ Nigeria Consultations"
                          stroke="#0ea5e9"
                          fill="#0ea5e9"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ height: 260, background: '#f8fafc', borderRadius: 8 }} />
                )}
              </div>

              {/* Cross-Border Transfer Ledger */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Cross-Border Data Transfer Registry</h2>
                    <p className="chart-sub">Immutable audit entries verifying lawful international health data transit</p>
                  </div>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Transfer Ref</th>
                      <th>Timestamp</th>
                      <th>Legal Basis</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Record Type</th>
                      <th>Consent Proof</th>
                      <th>Compliance Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="mono">xbt_418902</td>
                      <td>2026-09-04 22:15</td>
                      <td>Explicit Patient Consent</td>
                      <td>Lagos, NG (Central)</td>
                      <td>London, UK (South)</td>
                      <td>Live Video Consultation</td>
                      <td className="mono">cst_90184b91</td>
                      <td>
                        <span className="badge badge-healthy">VALIDATED</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="mono">xbt_418901</td>
                      <td>2026-09-04 20:30</td>
                      <td>Specialist Second Opinion</td>
                      <td>Abuja, NG</td>
                      <td>Manchester, UK</td>
                      <td>EHR Diagnostic Labs</td>
                      <td className="mono">cst_84102911</td>
                      <td>
                        <span className="badge badge-healthy">VALIDATED</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="mono">xbt_418899</td>
                      <td>2026-09-04 18:45</td>
                      <td>Cross-Border Prescription</td>
                      <td>London, UK</td>
                      <td>Lagos, NG</td>
                      <td>Formulary Fulfillment</td>
                      <td className="mono">cst_73819402</td>
                      <td>
                        <span className="badge badge-healthy">VALIDATED</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* REPORT 5: AUDIT VAULT INTEGRITY */}
          {/* ========================================================= */}
          {activeReport === 'audit' && (
            <>
              {/* Hash Chain Verification Hero */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  borderRadius: 14,
                  padding: 24,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <ShieldCheck style={{ width: 24, height: 24, color: '#10b981' }} />
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                      Cryptographic Audit Vault Integrity
                    </h2>
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 640, lineHeight: 1.5 }}>
                    Every clinical record modification, consultation start, prescription dispatch, and cross-border transfer generates a SHA-256 hash mathematically linked to its predecessor block, preventing backdated alteration.
                  </p>
                  <div style={{ display: 'flex', gap: 18, marginTop: 14, fontFamily: 'monospace', fontSize: 11 }}>
                    <div>
                      <span style={{ color: '#64748b' }}>TOTAL BLOCKS: </span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{verifiedCount}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>GENESIS HASH: </span>
                      <span style={{ color: '#94a3b8' }}>a0eebc99...39a82e</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>TAMPER ATTEMPTS: </span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>0 DETECTED</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={triggerVerification}
                    disabled={isVerifying}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: isVerifying ? '#334155' : '#0d746f',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: isVerifying ? 'wait' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(13, 116, 111, 0.3)',
                    }}
                  >
                    <RefreshCw
                      style={{
                        width: 14,
                        height: 14,
                        animation: isVerifying ? 'spin 1s linear infinite' : 'none',
                      }}
                    />
                    {isVerifying ? 'Computing Hashes...' : 'Verify Hash Chain'}
                  </button>
                  <p style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
                    {verifyComplete ? '✓ Full chain mathematically verified' : 'Last verified: Just now'}
                  </p>
                </div>
              </div>

              {/* Immutable Ledger Table */}
              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Tamper-Evident SHA-256 Audit Trail</h2>
                    <p className="chart-sub">Sequential cryptographic proof entries stored in append-only schema</p>
                  </div>
                  <span className="badge badge-verified">
                    <CheckCircle2 style={{ width: 12, height: 12 }} /> All Hashes Verified
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Block ID</th>
                        <th>Timestamp (UTC)</th>
                        <th>Action</th>
                        <th>Actor</th>
                        <th>Target ID</th>
                        <th>Prev Block Hash</th>
                        <th>Current Block Hash (SHA-256)</th>
                        <th>Integrity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_AUDIT_LOGS.map((log, idx) => (
                        <tr key={log.id}>
                          <td className="mono" style={{ fontWeight: 700 }}>
                            #{verifiedCount - idx}
                          </td>
                          <td style={{ fontSize: 11 }}>{log.timestamp}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{log.action}</span>
                          </td>
                          <td style={{ color: '#475569' }}>{log.actor}</td>
                          <td className="mono">{log.target}</td>
                          <td className="mono" style={{ color: '#94a3b8' }}>
                            {idx === 0 ? '7c9e...aa10' : '8f3b...19a2'}
                          </td>
                          <td className="mono" style={{ color: '#0d746f', fontWeight: 600 }}>
                            {log.hash}
                          </td>
                          <td>
                            <span className="badge badge-verified">VALID</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
