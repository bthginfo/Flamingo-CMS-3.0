import { NextResponse } from 'next/server';

const BASE = 'https://www.flamingomedia.online';

export async function GET() {
  const lines = [
    '# Flamingo CMS',
    '',
    '> Modernes CMS für Handwerker, Dienstleister und kleine Unternehmen. Professionelle Websites mit KI-Unterstützung, individuellen Templates und integriertem Shop.',
    '',
    `Website: ${BASE}`,
    '',
    '## Seiten',
    '',
    `- [Startseite](${BASE})`,
    `- [Templates](${BASE}/templates)`,
    `- [CMS Funktionen](${BASE}/cms)`,
    `- [Rechnungen & Kunden](${BASE}/rechnungen)`,
    `- [Prozess](${BASE}/prozess)`,
    `- [Preise](${BASE}/preise)`,
    `- [Über uns](${BASE}/ueber-uns)`,
    `- [Kontakt](${BASE}/kontakt)`,
    `- [Förderrechner](${BASE}/foerderrechner)`,
    `- [Demo](${BASE}/demo)`,
    '',
    '## Produkt',
    '',
    '- Multi-Tenant CMS mit individuellen Domains',
    '- Branchenspezifische Templates (Handwerk, Gastronomie, Fotografie, Tourismus, etc.)',
    '- Integrierter Online-Shop',
    '- Rechnungs- und Kundenverwaltung mit PDF, XRechnung, SMTP-Versand und Storno',
    '- SEO-optimiert mit automatischen Meta-Tags, Sitemaps und JSON-LD',
    '- Admin-Dashboard mit Live-Editor',
    '- Mehrsprachigkeit (i18n)',
    '- KI-gestützte Inhaltserstellung',
  ];

  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  });
}
