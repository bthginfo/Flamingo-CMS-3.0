'use client';

import { sanitizeHtml } from '@/lib/sanitize-html';

type ContentBlock = { headline?: string; title?: string; text?: string };
type Props = { data: Record<string, unknown> };

export function LegalContentSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  // `content` = single-HTML-string form (older data); `blocks` = structured form.
  const content = (data.content as string) || '';
  const blocks = ((data.blocks as ContentBlock[]) || []).map((b) => b && ({ ...b, headline: b.headline ?? b.title }));

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        {headline && <h1 className="font-display text-3xl md:text-4xl font-bold mb-12 text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h1>}
        {content && (
          <div
            className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-[color:var(--token-icon)] prose-a:no-underline hover:prose-a:underline rt-content mb-10"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        )}
        <div className="space-y-10">
          {blocks.map((block, i) => (
            <article key={i} data-edit-collection="blocks" data-edit-index={i}>
              {block.headline && <h2 className="text-xl font-semibold text-[color:var(--token-heading)] mb-3" data-edit-path="headline">{block.headline}</h2>}
              {block.text && (
                <div
                  className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-[color:var(--token-icon)] prose-a:no-underline hover:prose-a:underline rt-content"
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
