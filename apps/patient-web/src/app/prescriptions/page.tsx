'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  RotateCw,
  CheckCircle2,
  X,
  Truck,
  Building,
} from 'lucide-react';

interface Prescription {
  id: string;
  drugName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: string;
  quantity: string;
  duration: string;
  prescribedBy: string;
  license: string;
  datePrescribed: string;
  refillsRemaining: number;
  status: 'active' | 'completed' | 'pending_refill';
  dispensingHub: 'Lagos Hub (HealthPlus)' | 'UK Hub (Boots Pharmacy)';
  instructions: string;
  contraindications: string;
}

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-9021',
    drugName: 'Norvasc',
    genericName: 'Amlodipine Besylate',
    dosage: '5 mg',
    frequency: 'Once daily (Morning)',
    route: 'Oral',
    quantity: '28 Tablets',
    duration: '30 Days',
    prescribedBy: 'Dr. Elizabeth Adeyemi',
    license: 'GMC #7654321 • MDCN #48291',
    datePrescribed: '12 August 2026',
    refillsRemaining: 2,
    status: 'active',
    dispensingHub: 'Lagos Hub (HealthPlus)',
    instructions: 'Take 1 tablet every morning with or without water. Avoid grapefruit products while taking this medication.',
    contraindications: 'No documented drug-drug interactions with current profile. Allergy check clear.',
  },
  {
    id: 'rx-9022',
    drugName: 'Glucophage XR',
    genericName: 'Metformin Hydrochloride (Extended Release)',
    dosage: '500 mg',
    frequency: 'Twice daily with meals',
    route: 'Oral',
    quantity: '56 Tablets',
    duration: '30 Days',
    prescribedBy: 'Dr. Chidiebere Okafor',
    license: 'MDCN #34591',
    datePrescribed: '18 June 2026',
    refillsRemaining: 1,
    status: 'active',
    dispensingHub: 'Lagos Hub (HealthPlus)',
    instructions: 'Take with morning and evening meals to minimize gastrointestinal discomfort. Swallow whole; do not chew.',
    contraindications: 'Caution in severe renal impairment (eGFR checked >60 ml/min/1.73m²).',
  },
  {
    id: 'rx-8540',
    drugName: 'Ventolin Inhaler',
    genericName: 'Salbutamol',
    dosage: '100 mcg/actuation',
    frequency: 'As needed (PRN)',
    route: 'Inhalation',
    quantity: '1 Inhaler (200 doses)',
    duration: 'Completed',
    prescribedBy: 'Dr. Alistair Williams',
    license: 'GMC #6123456',
    datePrescribed: '15 January 2026',
    refillsRemaining: 0,
    status: 'completed',
    dispensingHub: 'UK Hub (Boots Pharmacy)',
    instructions: 'Inhale 1-2 puffs when experiencing acute wheeze or chest tightness.',
    contraindications: 'Completed course. Archive record.',
  },
];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [refillModalRx, setRefillModalRx] = useState<Prescription | null>(null);
  const [refillDeliveryHub, setRefillDeliveryHub] = useState<'lagos' | 'london'>('lagos');
  const [refillSuccessToast, setRefillSuccessToast] = useState<string | null>(null);

  const handleRequestRefill = () => {
    if (!refillModalRx) return;
    const rxId = refillModalRx.id;
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === rxId ? { ...p, status: 'pending_refill' as const } : p))
    );
    const drugName = refillModalRx.drugName;
    setRefillModalRx(null);
    setRefillSuccessToast(`Refill requested for ${drugName}. Clinician review notification dispatched.`);
    setTimeout(() => setRefillSuccessToast(null), 5000);
  };

  const activeRx = prescriptions.filter((p) => p.status === 'active' || p.status === 'pending_refill');
  const pastRx = prescriptions.filter((p) => p.status === 'completed');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast */}
      {refillSuccessToast && (
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
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{refillSuccessToast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Prescriptions & Medication Management
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
          Active clinical prescriptions, cross-border pharmacy dispensing hubs, and digital refill requests.
        </p>
      </div>

      {/* Cross-border Delivery & Allergy Alert Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#f0fdf9', border: '1px solid var(--docaas-teal-border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', gap: '12px' }}>
          <Truck size={22} color="#0d746f" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f766e', marginBottom: '2px' }}>
              Dual-Jurisdiction Pharmacy Dispatch
            </div>
            <div style={{ fontSize: '12px', color: '#115e59', lineHeight: 1.4 }}>
              Medications can be dispensed via licensed partner pharmacies in Lagos (HealthPlus) or London (Boots NHS Pharmacy courier delivery).
            </div>
          </div>
        </div>

        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', gap: '12px' }}>
          <AlertTriangle size={22} color="#dc2626" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#991b1b', marginBottom: '2px' }}>
              Documented Patient Allergy: Penicillin
            </div>
            <div style={{ fontSize: '12px', color: '#7f1d1d', lineHeight: 1.4 }}>
              System active contraindication block enabled. Beta-lactam antibiotics cannot be authorized without specialist clearance.
            </div>
          </div>
        </div>
      </div>

      {/* ─── Active Prescriptions ─── */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 14px 0' }}>
          Active Medications ({activeRx.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeRx.map((rx) => (
            <div
              key={rx.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge-status success"><CheckCircle2 size={12} /> Active Prescription</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rx #{rx.id}</span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
                    {rx.drugName} <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>({rx.genericName})</span>
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--docaas-teal)', fontWeight: 600 }}>
                    {rx.dosage} • {rx.frequency} ({rx.route})
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Refills Remaining: <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>{rx.refillsRemaining}</strong>
                  </div>
                  {rx.status === 'pending_refill' ? (
                    <span className="badge-status warning"><Clock size={13} /> Refill Pending Review</span>
                  ) : (
                    <button
                      onClick={() => setRefillModalRx(rx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: 'var(--docaas-teal)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <RotateCw size={14} />
                      <span>Request Refill</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Instructions & Clinical Context */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '13px', background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Patient Instructions</span>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-main)' }}>{rx.instructions}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Prescribing Clinician</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>{rx.prescribedBy}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rx.license} • Authorized {rx.datePrescribed}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Designated Pharmacy Hub</span>
                  <div style={{ fontWeight: 600, color: '#0d746f', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building size={14} />
                    <span>{rx.dispensingHub}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Past Prescriptions ─── */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '12px 0 14px 0' }}>
          Prescription History
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pastRx.map((rx) => (
            <div
              key={rx.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{rx.drugName}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({rx.genericName})</span>
                  <span className="badge-status neutral">Course Completed</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {rx.dosage} • Prescribed by {rx.prescribedBy} on {rx.datePrescribed}
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Archived Record
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Refill Request Modal ─── */}
      {refillModalRx && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Request Prescription Refill
              </h3>
              <button
                onClick={() => setRefillModalRx(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                {refillModalRx.drugName} ({refillModalRx.dosage})
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Refills remaining on file: <strong>{refillModalRx.refillsRemaining}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                Preferred Dispensing Location
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => setRefillDeliveryHub('lagos')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: refillDeliveryHub === 'lagos' ? '2px solid var(--docaas-teal)' : '1px solid var(--border-light)',
                    background: refillDeliveryHub === 'lagos' ? '#f0fdf9' : '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ color: 'var(--text-main)' }}>🇳🇬 Lagos Courier</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Same/Next day delivery</div>
                </button>

                <button
                  onClick={() => setRefillDeliveryHub('london')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: refillDeliveryHub === 'london' ? '2px solid var(--docaas-teal)' : '1px solid var(--border-light)',
                    background: refillDeliveryHub === 'london' ? '#f0fdf9' : '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ color: 'var(--text-main)' }}>🇬🇧 UK Pharmacy</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Boots / Royal Mail</div>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleRequestRefill}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--docaas-teal)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Submit Refill Request
              </button>
              <button
                onClick={() => setRefillModalRx(null)}
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
