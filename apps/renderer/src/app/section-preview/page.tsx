import { notFound } from 'next/navigation';
import { getIndustryTemplates } from '@/templates';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { getStyleCssVars } from '@/lib/styles';

export default async function SectionPreviewPage({ searchParams }: { searchParams: Promise<{ type?: string; industry?: string; style?: string }> }) {
  const params = await searchParams;
  const { type, industry = 'tradesman', style = 'classic' } = params;
  if (!type) return notFound();

  const templates = getIndustryTemplates(industry);
  const Component = templates[type];
  if (!Component) return notFound();

  const data = SECTION_PREVIEW_DATA[type] || {};
  const styleCssVars = getStyleCssVars(industry, style);

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white" style={styleCssVars as React.CSSProperties}>
        <div data-style={style}>
          <main>
            <section>
              <div className="max-w-7xl mx-auto px-6 py-12">
                <Component data={data} variant={null} styleVariant={style} />
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
