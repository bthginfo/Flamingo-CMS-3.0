import type { Metadata } from 'next';
import { TemplatesPage } from './templates-client';

export const metadata: Metadata = {
  title: 'Website-Templates für jede Branche',
  description:
    'Branchenspezifische Website-Templates für Handwerk, Restaurant, Salon, Hotel, Tourismus, Praxis, Shop und mehr. Schnell live, stark gestaltet und komplett im CMS pflegbar.',
  alternates: { canonical: '/templates' },
  openGraph: {
    title: 'Website-Templates für jede Branche · FlamingoMedia',
    description:
      'Website-Templates für lokale Betriebe: branchennah gedacht, SEO-sauber aufgebaut und in wenigen Tagen mit Deinen Inhalten online.',
  },
};

export default function Page() {
  return <TemplatesPage />;
}
