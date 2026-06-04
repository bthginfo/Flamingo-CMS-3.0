'use client';

type ContentBlock = { headline?: string; text?: string };
type Props = { data: Record<string, unknown> };

function sanitizeHtml(html: string): string {
  const ALLOWED_TAGS = new Set(['h1','h2','h3','h4','h5','h6','p','ul','ol','li','strong','em','a','br','span','div','table','thead','tbody','tr','th','td','blockquote']);
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return '';
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

export function LegalContentSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const blocks = (data.blocks as ContentBlock[]) || [];

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        {headline && <h1 className="font-display text-3xl md:text-4xl font-bold mb-12 text-gray-900">{headline}</h1>}
        <div className="space-y-10">
          {blocks.map((block, i) => (
            <article key={i}>
              {block.headline && <h2 className="text-xl font-semibold text-gray-900 mb-3">{block.headline}</h2>}
              {block.text && (
                <div
                  className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-[color:var(--token-icon,var(--brand-primary,#1a5276))] prose-a:no-underline hover:prose-a:underline rt-content"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.text) }}
                />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
