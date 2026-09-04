import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/auth';
import { PersonaSwitcher } from '../components/PersonaSwitcher';

export const metadata: Metadata = {
  title: 'Aura Clinical Workstation | GMC & MDCN Telemedicine',
  description: 'Next-Generation Clinical Management and Telemedicine Workstation for Medical Practitioners.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 antialiased">
        <AuthProvider defaultPersona="clinician">
          {children}
          <PersonaSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}
