'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Video,
  Key,
  Save,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Lock,
  AlertTriangle,
} from 'lucide-react';

interface ToggleRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  id: string;
}

function ToggleRow({ label, description, enabled, onChange, id }: ToggleRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{label}</p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
      >
        {enabled
          ? <ToggleRight style={{ width: 32, height: 32, color: '#0d746f' }} />
          : <ToggleLeft style={{ width: 32, height: 32, color: '#cbd5e1' }} />
        }
      </button>
    </div>
  );
}

interface Section {
  key: string;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: Section[] = [
  { key: 'general', label: 'General', icon: Settings },
  { key: 'security', label: 'Security & Access', icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'telemedicine', label: 'Telemedicine', icon: Video },
  { key: 'jurisdictions', label: 'Jurisdictions', icon: Globe },
  { key: 'api', label: 'API Keys', icon: Key },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  // General settings state
  const [platformName, setPlatformName] = useState('DOCAAS Virtual Health Platform');
  const [supportEmail, setSupportEmail] = useState('support@docaas.health');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security settings
  const [mfaRequired, setMfaRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [ipAllowlist, setIpAllowlist] = useState(false);
  const [auditSealing, setAuditSealing] = useState(true);

  // Notification settings
  const [credentialAlerts, setCredentialAlerts] = useState(true);
  const [breachAlerts, setBreachAlerts] = useState(true);
  const [consultationAlerts, setConsultationAlerts] = useState(false);
  const [complianceDigest, setComplianceDigest] = useState(true);

  // Telemedicine settings
  const [maxCallDuration, setMaxCallDuration] = useState('60');
  const [videoRecording, setVideoRecording] = useState(false);
  const [aiScribe, setAiScribe] = useState(true);
  const [crossBorderEnabled, setCrossBorderEnabled] = useState(true);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>Platform Name</p>
              <input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                id="setting-platform-name"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>Support Email</p>
              <input
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                type="email"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                id="setting-support-email"
              />
            </div>
            <ToggleRow
              id="toggle-maintenance"
              label="Maintenance Mode"
              description="Temporarily takes the platform offline for maintenance. A maintenance page is shown to all users."
              enabled={maintenanceMode}
              onChange={setMaintenanceMode}
            />
            {maintenanceMode && (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 8, marginTop: 12 }}>
                <AlertTriangle style={{ width: 16, height: 16, color: '#92400e', flexShrink: 0, marginTop: 1 }} />
                <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>
                  <strong>Warning:</strong> Enabling maintenance mode will immediately block all patient and clinician access. Ensure any active consultations are completed before enabling.
                </p>
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div>
            <ToggleRow
              id="toggle-mfa"
              label="Enforce MFA for All Clinicians"
              description="Require Time-based OTP (TOTP) or hardware key for all clinical portal logins. NDPA 2023 Art. 40 compliant."
              enabled={mfaRequired}
              onChange={setMfaRequired}
            />
            <ToggleRow
              id="toggle-audit-sealing"
              label="SHA-256 Audit Sealing"
              description="Cryptographically seal every audit log entry with a SHA-256 hash chain. Tamper-evident and GDPR Art. 30 compliant."
              enabled={auditSealing}
              onChange={setAuditSealing}
            />
            <ToggleRow
              id="toggle-ip-allowlist"
              label="IP Allowlist (Admin Access)"
              description="Restrict admin portal access to pre-approved IP address ranges only."
              enabled={ipAllowlist}
              onChange={setIpAllowlist}
            />
            <div style={{ paddingTop: 16 }}>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>Session Timeout (minutes)</p>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: '#0f172a', outline: 'none', background: 'white', fontFamily: 'Inter, sans-serif', minWidth: 200 }}
                id="setting-session-timeout"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <ToggleRow
              id="toggle-cred-alerts"
              label="Credential Verification Alerts"
              description="Notify admins when a new clinician credential submission requires review."
              enabled={credentialAlerts}
              onChange={setCredentialAlerts}
            />
            <ToggleRow
              id="toggle-breach-alerts"
              label="Security Breach Alerts"
              description="Immediate notifications for failed login surges, suspicious access patterns, or data breach incidents."
              enabled={breachAlerts}
              onChange={setBreachAlerts}
            />
            <ToggleRow
              id="toggle-consult-alerts"
              label="Consultation Anomaly Alerts"
              description="Alerts when consultation sessions exceed configured duration thresholds or experience technical failures."
              enabled={consultationAlerts}
              onChange={setConsultationAlerts}
            />
            <ToggleRow
              id="toggle-compliance-digest"
              label="Weekly Compliance Digest"
              description="Send a weekly regulatory compliance summary email to the DPO and admin team."
              enabled={complianceDigest}
              onChange={setComplianceDigest}
            />
          </div>
        );

      case 'telemedicine':
        return (
          <div>
            <ToggleRow
              id="toggle-ai-scribe"
              label="AI Clinical Scribe"
              description="Enable ambient AI transcription and SOAP note generation during consultations. Clinician review required before sealing."
              enabled={aiScribe}
              onChange={setAiScribe}
            />
            <ToggleRow
              id="toggle-cross-border"
              label="Cross-Border Consultations (NG ↔ UK)"
              description="Allow clinicians registered in one jurisdiction to serve patients in the other, subject to SCC data transfer agreements."
              enabled={crossBorderEnabled}
              onChange={setCrossBorderEnabled}
            />
            <ToggleRow
              id="toggle-recording"
              label="Session Recording"
              description="Record video consultations with explicit patient consent for quality assurance. Stored encrypted, deleted after 90 days."
              enabled={videoRecording}
              onChange={setVideoRecording}
            />
            <div style={{ paddingTop: 16 }}>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>Maximum Consultation Duration (minutes)</p>
              <select
                value={maxCallDuration}
                onChange={(e) => setMaxCallDuration(e.target.value)}
                style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: '#0f172a', outline: 'none', background: 'white', fontFamily: 'Inter, sans-serif', minWidth: 200 }}
                id="setting-max-duration"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
          </div>
        );

      case 'jurisdictions':
        return (
          <div>
            {[
              { key: 'uk', flag: '🇬🇧', name: 'United Kingdom', body: 'General Medical Council (GMC)', law: 'UK GDPR · Data Protection Act 2018', active: true },
              { key: 'ng', flag: '🇳🇬', name: 'Nigeria', body: 'Medical & Dental Council of Nigeria (MDCN)', law: 'NDPA 2023 · NDPC Guidelines', active: true },
            ].map((j) => (
              <div key={j.key} style={{ padding: '16px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 16 }}>
                <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{j.flag}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{j.name}</p>
                    {j.active && <span className="badge badge-verified">Active</span>}
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: 13, color: '#64748b' }}>Licensing: {j.body}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Lock style={{ width: 10, height: 10 }} /> {j.law}
                  </p>
                </div>
              </div>
            ))}
            <p style={{ margin: '16px 0 0', fontSize: 12, color: '#94a3b8' }}>
              To add a new jurisdiction, contact the DOCAAS compliance team to complete the required regulatory assessments.
            </p>
          </div>
        );

      case 'api':
        return (
          <div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 8 }}>
              <Lock style={{ width: 14, height: 14, color: '#64748b', flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>API keys are masked for security. Copy them upon creation — they cannot be retrieved afterwards.</p>
            </div>
            {[
              { name: 'LiveKit SFU', key: 'lk_prod_•••••••••••••••••••••••••••••••••••••', scope: 'Video Room Management', created: '2026-01-15', status: 'Active' },
              { name: 'NDPC API', key: 'ndpc_•••••••••••••••••••••••••••••', scope: 'Compliance Reporting', created: '2026-03-01', status: 'Active' },
              { name: 'AI Scribe (Gemini)', key: 'AIzaSy•••••••••••••••••••••••••••••••', scope: 'Clinical NLP Transcription', created: '2026-06-20', status: 'Active' },
            ].map((api) => (
              <div key={api.name} style={{ padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{api.name}</p>
                  <span className="badge badge-verified">{api.status}</span>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontFamily: 'monospace', color: '#64748b', letterSpacing: '0.02em' }}>{api.key}</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Scope: {api.scope}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Created: {api.created}</p>
                </div>
              </div>
            ))}
            <button style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 8, border: 'none', background: '#0d746f', fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}>
              <Key style={{ width: 14, height: 14 }} /> Generate New API Key
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="admin-page-title">Platform Settings</h1>
          <p className="admin-page-subtitle">System configuration, security policies, and integration management</p>
        </div>
        <button
          onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: saved ? '#10b981' : '#0d746f', fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer', transition: 'background 0.2s ease' }}
          id="btn-save-settings"
        >
          {saved ? <><CheckCircle2 style={{ width: 14, height: 14 }} /> Saved!</> : <><Save style={{ width: 14, height: 14 }} /> Save Changes</>}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Sidebar Nav */}
        <div style={{ width: 200, flexShrink: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 8 }}>
          {SECTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              id={`settings-tab-${key}`}
              onClick={() => setActiveSection(key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left', fontSize: 13, fontWeight: 600, background: activeSection === key ? '#f0fdf9' : 'transparent', color: activeSection === key ? '#0d746f' : '#64748b' }}
            >
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {label}
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
            {SECTIONS.find(s => s.key === activeSection)?.label}
          </h2>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
