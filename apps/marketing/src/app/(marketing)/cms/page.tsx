import type { Metadata } from 'next';
import { CmsPage } from './cms-client';

export const metadata: Metadata = {
  title: 'Flamingo CMS – Inhalte selbst pflegen',
  description:
    'Das Flamingo CMS ist ein intuitives Content-Management-System für lokale Betriebe. Texte, Bilder, Speisekarten und mehr – ohne technische Vorkenntnisse direkt im Browser bearbeiten.',
  alternates: { canonical: '/cms' },
  openGraph: {
    title: 'Flamingo CMS – Inhalte selbst pflegen · FlamingoMedia',
    description:
      'Einfaches CMS für kleine Unternehmen. Texte, Bilder und Inhalte selbst pflegen – ohne Agentur, ohne Code.',
  },
};

export default function Page() {
  return <CmsPage />;
}
