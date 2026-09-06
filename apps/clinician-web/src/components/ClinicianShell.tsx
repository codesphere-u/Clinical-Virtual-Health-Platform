'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Calendar,
  Users,
  FileText,
  ShieldCheck,
  Clock,
  Lock,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
  { href: '/consultation', label: 'Consultation Room', icon: Video, badge: 'READY' },
  { href: '/schedule', label: 'Schedule & Slots', icon: Calendar },
  { href: '/patients', label: 'Patient Directory', icon: Users },
  { href: '/history', label: 'Encounter History', icon: FileText },
];

export function ClinicianShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [watTime, setWatTime] = useState('');
  const [bstTime, setBstTime] = useState('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setWatTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }));
      setBstTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }));
    };
    updateTimes();
    const interval = setInterval(updateTimes, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clinician-shell-container">
      {/* ─── Persistent Workstation Sidebar ─── */}
      <aside className="clinician-sidebar">
        {/* Brand & Clinician License Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--ws-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0d746f 0%, #14b8a6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '14px',
              }}
            >
              C+
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                DOCAAS
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Clinician Workstation
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--ws-muted)', lineHeight: 1.3 }}>
            <strong>Dr. Elizabeth Adeyemi</strong>, MD, FWACP
            <div style={{ fontSize: '10px', color: 'var(--ws-dim)', marginTop: '2px' }}>
              GMC #7654321 • MDCN #48291
            </div>
          </div>
        </div>

        {/* Dual Telehealth Regulatory Badge */}
        <div style={{ padding: '10px 16px', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--ws-border)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#2dd4bf' }}>
          <ShieldCheck size={14} />
          <span>Cross-Border License Active</span>
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
                className={`clinician-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Telehealth Signaling Status */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--ws-border)', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#10b981', fontWeight: 600, marginBottom: '4px' }}>
            <span className="pulse-dot" style={{ background: '#10b981' }} />
            <span>WebRTC Gateway Active</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ws-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={10} />
            <span>DTLS 256-bit • RTT: 18ms</span>
          </div>
        </div>
      </aside>

      {/* ─── Main Viewport Area ─── */}
      <div className="clinician-main-viewport">
        {/* Workstation Top Navigation Bar */}
        <header
          style={{
            height: '56px',
            background: 'var(--ws-surface)',
            borderBottom: '1px solid var(--ws-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          {/* Dual Time Zones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ws-muted)' }}>
              <Clock size={14} color="#2dd4bf" />
              <span>Lagos (WAT): <strong style={{ color: '#ffffff' }}>{watTime || '14:00'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ws-muted)' }}>
              <Clock size={14} color="#38bdf8" />
              <span>London (BST): <strong style={{ color: '#ffffff' }}>{bstTime || '14:00'}</strong></span>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '9999px',
                fontSize: '11px',
                color: '#34d399',
                fontWeight: 600,
              }}
            >
              <span className="pulse-dot" style={{ background: '#10b981', width: '6px', height: '6px' }} />
              <span>On Duty • Available</span>
            </div>

            <Link
              href="/consultation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: '#0d746f',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(13, 116, 111, 0.4)',
              }}
            >
              <Video size={14} />
              <span>Enter Consultation</span>
            </Link>
          </div>
        </header>

        {/* Viewport Content */}
        <main style={{ flex: 1, padding: pathname === '/consultation' ? '0' : '28px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
