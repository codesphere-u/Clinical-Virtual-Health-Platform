'use client';

import React from 'react';
import {
  LayoutDashboard,
  Stethoscope,
  Pill,
  Globe,
  ShieldCheck,
  Activity,
  ChevronRight,
} from 'lucide-react';

export type ReportKey =
  | 'overview'
  | 'consultations'
  | 'prescriptions'
  | 'cross-border'
  | 'audit';

interface SidebarProps {
  activeReport: ReportKey;
  onNavigate: (report: ReportKey) => void;
}

const NAV_ITEMS: {
  key: ReportKey;
  label: string;
  icon: React.ElementType;
  sub?: string;
}[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, sub: 'KPI Dashboard' },
  { key: 'consultations', label: 'Consultation Volume', icon: Stethoscope, sub: 'By specialty & clinician' },
  { key: 'prescriptions', label: 'Prescription Safety', icon: Pill, sub: 'Allergy blocks & formulary' },
  { key: 'cross-border', label: 'Cross-Border Compliance', icon: Globe, sub: 'NDPA 2023 / UK GDPR' },
  { key: 'audit', label: 'Audit Vault Integrity', icon: ShieldCheck, sub: 'SHA-256 chain verification' },
];

export function Sidebar({ activeReport, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Analytics Navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">DOC</div>
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
        <p style={{ fontSize: 9, color: '#475569', marginTop: 4, fontFamily: 'monospace' }}>
          API 99.2% • DB 100% • SFU 99.8%
        </p>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-section" style={{ flex: 1 }}>
        <p className="sidebar-section-label">Reports</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeReport === item.key;
          return (
            <button
              key={item.key}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
              id={`nav-${item.key}`}
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
            </button>
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
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>
            AD
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0' }}>Admin Director</p>
            <p style={{ fontSize: 9, color: '#475569' }}>Super Administrator</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
