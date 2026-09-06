'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  Eye,
  FileText,
  AlertTriangle,
  Globe,
  BadgeCheck,
} from 'lucide-react';

type Status = 'pending_review' | 'verified' | 'rejected';
type Jurisdiction = 'UK' | 'NG' | 'Both';

interface Clinician {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  licensingBody: string;
  licenseNumber: string;
  credentialType: string;
  submittedAt: string;
  status: Status;
  jurisdiction: Jurisdiction;
  email: string;
  patients: number;
  consultations: number;
  notes?: string;
}

const CLINICIANS: Clinician[] = [
  {
    id: 'c1', name: 'Dr. Edward Clarke', initials: 'EC', specialty: 'Gastroenterology',
    licensingBody: 'General Medical Council (UK)', licenseNumber: 'GMC-6543210',
    credentialType: 'GMC Specialist Register Entry', submittedAt: 'Today, 08:30',
    status: 'pending_review', jurisdiction: 'UK', email: 'dr.clarke@docaas.health',
    patients: 0, consultations: 0,
  },
  {
    id: 'c2', name: 'Dr. Amina Lawal', initials: 'AL', specialty: 'Obstetrics & Gynecology',
    licensingBody: 'Medical & Dental Council of Nigeria', licenseNumber: 'MDCN-42110',
    credentialType: 'MDCN Annual Practicing License (2026)', submittedAt: 'Today, 09:15',
    status: 'pending_review', jurisdiction: 'NG', email: 'dr.lawal@docaas.health',
    patients: 0, consultations: 0,
  },
  {
    id: 'c3', name: 'Dr. Elizabeth Adeyemi', initials: 'EA', specialty: 'Cardiology',
    licensingBody: 'GMC & MDCN Dual Accreditation', licenseNumber: 'GMC-7654321 / MDCN-38910',
    credentialType: 'Consultant Telehealth Endorsement', submittedAt: 'Yesterday, 14:00',
    status: 'verified', jurisdiction: 'Both', email: 'dr.adeyemi@docaas.health',
    patients: 84, consultations: 312,
  },
  {
    id: 'c4', name: 'Dr. James Okonkwo', initials: 'JO', specialty: 'Neurology',
    licensingBody: 'Medical & Dental Council of Nigeria', licenseNumber: 'MDCN-51234',
    credentialType: 'Specialist Certificate', submittedAt: '3 days ago',
    status: 'verified', jurisdiction: 'NG', email: 'dr.okonkwo@docaas.health',
    patients: 56, consultations: 198,
  },
  {
    id: 'c5', name: 'Dr. Kavita Sharma', initials: 'KS', specialty: 'Psychiatry',
    licensingBody: 'General Medical Council (UK)', licenseNumber: 'GMC-4321987',
    credentialType: 'Section 12 Approval', submittedAt: '5 days ago',
    status: 'verified', jurisdiction: 'UK', email: 'dr.sharma@docaas.health',
    patients: 121, consultations: 445,
  },
  {
    id: 'c6', name: 'Dr. Marcus Webb', initials: 'MW', specialty: 'General Practice',
    licensingBody: 'General Medical Council (UK)', licenseNumber: 'GMC-1122334',
    credentialType: 'GP Registered (Performer)', submittedAt: '1 week ago',
    status: 'rejected', jurisdiction: 'UK', email: 'dr.webb@docaas.health',
    patients: 0, consultations: 0, notes: 'Expired GMC registration. Reapplication required.',
  },
];

