import type { MetadataRoute } from 'next';

const BASE = 'https://www.flamingomedia.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'templates', 'cms', 'shop', 'booking', 'prozess', 'preise', 'blog', 'ueber-uns', 'kontakt', 'foerderrechner', 'demo', 'impressum', 'datenschutz', 'agb'];
  return pages.map(p => ({
    url: `${BASE}/${p}`,
    lastModified: new Date(),
    changeFrequency: p === '' ? 'weekly' as const : 'monthly' as const,
    priority: p === '' ? 1 : 0.7,
  }));
}
