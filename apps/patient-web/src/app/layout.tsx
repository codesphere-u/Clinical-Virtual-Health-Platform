import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/auth';
import { PersonaSwitcher } from '../components/PersonaSwitcher';
import { PatientShell } from '../components/PatientShell';

export const metadata: Metadata = {
  title: 'DOCAAS | Virtual Care Platform (Nigeria & UK)',
  description: 'Next-Generation Clinical & Virtual Health Platform connecting Nigerian patients with British and Nigerian specialists.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider defaultPersona="patient">
          <PatientShell>
            {children}
          </PatientShell>
          <PersonaSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}

