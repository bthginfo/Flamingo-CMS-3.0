import type { Metadata } from 'next';
import DemoPlayground from '@/showcase/DemoPlayground';

export const metadata: Metadata = {
  title: 'Live Demo – Flamingo CMS ausprobieren',
  description:
    'Teste das Flamingo CMS live im Browser. Admin-Bereich, Seiten-Editor und Template-Vorschau – ohne Anmeldung, sofort loslegen.',
  alternates: { canonical: '/demo' },
  openGraph: {
    title: 'Live Demo · FlamingoMedia',
    description: 'Flamingo CMS live ausprobieren – Admin, Editor und Templates direkt im Browser.',
  },
};

export default function Page() {
  return <DemoPlayground />;
}
