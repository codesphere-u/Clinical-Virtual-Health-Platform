import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/auth';
import { PersonaSwitcher } from '../components/PersonaSwitcher';

export const metadata: Metadata = {
  title: 'Aura Health | Virtual Care for Nigeria',
  description: 'Next-Generation Clinical & Virtual Health Platform connecting Nigerian patients with British and Nigerian specialists.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <AuthProvider defaultPersona="patient">
          {children}
          <PersonaSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}
