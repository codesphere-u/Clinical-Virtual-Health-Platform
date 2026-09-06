import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/auth';
import { PersonaSwitcher } from '../components/PersonaSwitcher';
import { ClinicianShell } from '../components/ClinicianShell';

export const metadata: Metadata = {
  title: 'DOCAAS Clinical Workstation | GMC & MDCN Telemedicine',
  description: 'Next-Generation Clinical Management and Telemedicine Workstation for Medical Practitioners.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <AuthProvider defaultPersona="clinician">
          <ClinicianShell>
            {children}
          </ClinicianShell>
          <PersonaSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}

