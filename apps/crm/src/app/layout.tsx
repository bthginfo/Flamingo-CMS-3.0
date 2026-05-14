import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Flamingo CRM',
  description: 'Tenant-Management & Provisioning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
