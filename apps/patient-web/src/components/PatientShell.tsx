'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Pill,
  Activity,
  Settings,
  ShieldCheck,
  PhoneCall,
  AlertTriangle,
  Clock,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/records', label: 'Medical Records', icon: FileText },
  { href: '/prescriptions', label: 'Prescriptions', icon: Pill },
  { href: '/lab-results', label: 'Lab & Diagnostics', icon: Activity },
  { href: '/settings', label: 'Settings & Privacy', icon: Settings },
];

export function PatientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell-container">
      {/* ─── Persistent Left Navigation Sidebar ─── */}
      <aside className="shell-sidebar">
        {/* Brand Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="patient-brand-icon">D+</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              DOCAAS
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--aura-teal)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Virtual Care
            </div>
          </div>
        </div>

        {/* Dual Jurisdiction Badge */}
        <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#0d746f" />
            <span>MDCN (NG) • GMC (UK)</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Emergency SOS Help Box */}
        <div style={{ padding: '16px', margin: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 700, fontSize: '12px', marginBottom: '6px' }}>
            <AlertTriangle size={15} />
            <span>Emergency Medical Need?</span>
          </div>
          <p style={{ fontSize: '11px', color: '#7f1d1d', lineHeight: 1.4, margin: 0, marginBottom: '10px' }}>
            For acute emergencies, call 112 (Nigeria) or 999 (UK) immediately.
          </p>
          <a
            href="tel:112"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#dc2626',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontSize: '11px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <PhoneCall size={13} />
            <span>Emergency SOS</span>
          </a>
        </div>

        {/* Patient Profile Snapshot Footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#0d746f',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            SO
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Sarah Okafor
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NHS/NIN: #7492-NG</div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <div className="shell-main-area">
        {/* Top Emergency Strip */}
        <div
          style={{
            background: '#fffbeb',
            borderBottom: '1px solid #fde68a',
            padding: '7px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#92400e',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={14} color="#d97706" />
            <span>
              <strong>Clinical Advisory:</strong> DOCAAS virtual consultations are for non-emergency clinical care. If you have chest pain, severe shortness of breath, or uncontrolled bleeding, seek emergency care immediately.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 600 }}>
            <span>🇳🇬 Lagos: 112</span>
            <span>🇬🇧 UK: 999</span>
          </div>
        </div>

        {/* Top Header */}
        <header
          style={{
            height: '60px',
            background: '#ffffff',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span className="live-indicator-dot" />
              <span><strong>14 Specialists Online</strong> across Lagos & London</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              <span>WAT & BST Dual Time Support</span>
            </div>
            <Link
              href="/appointments"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'var(--aura-teal)',
                color: '#ffffff',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(13, 116, 111, 0.25)',
              }}
            >
              <Calendar size={15} />
              <span>Book Appointment</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
