'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Video,
  Clock,
  ShieldCheck,
  FileText,
  Pill,
  Activity,
  ChevronRight,
  CheckCircle2,
  X,
  Lock,
  AlertCircle,
  Heart,
} from 'lucide-react';

interface Clinician {
  id: string;
  name: string;
  specialty: string;
  sub: string;
  credentials: string;
  rating: number;
  reviews: number;
  fee: string;
  nextSlot: string;
  location: string;
  photo: string;
  available: boolean;
  slots: string[];
}

const FEATURED_CLINICIANS: Clinician[] = [
  {
    id: 'c1',
    name: 'Dr. Elizabeth Adeyemi',
    specialty: 'Cardiology',
    sub: 'Hypertension & Cardiovascular Health',
    credentials: 'GMC #7654321 (UK) • MDCN Licensed',
    rating: 4.9,
    reviews: 142,
    fee: '₦25,000 / £35',
    nextSlot: 'Today, 14:00',
    location: 'London, UK',
    photo: 'https://images.unsplash.com/photo-1594824813681-ef0db325028c?w=200&h=200&fit=crop&auto=format',
    available: true,
    slots: ['Today, 14:00', 'Today, 15:30', 'Tomorrow, 09:00'],
  },
  {
    id: 'c2',
    name: 'Dr. Alistair Williams',
    specialty: 'General Practice',
    sub: 'Preventative Care & Chronic Diseases',
    credentials: 'GMC #6123456 (UK NHS)',
    rating: 4.8,
    reviews: 98,
    fee: '₦18,000 / £25',
    nextSlot: 'Today, 15:00',
    location: 'Manchester, UK',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&auto=format',
    available: true,
    slots: ['Today, 15:00', 'Tomorrow, 11:00', 'Friday, 16:00'],
  },
  {
    id: 'c3',
    name: 'Dr. Chidiebere Okafor',
    specialty: 'Endocrinology',
    sub: 'Diabetes Management & Thyroid Care',
    credentials: 'MDCN #34591 • West African College',
    rating: 5.0,
    reviews: 84,
    fee: '₦22,000 / £30',
    nextSlot: 'Today, 16:30',
    location: 'Abuja, NG',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&auto=format',
    available: true,
    slots: ['Today, 16:30', 'Tomorrow, 14:00', 'Thursday, 10:30'],
  },
];

