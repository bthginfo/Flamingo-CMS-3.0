import type { Metadata } from 'next';
import { ProzessPage } from './prozess-client';

export const metadata: Metadata = {
  title: 'Ablauf – Von der Idee bis live in 10 Tagen',
  description:
    'So entsteht Deine Website bei FlamingoMedia: klares Briefing, Inhalte, Design, CMS, Vorschau und Live-Schaltung. Planbar, schnell und ohne Agentur-Theater.',
  alternates: { canonical: '/prozess' },
  openGraph: {
    title: 'Ablauf · FlamingoMedia',
    description: 'Vom ersten Gespräch bis zur Live-Schaltung: sauber geplant, klar erklärt und ohne Überraschungen.',
  },
};

export default function Page() {
  return <ProzessPage />;
}
