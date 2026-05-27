const INTERNAL_HREF_KEYS = new Set(['href', 'ctaHref']);

export function prefixInternalHref(href: unknown, linkPrefix = ''): unknown {
  if (!linkPrefix || typeof href !== 'string') return href;
  if (!href || href === '#') return href;
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  if (href === linkPrefix || href.startsWith(`${linkPrefix}/`)) return href;
  if (href.startsWith('/api/') || href.startsWith('/admin') || href.startsWith('/demo')) return href;
  return href === '/' ? linkPrefix : `${linkPrefix}${href}`;
}

export function prefixInternalLinks<T>(value: T, linkPrefix = ''): T {
  if (!linkPrefix || value == null) return value;
  if (Array.isArray(value)) return value.map(item => prefixInternalLinks(item, linkPrefix)) as T;
  if (typeof value !== 'object') return value;

  const entries = Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
    const normalizedKey = key.toLowerCase();
    if (INTERNAL_HREF_KEYS.has(key) || normalizedKey.endsWith('href')) {
      return [key, prefixInternalHref(entry, linkPrefix)];
    }
    return [key, prefixInternalLinks(entry, linkPrefix)];
  });

  return Object.fromEntries(entries) as T;
}
