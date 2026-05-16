/**
 * Renders a string that may contain HTML (from the mini rich text editor).
 * Falls back to plain text display if no HTML tags are present.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  if (/<[a-z][\s\S]*>/i.test(html)) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span className={className}>{html}</span>;
}