export default function CliniciansPage() {
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Clinician | null>(null);
  const [clinicians, setClinicians] = useState(CLINICIANS);

  const filtered = clinicians.filter((c) => {
    const matchStatus = filter === 'all' || c.status === filter;
    const q = query.toLowerCase();
    const matchQuery = !q || c.name.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q) || c.licenseNumber.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  function approve(id: string) {
    setClinicians((prev) => prev.map((c) => c.id === id ? { ...c, status: 'verified' } : c));
    setSelected(null);
  }

  function reject(id: string) {
    setClinicians((prev) => prev.map((c) => c.id === id ? { ...c, status: 'rejected' } : c));
    setSelected(null);
  }

  const counts = {
    all: clinicians.length,
    pending_review: clinicians.filter(c => c.status === 'pending_review').length,
    verified: clinicians.filter(c => c.status === 'verified').length,
    rejected: clinicians.filter(c => c.status === 'rejected').length,
  };

  const statusBadge = (s: Status) => {
    if (s === 'verified') return <span className="badge badge-verified"><CheckCircle2 style={{ width: 10, height: 10 }} /> Verified</span>;
    if (s === 'rejected') return <span className="badge badge-rejected"><XCircle style={{ width: 10, height: 10 }} /> Rejected</span>;
    return <span className="badge badge-pending"><Clock style={{ width: 10, height: 10 }} /> Pending</span>;
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="admin-page-title">Clinician Roster</h1>
          <p className="admin-page-subtitle">Credential verification and licensing management · {counts.pending_review} awaiting review</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            <Download style={{ width: 13, height: 13 }} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 20, width: 'fit-content' }}>
        {(['all', 'pending_review', 'verified', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            className={`admin-nav-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' ? 'All' : tab === 'pending_review' ? 'Pending' : tab === 'verified' ? 'Verified' : 'Rejected'}
            <span style={{ marginLeft: 4, background: filter === tab ? '#f0fdf9' : '#e2e8f0', color: filter === tab ? '#0d746f' : '#64748b', padding: '1px 5px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>
              {counts[tab === 'all' ? 'all' : tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 360, background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px' }}>
          <Search style={{ width: 14, height: 14, color: '#94a3b8', flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, specialty, or licence…"
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0f172a', width: '100%', background: 'transparent' }}
          />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
          <Filter style={{ width: 13, height: 13 }} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="admin-section-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Clinician</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Licensing Body</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Jurisdiction</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Submitted</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="admin-table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#475569', flexShrink: 0 }}>
                      {c.initials}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>{c.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{c.specialty} · {c.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ margin: 0, color: '#0f172a' }}>{c.licensingBody}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{c.licenseNumber}</p>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {c.jurisdiction === 'Both'
                    ? <><span className="admin-jurisdiction-badge uk" style={{ marginRight: 4 }}>UK</span><span className="admin-jurisdiction-badge ng">NG</span></>
                    : <span className={`admin-jurisdiction-badge ${c.jurisdiction.toLowerCase()}`}>{c.jurisdiction}</span>
                  }
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#64748b' }}>{c.submittedAt}</td>
                <td style={{ padding: '14px 20px' }}>{statusBadge(c.status)}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setSelected(c)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                    >
                      <Eye style={{ width: 11, height: 11 }} /> Review
                    </button>
                    {c.status === 'pending_review' && (
                      <>
                        <button
                          onClick={() => approve(c.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: 'none', background: '#0d746f', fontSize: 11, fontWeight: 600, color: 'white', cursor: 'pointer' }}
                        >
                          <CheckCircle2 style={{ width: 11, height: 11 }} /> Approve
                        </button>
                        <button
                          onClick={() => reject(c.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: 'none', background: '#fee2e2', fontSize: 11, fontWeight: 600, color: '#991b1b', cursor: 'pointer' }}
                        >
                          <XCircle style={{ width: 11, height: 11 }} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            No clinicians match your current filter.
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          role="dialog"
          aria-modal="true"
          aria-label={`Review ${selected.name}`}
        >
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 560, boxShadow: '0 25px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#475569' }}>
                  {selected.initials}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{selected.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>{selected.specialty}</p>
                </div>
              </div>
              {statusBadge(selected.status)}
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Licensing Body', value: selected.licensingBody, icon: BadgeCheck },
                { label: 'Licence Number', value: selected.licenseNumber, icon: FileText },
                { label: 'Credential Type', value: selected.credentialType, icon: FileText },
                { label: 'Jurisdiction', value: selected.jurisdiction, icon: Globe },
                { label: 'Email', value: selected.email, icon: UserCheck },
                { label: 'Submitted', value: selected.submittedAt, icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon style={{ width: 13, height: 13, color: '#64748b' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>{label}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{value}</p>
                  </div>
                </div>
              ))}
              {selected.notes && (
                <div style={{ background: '#fef3c7', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 8 }}>
                  <AlertTriangle style={{ width: 14, height: 14, color: '#92400e', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 12, color: '#92400e' }}>{selected.notes}</p>
                </div>
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelected(null)}
                style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
              >
                Close
              </button>
              {selected.status === 'pending_review' && (
                <>
                  <button
                    onClick={() => reject(selected.id)}
                    style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: '#fee2e2', fontSize: 13, fontWeight: 600, color: '#991b1b', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => approve(selected.id)}
                    style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: '#0d746f', fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}
                  >
                    Approve & Activate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
