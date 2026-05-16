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

  const base = (seo?.canonicalBase || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'localhost:3000'}`).replace(/\/$/, '');

  const entries: MetadataRoute.Sitemap = snapshot.pages
    .filter(p => p.visible)
    .map(p => {
      const isHome = p.slug === '' || p.slug === 'home' || p.slug === 'startseite';
      return {
        url: isHome ? base : `${base}/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: isHome ? 'weekly' as const : 'monthly' as const,
        priority: isHome ? 1 : 0.8,
      };
    });

  // Collection items (blog posts, etc.)
  if (snapshot.collections) {
    for (const col of snapshot.collections) {
      for (const item of col.items) {
        entries.push({
          url: `${base}/c/${col.key}/${item.slug}`,
          lastModified: new Date(item.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
