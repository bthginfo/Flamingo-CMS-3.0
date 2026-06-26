import { sanitizeHtml } from '@/lib/sanitize-html';

type Props = { data: Record<string, unknown> };

export function RichTextSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const content = (data.content as string) || '';
  const clean = sanitizeHtml(content);

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        {headline && <h1 className="font-display text-4xl font-bold mb-10 text-center" data-edit-path="headline">{headline}</h1>}
        <div
          className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-a:text-[color:var(--token-icon)] prose-a:no-underline hover:prose-a:underline rt-content"
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
