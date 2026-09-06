'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Globe,
  ShieldCheck,
  CheckCircle2,
  Download,
  RefreshCw,
  UserCheck,
  Activity,
  Stethoscope,
  Pill,
} from 'lucide-react';

// ── Mock data ───────────────────────────────────────────────
const CONSULTATION_TRENDS = [
  { month: 'Apr', consultations: 520 },
  { month: 'May', consultations: 610 },
  { month: 'Jun', consultations: 680 },
  { month: 'Jul', consultations: 740 },
  { month: 'Aug', consultations: 790 },
  { month: 'Sep', consultations: 847 },
];

const SPECIALTY_DISTRIBUTION = [
  { name: 'General Practice', count: 435, color: '#0d746f' },
  { name: 'Cardiology', count: 172, color: '#0ea5e9' },
  { name: 'Pediatrics', count: 145, color: '#8b5cf6' },
  { name: 'Psychiatry', count: 95, color: '#f59e0b' },
];

const PRESCRIPTION_DATA = [
  { name: 'Dispensed & Verified', value: 780, color: '#10b981' },
  { name: 'Pending Fulfillment', value: 92, color: '#38bdf8' },
  { name: 'Allergy Blocked', value: 18, color: '#f43f5e' },
  { name: 'Interactions Blocked', value: 7, color: '#f59e0b' },
];

const KPI_CARDS = [
  { label: 'Total Consultations (Sep)', value: '847', delta: '+7.2%', icon: Stethoscope, color: '#0d746f' },
  { label: 'Active Clinicians', value: '9', delta: '+1 today', icon: UserCheck, color: '#0ea5e9' },
  { label: 'Prescriptions Issued', value: '897', delta: '97.8% safe', icon: Pill, color: '#8b5cf6' },
  { label: 'Cross-Border Sessions', value: '31', delta: '↑ vs 18 last month', icon: Globe, color: '#f59e0b' },
  { label: 'Audit Chain Integrity', value: '100%', delta: 'No tampering detected', icon: ShieldCheck, color: '#10b981' },
  { label: 'Platform Uptime', value: '99.4%', delta: 'Last 30 days', icon: Activity, color: '#f43f5e' },
];

export default function OverviewPage() {
  return (
    <div className="page-content">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Platform Overview</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>Aggregate KPIs · September 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline"><RefreshCw style={{ width: 13, height: 13 }} /> Refresh</button>
          <button className="btn-outline"><Download style={{ width: 13, height: 13 }} /> Export PDF</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="kpi-card" style={{ ['--kpi-accent' as string]: kpi.color }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="kpi-icon-wrap" style={{ background: `${kpi.color}18` }}>
                  <Icon style={{ width: 16, height: 16, color: kpi.color }} />
                </div>
              </div>
              <p className="kpi-value">{kpi.value}</p>
              <p className="kpi-label">{kpi.label}</p>
              <p className="kpi-delta">{kpi.delta}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row" style={{ marginBottom: 16 }}>
        {/* Consultation Trend */}
        <div className="chart-card" style={{ flex: 2 }}>
          <div className="chart-card-header">
            <p className="chart-card-title">Monthly Consultation Volume</p>
            <span className="chart-badge">6-month trend</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CONSULTATION_TRENDS} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d746f" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d746f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="consultations" stroke="#0d746f" strokeWidth={2.5} fill="url(#tealGrad)" dot={{ fill: '#0d746f', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Specialty Distribution */}
        <div className="chart-card">
          <div className="chart-card-header">
            <p className="chart-card-title">Specialty Distribution</p>
            <span className="chart-badge">Sep 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={SPECIALTY_DISTRIBUTION} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={64} innerRadius={36}>
                {SPECIALTY_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {SPECIALTY_DISTRIBUTION.map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ color: '#64748b', flex: 1 }}>{s.name}</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        {/* Prescription Safety */}
        <div className="chart-card">
          <div className="chart-card-header">
            <p className="chart-card-title">Prescription Safety</p>
            <span className="chart-badge">Sep 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PRESCRIPTION_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={64} innerRadius={36}>
                {PRESCRIPTION_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {PRESCRIPTION_DATA.map((p) => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ color: '#64748b', flex: 1 }}>{p.name}</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Summary */}
        <div className="chart-card" style={{ flex: 2 }}>
          <div className="chart-card-header">
            <p className="chart-card-title">Audit & Compliance Summary</p>
            <span className="chart-badge" style={{ background: '#dcfce7', color: '#166534' }}>
              <CheckCircle2 style={{ width: 10, height: 10 }} /> All Clear
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            {[
              { label: 'Audit Events (Sep)', value: '1,084', color: '#0d746f' },
              { label: 'Chain Integrity', value: '100%', color: '#10b981' },
              { label: 'NDPA Compliance Score', value: '88%', color: '#0ea5e9' },
              { label: 'UK GDPR Score', value: '97%', color: '#8b5cf6' },
              { label: 'Active Consent Records', value: '2,790', color: '#f59e0b' },
              { label: 'Cross-Border SCCs', value: 'Active', color: '#f43f5e' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94a3b8' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
