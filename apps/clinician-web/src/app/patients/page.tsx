'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  AlertTriangle,
  FileText,
  Video,
  MapPin,
} from 'lucide-react';

interface PatientRecord {
  id: string;
  name: string;
  ageGender: string;
  hospitalNumber: string;
  ninOrNhs: string;
  location: string;
  primaryDiagnosis: string;
  allergies: string[];
  lastVisit: string;
  activeMedications: string[];
  complianceRating: string;
}

const PATIENT_ROSTER: PatientRecord[] = [
  {
    id: 'p-1001',
    name: 'Sarah Okafor',
    ageGender: '38F',
    hospitalNumber: 'DOC-NG-09214',
    ninOrNhs: 'NIN: 48291049281',
    location: 'Lagos, Nigeria',
    primaryDiagnosis: 'Essential Hypertension (Stage 1)',
    allergies: ['Penicillin (Severe Anaphylaxis)'],
    lastVisit: '12 Aug 2026',
    activeMedications: ['Amlodipine 5mg OD', 'Metformin 500mg BD'],
    complianceRating: 'High (94%)',
  },
  {
    id: 'p-1002',
    name: 'Olumide Babalola',
    ageGender: '42M',
    hospitalNumber: 'DOC-NG-07381',
    ninOrNhs: 'NIN: 59302194820',
    location: 'Ibadan, Nigeria',
    primaryDiagnosis: 'Uncontrolled Hypertension, Nocturnal Headaches',
    allergies: ['Penicillin', 'Amoxicillin'],
    lastVisit: 'Today (Waiting in Queue)',
    activeMedications: ['Amlodipine 5mg OD'],
    complianceRating: 'Moderate (78%)',
  },
  {
    id: 'p-1003',
    name: 'Amina Bello',
    ageGender: '29F',
    hospitalNumber: 'DOC-NG-11029',
    ninOrNhs: 'NIN: 10492847291',
    location: 'Abuja, Nigeria',
    primaryDiagnosis: 'Hypothyroidism / Hashimoto Thyroiditis',
    allergies: ['None Documented'],
    lastVisit: '18 Jul 2026',
    activeMedications: ['Levothyroxine 75mcg OD'],
    complianceRating: 'High (98%)',
  },
  {
    id: 'p-1004',
    name: 'Chukwuma Obi',
    ageGender: '55M',
    hospitalNumber: 'DOC-UK-04820',
    ninOrNhs: 'NHS: 943 281 9021',
    location: 'London, United Kingdom',
    primaryDiagnosis: 'Paroxysmal Atrial Fibrillation (Post-Ablation)',
    allergies: ['Sulfa drugs'],
    lastVisit: '04 Jun 2026',
    activeMedications: ['Bisoprolol 2.5mg OD', 'Apixaban 5mg BD'],
    complianceRating: 'High (96%)',
  },
  {
    id: 'p-1005',
    name: 'Folake Adebayo',
    ageGender: '48F',
    hospitalNumber: 'DOC-NG-12948',
    ninOrNhs: 'NIN: 39201948291',
    location: 'Lagos, Nigeria',
    primaryDiagnosis: 'Type 2 Diabetes Mellitus & Dyslipidemia',
    allergies: ['Aspirin (Bronchospasm)'],
    lastVisit: '15 May 2026',
    activeMedications: ['Metformin 1000mg BD', 'Atorvastatin 20mg ON'],
    complianceRating: 'High (92%)',
  },
];

export default function PatientsRosterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All Locations');

  const filteredPatients = PATIENT_ROSTER.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hospitalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation =
      filterLocation === 'All Locations' || p.location.includes(filterLocation);
    return matchSearch && matchLocation;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Cross-Border Patient Directory
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ws-muted)' }}>
            Searchable patient registry compliant with NDPA 2023 and UK GDPR standards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} color="var(--ws-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by name, ID, condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid var(--ws-border)',
                background: 'var(--ws-surface)',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--ws-border)',
              background: 'var(--ws-surface)',
              color: 'var(--ws-muted)',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            <option>All Locations</option>
            <option>Nigeria</option>
            <option>United Kingdom</option>
          </select>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            style={{
              background: 'var(--ws-surface)',
              borderRadius: '14px',
              border: '1px solid var(--ws-border)',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d746f 0%, #0284c7 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '16px',
                }}
              >
                {patient.name.split(' ').map((n) => n[0]).join('')}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
                    {patient.name}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--ws-muted)' }}>({patient.ageGender})</span>
                  <span style={{ fontSize: '11px', color: '#2dd4bf', background: 'rgba(13, 116, 111, 0.25)', padding: '2px 8px', borderRadius: '4px' }}>
                    {patient.hospitalNumber}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
                  {patient.primaryDiagnosis}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '11px', color: 'var(--ws-muted)' }}>
                  <span><MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />{patient.location}</span>
                  <span>•</span>
                  <span>{patient.ninOrNhs}</span>
                  <span>•</span>
                  <span>Last Visit: <strong style={{ color: '#f1f5f9' }}>{patient.lastVisit}</strong></span>
                </div>
              </div>
            </div>

            {/* Allergies and Medications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '300px' }}>
              {patient.allergies[0] !== 'None Documented' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.15)', padding: '4px 8px', borderRadius: '4px' }}>
                  <AlertTriangle size={12} />
                  <span>Allergy: {patient.allergies.join(', ')}</span>
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: '#34d399' }}>
                  No Known Drug Allergies (NKDA)
                </div>
              )}
              <div style={{ fontSize: '11px', color: 'var(--ws-muted)' }}>
                Medications: {patient.activeMedications.join(' • ')}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                href="/consultation"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: 'var(--aura-teal)',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Video size={13} />
                <span>Start Session</span>
              </Link>
              <Link
                href="/history"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--ws-border)',
                  color: 'var(--ws-muted)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <FileText size={13} />
                <span>Dossier</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
