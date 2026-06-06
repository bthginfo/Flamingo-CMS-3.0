import type { Metadata } from 'next';
import { DatenloeschungPage } from './datenloeschung-client';

export const metadata: Metadata = {
  title: 'Anleitung zur Datenlöschung',
  description:
    'So lassen Sie Ihre durch FlamingoMedia verarbeiteten Daten — inklusive Instagram-Integration — löschen.',
  alternates: { canonical: '/datenloeschung' },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <DatenloeschungPage />;
}
