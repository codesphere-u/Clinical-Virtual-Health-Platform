'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  UserX,
  UserCheck,
  Mail,
  Globe,
  Calendar,
  Phone,
  Shield,
  ChevronDown,
} from 'lucide-react';

type AccountStatus = 'active' | 'suspended' | 'pending_verification' | 'deactivated';

interface Patient {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  dob: string;
  jurisdiction: 'UK' | 'NG';
  status: AccountStatus;
  registeredAt: string;
  consultations: number;
  lastActive: string;
  consentGiven: boolean;
}

const PATIENTS: Patient[] = [
  { id: 'p1', name: 'Sarah Okafor', initials: 'SO', email: 'sarah.o@gmail.com', phone: '+44 7700 900123', dob: '14 Mar 1988', jurisdiction: 'UK', status: 'active', registeredAt: '12 Jan 2025', consultations: 8, lastActive: '2 hours ago', consentGiven: true },
  { id: 'p2', name: 'Emeka Adewale', initials: 'EA', email: 'emeka.a@yahoo.com', phone: '+234 805 1234567', dob: '22 Jul 1975', jurisdiction: 'NG', status: 'active', registeredAt: '3 Feb 2025', consultations: 14, lastActive: 'Yesterday', consentGiven: true },
  { id: 'p3', name: 'Priya Mehta', initials: 'PM', email: 'priya.m@outlook.com', phone: '+44 7911 123456', dob: '9 Nov 1992', jurisdiction: 'UK', status: 'pending_verification', registeredAt: 'Today', consultations: 0, lastActive: '1 hour ago', consentGiven: false },
  { id: 'p4', name: 'James Thompson', initials: 'JT', email: 'j.thompson@docmail.co.uk', phone: '+44 7800 654321', dob: '5 Apr 1965', jurisdiction: 'UK', status: 'active', registeredAt: '28 Dec 2024', consultations: 22, lastActive: '3 days ago', consentGiven: true },
  { id: 'p5', name: 'Fatima Al-Rashid', initials: 'FA', email: 'fatima.r@gmail.com', phone: '+234 802 9876543', dob: '18 Aug 2000', jurisdiction: 'NG', status: 'suspended', registeredAt: '14 Mar 2025', consultations: 3, lastActive: '1 week ago', consentGiven: true },
  { id: 'p6', name: 'David Obi', initials: 'DO', email: 'd.obi@hotmail.com', phone: '+234 703 1122334', dob: '30 Jan 1983', jurisdiction: 'NG', status: 'active', registeredAt: '1 Apr 2025', consultations: 5, lastActive: '5 hours ago', consentGiven: true },
  { id: 'p7', name: 'Charlotte Hughes', initials: 'CH', email: 'c.hughes@nhs.net', phone: '+44 7600 111222', dob: '2 Feb 1990', jurisdiction: 'UK', status: 'deactivated', registeredAt: '6 Sep 2024', consultations: 1, lastActive: '2 months ago', consentGiven: false },
];

const STATUS_BADGE: Record<AccountStatus, React.ReactNode> = {
  active: <span className="badge badge-verified"><UserCheck style={{ width: 10, height: 10 }} /> Active</span>,
  suspended: <span className="badge badge-pending"><UserX style={{ width: 10, height: 10 }} /> Suspended</span>,
  pending_verification: <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}><Shield style={{ width: 10, height: 10 }} /> Pending</span>,
  deactivated: <span className="badge badge-rejected"><UserX style={{ width: 10, height: 10 }} /> Deactivated</span>,
};