export default function PatientDashboard() {
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [bookingToast, setBookingToast] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* ─── Toast Notification ─── */}
      {bookingToast && (
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
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{bookingToast}</span>
        </div>
      )}

      {/* ─── Hero Welcome & Status ─── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Welcome back, Sarah
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
            Your next virtual consultation is scheduled for today at 14:00 (WAT). Please review your vitals.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px 16px',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Clock size={14} color="#0d746f" />
            <span>Local Time: <strong>{currentTime || '13:45'}</strong></span>
          </div>
        </div>
      </div>

      {/* ─── Next Appointment Hero Card ─── */}
      <div className="appointment-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="live-indicator-dot" />
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                Upcoming Virtual Consultation
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
              Cardiology Review & Medication Check
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.85 }}>
              Dr. Elizabeth Adeyemi • GMC #7654321 • MDCN Registered Consultant
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} />
                <span>Today, 6 September 2026</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} />
                <span>14:00 - 14:30 WAT (starts in 15 mins)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} />
                <span>End-to-End Encrypted WebRTC Video</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
            <button
              onClick={() => setInWaitingRoom(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#ffffff',
                color: '#0d746f',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Video size={16} />
              <span>Join Waiting Room</span>
            </button>
            <Link
              href="/appointments"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              <span>Manage Booking</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Clinical Health Snapshot ─── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Health Snapshot & Clinical Summary
          </h3>
          <Link href="/records" style={{ fontSize: '13px', color: 'var(--aura-teal)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Full Health Profile</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Vitals Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Latest Vitals</span>
              <Heart size={16} color="#e11d48" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>124/82</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>mmHg</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Pulse: <strong>72 bpm</strong></span>
              <span>•</span>
              <span>SpO2: <strong>98%</strong></span>
              <span>•</span>
              <span>BMI: <strong>23.4</strong></span>
            </div>
          </div>

          {/* Active Prescriptions Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Active Medications</span>
              <Pill size={16} color="#0d746f" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>2 Active</div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Amlodipine 5mg (OD) • Metformin 500mg (BD)
            </p>
            <div style={{ marginTop: '10px' }}>
              <Link href="/prescriptions" style={{ fontSize: '12px', color: 'var(--aura-teal)', fontWeight: 600, textDecoration: 'none' }}>
                Manage Prescriptions →
              </Link>
            </div>
          </div>

          {/* Allergy & Safety Alert */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Allergies & Contraindications</span>
              <AlertCircle size={16} color="#d97706" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-status danger">Penicillin (Severe Anaphylaxis)</span>
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              All cross-border clinicians are alerted before prescribing.
            </p>
          </div>

          {/* Recent Lab Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Recent Lab Test</span>
              <Activity size={16} color="#2563eb" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>HbA1c: 6.2%</span>
              <span className="badge-status success">Normal Range</span>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Tested 24 Aug 2026 at Clinix Lagos
            </p>
            <div style={{ marginTop: '8px' }}>
              <Link href="/lab-results" style={{ fontSize: '12px', color: 'var(--aura-teal)', fontWeight: 600, textDecoration: 'none' }}>
                View Full Diagnostic Panel →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Quick Actions Navigation Grid ─── */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 14px 0' }}>
          Quick Services
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <Link href="/appointments" className="quick-action-tile" style={{ textDecoration: 'none' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: '#f0fdf9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="#0d746f" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Book Specialist</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>UK & Nigerian Consultants</div>
            </div>
          </Link>

          <Link href="/records" className="quick-action-tile" style={{ textDecoration: 'none' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Medical Records</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Consultations & SOAP Notes</div>
            </div>
          </Link>

          <Link href="/prescriptions" className="quick-action-tile" style={{ textDecoration: 'none' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={20} color="#c026d3" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Medications & Refills</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cross-border pharmacy dispatch</div>
            </div>
          </Link>

          <Link href="/lab-results" className="quick-action-tile" style={{ textDecoration: 'none' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#059669" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Diagnostic Reports</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>FBC, Lipids, Imaging</div>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── Available Specialists Spotlight ─── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Specialists Ready for Virtual Consultation
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Dual-licensed doctors verified with GMC (UK) and MDCN (Nigeria).
            </p>
          </div>
          <Link
            href="/appointments"
            style={{
              fontSize: '13px',
              color: 'var(--aura-teal)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All Doctors</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {FEATURED_CLINICIANS.map((c) => (
            <div key={c.id} className="clinician-profile-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <img src={c.photo} alt={c.name} className="clinician-avatar" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{c.name}</h4>
                      <ShieldCheck size={15} color="#0d746f" />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--aura-teal)', marginTop: '2px' }}>{c.specialty}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.credentials}</div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {c.sub}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Fee: </span>
                    <strong style={{ color: 'var(--text-main)' }}>{c.fee}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Next slot: </span>
                    <strong style={{ color: '#059669' }}>{c.nextSlot}</strong>
                  </div>
                </div>
              </div>

              <Link
                href={`/appointments?doctor=${c.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  background: 'var(--aura-teal)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Calendar size={14} />
                <span>Book Consultation</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Waiting Room Modal ─── */}
      {inWaitingRoom && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-indicator-dot" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Virtual Waiting Room
                </h3>
              </div>
              <button
                onClick={() => setInWaitingRoom(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <Video size={28} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                You are next in queue
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Dr. Elizabeth Adeyemi is finishing notes from the previous patient and will admit you in approximately 2 minutes.
              </p>
            </div>

            {/* Diagnostic Pre-flight Checks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Camera & Microphone</span>
                <span className="badge-status success"><CheckCircle2 size={13} /> Active & Ready</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Connection Latency</span>
                <span className="badge-status success">18ms (Optimal)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Encryption Standard</span>
                <span className="badge-status info"><Lock size={12} /> DTLS-SRTP 256-bit</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setInWaitingRoom(false);
                  setBookingToast('Simulated consultation started in clinician workstation!');
                  setTimeout(() => setBookingToast(null), 4000);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--aura-teal)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Simulate Call Connect
              </button>
              <button
                onClick={() => setInWaitingRoom(false)}
                style={{
                  padding: '12px 18px',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
