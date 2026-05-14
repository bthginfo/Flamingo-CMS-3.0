import { resolveTenant } from '@/lib/snapshot';
import { getTenantSeoGlobal } from '@/lib/tenant-data';
import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const tenantId = await resolveTenant();
  const seo = tenantId ? await getTenantSeoGlobal(tenantId) : null;
  const base = seo?.canonicalBase || 'https://localhost:3002';

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  };
}
