import type { Metadata } from 'next';
import { KontaktPage } from './kontakt-client';

export const metadata: Metadata = {
  title: 'Kontakt – Erstgespräch & Beratung',
  description:
    'Website-Projekt besprechen? Schreib FlamingoMedia für ein Erstgespräch, ein Angebot oder eine kurze Einschätzung. Wir arbeiten für Betriebe in Innsbruck, München, Ingolstadt und DACH-weit.',
  alternates: { canonical: '/kontakt' },
  openGraph: {
    title: 'Kontakt · FlamingoMedia',
    description: 'Erstgespräch, Angebot oder kurze Einschätzung zu Deiner Website. Wir antworten innerhalb von 24 Stunden.',
  },
};

export default function Page() {
  return <KontaktPage />;
}
