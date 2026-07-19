import type { Metadata } from 'next';
import { PreisePage } from './preise-client';

export const metadata: Metadata = {
  title: 'Preise & Pakete – Website ab 1.490 €',
  description:
    'Transparente Website-Pakete für lokale Betriebe: Template ab 1.490 €, Content Kit ab 2.400 €, Shop, Booking, Rechnungen & Kunden sowie Hosting ab 29 €/Monat.',
  alternates: { canonical: '/preise' },
  openGraph: {
    title: 'Preise & Pakete · FlamingoMedia',
    description:
      'Faire Website-Preise ohne Agentur-Nebel: klare Pakete, sinnvolle Add-ons und monatliche Pflege auf Wunsch.',
  },
};

export default function Page() {
  return <PreisePage />;
}
