'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Radio,
} from 'lucide-react';
import { Button, Badge, Card } from '@aura/design-system';

export default function AdminCommandCenterPage() {
  const [selectedTab, setSelectedTab] = useState<'verification' | 'telemetry' | 'audit'>('verification');

  // Verification Queue State
  const [verifications, setVerifications] = useState([
    {
      id: 'v1',
      name: 'Dr. Edward Clarke',
      specialty: 'Gastroenterology',
      licensingBody: 'GMC (United Kingdom)',
      licenseNumber: '6543210',
      credentialType: 'GMC Full Registration & Specialist Register',
      submittedAt: 'Today, 08:30',
      documentUrl: 'https://vault.alliance-health.org/credentials/clarke-gmc.pdf',
      status: 'pending_review',
    },
    {
      id: 'v2',
      name: 'Dr. Amina Lawal',
      specialty: 'Obstetrics & Gynecology',
      licensingBody: 'MDCN (Nigeria)',
      licenseNumber: 'MDCN-42110',
      credentialType: 'MDCN Annual Practicing License (2026)',
      submittedAt: 'Today, 09:15',
      documentUrl: 'https://vault.alliance-health.org/credentials/lawal-mdcn.pdf',
      status: 'pending_review',
    },
  ]);

  const handleApprove = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'verified' } : v))
    );
  };

  const handleReject = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'rejected' } : v))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Admin Command Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#0D746F] flex items-center justify-center font-bold tracking-wider text-sm">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight">AURA COMMAND CENTER</h1>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  SYSTEM OPTIMAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Governance, Cross-Border Telemetry & Sovereign Audit Vault (Nigeria / UK)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>SFU Cluster: <strong>Lagos-1 / London-1</strong></span>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Main Command Surface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {/* KPI Telemetry Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-l-4 border-l-[#0D746F]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Consultations</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900">14 Live</span>
              <span className="text-xs text-emerald-600 font-medium">100% WebRTC SFU</span>
            </div>
          </Card>

          <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinicians On Duty</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900">24</span>
              <span className="text-xs text-slate-500">16 UK • 8 NG</span>
            </div>
          </Card>

          <Card className="p-4 bg-white border-l-4 border-l-amber-500">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Waiting Room Queue</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-amber-600">3 Patients</span>
              <span className="text-xs text-slate-500">Avg wait: 4.2m</span>
            </div>
          </Card>

          <Card className="p-4 bg-white border-l-4 border-l-sky-600">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cross-Border Transfers</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-sky-700">31 Logged</span>
              <span className="text-xs text-slate-500">NDPA / UK GDPR</span>
            </div>
          </Card>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setSelectedTab('verification')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedTab === 'verification'
                ? 'bg-[#0D746F] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Clinician Compliance Passports (2 Pending)
          </button>
          <button
            onClick={() => setSelectedTab('telemetry')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedTab === 'telemetry'
                ? 'bg-[#0D746F] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Live Waiting Room Telemetry
          </button>
          <button
            onClick={() => setSelectedTab('audit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedTab === 'audit'
                ? 'bg-[#0D746F] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Immutable Audit Trail (SHA-256 Vault)
          </button>
        </div>

        {/* Tab 1: Verification Queue */}
        {selectedTab === 'verification' && (
          <section className="space-y-4">
            <div className="space-y-3">
              {verifications.map((v) => (
                <Card key={v.id} variant="elevated" className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{v.name}</h3>
                        <Badge variant="info" size="sm">
                          {v.specialty}
                        </Badge>
                        <Badge
                          variant={v.status === 'verified' ? 'verified' : v.status === 'rejected' ? 'critical' : 'warning'}
                          size="sm"
                          dot
                        >
                          {v.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600">
                        <strong>Licensing Authority:</strong> {v.licensingBody} • Registration #{v.licenseNumber}
                      </p>
                      <p className="text-xs text-slate-500">
                        <strong>Document:</strong> {v.credentialType} (Submitted {v.submittedAt})
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={v.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#0D746F] hover:underline font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Inspect Certificate</span>
                      </a>

                      {v.status === 'pending_review' && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(v.id)}
                            leftIcon={<XCircle className="h-3.5 w-3.5 text-rose-600" />}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApprove(v.id)}
                            leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                          >
                            Approve Passport
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Tab 2: Live Waiting Room Telemetry */}
        {selectedTab === 'telemetry' && (
          <section className="space-y-4">
            <Card className="p-0 overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Patient</th>
                    <th className="p-3.5">Assigned Clinician</th>
                    <th className="p-3.5">Wait Time</th>
                    <th className="p-3.5">Network Signal</th>
                    <th className="p-3.5">Room ID</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">Olumide Babalola (MRN: CVH-2026-0001)</td>
                    <td className="p-3.5 text-slate-700">Dr. Elizabeth Adeyemi (Cardiology)</td>
                    <td className="p-3.5 text-amber-600 font-semibold">4m 12s</td>
                    <td className="p-3.5 text-emerald-600 font-medium">1080p (45ms latency)</td>
                    <td className="p-3.5 font-mono text-slate-500">cvh-room-001</td>
                    <td className="p-3.5 text-right">
                      <Button size="sm" variant="outline">Inspect Signal</Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">Chioma Eze (MRN: CVH-2026-0002)</td>
                    <td className="p-3.5 text-slate-700">Dr. Chidiebere Okafor (Endocrinology)</td>
                    <td className="p-3.5 text-amber-600 font-semibold">2m 45s</td>
                    <td className="p-3.5 text-emerald-600 font-medium">720p (62ms latency)</td>
                    <td className="p-3.5 font-mono text-slate-500">cvh-room-002</td>
                    <td className="p-3.5 text-right">
                      <Button size="sm" variant="outline">Inspect Signal</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </section>
        )}

        {/* Tab 3: Immutable Audit Vault */}
        {selectedTab === 'audit' && (
          <section className="space-y-4">
            <Card className="p-0 overflow-hidden bg-white">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Timestamp (UTC)</th>
                    <th className="p-3">User Role</th>
                    <th className="p-3">Action Event</th>
                    <th className="p-3">Jurisdiction</th>
                    <th className="p-3">Cryptographic SHA-256 Chain Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-600">2026-09-03 08:45:12</td>
                    <td className="p-3 text-emerald-700 font-bold">clinician (GMC-7654321)</td>
                    <td className="p-3 font-semibold text-slate-900">PRESCRIPTION_SIGN</td>
                    <td className="p-3 font-bold text-sky-700">NG &lt;-&gt; GB</td>
                    <td className="p-3 text-[11px] text-slate-500 truncate max-w-xs">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-600">2026-09-03 08:31:04</td>
                    <td className="p-3 text-emerald-700 font-bold">clinician (GMC-7654321)</td>
                    <td className="p-3 font-semibold text-slate-900">NOTE_SIGN_AND_LOCK</td>
                    <td className="p-3 font-bold text-sky-700">NG (Primary)</td>
                    <td className="p-3 text-[11px] text-slate-500 truncate max-w-xs">
                      7d8a9f3b1e2c4d5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-600">2026-09-03 08:15:20</td>
                    <td className="p-3 text-[#0D746F] font-bold">patient (CVH-2026-0001)</td>
                    <td className="p-3 font-semibold text-slate-900">WAITING_ROOM_JOIN</td>
                    <td className="p-3 font-bold text-sky-700">NG</td>
                    <td className="p-3 text-[11px] text-slate-500 truncate max-w-xs">
                      a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
