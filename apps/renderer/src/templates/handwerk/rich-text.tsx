type Props = { data: Record<string, unknown> };

// Simple allowlist-based sanitizer for server-side rendering.
// Only allows safe structural/text HTML tags and href/target/rel attributes.
function sanitizeHtml(html: string): string {
  const ALLOWED_TAGS = new Set(['h1','h2','h3','h4','p','ul','ol','li','strong','em','a','br','span','div','table','thead','tbody','tr','th','td','blockquote']);
  // Strip all tags except allowed ones
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return '';
    // For allowed tags, only keep href, target, rel attributes
    if (match.startsWith('</')) return `</${lower}>`;
    const hrefMatch = match.match(/\bhref="([^"]*?)"/);
    const targetMatch = match.match(/\btarget="([^"]*?)"/);
    const relMatch = match.match(/\brel="([^"]*?)"/);
    const attrs = [
      hrefMatch ? ` href="${hrefMatch[1]}"` : '',
      targetMatch ? ` target="${targetMatch[1]}"` : '',
      relMatch ? ` rel="${relMatch[1]}"` : '',
    ].join('');
    return `<${lower}${attrs}>`;
  });
}

export function RichTextSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const content = (data.content as string) || '';
  const clean = sanitizeHtml(content);

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        {headline && <h1 className="font-display text-4xl font-bold mb-10 text-center">{headline}</h1>}
        <div
          className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-a:text-[color:var(--token-icon,var(--brand-primary,#1a5276))] prose-a:no-underline hover:prose-a:underline rt-content"
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
