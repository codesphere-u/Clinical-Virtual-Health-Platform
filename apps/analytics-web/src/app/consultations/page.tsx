'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Download, TrendingUp } from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────
const MONTHLY_VOLUME = [
  { month: 'Apr', consultations: 520, generalPractice: 280, cardiology: 90, pediatrics: 85, psychiatry: 65 },
  { month: 'May', consultations: 610, generalPractice: 320, cardiology: 110, pediatrics: 105, psychiatry: 75 },
  { month: 'Jun', consultations: 680, generalPractice: 350, cardiology: 130, pediatrics: 120, psychiatry: 80 },
  { month: 'Jul', consultations: 740, generalPractice: 390, cardiology: 140, pediatrics: 130, psychiatry: 80 },
  { month: 'Aug', consultations: 790, generalPractice: 410, cardiology: 155, pediatrics: 135, psychiatry: 90 },
  { month: 'Sep', consultations: 847, generalPractice: 435, cardiology: 172, pediatrics: 145, psychiatry: 95 },
];

const CLINICIAN_TABLE = [
  { name: 'Dr. Elizabeth Adeyemi', specialty: 'Cardiology', jurisdiction: 'Both', consultations: 172, avgDuration: '24 min', satisfaction: 4.9 },
  { name: 'Dr. Kavita Sharma', specialty: 'Psychiatry', jurisdiction: 'UK', consultations: 95, avgDuration: '48 min', satisfaction: 4.8 },
  { name: 'Dr. James Okonkwo', specialty: 'Neurology', jurisdiction: 'NG', consultations: 88, avgDuration: '31 min', satisfaction: 4.7 },
  { name: 'Dr. Amina Lawal', specialty: 'OB/GYN', jurisdiction: 'NG', consultations: 76, avgDuration: '28 min', satisfaction: 4.9 },
  { name: 'Dr. Edward Clarke', specialty: 'Gastroenterology', jurisdiction: 'UK', consultations: 62, avgDuration: '22 min', satisfaction: 4.6 },
];

const SPECIALTY_COLORS: Record<string, string> = {
  generalPractice: '#0d746f',
  cardiology: '#0ea5e9',
  pediatrics: '#8b5cf6',
  psychiatry: '#f59e0b',
};

type Period = '3m' | '6m' | '12m';

export default function ConsultationsPage() {
  const [period, setPeriod] = useState<Period>('6m');

  const displayData = period === '3m' ? MONTHLY_VOLUME.slice(-3) : MONTHLY_VOLUME;

  return (
    <div className="page-content animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Consultation Volume</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>By specialty & clinician performance</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 3, gap: 2 }}>
            {(['3m', '6m', '12m'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: period === p ? 'white' : 'transparent', color: period === p ? '#0d746f' : '#64748b', boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s ease' }}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="btn-outline"><Download style={{ width: 13, height: 13 }} /> Export</button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid">
        {[
          { label: 'Total (Sep)', value: '847', delta: '↑ 57 vs Aug', color: '#0d746f' },
          { label: 'Avg Daily', value: '28.2', delta: 'consultations / day', color: '#0ea5e9' },
          { label: 'Avg Duration', value: '26 min', delta: 'per session', color: '#8b5cf6' },
          { label: 'Completion Rate', value: '97.3%', delta: '23 incomplete', color: '#10b981' },
        ].map(({ label, value, delta, color }) => (
          <div key={label} className="kpi-card" style={{ ['--accent-color' as string]: color }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <TrendingUp style={{ width: 14, height: 14, color }} />
            </div>
            <p style={{ margin: '0 0 2px', fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{label}</p>
            <p className="kpi-delta">{delta}</p>
          </div>
        ))}
      </div>

      {/* Volume Trend */}
      <div className="chart-card">
        <div className="chart-card-header">
          <p className="chart-card-title">Monthly Consultation Volume by Specialty</p>
          <span className="chart-badge">Stacked bar</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={displayData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="generalPractice" name="General Practice" stackId="a" fill={SPECIALTY_COLORS.generalPractice} radius={[0, 0, 0, 0]} />
            <Bar dataKey="cardiology" name="Cardiology" stackId="a" fill={SPECIALTY_COLORS.cardiology} />
            <Bar dataKey="pediatrics" name="Pediatrics" stackId="a" fill={SPECIALTY_COLORS.pediatrics} />
            <Bar dataKey="psychiatry" name="Psychiatry" stackId="a" fill={SPECIALTY_COLORS.psychiatry} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart — Total Trend */}
      <div className="chart-card">
        <div className="chart-card-header">
          <p className="chart-card-title">Total Consultation Growth Trend</p>
          <span className="chart-badge" style={{ background: '#f0fdf9', color: '#0d746f' }}>↑ 62.9% over 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={MONTHLY_VOLUME} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="consultGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d746f" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d746f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Area type="monotone" dataKey="consultations" stroke="#0d746f" strokeWidth={2.5} fill="url(#consultGrad)" dot={{ fill: '#0d746f', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Clinician Performance Table */}
      <div className="chart-card">
        <div className="chart-card-header">
          <p className="chart-card-title">Clinician Performance Ranking</p>
          <span className="chart-badge">Sep 2026</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Clinician</th>
              <th>Specialty</th>
              <th>Jurisdiction</th>
              <th style={{ textAlign: 'right' }}>Consultations</th>
              <th style={{ textAlign: 'right' }}>Avg Duration</th>
              <th style={{ textAlign: 'right' }}>Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {CLINICIAN_TABLE.map((c, i) => (
              <tr key={c.name}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#475569', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ color: '#64748b' }}>{c.specialty}</td>
                <td>
                  {c.jurisdiction === 'Both'
                    ? <><span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 700, marginRight: 4 }}>UK</span><span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700 }}>NG</span></>
                    : <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: c.jurisdiction === 'UK' ? 'rgba(14,165,233,0.1)' : 'rgba(16,185,129,0.1)', color: c.jurisdiction === 'UK' ? '#0ea5e9' : '#10b981', fontWeight: 700 }}>{c.jurisdiction}</span>
                  }
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{c.consultations}</td>
                <td style={{ textAlign: 'right', color: '#64748b' }}>{c.avgDuration}</td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, color: '#0d746f' }}>★ {c.satisfaction}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
