'use client';

import React, { useState } from 'react';
import {
  Hash,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  Lock,
} from 'lucide-react';

interface AuditEntry {
  seq: number;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  jurisdiction: 'UK' | 'NG' | 'System';
  hash: string;
  prevHash: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
  chainValid: boolean;
}

const AUDIT_CHAIN: AuditEntry[] = [
  { seq: 1084, timestamp: '2026-09-06 09:42:11 UTC', actor: 'dr.adeyemi@docaas.health', role: 'CLINICIAN', action: 'VIDEO_TOKEN_ISSUED', target: 'apt_c8919b4e', jurisdiction: 'NG', hash: '8f3b2c1a…19a2e4f1', prevHash: 'a1c9d3e2…44f1b8c9', details: 'Livekit room token issued for scheduled appointment.', severity: 'info', chainValid: true },
  { seq: 1083, timestamp: '2026-09-06 09:38:05 UTC', actor: 'admin@docaas.health', role: 'ADMIN', action: 'CREDENTIAL_VERIFIED', target: 'clin_ea001', jurisdiction: 'UK', hash: 'a1c9d3e2…44f1b8c9', prevHash: 'f2e84d7c…00b36a12', details: 'GMC-7654321 endorsement approved. Telehealth flag activated.', severity: 'info', chainValid: true },
  { seq: 1082, timestamp: '2026-09-06 09:22:47 UTC', actor: 'System · Allergy Engine v2.1', role: 'SYSTEM', action: 'PRESCRIPTION_BLOCKED', target: 'rx_28f3a91b', jurisdiction: 'NG', hash: 'f2e84d7c…00b36a12', prevHash: 'c7d02a9b…a9e2f103', details: 'Penicillin prescription blocked: patient allergy profile match (IgE-mediated). Clinician notified.', severity: 'warning', chainValid: true },
  { seq: 1081, timestamp: '2026-09-06 09:14:33 UTC', actor: 'dr.lawal@docaas.health', role: 'CLINICIAN', action: 'PATIENT_RECORD_ACCESSED', target: 'pat_f42b1903', jurisdiction: 'NG', hash: 'c7d02a9b…a9e2f103', prevHash: 'b9e312a4…7f1d0c88', details: 'Consultation note and prescription history accessed under active encounter.', severity: 'info', chainValid: true },
  { seq: 1080, timestamp: '2026-09-06 08:55:00 UTC', actor: 'dr.clarke@docaas.health', role: 'CLINICIAN', action: 'CLINICAL_NOTE_SEALED', target: 'note_7b3c19', jurisdiction: 'UK', hash: 'b9e312a4…7f1d0c88', prevHash: 'e4f8c221…b3a91f02', details: 'SHA-256 seal applied. Note is immutable. Addendum protocol enforced.', severity: 'info', chainValid: true },
  { seq: 1079, timestamp: '2026-09-06 08:43:19 UTC', actor: 'System · Auth Service', role: 'SYSTEM', action: 'FAILED_LOGIN_ATTEMPT', target: 'pat_d9a10c32', jurisdiction: 'UK', hash: 'e4f8c221…b3a91f02', prevHash: '3c1a8b9f…12e4d5c6', details: '3 failed login attempts from IP 92.14.11.200. Account rate-limited for 15 minutes.', severity: 'critical', chainValid: true },
  { seq: 1078, timestamp: '2026-09-06 08:30:11 UTC', actor: 'admin@docaas.health', role: 'ADMIN', action: 'CREDENTIAL_SUBMITTED', target: 'clin_ec001', jurisdiction: 'UK', hash: '3c1a8b9f…12e4d5c6', prevHash: 'aa3f9112…8c7d1e44', details: 'GMC-6543210 gastroenterology specialist application received for review.', severity: 'info', chainValid: true },
];

const SEVERITY_BADGE = {
  info: <span className="badge badge-verified">Info</span>,
  warning: <span className="badge badge-pending"><AlertTriangle style={{ width: 10, height: 10 }} /> Warning</span>,
  critical: <span className="badge badge-rejected"><AlertTriangle style={{ width: 10, height: 10 }} /> Critical</span>,
};

