import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura Clinical Analytics | Executive Dashboard',
  description:
    'Real-time clinical KPI reporting, regulatory compliance metrics, and audit integrity dashboards for the Aura Clinical Health Alliance. Covering Nigeria (NDPA 2023) and United Kingdom (UK GDPR) jurisdictions.',
  robots: { index: false, follow: false }, // Internal tool — do not index
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
