'use client';

import React from 'react';
import {
  ResponsiveContainer,
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
  AlertTriangle,
  Shield,
  Download,
} from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────
const MONTHLY_PRESCRIPTIONS = [
  { month: 'Apr', issued: 720, blocked: 18, pending: 60 },
  { month: 'May', issued: 760, blocked: 21, pending: 72 },
  { month: 'Jun', issued: 810, blocked: 19, pending: 68 },
  { month: 'Jul', issued: 840, blocked: 25, pending: 75 },
  { month: 'Aug', issued: 860, blocked: 22, pending: 80 },
  { month: 'Sep', issued: 897, blocked: 25, pending: 92 },
];

const BLOCK_REASONS = [
  { name: 'Allergy Interactions', value: 18, color: '#f43f5e' },
  { name: 'Drug Interactions', value: 7, color: '#f59e0b' },
];

const RECENT_BLOCKS = [
  { rx: 'rx_28f3a91b', drug: 'Amoxicillin (Penicillin)', patient: 'pat_••••1903', reason: 'IgE-mediated penicillin allergy documented', clinician: 'Dr. Lawal', time: '09:22', severity: 'High' },
  { rx: 'rx_91b4c2d0', drug: 'Ibuprofen 400mg', patient: 'pat_••••4421', reason: 'Active GI bleed history — NSAID contraindicated', clinician: 'Dr. Clarke', time: '08:44', severity: 'High' },
  { rx: 'rx_55e6f3a1', drug: 'Metformin 1g', patient: 'pat_••••7710', reason: 'eGFR < 30 — renal contraindication', clinician: 'Dr. Adeyemi', time: 'Yesterday', severity: 'Medium' },
  { rx: 'rx_c3a8b912', drug: 'Warfarin 5mg', patient: 'pat_••••3301', reason: 'Active NSAID co-prescription — bleeding risk', clinician: 'Dr. Okonkwo', time: 'Yesterday', severity: 'High' },
];

export default function PrescriptionsPage() {
  const total = 897;
  const dispensed = 780;
  const allergyBlocked = 18;
  const interactionBlocked = 7;
  const pending = 92;
  const safeRate = ((dispensed / total) * 100).toFixed(1);

  return (
    <div className="page-content animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Prescription Safety</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>Allergy blocks, drug interactions & formulary compliance</p>
        </div>
        <button className="btn-outline"><Download style={{ width: 13, height: 13 }} /> Export Report</button>
      </div>

      {/* Safety Banner */}
      <div style={{ background: 'linear-gradient(135deg, #065f46, #047857)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shield style={{ width: 28, height: 28, color: 'white' }} />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{safeRate}% Safe Prescription Rate</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            {dispensed} prescriptions dispensed safely · {allergyBlocked + interactionBlocked} blocked by safety engine
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Dispensed', value: dispensed, color: '#86efac' },
            { label: 'Allergy Blocked', value: allergyBlocked, color: '#fca5a5' },
            { label: 'Interaction Blocked', value: interactionBlocked, color: '#fcd34d' },
            { label: 'Pending', value: pending, color: '#93c5fd' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color }}>{value}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Monthly Prescriptions */}
        <div className="chart-card" style={{ flex: 2 }}>
          <div className="chart-card-header">
            <p className="chart-card-title">Monthly Prescription Activity</p>
            <span className="chart-badge">6-month view</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_PRESCRIPTIONS} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="issued" name="Issued & Safe" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="blocked" name="Blocked" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Block Breakdown */}
        <div className="chart-card">
          <div className="chart-card-header">
            <p className="chart-card-title">Block Reason Breakdown</p>
            <span className="chart-badge">Sep 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={BLOCK_REASONS} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={64} innerRadius={36}>
                {BLOCK_REASONS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {BLOCK_REASONS.map((r) => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: `${r.color}10`, border: `1px solid ${r.color}30` }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, color: '#0f172a' }}>{r.name}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Safety Blocks */}
      <div className="chart-card">
        <div className="chart-card-header">
          <p className="chart-card-title">Recent Safety Blocks</p>
          <span className="chart-badge" style={{ background: '#fff1f2', color: '#881337' }}>
            <AlertTriangle style={{ width: 10, height: 10 }} /> {allergyBlocked + interactionBlocked} blocked this month
          </span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Drug / Prescription</th>
              <th>Patient</th>
              <th>Block Reason</th>
              <th>Clinician</th>
              <th>Severity</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_BLOCKS.map((b) => (
              <tr key={b.rx}>
                <td>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontFamily: 'monospace', fontSize: 12 }}>{b.drug}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>{b.rx}</p>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{b.patient}</td>
                <td style={{ fontSize: 12, color: '#64748b', maxWidth: 220 }}>{b.reason}</td>
                <td style={{ fontSize: 12, color: '#64748b' }}>{b.clinician}</td>
                <td>
                  <span className={`badge ${b.severity === 'High' ? 'badge-critical' : 'badge-warning'}`}>
                    {b.severity === 'High' ? <AlertTriangle style={{ width: 10, height: 10 }} /> : null} {b.severity}
                  </span>
                </td>
                <td style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{b.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
