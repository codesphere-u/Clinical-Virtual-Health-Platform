'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldCheck,
  Globe,
  Settings,
  Activity,
  Bell,
  Search,
  ChevronRight,
  Zap,
  Lock,
  LogOut,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  sub?: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Command Centre', icon: LayoutDashboard, sub: 'Live operational overview' },
  { href: '/clinicians', label: 'Clinician Roster', icon: UserCheck, sub: 'Verification & licensing', badge: 3 },
  { href: '/users', label: 'Patient Registry', icon: Users, sub: 'User & account management' },
  { href: '/audit', label: 'Audit Vault', icon: ShieldCheck, sub: 'SHA-256 immutable chain' },
  { href: '/compliance', label: 'Compliance Centre', icon: Globe, sub: 'NDPA 2023 · UK GDPR' },
  { href: '/settings', label: 'Platform Settings', icon: Settings, sub: 'Configuration & access' },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const now = new Date();

  return (
    <div className="admin-shell">
      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside className="admin-sidebar" aria-label="Admin navigation">
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div className="admin-logo-mark">
            <Lock style={{ width: 14, height: 14 }} />
          </div>
          <div>
            <p className="admin-logo-title">DOCAAS Admin</p>
            <p className="admin-logo-sub">Command Centre</p>
          </div>
        </div>

        {/* Live Telemetry Strip */}
        <div className="admin-telemetry-strip">
          <div className="admin-telemetry-row">
            <span className="admin-telemetry-label">Platform Status</span>
            <span className="admin-pulse-dot" />
          </div>
          <div className="admin-health-bar">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="admin-health-segment"
                style={{ background: i < 13 ? '#10b981' : '#f59e0b' }}
              />
            ))}
          </div>
          <p className="admin-telemetry-detail">API 99.4% · DB 100% · Video SFU 99.1%</p>
        </div>

        {/* Main Navigation */}
        <nav className="admin-nav-section" aria-label="Primary navigation">
          <p className="admin-nav-section-label">Operations</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="admin-nav-icon-wrap">
                  <Icon style={{ width: 15, height: 15 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="admin-nav-item-label">{item.label}</p>
                  {item.sub && <p className="admin-nav-item-sub">{item.sub}</p>}
                </div>
                {item.badge && (
                  <span className="admin-nav-badge">{item.badge}</span>
                )}
                {isActive && (
                  <ChevronRight style={{ width: 13, height: 13, opacity: 0.5, flexShrink: 0 }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-live-stat">
            <Activity style={{ width: 11, height: 11, color: '#10b981' }} />
            <span><span style={{ color: '#10b981', fontWeight: 700 }}>14</span> live sessions</span>
          </div>
          <div className="admin-live-stat">
            <Zap style={{ width: 11, height: 11, color: '#f59e0b' }} />
            <span><span style={{ color: '#f59e0b', fontWeight: 700 }}>3</span> pending verifications</span>
          </div>
          <div className="admin-user-row">
            <div className="admin-avatar">SA</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="admin-user-name">Super Administrator</p>
              <p className="admin-user-role">admin@docaas.health</p>
            </div>
            <button
              className="admin-icon-btn"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Area ───────────────────────────────────── */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            {searchOpen ? (
              <div className="admin-search-bar">
                <Search style={{ width: 14, height: 14, color: '#94a3b8' }} />
                <input
                  autoFocus
                  placeholder="Search clinicians, patients, audit events…"
                  onBlur={() => setSearchOpen(false)}
                  className="admin-search-input"
                  aria-label="Global search"
                />
              </div>
            ) : (
              <button
                className="admin-header-search-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Search style={{ width: 14, height: 14 }} />
                <span>Search…</span>
                <kbd className="admin-kbd">⌘K</kbd>
              </button>
            )}
          </div>

          <div className="admin-header-right">
            <div className="admin-jurisdiction-badge uk">UK · GMC</div>
            <div className="admin-jurisdiction-badge ng">NG · MDCN</div>
            <button className="admin-icon-btn" aria-label="Notifications" style={{ position: 'relative' }}>
              <Bell style={{ width: 16, height: 16 }} />
              <span className="admin-notification-dot" />
            </button>
            <div className="admin-header-clock" aria-label="Current time">
              <span style={{ color: '#10b981', fontWeight: 700 }}>●</span>&nbsp;
              {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-page-body" id="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
