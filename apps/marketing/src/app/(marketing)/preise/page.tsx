import type { Metadata } from 'next';
import { PreisePage } from './preise-client';

export const metadata: Metadata = {
  title: 'Preise & Pakete – Website ab 1.490 €',
  description:
    'Drei klare Pakete: Template ab 1.490 €, mit Foto- & Video-Content-Kit ab 2.400 €, oder komplett individuell. Transparente Festpreise, keine versteckten Kosten. Hosting ab 29 €/Monat.',
  alternates: { canonical: '/preise' },
  openGraph: {
    title: 'Preise & Pakete · FlamingoMedia',
    description:
      'Website-Pakete ab 1.490 € einmalig. Faire Preise, keine Überraschungen. Hosting & Pflege ab 29 €/Monat.',
  },
};

export default function Page() {
  return <PreisePage />;
}
