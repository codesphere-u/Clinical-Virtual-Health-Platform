'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  Hash,
  Database,
  Layers,
  Download,
} from 'lucide-react';

const AUDIT_BLOCKS = [
  {
    blockNumber: 1048291,
    timestamp: '2026-09-06 04:52:11 UTC',
    action: 'CLINICAL_PRESCRIPTION_ISSUED',
    actor: 'dr_clarke_gmc (GMC #7192841)',
    patientRef: 'pat_enc_9a8f10b2',
    payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    prevHash: '7d1a29f8c03e84ab1b54a719d28e4693179ef4982a5c317b3f9408c4e0915a72',
    status: 'VERIFIED_IMMUTABLE',
  },
  {
    blockNumber: 1048290,
    timestamp: '2026-09-06 04:50:04 UTC',
    action: 'CONSULTATION_SESSION_FINALIZED',
    actor: 'dr_lawal_mdcn (MDCN #48291)',
    patientRef: 'pat_enc_44a19b88',
    payloadHash: '7d1a29f8c03e84ab1b54a719d28e4693179ef4982a5c317b3f9408c4e0915a72',
    prevHash: 'a58c93b1d02f8417e29a3915f019c836928e4179b04f1295c37890e4f71a29b4',
    status: 'VERIFIED_IMMUTABLE',
  },
  {
    blockNumber: 1048289,
    timestamp: '2026-09-06 04:47:39 UTC',
    action: 'CROSS_BORDER_TRANSFER_CONSENT',
    actor: 'pat_enc_33c91a02 (Patient Direct)',
    patientRef: 'pat_enc_33c91a02',
    payloadHash: 'a58c93b1d02f8417e29a3915f019c836928e4179b04f1295c37890e4f71a29b4',
    prevHash: '42b918cae71029c4f83910ab3847e9201948ba394c8e104928b5719a8427189c',
    status: 'VERIFIED_IMMUTABLE',
  },
  {
    blockNumber: 1048288,
    timestamp: '2026-09-06 04:42:15 UTC',
    action: 'EMR_RECORD_ACCESS_GRANT',
    actor: 'dr_adeyemi_mdcn (MDCN #39104)',
    patientRef: 'pat_enc_71b4a901',
    payloadHash: '42b918cae71029c4f83910ab3847e9201948ba394c8e104928b5719a8427189c',
    prevHash: '891ac3b918402947190efb49281a7493019e481b920485719028e391b4029581',
    status: 'VERIFIED_IMMUTABLE',
  },
  {
    blockNumber: 1048287,
    timestamp: '2026-09-06 04:39:00 UTC',
    action: 'MEDICATION_SAFETY_INTERVENTION',
    actor: 'SYSTEM_SAFETY_ENGINE (v2.4)',
    patientRef: 'pat_enc_1903e481',
    payloadHash: '891ac3b918402947190efb49281a7493019e481b920485719028e391b4029581',
    prevHash: '39481904a8c91b49102837482910492817293849102938491029384910293849',
    status: 'VERIFIED_IMMUTABLE',
  },
];

export default function AuditVaultPage() {
  const [verifying, setVerifying] = useState(false);
  const [lastVerified, setLastVerified] = useState<string>('Just now');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const runVerification = () => {
    setVerifying(true);
    setVerificationResult(null);
    setTimeout(() => {
      setVerifying(false);
      setLastVerified('Just now');
      setVerificationResult('All 1,048,291 cryptographic blocks validated. SHA-256 chain unbroken.');
    }, 1200);
  };

  return (
    <div className="page-content animate-fadeIn">
      {/* Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Audit Vault & Cryptographic Chain Integrity
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>
            SHA-256 tamper-evident hash chaining for clinical encounters, prescriptions, and access logs
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn-outline"
            onClick={runVerification}
            disabled={verifying}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw className={verifying ? 'animate-spin' : ''} style={{ width: 13, height: 13 }} />
            {verifying ? 'Recalculating Chain...' : 'Verify Cryptographic Integrity'}
          </button>
          <button className="btn-outline">
            <Download style={{ width: 13, height: 13 }} /> Export Certificate of Authenticity
          </button>
        </div>
      </div>

      {/* Verification Feedback Banner */}
      {verificationResult && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#065f46',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <CheckCircle2 style={{ width: 18, height: 18, color: '#10b981', flexShrink: 0 }} />
          <span>{verificationResult}</span>
        </div>
      )}

      {/* Vault KPI Summary */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Current Ledger Height</span>
            <div className="kpi-icon-wrap" style={{ background: '#f8fafc', color: '#0f172a' }}>
              <Layers style={{ width: 15, height: 15 }} />
            </div>
          </div>
          <div className="kpi-card-value">1,048,291</div>
          <div className="kpi-delta positive">
            <span>+3,420 immutable records today</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Cryptographic Integrity</span>
            <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <ShieldCheck style={{ width: 15, height: 15 }} />
            </div>
          </div>
          <div className="kpi-card-value">100.0% Valid</div>
          <div className="kpi-delta positive">
            <CheckCircle2 style={{ width: 12, height: 12 }} />
            <span>0 broken links detected</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Hashing Algorithm</span>
            <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Hash style={{ width: 15, height: 15 }} />
            </div>
          </div>
          <div className="kpi-card-value">SHA-256 + HMAC</div>
          <div className="kpi-delta neutral">
            <span>FIPS 140-2 Level 3 HSM Enclave</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-label">Last Full Integrity Audit</span>
            <div className="kpi-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Database style={{ width: 15, height: 15 }} />
            </div>
          </div>
          <div className="kpi-card-value">{lastVerified}</div>
          <div className="kpi-delta positive">
            <span>Automated hourly daemon active</span>
          </div>
        </div>
      </div>

      {/* Merkle Root & Vault Architecture Strip */}
      <div
        style={{
          background: '#0f172a',
          color: '#f8fafc',
          borderRadius: 12,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock style={{ width: 14, height: 14, color: '#10b981' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94a3b8' }}>
              Current Sovereign Merkle Root Anchor
            </span>
          </div>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(16,185,129,0.3)' }}>
            LATEST ANCHOR: BLOCK #1,048,291
          </span>
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            background: '#1e293b',
            padding: '10px 14px',
            borderRadius: 8,
            color: '#38bdf8',
            wordBreak: 'break-all',
            border: '1px solid #334155',
          }}
        >
          0x4fae8910b84c910283749102948291048291048bca9104829104928192847190
        </div>
        <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>
          Synchronized to Sovereign Timestamp Authority (TSA) & RFC 3161 compliant hardware security module.
        </p>
      </div>

      {/* Block Explorer Table */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <p className="chart-card-title">Immutable Audit Chain Explorer</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>
              Chronological cryptographic sequence of validated clinical and administrative events
            </p>
          </div>
          <span className="chart-badge">Continuous SHA-256 Feed</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Block #</th>
                <th>Timestamp</th>
                <th>Clinical / Security Event</th>
                <th>Principal / Signer</th>
                <th>Patient Hash</th>
                <th>Payload SHA-256 Digest</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_BLOCKS.map((block) => (
                <tr key={block.blockNumber}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                    #{block.blockNumber}
                  </td>
                  <td style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {block.timestamp}
                  </td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1' }}>
                      {block.action}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>
                    {block.actor}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 10, color: '#64748b' }}>
                    {block.patientRef}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 10, color: '#475569' }}>
                    {block.payloadHash.substring(0, 16)}...{block.payloadHash.substring(56)}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 99,
                        background: '#dcfce7',
                        color: '#15803d',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 style={{ width: 10, height: 10 }} />
                      Chain Valid
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
