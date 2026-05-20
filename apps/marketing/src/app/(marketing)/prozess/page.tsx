import type { Metadata } from 'next';
import { ProzessPage } from './prozess-client';

export const metadata: Metadata = {
  title: 'Ablauf – Von der Idee bis live in 10 Tagen',
  description:
    'Vom Erstgespräch bis zur Live-Schaltung in 7 klaren Schritten. Transparente Kosten, feste Zeitplanung, kein Agentur-Theater. So entsteht Deine Website bei FlamingoMedia.',
  alternates: { canonical: '/prozess' },
  openGraph: {
    title: 'Ablauf · FlamingoMedia',
    description: 'Vom ersten Gespräch bis zur Live-Schaltung. Klar geplant, ohne Überraschungen.',
  },
};

export default function Page() {
  return <ProzessPage />;
}
