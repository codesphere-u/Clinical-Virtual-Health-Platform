'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Video,
  Clock,
  ShieldCheck,
  FileText,
  Pill,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { Button, Card, ClinicalSnapshotCard } from '@aura/design-system';

export default function PatientHomePage() {
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', 'Cardiology', 'General Practice', 'Endocrinology', 'Pediatrics', 'Neurology'];

  const clinicians = [
    {
      id: 'c1',
      name: 'Dr. Elizabeth Adeyemi',
      title: 'Dr',
      specialty: 'Cardiology',
      sub: 'Hypertension Management',
      credentials: 'GMC #7654321 (UK) • MDCN Licensed',
      rating: 4.9,
      reviews: 142,
      fee: '₦25,000',
      nextSlot: 'Today, 14:00',
      photo: 'https://images.unsplash.com/photo-1594824813681-ef0db325028c?w=150',
    },
    {
      id: 'c2',
      name: 'Dr. Alistair Williams',
      title: 'Dr',
      specialty: 'General Practice',
      sub: 'Preventative & Chronic Care',
      credentials: 'GMC #6123456 (UK NHS)',
      rating: 4.8,
      reviews: 98,
      fee: '₦18,000',
      nextSlot: 'Tomorrow, 10:30',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    },
    {
      id: 'c3',
      name: 'Dr. Chidiebere Okafor',
      title: 'Dr',
      specialty: 'Endocrinology',
      sub: 'Diabetes & Thyroid',
      credentials: 'MDCN #34591 • West African College',
      rating: 5.0,
      reviews: 84,
      fee: '₦22,000',
      nextSlot: 'Today, 16:30',
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    },
  ];

  const filteredClinicians =
    selectedSpecialty === 'All'
      ? clinicians
      : clinicians.filter((c) => c.specialty === selectedSpecialty);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#0D746F] flex items-center justify-center text-white font-bold tracking-wider">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base">AURA HEALTH</span>
                <span className="text-[10px] font-semibold uppercase bg-teal-50 text-[#0D746F] px-2 py-0.5 rounded-md border border-teal-200">
                  Patient Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Cross-Border Telemedicine: Nigeria & United Kingdom</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <PhoneCall className="h-3.5 w-3.5 text-amber-700" />
              <span>Medical Emergency? Call <strong>112</strong> (Nigeria)</span>
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-800">Olumide Babalola</p>
                <p className="text-[11px] font-mono text-slate-500">CVH-2026-0001</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                OB
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Patient Snapshot Banner */}
        <section>
          <ClinicalSnapshotCard
            mrn="CVH-2026-0001"
            fullName="Olumide Babalola"
            ageYears={44}
            gender="Male"
            bloodGroup="O+"
            genotype="AA"
            verificationStatus="verified"
            allergies={[{ substance: 'Penicillin', severity: 'life_threatening' }]}
          />
        </section>

        {/* Active / Next Appointment Banner */}
        <section>
          <div className="bg-gradient-to-r from-[#0D746F] to-[#0A5F5B] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Scheduled Today at 14:00 (West Africa Time)</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Follow-up Virtual Consultation with Dr. Elizabeth Adeyemi
                </h2>
                <p className="text-sm text-teal-100 max-w-xl">
                  Cardiology review regarding blood pressure adjustment and morning headache follow-up. Secure encrypted WebRTC video consultation.
                </p>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                {!inWaitingRoom ? (
                  <button
                    onClick={() => {
                      setInWaitingRoom(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#0D746F] hover:bg-teal-50 font-bold px-6 py-3.5 rounded-xl shadow-md transition duration-150 active:scale-95"
                  >
                    <Video className="h-5 w-5" />
                    <span>Enter Live Waiting Room</span>
                  </button>
                ) : (
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-300 font-semibold text-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Waiting in Room (Ready)</span>
                    </div>
                    <p className="text-xs text-teal-100">Clinician notified. Video link live.</p>
                    <button
                      onClick={() => setInWaitingRoom(false)}
                      className="text-xs text-white/80 hover:text-white underline mt-1"
                    >
                      Leave Waiting Room
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="interactive" className="p-4 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-[#0D746F] flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Book Visit</p>
              <p className="text-xs text-slate-500">Search 10+ specialists</p>
            </div>
          </Card>

          <Card variant="interactive" className="p-4 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Prescriptions</p>
              <p className="text-xs text-slate-500">1 active authorized</p>
            </div>
          </Card>

          <Card variant="interactive" className="p-4 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Test Results</p>
              <p className="text-xs text-slate-500">Blood pressure & labs</p>
            </div>
          </Card>

          <Card variant="interactive" className="p-4 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Health Vitals</p>
              <p className="text-xs text-slate-500">142/90 mmHg • HR 76</p>
            </div>
          </Card>
        </section>

        {/* Find a Specialist Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Verified Specialist Clinicians</h3>
              <p className="text-xs text-slate-500">British GMC & Nigerian MDCN accredited physicians</p>
            </div>

            {/* Specialty Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
                    selectedSpecialty === spec
                      ? 'bg-[#0D746F] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredClinicians.map((c) => (
              <Card key={c.id} variant="elevated" className="flex flex-col justify-between p-5">
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={c.photo}
                      alt={c.name}
                      className="h-14 w-14 rounded-full object-cover border-2 border-slate-100 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{c.name}</h4>
                      <p className="text-xs font-medium text-[#0D746F]">{c.specialty}</p>
                      <p className="text-[11px] text-slate-500">{c.sub}</p>
                    </div>
                  </div>

                  <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                    <div className="flex items-center gap-1 font-semibold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{c.credentials}</span>
                    </div>
                    <p className="text-slate-500">★ {c.rating} ({c.reviews} patient reviews)</p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                      Consultation Fee
                    </span>
                    <span className="text-sm font-bold text-slate-900">{c.fee}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Book Slot
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Aura Clinical Health Alliance. All rights reserved.</p>
          <p className="text-slate-400">
            Adheres to Nigeria Data Protection Act (NDPA 2023) & UK General Medical Council Telemedicine Standards.
          </p>
        </div>
      </footer>
    </div>
  );
}
