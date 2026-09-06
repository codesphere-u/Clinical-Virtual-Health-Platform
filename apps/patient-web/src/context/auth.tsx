'use client';

/**
 * DOCAAS Clinical Network — Auth Context Provider
 * Manages JWT sessions, persona switcher, and MFA state across web applications.
 */

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type DemoPersona = 'patient' | 'clinician' | 'admin';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'patient' | 'clinician' | 'admin' | 'safeguarding_lead' | 'auditor';
  jurisdiction: 'NG' | 'GB' | 'INTL';
  name: string;
  avatarInitials: string;
  mfaEnabled?: boolean;
}

interface AuthContextState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeDemoPersona: DemoPersona;
  switchPersona: (persona: DemoPersona) => void;
  logout: () => void;
}

const DEMO_USERS: Record<DemoPersona, AuthUser> = {
  patient: {
    userId: 'demo-patient-001',
    email: 'olumide.babalola@demo.docaas',
    role: 'patient',
    jurisdiction: 'NG',
    name: 'Olumide Babalola',
    avatarInitials: 'OB',
  },
  clinician: {
    userId: 'demo-clinician-001',
    email: 'dr.elizabeth.adeyemi@demo.docaas',
    role: 'clinician',
    jurisdiction: 'GB',
    name: 'Dr. Elizabeth Adeyemi',
    avatarInitials: 'EA',
    mfaEnabled: true,
  },
  admin: {
    userId: 'demo-admin-001',
    email: 'admin@demo.docaas',
    role: 'admin',
    jurisdiction: 'GB',
    name: 'DOCAAS Compliance Admin',
    avatarInitials: 'DA',
    mfaEnabled: true,
  },
};

const AuthContext = createContext<AuthContextState | null>(null);

export function AuthProvider({ children, defaultPersona = 'patient' }: { children: ReactNode; defaultPersona?: DemoPersona }) {
  const [activeDemoPersona, setActiveDemoPersona] = useState<DemoPersona>(defaultPersona);
  const [isLoading] = useState(false);

  const user = DEMO_USERS[activeDemoPersona] ?? null;
  const accessToken = `demo-jwt-${activeDemoPersona}-token`;

  const switchPersona = useCallback((persona: DemoPersona) => {
    setActiveDemoPersona(persona);
  }, []);

  const logout = useCallback(() => {
    setActiveDemoPersona('patient');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: true, // demo mode always authenticated
        isLoading,
        activeDemoPersona,
        switchPersona,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}
