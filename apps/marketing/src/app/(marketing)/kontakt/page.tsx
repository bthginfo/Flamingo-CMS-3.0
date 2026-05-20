import type { Metadata } from 'next';
import { KontaktPage } from './kontakt-client';

export const metadata: Metadata = {
  title: 'Kontakt – Erstgespräch & Beratung',
  description:
    'Erstgespräch, Angebot oder einfach mal Hallo. FlamingoMedia antwortet innerhalb von 24 Stunden. Erreichbar per E-Mail, Telefon oder Kontaktformular.',
  alternates: { canonical: '/kontakt' },
  openGraph: {
    title: 'Kontakt · FlamingoMedia',
    description: 'Erstgespräch, Angebot oder einfach mal Hallo. Wir antworten innerhalb von 24 Stunden.',
  },
};

export default function Page() {
  return <KontaktPage />;
}
