import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { resolveTenant, getActiveSnapshot } = await import('@/lib/snapshot');
  const { getTenantSeoGlobal } = await import('@/lib/tenant-data');
  const tenantId = await resolveTenant();
  if (!tenantId) return [];

  const [snapshot, seo] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantSeoGlobal(tenantId),
  ]);
  if (!snapshot) return [];

  const base = seo?.canonicalBase || 'https://localhost:3002';

  return snapshot.pages
    .filter(p => p.visible)
    .map(p => ({
      url: `${base}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: p.slug === '' || p.slug === 'home' ? 'weekly' as const : 'monthly' as const,
      priority: p.slug === '' || p.slug === 'home' ? 1 : 0.8,
    }));
}
