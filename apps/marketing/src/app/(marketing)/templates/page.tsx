import type { Metadata } from 'next';
import { TemplatesPage } from './templates-client';

export const metadata: Metadata = {
  title: 'Website-Templates für jede Branche',
  description:
    'Acht branchenspezifische Website-Templates: Handwerk, Restaurant, Salon, Hotel, Tourismus, Arztpraxis, Hochzeit und Fotografie. Drei Stilvarianten pro Branche. Sofort einsatzbereit.',
  alternates: { canonical: '/templates' },
  openGraph: {
    title: 'Website-Templates für jede Branche · FlamingoMedia',
    description:
      'Branchenspezifische Templates für lokale Betriebe – Restaurant, Salon, Handwerk, Hotel, Praxis und mehr. Editorial-Design, sofort einsatzbereit.',
  },
};

export default function Page() {
  return <TemplatesPage />;
}
