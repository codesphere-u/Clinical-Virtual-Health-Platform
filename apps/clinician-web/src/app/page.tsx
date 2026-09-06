'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

interface QueuePatient {
  id: string;
  name: string;
  ageGender: string;
  reason: string;
  waitDuration: string;
  urgency: 'urgent' | 'routine';
  bp: string;
  hr: string;
  allergies: string[];
}

const UPCOMING_QUEUE: QueuePatient[] = [
  {
    id: 'p1',
    name: 'Olumide Babalola',
    ageGender: '42M',
    reason: 'Hypertension Review & Medication Adjustment',
    waitDuration: '4 min',
    urgency: 'urgent',
    bp: '142/90 mmHg',
    hr: '76 bpm',
    allergies: ['Penicillin (Anaphylaxis)'],
  },
  {
    id: 'p2',
    name: 'Amina Bello',
    ageGender: '29F',
    reason: 'Thyroid Panel & Levothyroxine Dose Check',
    waitDuration: '8 min',
    urgency: 'routine',
    bp: '118/76 mmHg',
    hr: '68 bpm',
    allergies: ['None Documented'],
  },
  {
    id: 'p3',
    name: 'Chukwuma Obi',
    ageGender: '55M',
    reason: 'Post-ECG Arrhythmia Assessment',
    waitDuration: '14 min',
    urgency: 'routine',
    bp: '135/85 mmHg',
    hr: '82 bpm',
    allergies: ['Sulfa drugs'],
  },
];

