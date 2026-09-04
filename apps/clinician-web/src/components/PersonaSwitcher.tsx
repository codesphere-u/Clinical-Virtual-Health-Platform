'use client';

/**
 * Aura Clinical Network — Persona Switcher Component
 * Floating control for stakeholder demos to switch between Patient, Clinician, and Admin views.
 */

import React from 'react';
import { useAuth, type DemoPersona } from '../context/auth';

const PERSONAS: { id: DemoPersona; label: string; icon: string; color: string }[] = [
  { id: 'patient', label: 'Patient', icon: '🧑‍⚕️', color: '#0ea5e9' },
  { id: 'clinician', label: 'Clinician', icon: '👨‍⚕️', color: '#10b981' },
  { id: 'admin', label: 'Admin', icon: '🛡️', color: '#f59e0b' },
];

export function PersonaSwitcher() {
  const { activeDemoPersona, switchPersona, user } = useAuth();

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
      }}>
        <p style={{
          color: 'rgba(148, 163, 184, 0.8)',
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          Demo Persona
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => switchPersona(p.id)}
              title={`Switch to ${p.label} view`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                borderRadius: '10px',
                border: activeDemoPersona === p.id
                  ? `2px solid ${p.color}`
                  : '2px solid transparent',
                background: activeDemoPersona === p.id
                  ? `${p.color}22`
                  : 'rgba(255,255,255,0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
            >
              <span style={{ fontSize: '18px' }}>{p.icon}</span>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                color: activeDemoPersona === p.id ? p.color : 'rgba(148,163,184,0.6)',
                transition: 'color 0.15s ease',
              }}>
                {p.label}
              </span>
            </button>
          ))}
        </div>
        {user && (
          <p style={{
            color: 'rgba(148,163,184,0.6)',
            fontSize: '10px',
            textAlign: 'center',
            marginTop: '8px',
          }}>
            {user.name}
          </p>
        )}
      </div>
    </div>
  );
}
