import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let base = 'https://localhost:3002';
  try {
    const { resolveTenant } = await import('@/lib/snapshot');
    const { getTenantSeoGlobal } = await import('@/lib/tenant-data');
    const tenantId = await resolveTenant();
    if (tenantId) {
      const seo = await getTenantSeoGlobal(tenantId);
      if (seo?.canonicalBase) base = seo.canonicalBase;
    }
  } catch { /* build-time: no DB */ }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
