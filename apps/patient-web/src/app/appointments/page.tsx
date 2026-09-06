'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Search,
  CheckCircle2,
  Video,
  FileText,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  sub: string;
  credentials: string;
  rating: number;
  reviews: number;
  feeNGN: number;
  feeGBP: number;
  location: string;
  photo: string;
  languages: string[];
  slots: string[];
}

const SPECIALISTS: Specialist[] = [
  {
    id: 'c1',
    name: 'Dr. Elizabeth Adeyemi',
    specialty: 'Cardiology',
    sub: 'Hypertension, Arrhythmia & Heart Failure',
    credentials: 'GMC #7654321 (UK) • MDCN #48291 (NG)',
    rating: 4.9,
    reviews: 142,
    feeNGN: 25000,
    feeGBP: 35,
    location: 'London, UK / Lagos, NG',
    photo: 'https://images.unsplash.com/photo-1594824813681-ef0db325028c?w=200&h=200&fit=crop&auto=format',
    languages: ['English', 'Yoruba'],
    slots: ['Today, 14:00', 'Today, 15:30', 'Tomorrow, 09:00', 'Tomorrow, 11:30'],
  },
  {
    id: 'c2',
    name: 'Dr. Alistair Williams',
    specialty: 'General Practice',
    sub: 'Preventative Medicine & Complex Chronic Care',
    credentials: 'GMC #6123456 (UK NHS Consultant)',
    rating: 4.8,
    reviews: 98,
    feeNGN: 18000,
    feeGBP: 25,
    location: 'Manchester, UK',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&auto=format',
    languages: ['English'],
    slots: ['Today, 15:00', 'Tomorrow, 10:00', 'Tomorrow, 14:00'],
  },
  {
    id: 'c3',
    name: 'Dr. Chidiebere Okafor',
    specialty: 'Endocrinology',
    sub: 'Type 1/2 Diabetes & Metabolic Disorders',
    credentials: 'MDCN #34591 • FWACP (Fellow West African College)',
    rating: 5.0,
    reviews: 84,
    feeNGN: 22000,
    feeGBP: 30,
    location: 'Abuja, NG',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&auto=format',
    languages: ['English', 'Igbo'],
    slots: ['Today, 16:30', 'Tomorrow, 14:00', 'Friday, 10:00'],
  },
  {
    id: 'c4',
    name: 'Dr. Amina Yusuf',
    specialty: 'Pediatrics',
    sub: 'Neonatology & Pediatric Infectious Disease',
    credentials: 'MDCN #51203 • MRCPCH (UK)',
    rating: 4.9,
    reviews: 110,
    feeNGN: 20000,
    feeGBP: 28,
    location: 'Lagos, NG / London, UK',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&auto=format',
    languages: ['English', 'Hausa'],
    slots: ['Tomorrow, 09:30', 'Tomorrow, 12:00', 'Thursday, 15:00'],
  },
];

const SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'General Practice',
  'Endocrinology',
  'Pediatrics',
  'Neurology',
  'Dermatology',
];

interface AppointmentRecord {
  id: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  fee: string;
  notes?: string;
}

