import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { resolveTenant, getActiveSnapshot } = await import('@/lib/snapshot');
  const { getTenantSeoGlobal, getTenantI18n } = await import('@/lib/tenant-data');
  const tenantId = await resolveTenant();
  if (!tenantId) return [];

  const [snapshot, seo, i18n] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantSeoGlobal(tenantId),
    getTenantI18n(tenantId),
  ]);
  if (!snapshot) return [];

  const base = (seo?.canonicalBase || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'localhost:3000'}`).replace(/\/$/, '');

  // i18n-aware sitemap: when locales are configured, emit one entry per
  // (page, locale) pair and link them together via the `alternates.languages`
  // map (rendered as <xhtml:link rel="alternate" hreflang=…> by Next).
  const locales: string[] = (i18n?.enabled && i18n.locales.length > 0) ? i18n.locales : [];
  const defaultLocale = i18n?.defaultLocale || (locales[0] ?? 'de');

  function urlForPage(slug: string, locale?: string): string {
    const isHome = slug === '' || slug === 'home' || slug === 'startseite';
    const prefix = locale && locale !== defaultLocale ? `/${locale}` : '';
    if (isHome) return `${base}${prefix}` || base;
    return `${base}${prefix}/${slug}`;
  }

  function alternatesForPage(slug: string): Record<string, string> | undefined {
    if (locales.length === 0) return undefined;
    const languages: Record<string, string> = {};
    for (const loc of locales) {
      languages[loc] = urlForPage(slug, loc);
    }
    languages['x-default'] = urlForPage(slug, defaultLocale);
    return languages;
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const p of snapshot.pages) {
    if (!p.visible) continue;
    const isHome = p.slug === '' || p.slug === 'home' || p.slug === 'startseite';
    const slugForUrl = isHome ? '' : p.slug;
    const alternates = alternatesForPage(slugForUrl);
    if (locales.length === 0) {
      entries.push({
        url: urlForPage(slugForUrl),
        lastModified: new Date(),
        changeFrequency: isHome ? 'weekly' as const : 'monthly' as const,
        priority: isHome ? 1 : 0.8,
      });
    } else {
      for (const loc of locales) {
        entries.push({
          url: urlForPage(slugForUrl, loc),
          lastModified: new Date(),
          changeFrequency: isHome ? 'weekly' as const : 'monthly' as const,
          priority: isHome ? 1 : 0.8,
          ...(alternates && { alternates: { languages: alternates } }),
        });
      }
    }
  }

  // Collection items (blog posts, etc.)
  if (snapshot.collections) {
    for (const col of snapshot.collections) {
      for (const item of col.items) {
        const slug = `c/${col.key}/${item.slug}`;
        const alternates = alternatesForPage(slug);
        if (locales.length === 0) {
          entries.push({
            url: `${base}/${slug}`,
            lastModified: new Date(item.updatedAt),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        } else {
          for (const loc of locales) {
            entries.push({
              url: urlForPage(slug, loc),
              lastModified: new Date(item.updatedAt),
              changeFrequency: 'monthly',
              priority: 0.6,
              ...(alternates && { alternates: { languages: alternates } }),
            });
          }
        }
      }
    }
  }

  return entries;
}
