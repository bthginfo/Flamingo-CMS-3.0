import { NextResponse } from 'next/server';
import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantBrand, getTenantSeoGlobal } from '@/lib/tenant-data';

export const revalidate = 3600;

export async function GET() {
  const tenantId = await resolveTenant();
  if (!tenantId) return new NextResponse('Not found', { status: 404 });

  const [snapshot, seo, { brand, contact }] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantSeoGlobal(tenantId),
    getTenantBrand(tenantId),
  ]);

  if (!snapshot) return new NextResponse('Not found', { status: 404 });

  const base = (seo?.canonicalBase || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'localhost:3000'}`).replace(/\/$/, '');
  const companyName = brand.companyName || 'Unbekannt';
  const description = seo?.defaultDescription || brand.tagline || '';

  const lines: string[] = [
    `# ${companyName}`,
    '',
    `> ${description}`,
    '',
    `Website: ${base}`,
    ...(contact.phone ? [`Telefon: ${contact.phone}`] : []),
    ...(contact.email ? [`E-Mail: ${contact.email}`] : []),
    ...(contact.address ? [`Adresse: ${contact.address}`] : []),
    '',
    '## Seiten',
    '',
  ];

  for (const page of snapshot.pages.filter(p => p.visible)) {
    const isHome = page.slug === '' || page.slug === 'home' || page.slug === 'startseite';
    const url = isHome ? base : `${base}/${page.slug}`;
    lines.push(`- [${page.title}](${url})`);
  }

  // Collection items
  if (snapshot.collections?.length) {
    lines.push('', '## Inhalte', '');
    for (const col of snapshot.collections) {
      if (col.items.length === 0) continue;
      lines.push(`### ${col.label}`);
      for (const item of col.items) {
        lines.push(`- [${item.title}](${base}/c/${col.key}/${item.slug})`);
      }
      lines.push('');
    }
  }

  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
