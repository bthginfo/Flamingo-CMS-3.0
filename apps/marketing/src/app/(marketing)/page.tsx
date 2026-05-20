import type { Metadata } from 'next';
import { LandingPage } from './landing-client';

export const metadata: Metadata = {
  title: 'FlamingoMedia · Websites für lokale Marken',
  description:
    'FlamingoMedia gestaltet und betreut Websites für inhabergeführte Betriebe in der DACH-Region – Restaurants, Salons, Handwerk, Praxen & mehr. Editorial-Design mit einem Hauch von Pop. Inhalte selbst pflegen, ohne Agentur.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'FlamingoMedia · Websites für lokale Marken',
    description:
      'Editorial-Design mit Pop für Restaurants, Salons, Handwerk, Praxen, Beratung, Studios und viele mehr. Inhalte, die Sie selbst pflegen – ohne Agentur.',
  },
};

export default function HomePage() {
  return <LandingPage />;
}
