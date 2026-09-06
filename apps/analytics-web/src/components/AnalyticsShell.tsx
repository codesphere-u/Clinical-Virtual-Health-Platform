'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  Pill,
  Globe,
  ShieldCheck,
  Activity,
  ChevronRight,
  BarChart3,
  Lock,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  sub?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Overview', icon: LayoutDashboard, sub: 'KPI Dashboard' },
  { href: '/consultations', label: 'Consultation Volume', icon: Stethoscope, sub: 'By specialty & clinician' },
  { href: '/prescriptions', label: 'Prescription Safety', icon: Pill, sub: 'Allergy blocks & formulary' },
  { href: '/cross-border', label: 'Cross-Border', icon: Globe, sub: 'NDPA 2023 / UK GDPR' },
  { href: '/audit', label: 'Audit Vault Integrity', icon: ShieldCheck, sub: 'SHA-256 chain verification' },
];

interface AnalyticsShellProps {
  children: React.ReactNode;
}

export function AnalyticsShell({ children }: AnalyticsShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      {/* ─── Sidebar ─────────────────────────────────────── */}
      <nav className="sidebar" aria-label="Analytics Navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <BarChart3 style={{ width: 14, height: 14 }} />
          </div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">DOCAAS Analytics</span>
            <span className="sidebar-logo-sub">Executive Intelligence</span>
          </div>
        </div>

        {/* System Health Strip */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569' }}>
              System Status
            </span>
            <span className="pulse-dot" style={{ background: '#10b981' }} />
          </div>
          <div className="health-bar">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="health-bar-segment"
                style={{ background: i < 11 ? '#10b981' : '#f59e0b' }}
              />
            ))}
          </div>
          <p style={{ fontSize: 9, color: '#475569', marginTop: 4, fontFamily: 'monospace', margin: '4px 0 0' }}>
            API 99.2% · DB 100% · SFU 99.8%
          </p>
        </div>

        {/* Main Navigation */}
        <div className="sidebar-section" style={{ flex: 1 }}>
          <p className="sidebar-section-label">Reports</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                id={`nav-${item.href.replace('/', '') || 'overview'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="nav-icon" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </div>
                  {item.sub && (
                    <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.sub}
                    </div>
                  )}
                </div>
                {isActive && <ChevronRight className="nav-icon" style={{ opacity: 0.6, flexShrink: 0 }} />}
              </Link>
            );
          })}
        </div>

        {/* Live Telemetry Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity style={{ width: 12, height: 12, color: '#10b981' }} />
            <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>14</span> live consultations
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe style={{ width: 12, height: 12, color: '#0ea5e9' }} />
            <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>
              <span style={{ color: '#0ea5e9', fontWeight: 700 }}>31</span> cross-border transfers
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <Lock style={{ width: 10, height: 10, color: '#475569' }} />
            <span style={{ fontSize: 9, color: '#334155', fontFamily: 'monospace' }}>Encrypted · Read-only portal</span>
          </div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>
              AD
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin Director</p>
              <p style={{ fontSize: 9, color: '#475569', margin: '1px 0 0' }}>Super Administrator</p>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Main Content Area ───────────────────────────── */}
      <div className="main-content">
        {/* Top Header Bar */}
        <header className="page-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <h1 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
              {NAV_ITEMS.find(n => n.href === '/' ? pathname === '/' : pathname.startsWith(n.href))?.label ?? 'Analytics'}
            </h1>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>
              DOCAAS Clinical Analytics · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.25)', fontWeight: 700 }}>UK · GMC</span>
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 700 }}>NG · MDCN</span>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>
              {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC
            </span>
          </div>
        </header>

        {/* Page Body */}
        <main className="page-body" id="analytics-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
