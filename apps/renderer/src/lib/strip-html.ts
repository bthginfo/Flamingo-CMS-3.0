/** Strip HTML tags from a string, returning plain text. */
export function plain(html: string | undefined | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}
