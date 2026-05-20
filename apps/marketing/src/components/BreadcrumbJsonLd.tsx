'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

const LABELS: Record<string, string> = {
  '': 'Startseite',
  templates: 'Templates',
  cms: 'CMS',
  prozess: 'Ablauf',
  preise: 'Preise',
  'ueber-uns': 'Über uns',
  kontakt: 'Kontakt',
  foerderrechner: 'Förderrechner',
  demo: 'Live Demo',
  impressum: 'Impressum',
  datenschutz: 'Datenschutz',
};

const BASE = 'https://www.flamingomedia.online';

export function BreadcrumbJsonLd() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const slug = pathname.replace(/^\//, '');
  const label = LABELS[slug] || slug;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: BASE },
      { '@type': 'ListItem', position: 2, name: label, item: `${BASE}/${slug}` },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
