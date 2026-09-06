'use client';

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Globe,
} from 'lucide-react';

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  duration: string;
  status: 'available' | 'booked' | 'blocked';
  patientName?: string;
  specialty?: string;
}

const INITIAL_SLOTS: TimeSlot[] = [
  { id: 's1', day: 'Today (Sunday, 6 Sep)', time: '14:00 - 14:30 WAT', duration: '30m', status: 'booked', patientName: 'Olumide Babalola', specialty: 'Cardiology Review' },
  { id: 's2', day: 'Today (Sunday, 6 Sep)', time: '15:00 - 15:30 WAT', duration: '30m', status: 'booked', patientName: 'Amina Bello', specialty: 'Thyroid Panel' },
  { id: 's3', day: 'Today (Sunday, 6 Sep)', time: '16:00 - 16:30 WAT', duration: '30m', status: 'available' },
  { id: 's4', day: 'Today (Sunday, 6 Sep)', time: '17:00 - 17:30 WAT', duration: '30m', status: 'blocked' },
  { id: 's5', day: 'Tomorrow (Monday, 7 Sep)', time: '09:00 - 09:30 WAT', duration: '30m', status: 'available' },
  { id: 's6', day: 'Tomorrow (Monday, 7 Sep)', time: '10:00 - 10:30 WAT', duration: '30m', status: 'booked', patientName: 'Chukwuma Obi', specialty: 'Post-ECG Arrhythmia' },
  { id: 's7', day: 'Tomorrow (Monday, 7 Sep)', time: '11:00 - 11:30 WAT', duration: '30m', status: 'available' },
  { id: 's8', day: 'Tomorrow (Monday, 7 Sep)', time: '14:00 - 14:30 WAT', duration: '30m', status: 'available' },
];

export default function ClinicianSchedulePage() {
  const [slots, setSlots] = useState<TimeSlot[]>(INITIAL_SLOTS);
  const [selectedDay, setSelectedDay] = useState<string>('Today (Sunday, 6 Sep)');
  const [slotToast, setSlotToast] = useState<string | null>(null);

  // New slot creation
  const [newTime, setNewTime] = useState('18:00');
  const [newDuration, setNewDuration] = useState('30m');

  const handleAddSlot = () => {
    const newSlot: TimeSlot = {
      id: `s-${Date.now()}`,
      day: selectedDay,
      time: `${newTime} - ${newTime.split(':')[0]}:30 WAT`,
      duration: newDuration,
      status: 'available',
    };
    setSlots((prev) => [...prev, newSlot]);
    setSlotToast('Telemedicine availability slot opened.');
    setTimeout(() => setSlotToast(null), 3500);
  };

  const handleToggleBlock = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: s.status === 'blocked' ? 'available' : 'blocked',
          };
        }
        return s;
      })
    );
  };

  const handleDeleteSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const daySlots = slots.filter((s) => s.day === selectedDay);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast */}
      {slotToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0d746f',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
          }}
        >
          <CheckCircle2 size={18} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{slotToast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Clinical Schedule & Telehealth Availability
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ws-muted)' }}>
            Configure cross-border availability slots synchronized between West Africa Time (WAT) and British Summer Time (BST).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--ws-surface)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--ws-border)', fontSize: '12px', color: '#2dd4bf' }}>
          <Globe size={14} />
          <span>Auto-synchronized across Lagos & London timezones</span>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--ws-border)', paddingBottom: '12px' }}>
        {['Today (Sunday, 6 Sep)', 'Tomorrow (Monday, 7 Sep)', 'Tuesday, 8 Sep', 'Wednesday, 9 Sep'].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              border: selectedDay === d ? '1px solid #0d746f' : '1px solid var(--ws-border)',
              background: selectedDay === d ? 'rgba(13, 116, 111, 0.3)' : 'var(--ws-surface)',
              color: selectedDay === d ? '#2dd4bf' : 'var(--ws-muted)',
              cursor: 'pointer',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Grid: Slots List & Add Slot Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Slot Timeline */}
        <div style={{ background: 'var(--ws-surface)', borderRadius: '16px', border: '1px solid var(--ws-border)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 16px 0' }}>
            Slots for {selectedDay} ({daySlots.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {daySlots.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--ws-dim)' }}>No slots configured for this date. Create one on the right.</p>
            ) : (
              daySlots.map((s) => (
                <div
                  key={s.id}
                  style={{
                    background: s.status === 'booked' ? 'rgba(13, 116, 111, 0.15)' : s.status === 'blocked' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: s.status === 'booked' ? '1px solid rgba(13, 116, 111, 0.4)' : s.status === 'blocked' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--ws-border)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: s.status === 'booked' ? '#0d746f' : s.status === 'blocked' ? '#ef4444' : 'rgba(255,255,255,0.08)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{s.time}</div>
                      {s.status === 'booked' ? (
                        <div style={{ fontSize: '12px', color: '#2dd4bf', marginTop: '2px' }}>
                          Booked: <strong>{s.patientName}</strong> ({s.specialty})
                        </div>
                      ) : s.status === 'blocked' ? (
                        <div style={{ fontSize: '12px', color: '#fca5a5', marginTop: '2px' }}>
                          Doctor Out of Office / Break
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px' }}>
                          Open for Virtual Patient Booking
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {s.status === 'booked' ? (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '4px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                        }}
                      >
                        CONFIRMED
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleBlock(s.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'transparent',
                            border: '1px solid var(--ws-border)',
                            color: s.status === 'blocked' ? '#2dd4bf' : '#fca5a5',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {s.status === 'blocked' ? 'Unblock' : 'Block Slot'}
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(s.id)}
                          style={{
                            padding: '6px 10px',
                            background: 'transparent',
                            border: '1px solid var(--ws-border)',
                            color: 'var(--ws-dim)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Add Slot Card */}
        <div style={{ background: 'var(--ws-surface)', borderRadius: '16px', border: '1px solid var(--ws-border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Open New Telehealth Slot
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--ws-muted)' }}>
            Added slots immediately become visible on the Patient Web Booking Wizard.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ws-muted)', marginBottom: '6px' }}>
              Start Time (WAT / BST)
            </label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--ws-border)',
                background: 'var(--ws-card)',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ws-muted)', marginBottom: '6px' }}>
              Consultation Length
            </label>
            <select
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--ws-border)',
                background: 'var(--ws-card)',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="15m">15 Minutes (Follow-up)</option>
              <option value="30m">30 Minutes (Standard Review)</option>
              <option value="45m">45 Minutes (Initial Assessment)</option>
              <option value="60m">60 Minutes (Complex Multi-disciplinary)</option>
            </select>
          </div>

          <button
            onClick={handleAddSlot}
            style={{
              marginTop: '8px',
              padding: '12px',
              background: 'var(--aura-teal)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} />
            <span>Publish Telehealth Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