const PAST_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'apt-001',
    doctorName: 'Dr. Elizabeth Adeyemi',
    specialty: 'Cardiology',
    dateTime: 'Today, 14:00 WAT',
    status: 'upcoming',
    fee: '₦25,000',
  },
  {
    id: 'apt-002',
    doctorName: 'Dr. Alistair Williams',
    specialty: 'General Practice',
    dateTime: '12 Aug 2026, 11:00 WAT',
    status: 'completed',
    fee: '₦18,000',
    notes: 'Routine hypertension review. Blood pressure stabilized at 126/84. Continue Amlodipine 5mg OD.',
  },
  {
    id: 'apt-003',
    doctorName: 'Dr. Chidiebere Okafor',
    specialty: 'Endocrinology',
    dateTime: '18 Jul 2026, 15:30 WAT',
    status: 'completed',
    fee: '₦22,000',
    notes: 'HbA1c target review. Fasting blood sugars well managed. Lifestyle adjustments reinforced.',
  },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'wizard' | 'upcoming' | 'history'>('wizard');
  const [step, setStep] = useState<number>(1);

  // Wizard state
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Specialist | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('Less than a week');
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredSpecialists = SPECIALISTS.filter((s) => {
    const matchSpecialty = selectedSpecialty === 'All Specialties' || s.specialty === selectedSpecialty;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSpecialty && matchSearch;
  });

  const handleBookingSubmit = () => {
    setBookingSuccess(true);
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedSlot('');
    setSymptoms('');
    setAcceptedConsent(false);
    setBookingSuccess(false);
    setActiveTab('upcoming');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Consultation & Appointment Management
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
          Schedule appointments with GMC and MDCN verified specialists in Nigeria and the United Kingdom.
        </p>
      </div>

      {/* Main Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '2px' }}>
        <button
          onClick={() => { setActiveTab('wizard'); setBookingSuccess(false); }}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            color: activeTab === 'wizard' ? 'var(--docaas-teal)' : 'var(--text-muted)',
            borderBottom: activeTab === 'wizard' ? '2px solid var(--docaas-teal)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Book New Consultation
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            color: activeTab === 'upcoming' ? 'var(--docaas-teal)' : 'var(--text-muted)',
            borderBottom: activeTab === 'upcoming' ? '2px solid var(--docaas-teal)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Upcoming (1)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            color: activeTab === 'history' ? 'var(--docaas-teal)' : 'var(--text-muted)',
            borderBottom: activeTab === 'history' ? '2px solid var(--docaas-teal)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Past Consultations (2)
        </button>
      </div>

      {/* ─── TAB: SMART BOOKING WIZARD ─── */}
      {activeTab === 'wizard' && (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '28px', boxShadow: 'var(--shadow-card)' }}>
          {/* Wizard Step Progress Bar */}
          {!bookingSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
              {[
                { num: 1, label: 'Specialty' },
                { num: 2, label: 'Clinician' },
                { num: 3, label: 'Date & Slot' },
                { num: 4, label: 'Clinical Reason' },
                { num: 5, label: 'Confirmation' },
              ].map((s) => (
                <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: step >= s.num ? 'var(--docaas-teal)' : 'var(--bg-subtle)',
                      color: step >= s.num ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  >
                    {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: step === s.num ? 700 : 500, color: step === s.num ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* STEP 1: Specialty Selection */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Step 1: Select Clinical Specialty
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Choose the clinical discipline appropriate for your medical inquiry.
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {SPECIALTIES.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`filter-pill ${selectedSpecialty === spec ? 'active' : ''}`}
                  >
                    {spec}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    padding: '10px 24px',
                    background: 'var(--docaas-teal)',
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
                  <span>Select Doctor</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Doctor Selection */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                    Step 2: Choose Your Verified Specialist
                  </h2>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                    Showing verified clinicians for: <strong>{selectedSpecialty}</strong>
                  </p>
                </div>
                <div style={{ position: 'relative', width: '260px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search doctor or condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {filteredSpecialists.map((doc) => {
                  const isSelected = selectedDoctor?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      style={{
                        padding: '18px',
                        borderRadius: 'var(--radius-lg)',
                        border: isSelected ? '2px solid var(--docaas-teal)' : '1px solid var(--border-light)',
                        background: isSelected ? '#f0fdf9' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src={doc.photo} alt={doc.name} style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{doc.name}</strong>
                            <span className="badge-status success"><ShieldCheck size={12} /> Verified</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--docaas-teal)', fontWeight: 600 }}>{doc.specialty} • {doc.sub}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{doc.credentials}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Languages: {doc.languages.join(', ')}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>₦{doc.feeNGN.toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>approx. £{doc.feeGBP}</div>
                        <button
                          style={{
                            marginTop: '8px',
                            padding: '6px 14px',
                            background: isSelected ? 'var(--docaas-teal)' : 'var(--bg-subtle)',
                            color: isSelected ? '#ffffff' : 'var(--text-main)',
                            border: 'none',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  disabled={!selectedDoctor}
                  onClick={() => setStep(3)}
                  style={{
                    padding: '10px 24px',
                    background: selectedDoctor ? 'var(--docaas-teal)' : 'var(--border-light)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: selectedDoctor ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Choose Time Slot</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Slot Picker */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Step 3: Select Consultation Date & Time
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Clinician: <strong>{selectedDoctor?.name}</strong> ({selectedDoctor?.specialty})
              </p>

              <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
                  Available Telemedicine Slots (WAT / BST)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {selectedDoctor?.slots.map((slot) => {
                    const isSlotSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: isSlotSelected ? '2px solid var(--docaas-teal)' : '1px solid var(--border-light)',
                          background: isSlotSelected ? '#f0fdf9' : '#ffffff',
                          color: isSlotSelected ? 'var(--docaas-teal)' : 'var(--text-main)',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          justifyContent: 'center',
                        }}
                      >
                        <Clock size={15} />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setStep(2)}
                  style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  disabled={!selectedSlot}
                  onClick={() => setStep(4)}
                  style={{
                    padding: '10px 24px',
                    background: selectedSlot ? 'var(--docaas-teal)' : 'var(--border-light)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: selectedSlot ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Enter Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Clinical Reason & Symptoms */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Step 4: Clinical Reason & Symptoms
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Please provide clinical context so your doctor can prepare ahead of the session.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Describe your primary symptoms or reason for visit *
                  </label>
                  <textarea
                    rows={4}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Mild palpitations and elevated blood pressure readings over the past 3 days (145/92). Current medication is Amlodipine 5mg."
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    How long have you experienced these symptoms?
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '13px',
                      outline: 'none',
                      background: '#ffffff',
                    }}
                  >
                    <option>Less than 48 hours</option>
                    <option>Less than a week</option>
                    <option>1 to 4 weeks</option>
                    <option>More than a month (chronic)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setStep(3)}
                  style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  disabled={!symptoms.trim()}
                  onClick={() => setStep(5)}
                  style={{
                    padding: '10px 24px',
                    background: symptoms.trim() ? 'var(--docaas-teal)' : 'var(--border-light)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: symptoms.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Review & Confirm</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Consent, Payment & Instant Confirmation */}
          {step === 5 && !bookingSuccess && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Step 5: Review & Consent
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Please review your consultation details and regulatory consent.
              </p>

              <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Specialist:</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedDoctor?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--docaas-teal)' }}>{selectedDoctor?.credentials}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Date & Slot:</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedSlot}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>30 mins virtual session</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Reason:</span>
                    <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{symptoms}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Consultation Fee:</span>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>₦{selectedDoctor?.feeNGN.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Paystack / Flutterwave / Stripe UK</div>
                  </div>
                </div>
              </div>

              {/* Cross-border Telemedicine Consent */}
              <div style={{ padding: '16px', background: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={acceptedConsent}
                    onChange={(e) => setAcceptedConsent(e.target.checked)}
                    style={{ marginTop: '3px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#1e40af', lineHeight: 1.5 }}>
                    I understand that this is a virtual telemedicine consultation. I consent to medical record processing under NDPA 2023 (Nigeria) and UK GDPR standards. I acknowledge this consultation is not for emergency care.
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setStep(4)}
                  style={{ padding: '10px 18px', background: 'none', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  disabled={!acceptedConsent}
                  onClick={handleBookingSubmit}
                  style={{
                    padding: '12px 28px',
                    background: acceptedConsent ? 'var(--docaas-teal)' : 'var(--border-light)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: acceptedConsent ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Confirm & Schedule</span>
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {bookingSuccess && (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                Consultation Confirmed!
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 24px auto' }}>
                Your appointment with <strong>{selectedDoctor?.name}</strong> has been scheduled for <strong>{selectedSlot}</strong>. A calendar invite and SMS reminder have been sent.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <button
                  onClick={resetWizard}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--docaas-teal)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View in Upcoming Consultations
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: UPCOMING APPOINTMENTS ─── */}
      {activeTab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PAST_APPOINTMENTS.filter((a) => a.status === 'upcoming').map((apt) => (
            <div
              key={apt.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge-status success"><span className="live-indicator-dot" /> Confirmed</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {apt.id}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
                  {apt.doctorName}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--docaas-teal)', fontWeight: 600, marginBottom: '6px' }}>
                  {apt.specialty} Virtual Consultation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {apt.dateTime}</span>
                  <span>•</span>
                  <span>Fee Paid: {apt.fee}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => alert('Starting WebRTC video stream...')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    background: 'var(--docaas-teal)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Video size={15} />
                  <span>Join Call</span>
                </button>
                <button
                  onClick={() => alert('Rescheduling options opened.')}
                  style={{
                    padding: '10px 16px',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB: CONSULTATION HISTORY ─── */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PAST_APPOINTMENTS.filter((a) => a.status === 'completed').map((apt) => (
            <div
              key={apt.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge-status neutral">Completed</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{apt.dateTime}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 2px 0', color: 'var(--text-main)' }}>
                    {apt.doctorName}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--docaas-teal)', fontWeight: 600 }}>{apt.specialty}</div>
                </div>

                <button
                  onClick={() => alert('Downloading clinical encounter summary PDF...')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--docaas-teal)',
                  }}
                >
                  <FileText size={14} />
                  <span>Download Summary</span>
                </button>
              </div>

              {apt.notes && (
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Clinical Note: </strong>
                  {apt.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