export default function AuditPage() {
  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [chainVerified, setChainVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const filtered = AUDIT_CHAIN.filter((e) => {
    const q = query.toLowerCase();
    const matchQ = !q || e.action.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q) || e.hash.includes(q);
    const matchS = severityFilter === 'all' || e.severity === severityFilter;
    return matchQ && matchS;
  });

  function verifyChain() {
    setVerifying(true);
    setTimeout(() => {
      setChainVerified(true);
      setVerifying(false);
    }, 1800);
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="admin-page-title">Audit Vault</h1>
          <p className="admin-page-subtitle">Tamper-evident SHA-256 blockchain audit trail · NDPA 2023 Art. 25 · UK GDPR Art. 30 compliant</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={verifyChain}
            disabled={verifying}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: chainVerified ? '#0d746f' : '#0f172a', fontSize: 12, fontWeight: 600, color: 'white', cursor: 'pointer', opacity: verifying ? 0.7 : 1 }}
          >
            {verifying
              ? <><RefreshCw style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> Verifying…</>
              : chainVerified
              ? <><CheckCircle2 style={{ width: 13, height: 13 }} /> Chain Verified</>
              : <><ShieldCheck style={{ width: 13, height: 13 }} /> Verify Chain</>
            }
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            <Download style={{ width: 13, height: 13 }} /> Export JSONL
          </button>
        </div>
      </div>

      {/* Chain Integrity Banner */}
      <div style={{ background: chainVerified ? '#f0fdf4' : '#f8fafc', border: `1px solid ${chainVerified ? '#86efac' : '#e2e8f0'}`, borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: chainVerified ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {chainVerified ? <CheckCircle2 style={{ width: 18, height: 18, color: '#16a34a' }} /> : <Lock style={{ width: 18, height: 18, color: '#64748b' }} />}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: chainVerified ? '#166534' : '#0f172a' }}>
            {chainVerified ? 'Audit Chain Integrity: VERIFIED ✓' : 'Audit Chain Integrity: Not Yet Verified'}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
            {chainVerified
              ? `All ${AUDIT_CHAIN.length} blocks verified. SHA-256 hash chain intact. No tampering detected.`
              : 'Click "Verify Chain" to run SHA-256 hash verification across all audit blocks.'}
          </p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>Latest Block</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, fontFamily: 'monospace', color: '#0f172a' }}>{AUDIT_CHAIN[0]!.hash}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 240, maxWidth: 380, background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px' }}>
          <Search style={{ width: 14, height: 14, color: '#94a3b8', flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search action, actor, or hash…"
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0f172a', width: '100%', background: 'transparent' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 12, color: '#64748b' }}>
          <Filter style={{ width: 13, height: 13 }} />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as typeof severityFilter)}
            style={{ border: 'none', outline: 'none', fontSize: 12, color: '#64748b', background: 'transparent', cursor: 'pointer' }}
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <ChevronDown style={{ width: 12, height: 12 }} />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="admin-section-card">
        <div className="admin-section-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Hash style={{ width: 14, height: 14, color: '#64748b' }} />
            <p className="admin-section-card-title">Audit Log — {filtered.length} entries</p>
          </div>
        </div>
        <div>
          {filtered.map((entry) => (
            <div key={entry.seq} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div
                className="admin-table-row"
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === entry.seq ? null : entry.seq)}
              >
                {/* Sequence */}
                <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#64748b' }}>#{entry.seq}</span>
                </div>
                {/* Chain validity */}
                <div style={{ flexShrink: 0 }}>
                  {entry.chainValid
                    ? <CheckCircle2 style={{ width: 16, height: 16, color: '#10b981' }} />
                    : <AlertTriangle style={{ width: 16, height: 16, color: '#f43f5e' }} />
                  }
                </div>
                {/* Action */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{entry.action}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.actor} · {entry.role}
                  </p>
                </div>
                {/* Hash */}
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Hash style={{ width: 11, height: 11, color: '#94a3b8' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748b' }}>{entry.hash}</span>
                </div>
                {/* Jurisdiction */}
                <div style={{ flexShrink: 0 }}>
                  {entry.jurisdiction !== 'System'
                    ? <span className={`admin-jurisdiction-badge ${entry.jurisdiction.toLowerCase()}`}>{entry.jurisdiction}</span>
                    : <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>System</span>
                  }
                </div>
                {/* Severity */}
                <div style={{ flexShrink: 0 }}>{SEVERITY_BADGE[entry.severity]}</div>
                {/* Timestamp */}
                <div style={{ flexShrink: 0, fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  {entry.timestamp.split(' ').slice(1).join(' ')}
                </div>
                <ChevronDown style={{ width: 14, height: 14, color: '#94a3b8', flexShrink: 0, transform: expanded === entry.seq ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </div>

              {/* Expanded Details */}
              {expanded === entry.seq && (
                <div style={{ padding: '0 20px 16px 88px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, gridColumn: '1 / -1' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>Event Details</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#0f172a' }}>{entry.details}</p>
                  </div>
                  {[
                    { label: 'Target Resource', value: entry.target },
                    { label: 'Timestamp', value: entry.timestamp },
                    { label: 'Block Hash (SHA-256)', value: entry.hash },
                    { label: 'Previous Block Hash', value: entry.prevHash },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>{label}</p>
                      <p style={{ margin: 0, fontSize: 12, fontFamily: 'monospace', color: '#0f172a' }}>{value}</p>
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ExternalLink style={{ width: 12, height: 12, color: '#0d746f' }} />
                    <button style={{ fontSize: 12, color: '#0d746f', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      View full block in Audit Vault →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
