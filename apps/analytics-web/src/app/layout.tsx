import type { Metadata } from 'next';
import './globals.css';
import { AnalyticsShell } from '../components/AnalyticsShell';

export const metadata: Metadata = {
  title: 'DOCAAS Clinical Analytics | Executive Dashboard',
  description:
    'Real-time clinical KPI reporting, regulatory compliance metrics, and audit integrity dashboards for the DOCAAS Telemedicine Alliance. Covering Nigeria (NDPA 2023) and United Kingdom (UK GDPR) jurisdictions.',
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
        <AnalyticsShell>{children}</AnalyticsShell>
      </body>
    </html>
  );
}
