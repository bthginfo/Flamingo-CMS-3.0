const URL_FIELD = /(?:href|url|src|link|image|logo|avatar|poster|background)$/i;

export function isContentUrlField(key: string) {
  return URL_FIELD.test(key);
}

/** Reject executable/credential-bearing schemes while preserving CMS-relative links. */
export function safeContentUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || /[\u0000-\u001f\u007f]/.test(trimmed)) return '';
  if (trimmed.startsWith('//')) return '';
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) return trimmed;

  const scheme = trimmed.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (!scheme) return trimmed;
  if (scheme === 'mailto' || scheme === 'tel' || scheme === 'sms') return trimmed;
  if (scheme !== 'https') return '';

  try {
    const url = new URL(trimmed);
    if (url.username || url.password) return '';
    return url.toString();
  } catch {
    return '';
  }
}