export default function ClinicianDashboard() {
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'urgent' | 'routine'>('all');

  const filteredQueue = UPCOMING_QUEUE.filter(
    (p) => filterUrgency === 'all' || p.urgency === filterUrgency
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* ─── Hero Overview Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Clinician Duty Overview
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ws-muted)' }}>
            Lagos & London Telemedicine Sessions • Dr. Elizabeth Adeyemi (GMC #7654321 • MDCN #48291)
          </p>
        </div>

        <Link
          href="/consultation"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            background: 'linear-gradient(135deg, #0d746f 0%, #14b8a6 100%)',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(13, 116, 111, 0.4)',
          }}
        >
          <Video size={17} />
          <span>Launch Consultation Room</span>
        </Link>
      </div>

      {/* ─── Key Clinical Metrics ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--ws-surface)', borderRadius: '12px', border: '1px solid var(--ws-border)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ws-muted)' }}>Patients Scheduled Today</span>
            <Users size={16} color="#2dd4bf" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9' }}>6</span>
            <span style={{ fontSize: '14px', color: 'var(--ws-muted)' }}>/ 10 completed</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} />
            <span>On schedule (average 18m / consult)</span>
          </div>
        </div>

        <div style={{ background: 'var(--ws-surface)', borderRadius: '12px', border: '1px solid var(--ws-border)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ws-muted)' }}>Pending SOAP Sign-offs</span>
            <FileText size={16} color="#38bdf8" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9' }}>1</span>
            <span style={{ fontSize: '12px', color: '#f59e0b' }}>Awaiting lock & seal</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ws-muted)' }}>
            Babatunde Adeleke (13:30 WAT)
          </div>
        </div>

        <div style={{ background: 'var(--ws-surface)', borderRadius: '12px', border: '1px solid var(--ws-border)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ws-muted)' }}>E-Prescriptions Authorized</span>
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9' }}>8</span>
            <span style={{ fontSize: '12px', color: 'var(--ws-muted)' }}>cross-border orders</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ws-muted)' }}>
            All verified against patient allergy profiles
          </div>
        </div>

        <div style={{ background: 'var(--ws-surface)', borderRadius: '12px', border: '1px solid var(--ws-border)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ws-muted)' }}>Telehealth Gateway</span>
            <ShieldCheck size={16} color="#2dd4bf" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>18 ms</span>
            <span style={{ fontSize: '12px', color: 'var(--ws-muted)' }}>Latency (Lagos SFU)</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#2dd4bf' }}>
            DTLS-SRTP 256-bit encryption verified
          </div>
        </div>
      </div>

      {/* ─── Active Spotlight: Next Patient in Waiting Room ─── */}
      {UPCOMING_QUEUE.length > 0 && UPCOMING_QUEUE[0] && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(13, 116, 111, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(13, 116, 111, 0.45)',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="pulse-dot" style={{ background: '#ef4444' }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Immediate Patient Waiting in Queue
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>
              {UPCOMING_QUEUE[0].name} ({UPCOMING_QUEUE[0].ageGender})
            </h2>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ws-muted)' }}>
              Reason: <strong>{UPCOMING_QUEUE[0].reason}</strong> • Waiting: <strong style={{ color: '#fca5a5' }}>{UPCOMING_QUEUE[0].waitDuration}</strong>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
              <span style={{ color: '#fca5a5' }}>BP: <strong>{UPCOMING_QUEUE[0].bp} (Elevated)</strong></span>
              <span style={{ color: 'var(--ws-dim)' }}>•</span>
              <span style={{ color: '#34d399' }}>HR: <strong>{UPCOMING_QUEUE[0].hr}</strong></span>
              <span style={{ color: 'var(--ws-dim)' }}>•</span>
              <span style={{ color: '#fca5a5' }}>Allergy: <strong>{UPCOMING_QUEUE[0].allergies[0] || 'None'}</strong></span>
            </div>
          </div>

          <Link
            href="/consultation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'var(--aura-teal)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(13, 116, 111, 0.5)',
            }}
          >
            <Video size={16} />
            <span>Admit to Consultation Room</span>
          </Link>
        </div>
      )}

      {/* ─── Virtual Patient Triage Queue Table ─── */}
      <div style={{ background: 'var(--ws-surface)', borderRadius: '16px', border: '1px solid var(--ws-border)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px 0' }}>
              Virtual Waiting Queue ({filteredQueue.length})
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ws-muted)' }}>
              Real-time patient check-ins across Nigerian and UK telemedicine corridors.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilterUrgency('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--ws-border)',
                background: filterUrgency === 'all' ? 'rgba(13, 116, 111, 0.3)' : 'transparent',
                color: filterUrgency === 'all' ? '#2dd4bf' : 'var(--ws-muted)',
                cursor: 'pointer',
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilterUrgency('urgent')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--ws-border)',
                background: filterUrgency === 'urgent' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                color: filterUrgency === 'urgent' ? '#fca5a5' : 'var(--ws-muted)',
                cursor: 'pointer',
              }}
            >
              Urgent Priority
            </button>
            <button
              onClick={() => setFilterUrgency('routine')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--ws-border)',
                background: filterUrgency === 'routine' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                color: filterUrgency === 'routine' ? '#7dd3fc' : 'var(--ws-muted)',
                cursor: 'pointer',
              }}
            >
              Routine
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ws-border)', color: 'var(--ws-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Patient Name</th>
                <th style={{ padding: '10px 14px' }}>Clinical Reason</th>
                <th style={{ padding: '10px 14px' }}>Wait Duration</th>
                <th style={{ padding: '10px 14px' }}>Triage Urgency</th>
                <th style={{ padding: '10px 14px' }}>Telemetry Baseline</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#f1f5f9' }}>
                    <div>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ws-muted)' }}>{p.ageGender}</div>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--ws-muted)', maxWidth: '280px' }}>
                    {p.reason}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--ws-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      <span>{p.waitDuration}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        background: p.urgency === 'urgent' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                        color: p.urgency === 'urgent' ? '#fca5a5' : '#7dd3fc',
                      }}
                    >
                      {p.urgency}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontSize: '12px' }}>
                    <div>BP: <strong style={{ color: p.urgency === 'urgent' ? '#fca5a5' : '#f1f5f9' }}>{p.bp}</strong></div>
                    <div style={{ color: 'var(--ws-dim)' }}>HR: {p.hr}</div>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <Link
                      href="/consultation"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        background: 'var(--aura-teal)',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <Video size={13} />
                      <span>Admit</span>
                    </Link>
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
