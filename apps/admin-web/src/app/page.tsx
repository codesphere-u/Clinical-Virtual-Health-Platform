'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Activity,
  Clock,
  Video,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Globe,
  Hash,
  RefreshCw,
} from 'lucide-react';

/* ── Mock Live Queue ─────────────────────────────────── */
interface QueueEntry {
  id: string;
  patient: string;
  clinician: string;
  specialty: string;
  duration: number;
  jurisdiction: 'UK' | 'NG';
  status: 'live' | 'waiting' | 'completed';
}

const LIVE_QUEUE: QueueEntry[] = [
  { id: 'q1', patient: 'Sarah O.', clinician: 'Dr. Clarke', specialty: 'Gastroenterology', duration: 14, jurisdiction: 'UK', status: 'live' },
  { id: 'q2', patient: 'Emeka A.', clinician: 'Dr. Lawal', specialty: 'Cardiology', duration: 8, jurisdiction: 'NG', status: 'live' },
  { id: 'q3', patient: 'Priya M.', clinician: 'Dr. Adeyemi', specialty: 'General Practice', duration: 3, jurisdiction: 'UK', status: 'waiting' },
  { id: 'q4', patient: 'James T.', clinician: 'Dr. Nwosu', specialty: 'Psychiatry', duration: 0, jurisdiction: 'NG', status: 'waiting' },
];

/* ── Recent Verifications ────────────────────────────── */
interface VerificationItem {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  body: string;
  time: string;
  status: 'pending_review' | 'verified' | 'rejected';
  jurisdiction: 'UK' | 'NG';
}

const RECENT_VERIFICATIONS: VerificationItem[] = [
  { id: 'v1', name: 'Dr. Edward Clarke', initials: 'EC', specialty: 'Gastroenterology', body: 'GMC', time: '08:30', status: 'pending_review', jurisdiction: 'UK' },
  { id: 'v2', name: 'Dr. Amina Lawal', initials: 'AL', specialty: 'OB/GYN', body: 'MDCN', time: '09:15', status: 'pending_review', jurisdiction: 'NG' },
  { id: 'v3', name: 'Dr. Elizabeth Adeyemi', initials: 'EA', specialty: 'Cardiology', body: 'GMC/MDCN', time: 'Yesterday', status: 'verified', jurisdiction: 'UK' },
  { id: 'v4', name: 'Dr. James Okonkwo', initials: 'JO', specialty: 'Neurology', body: 'MDCN', time: 'Yesterday', status: 'verified', jurisdiction: 'NG' },
];

/* ── KPI Data ────────────────────────────────────────── */
const KPIS = [
  {
    label: 'Active Consultations',
    value: '14',
    sub: '↑ 3 from 1h ago',
    icon: Video,
    color: '#0d746f',
    trend: 'up',
  },
  {
    label: 'Clinicians Online',
    value: '9',
    sub: '4 UK · 5 NG',
    icon: UserCheck,
    color: '#0ea5e9',
    trend: 'neutral',
  },
  {
    label: 'Pending Verifications',
    value: '3',
    sub: 'Require review today',
    icon: ShieldCheck,
    color: '#f59e0b',
    trend: 'alert',
  },
  {
    label: 'Platform Uptime',
    value: '99.4%',
    sub: 'Last 30 days',
    icon: Activity,
    color: '#10b981',
    trend: 'up',
  },
  {
    label: 'Total Patients',
    value: '2,841',
    sub: '↑ 47 this week',
    icon: Users,
    color: '#8b5cf6',
    trend: 'up',
  },
  {
    label: 'Cross-Border Sessions',
    value: '31',
    sub: 'Today (NG ↔ UK)',
    icon: Globe,
    color: '#f43f5e',
    trend: 'up',
  },
];

/* ── Audit Highlights ────────────────────────────────── */
const AUDIT_HIGHLIGHTS = [
  { time: '2 min ago', action: 'VIDEO_TOKEN_ISSUED', actor: 'dr.clarke@docaas.health', hash: '8f3b…19a2', ok: true },
  { time: '6 min ago', action: 'CREDENTIAL_VERIFIED', actor: 'admin@docaas.health', hash: 'a1c9…44f1', ok: true },
  { time: '14 min ago', action: 'PRESCRIPTION_BLOCKED', actor: 'System · Allergy Engine', hash: 'f2e8…00b3', ok: false },
  { time: '22 min ago', action: 'PATIENT_RECORD_ACCESSED', actor: 'dr.lawal@docaas.health', hash: 'c7d0…a9e2', ok: true },
];

