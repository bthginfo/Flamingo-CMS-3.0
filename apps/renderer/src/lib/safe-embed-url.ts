const MAP_DOMAINS = [
  'www.google.com',
  'maps.google.com',
  'www.openstreetmap.org',
  'openstreetmap.org',
];

function matchesDomain(hostname: string, rule: string) {
  const normalizedRule = rule.toLowerCase();
  if (normalizedRule.startsWith('*.')) {
    const suffix = normalizedRule.slice(1);
    return hostname.endsWith(suffix) && hostname.length > suffix.length;
  }
  return hostname === normalizedRule;
}

/** Only HTTPS embeds from the explicitly selected provider may render. */
export function safeEmbedUrl(value: unknown, allowedDomains: readonly string[]): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    const hostname = url.hostname.toLowerCase();
    if (!allowedDomains.some(rule => matchesDomain(hostname, rule))) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function safeMapEmbedUrl(value: unknown): string {
  return safeEmbedUrl(value, MAP_DOMAINS) || '';
}
