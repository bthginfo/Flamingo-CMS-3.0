import type { Metadata } from 'next';
import { CmsPage } from './cms-client';

export const metadata: Metadata = {
  title: 'Flamingo CMS – Inhalte selbst pflegen',
  description:
    'Flamingo CMS ist das einfache Content-Management-System für lokale Betriebe. Seiten, Texte, Bilder, SEO, Navigation und Shop-Inhalte direkt im Browser pflegen.',
  alternates: { canonical: '/cms' },
  openGraph: {
    title: 'Flamingo CMS – Inhalte selbst pflegen · FlamingoMedia',
    description:
      'Ein modernes CMS für kleine Unternehmen: Inhalte selbst pflegen, live vorschauen und veröffentlichen, ohne Code und ohne Agentur-Ticket.',
  },
};

export default function Page() {
  return <CmsPage />;
}