export default function AdminDashboard() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const statusBadge = (s: VerificationItem['status']) => {
    if (s === 'verified') return <span className="badge badge-verified"><CheckCircle2 style={{ width: 10, height: 10 }} /> Verified</span>;
    if (s === 'rejected') return <span className="badge badge-rejected"><XCircle style={{ width: 10, height: 10 }} /> Rejected</span>;
    return <span className="badge badge-pending"><Clock style={{ width: 10, height: 10 }} /> Pending</span>;
  };

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="admin-page-title">Command Centre</h1>
          <p className="admin-page-subtitle">Real-time operational overview — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
          onClick={() => setTick(t => t + 1)}
        >
          <RefreshCw style={{ width: 13, height: 13 }} />
          Refresh
        </button>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="admin-kpi-card" style={{ ['--kpi-color' as string]: kpi.color }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${kpi.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 18, height: 18, color: kpi.color }} />
                </div>
                {kpi.trend === 'up' && <TrendingUp style={{ width: 14, height: 14, color: '#10b981' }} />}
                {kpi.trend === 'alert' && <AlertTriangle style={{ width: 14, height: 14, color: '#f59e0b' }} />}
              </div>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 2px' }}>{kpi.value}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{kpi.label}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Live Queue + Verifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Live Consultation Queue */}
        <div className="admin-section-card">
          <div className="admin-section-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="radio-ping" />
              <p className="admin-section-card-title">Live Consultation Queue</p>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{LIVE_QUEUE.filter(q => q.status === 'live').length} active</span>
          </div>
          <div>
            {LIVE_QUEUE.map((entry) => (
              <div
                key={entry.id}
                className="admin-table-row"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.status === 'live' ? '#10b981' : '#94a3b8', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: '#0f172a' }}>{entry.patient} → {entry.clinician}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>{entry.specialty}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className={`admin-jurisdiction-badge ${entry.jurisdiction.toLowerCase()}`}>{entry.jurisdiction}</span>
                  {entry.status === 'live' && (
                    <p style={{ fontSize: 10, color: '#10b981', margin: '3px 0 0', fontFamily: 'monospace' }}>{entry.duration}m elapsed</p>
                  )}
                  {entry.status === 'waiting' && (
                    <p style={{ fontSize: 10, color: '#f59e0b', margin: '3px 0 0' }}>Waiting</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="admin-section-card">
          <div className="admin-section-card-header">
            <p className="admin-section-card-title">Clinician Verifications</p>
            <a href="/clinicians" style={{ fontSize: 11, color: '#0d746f', textDecoration: 'none', fontWeight: 600 }}>View all →</a>
          </div>
          <div>
            {RECENT_VERIFICATIONS.map((v) => (
              <div
                key={v.id}
                className="admin-table-row"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}
              >
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#475569', flexShrink: 0 }}>
                  {v.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>{v.specialty} · {v.body}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {statusBadge(v.status)}
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: '3px 0 0' }}>{v.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Highlights */}
      <div className="admin-section-card">
        <div className="admin-section-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Hash style={{ width: 14, height: 14, color: '#64748b' }} />
            <p className="admin-section-card-title">Recent Audit Events</p>
          </div>
          <a href="/audit" style={{ fontSize: 11, color: '#0d746f', textDecoration: 'none', fontWeight: 600 }}>Full audit vault →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Time</th>
                <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Action</th>
                <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actor</th>
                <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hash</th>
                <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_HIGHLIGHTS.map((e, i) => (
                <tr key={i} className="admin-table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 20px', color: '#94a3b8', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 11 }}>{e.time}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{e.action}</span>
                  </td>
                  <td style={{ padding: '12px 20px', color: '#64748b', fontSize: 11, fontFamily: 'monospace' }}>{e.actor}</td>
                  <td style={{ padding: '12px 20px', fontFamily: 'monospace', fontSize: 11, color: '#64748b' }}>{e.hash}</td>
                  <td style={{ padding: '12px 20px' }}>
                    {e.ok
                      ? <span className="badge badge-verified"><CheckCircle2 style={{ width: 10, height: 10 }} /> Valid</span>
                      : <span className="badge badge-pending"><AlertTriangle style={{ width: 10, height: 10 }} /> Flagged</span>
                    }
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
