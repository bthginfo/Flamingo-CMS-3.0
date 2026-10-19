import { sanitizeHtml } from '@/lib/sanitize-html';

type Props = { data: Record<string, unknown> };

export function RichTextSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const content = (data.content as string) || (data.text as string) || (data.html as string) || '';
  const clean = sanitizeHtml(content);
  const Title = data.titleAs === 'h2' || data.headingLevel === 'h2' ? 'h2' : 'h1';

  return (
    <section className="py-7 md:py-12">
      <div className="max-w-3xl mx-auto px-6">
        {headline && <Title className="font-display text-3xl md:text-4xl font-semibold mb-7 text-[color:var(--token-heading)] [text-wrap:balance]" data-edit-path="headline">{headline}</Title>}
        <div
          className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-a:text-[color:var(--token-icon)] prose-a:no-underline hover:prose-a:underline rt-content"
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
