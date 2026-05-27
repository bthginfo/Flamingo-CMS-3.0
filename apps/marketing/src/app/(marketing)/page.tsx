import type { Metadata } from 'next';
import { LandingPage } from './landing-client';
import { NewsSection } from './news-section';

export const metadata: Metadata = {
  title: 'FlamingoMedia · Websites für lokale Marken',
  description:
    'FlamingoMedia erstellt moderne Websites für lokale Betriebe in Innsbruck, München, Ingolstadt und der DACH-Region. Design, CMS, SEO-Grundlage, Hosting und Pflege aus einer Hand.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'FlamingoMedia · Websites für lokale Marken',
    description:
      'Schnelle Websites mit starkem Design und eigenem CMS für lokale Unternehmen. Inhalte selbst pflegen, professionell auftreten, besser gefunden werden.',
  },
};

export default function HomePage() {
  return (
    <LandingPage>
      <NewsSection />
    </LandingPage>
  );
}
