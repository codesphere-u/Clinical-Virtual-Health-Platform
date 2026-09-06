import type { Metadata } from 'next';
import './globals.css';
import { AdminShell } from '../components/AdminShell';

export const metadata: Metadata = {
  title: 'DOCAAS Command Centre | Administrative & Compliance Headquarters',
  description:
    'Enterprise administrative oversight, clinician verification, waiting room telemetry, and tamper-evident audit inspection for the DOCAAS Virtual Health Platform.',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
