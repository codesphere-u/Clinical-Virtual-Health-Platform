import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/auth';
import { PersonaSwitcher } from '../components/PersonaSwitcher';

export const metadata: Metadata = {
  title: 'Aura Command Center | Administrative & Compliance Headquarters',
  description: 'Enterprise administrative oversight, clinician verification, waiting room telemetry, and tamper-evident audit inspection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <AuthProvider defaultPersona="admin">
          {children}
          <PersonaSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}
