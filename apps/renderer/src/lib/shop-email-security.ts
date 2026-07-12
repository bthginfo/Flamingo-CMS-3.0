const MAX_EMAIL_URL_LENGTH = 2_048;

export function escapeShopEmailHtml(value: unknown) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character] || character,
  );
}

export function sanitizeShopEmailHeaderValue(value: unknown, maxLength = 160) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function getSafeShopEmailUrl(value: unknown) {
  const raw = String(value ?? '').trim();
  if (!raw || raw.length > MAX_EMAIL_URL_LENGTH || /[\u0000-\u001f\u007f]/.test(raw)) return null;

  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}
