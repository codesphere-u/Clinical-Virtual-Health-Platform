'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications' | 'security'>('profile');
  const [savedToast, setSavedToast] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('Sarah Okafor');
  const [email, setEmail] = useState('sarah.okafor@example.com');
  const [phoneNG, setPhoneNG] = useState('+234 803 123 4567');
  const [phoneUK, setPhoneUK] = useState('+44 7700 900123');
  const [ninNumber, setNinNumber] = useState('48291049281');
  const [nhsNumber, setNhsNumber] = useState('943 281 9021');
  const [kinName, setKinName] = useState('Emeka Okafor');
  const [kinPhone, setKinPhone] = useState('+234 802 987 6543');
  const [kinRelation, setKinRelation] = useState('Spouse');

  // Privacy toggles
  const [consentNDPA, setConsentNDPA] = useState(true);
  const [consentGDPR, setConsentGDPR] = useState(true);
  const [consentRecording, setConsentRecording] = useState(true);
  const [consentAuditSharing, setConsentAuditSharing] = useState(true);

  // Notification toggles
  const [notifWhatsApp, setNotifWhatsApp] = useState(true);
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast */}
      {savedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0d746f',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-elevated)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
          }}
        >
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Preferences saved successfully.</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Account & Privacy Settings
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
          Manage your dual-jurisdiction profile, regulatory consents (NDPA / UK GDPR), and communication channels.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            color: activeTab === 'profile' ? 'var(--aura-teal)' : 'var(--text-muted)',
            borderBottom: activeTab === 'profile' ? '2px solid var(--aura-teal)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Patient Profile
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            color: activeTab === 'privacy' ? 'var(--aura-teal)' : 'var(--text-muted)',
            borderBottom: activeTab === 'privacy' ? '2px solid var(--aura-teal)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Data Privacy & Consent
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            color: activeTab === 'notifications' ? 'var(--aura-teal)' : 'var(--text-muted)',
            borderBottom: activeTab === 'notifications' ? '2px solid var(--aura-teal)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            color: activeTab === 'security' ? 'var(--aura-teal)' : 'var(--text-muted)',
            borderBottom: activeTab === 'security' ? '2px solid var(--aura-teal)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Security & 2FA
        </button>
      </div>

      {/* ─── TAB: PROFILE ─── */}
      {activeTab === 'profile' && (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 20px 0' }}>
            Personal Demographics & Clinical Identification
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Nigerian Phone (WAT)
              </label>
              <input
                type="tel"
                value={phoneNG}
                onChange={(e) => setPhoneNG(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                UK / Roaming Phone (BST)
              </label>
              <input
                type="tel"
                value={phoneUK}
                onChange={(e) => setPhoneUK(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Nigeria National Identity Number (NIN)
              </label>
              <input
                type="text"
                value={ninNumber}
                onChange={(e) => setNinNumber(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                UK NHS Number (if applicable)
              </label>
              <input
                type="text"
                value={nhsNumber}
                onChange={(e) => setNhsNumber(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: '24px 0 14px 0' }}>
            Emergency Contact / Next of Kin
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Name
              </label>
              <input
                type="text"
                value={kinName}
                onChange={(e) => setKinName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Emergency Phone
              </label>
              <input
                type="tel"
                value={kinPhone}
                onChange={(e) => setKinPhone(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Relationship
              </label>
              <input
                type="text"
                value={kinRelation}
                onChange={(e) => setKinRelation(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px' }}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              background: 'var(--aura-teal)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      )}

      {/* ─── TAB: DATA PRIVACY & REGULATORY CONSENT ─── */}
      {activeTab === 'privacy' && (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            Data Privacy & Regulatory Consent Framework
          </h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            DOCAAS operates under the Nigeria Data Protection Act 2023 (NDPA) and UK General Data Protection Regulation (UK GDPR).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>NDPA 2023 Health Data Processing</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Authorizes DOCAAS to securely store and process medical health records within Nigeria and compliant data zones.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consentNDPA}
                onChange={(e) => setConsentNDPA(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </div>

            <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Cross-Border Transfer to UK GMC Clinicians</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Enables encrypted transfer of consultation history to GMC-registered consultants practicing in the United Kingdom.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consentGDPR}
                onChange={(e) => setConsentGDPR(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </div>

            <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Clinical Telehealth Recording Consent</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Allow secure recording of telemedicine encounters for patient safety, clinical audit, and AI ambient scribe transcription.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consentRecording}
                onChange={(e) => setConsentRecording(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </div>

            <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Bilateral Clinical Audit Log Sharing</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Permit sharing of cryptographic encounter integrity logs with regulating bodies (MDCN & GMC) upon verified request.
                </p>
              </div>
              <input
                type="checkbox"
                checked={consentAuditSharing}
                onChange={(e) => setConsentAuditSharing(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              background: 'var(--aura-teal)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Save size={16} />
            <span>Update Consent Preferences</span>
          </button>
        </div>
      )}

      {/* ─── TAB: NOTIFICATIONS ─── */}
      {activeTab === 'notifications' && (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            Appointment Reminders & Communication Channels
          </h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Choose how you receive appointment links, lab release notifications, and prescription alerts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>WhatsApp Instant Alerts</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Receive video room access links and 15-minute countdown reminders directly on WhatsApp.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifWhatsApp}
                onChange={(e) => setNotifWhatsApp(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </div>

            <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>SMS Text Messages</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Fall-back SMS dispatched for high-priority clinical notifications or pharmacy pickups.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifSMS}
                onChange={(e) => setNotifSMS(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </div>

            <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Email Clinical Summaries</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Receive encrypted PDF summaries of doctor consultations and invoice receipts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifEmail}
                onChange={(e) => setNotifEmail(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              background: 'var(--aura-teal)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Save size={16} />
            <span>Save Channels</span>
          </button>
        </div>
      )}

      {/* ─── TAB: SECURITY & 2FA ─── */}
      {activeTab === 'security' && (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            Security & Authentication
          </h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Protect your sensitive electronic health records with multi-factor authentication.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#065f46' }}>Two-Factor Authentication (2FA) Active</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#047857' }}>
                  SMS OTP verification enabled for your registered phone number (+234 803 123 4567).
                </p>
              </div>
              <span className="badge-status success">Protected</span>
            </div>

            <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Active Sessions</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Current login: Chrome on Windows 11 (Lagos, Nigeria) • IP 102.89.x.x
                </p>
              </div>
              <button
                onClick={() => alert('Logged out of other active sessions.')}
                style={{
                  padding: '8px 14px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sign Out Other Devices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
