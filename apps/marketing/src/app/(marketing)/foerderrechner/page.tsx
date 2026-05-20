import type { Metadata } from 'next';
import { FoerderrechnerPage } from './foerderrechner-client';

export const metadata: Metadata = {
  title: 'Förderrechner – Website-Förderung berechnen',
  description:
    'Berechne Deine mögliche Förderung für Dein Website-Projekt. Förderprogramme für Tirol und Bayern – Digitalbonus, Digitalisierungsförderung und mehr.',
  alternates: { canonical: '/foerderrechner' },
  openGraph: {
    title: 'Förderrechner · FlamingoMedia',
    description: 'Fördermittel für Dein Website-Projekt berechnen – Tirol & Bayern.',
  },
};

export default function Page() {
  return <FoerderrechnerPage />;
}