export default function UsersPage() {
  const [query, setQuery] = useState('');
  const [jFilter, setJFilter] = useState<'all' | 'UK' | 'NG'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [patients, setPatients] = useState(PATIENTS);

  const filtered = patients.filter((p) => {
    const q = query.toLowerCase();
    const matchQuery = !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.id.includes(q);
    const matchJ = jFilter === 'all' || p.jurisdiction === jFilter;
    const matchS = statusFilter === 'all' || p.status === statusFilter;
    return matchQuery && matchJ && matchS;
  });

  function toggleSuspend(id: string) {
    setPatients(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'suspended' ? 'active' : 'suspended' } : p
    ));
    setSelected(null);
  }

  return (
    <div className="animate-fadeIn">
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="admin-page-title">Patient Registry</h1>
          <p className="admin-page-subtitle">User account management, consent tracking, and access control · {patients.filter(p => p.status === 'active').length} active accounts</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
          <Download style={{ width: 13, height: 13 }} /> Export CSV
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Patients', value: patients.length, color: '#0d746f' },
          { label: 'Active', value: patients.filter(p => p.status === 'active').length, color: '#10b981' },
          { label: 'Pending Verification', value: patients.filter(p => p.status === 'pending_verification').length, color: '#f59e0b' },
          { label: 'Suspended', value: patients.filter(p => p.status === 'suspended').length, color: '#f43f5e' },
        ].map(({ label, value, color }) => (
          <div key={label} className="admin-kpi-card" style={{ ['--kpi-color' as string]: color, padding: 16 }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 240, maxWidth: 360, background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px' }}>
          <Search style={{ width: 14, height: 14, color: '#94a3b8', flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0f172a', width: '100%', background: 'transparent' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
          <Globe style={{ width: 13, height: 13 }} />
          <select
            value={jFilter}
            onChange={(e) => setJFilter(e.target.value as typeof jFilter)}
            style={{ border: 'none', outline: 'none', fontSize: 12, color: '#64748b', background: 'transparent', cursor: 'pointer' }}
          >
            <option value="all">All Jurisdictions</option>
            <option value="UK">UK</option>
            <option value="NG">Nigeria</option>
          </select>
          <ChevronDown style={{ width: 12, height: 12 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
          <Filter style={{ width: 13, height: 13 }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            style={{ border: 'none', outline: 'none', fontSize: 12, color: '#64748b', background: 'transparent', cursor: 'pointer' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_verification">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="deactivated">Deactivated</option>
          </select>
          <ChevronDown style={{ width: 12, height: 12 }} />
        </div>
      </div>

      {/* Table */}
      <div className="admin-section-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Patient', 'Contact', 'Jurisdiction', 'Registered', 'Consultations', 'Consent', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="admin-table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#475569', flexShrink: 0 }}>
                      {p.initials}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{p.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>DOB: {p.dob}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <p style={{ margin: 0, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#64748b' }}><Mail style={{ width: 11, height: 11 }} />{p.email}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}><Phone style={{ width: 11, height: 11 }} />{p.phone}</p>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`admin-jurisdiction-badge ${p.jurisdiction.toLowerCase()}`}>{p.jurisdiction}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar style={{ width: 11, height: 11 }} /> {p.registeredAt}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a', textAlign: 'center' }}>{p.consultations}</td>
                <td style={{ padding: '12px 16px' }}>
                  {p.consentGiven
                    ? <span className="badge badge-verified">Given</span>
                    : <span className="badge badge-pending">Pending</span>
                  }
                </td>
                <td style={{ padding: '12px 16px' }}>{STATUS_BADGE[p.status]}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setSelected(p)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                    >
                      <Eye style={{ width: 11, height: 11 }} />
                    </button>
                    {(p.status === 'active' || p.status === 'suspended') && (
                      <button
                        onClick={() => toggleSuspend(p.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px', borderRadius: 6, border: 'none', background: p.status === 'suspended' ? '#dcfce7' : '#fee2e2', fontSize: 11, fontWeight: 600, color: p.status === 'suspended' ? '#166534' : '#991b1b', cursor: 'pointer' }}
                      >
                        {p.status === 'suspended' ? <UserCheck style={{ width: 11, height: 11 }} /> : <UserX style={{ width: 11, height: 11 }} />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No patients match your current filter.</div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          role="dialog" aria-modal="true"
        >
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 25px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#475569' }}>
                  {selected.initials}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{selected.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>{selected.email}</p>
                </div>
              </div>
              {STATUS_BADGE[selected.status]}
            </div>
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Date of Birth', value: selected.dob },
                { label: 'Phone', value: selected.phone },
                { label: 'Jurisdiction', value: selected.jurisdiction },
                { label: 'Registered', value: selected.registeredAt },
                { label: 'Consultations', value: String(selected.consultations) },
                { label: 'Last Active', value: selected.lastActive },
                { label: 'Consent', value: selected.consentGiven ? 'GDPR/NDPA Consent Given' : 'Consent Pending' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>{label}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setSelected(null)} style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Close</button>
              {(selected.status === 'active' || selected.status === 'suspended') && (
                <button
                  onClick={() => toggleSuspend(selected.id)}
                  style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: selected.status === 'suspended' ? '#0d746f' : '#fee2e2', fontSize: 13, fontWeight: 600, color: selected.status === 'suspended' ? 'white' : '#991b1b', cursor: 'pointer' }}
                >
                  {selected.status === 'suspended' ? 'Reinstate Account' : 'Suspend Account'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
