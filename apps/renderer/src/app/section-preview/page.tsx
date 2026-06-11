import { notFound } from 'next/navigation';
import { getIndustryTemplates } from '@/templates';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { SECTION_EDITOR_FIELD_DEFAULTS } from '@/lib/section-editor-field-defaults';
import { getStyleCssVars } from '@/lib/styles';
import { SectionRenderer } from '@/components/section-renderer';

const HERO_PREVIEW_TYPE_BY_INDUSTRY: Record<string, string> = {
  tradesman: 'heroHandwerk',
  restaurant: 'heroRestaurant',
  hotel: 'heroHotel',
  tourism: 'heroTourism',
  salon: 'heroSalon',
  medical: 'heroMedical',
  wedding: 'heroWedding',
  consulting: 'heroConsulting',
  realestate: 'heroRealestate',
  cafe: 'heroCafe',
  tattoo: 'heroTattoo',
  ecommerce: 'heroEcommerce',
};

export default async function SectionPreviewPage({ searchParams }: { searchParams: Promise<{ type?: string; industry?: string; style?: string }> }) {
  const params = await searchParams;
  const { type, industry = 'tradesman' } = params;
  const style = 'classic';
  if (!type) return notFound();

  const templates = getIndustryTemplates(industry);
  const Component = templates[type];
  if (!Component) {
    return (
      <html lang="de"><body className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500 text-sm">
        <p>Keine Vorschau für &ldquo;{type}&rdquo; in Branche &ldquo;{industry}&rdquo; verfügbar.</p>
      </body></html>
    );
  }

  const previewType = type === 'hero' ? HERO_PREVIEW_TYPE_BY_INDUSTRY[industry] || type : type;
  const data = {
    ...(SECTION_EDITOR_FIELD_DEFAULTS[type] || {}),
    ...(SECTION_EDITOR_FIELD_DEFAULTS[previewType] || {}),
    ...(SECTION_PREVIEW_DATA[type] || {}),
    ...(SECTION_PREVIEW_DATA[previewType] || {}),
  };
  const styleCssVars = getStyleCssVars(industry, style);
  const previewSection = {
    id: `preview-${type}`,
    type,
    variant: null,
    visible: true,
    locked: false,
    container: 'default',
    spacingTop: 'm',
    spacingBottom: 'm',
    anchorId: null,
    styleOverrides: null,
    data,
    sortOrder: 0,
  };

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white" style={styleCssVars as React.CSSProperties}>
        <div data-style={style}>
          <main>
            {type === 'uspStrip' && <div className="h-24" />}
            <SectionRenderer section={previewSection} styleVariant={style} industry={industry} />
          </main>
        </div>
      </body>
    </html>
  );
}
