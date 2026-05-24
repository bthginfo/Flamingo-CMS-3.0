import { notFound } from 'next/navigation';
import { getIndustryTemplates } from '@/templates';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { getStyleCssVars } from '@/lib/styles';

const FULL_BLEED_TYPES = new Set([
  'hero', 'collectionHero', 'noticeBanner', 'atmosphereGallery',
  'styleGallery', 'artistGrid', 'artistHero', 'tattooBookingCta',
  'aftercareSteps', 'pricingInfo', 'tattooBooking', 'flashDayBanner',
  'photographerAbout', 'shootingProcess', 'marketReport', 'valuationCta',
  'eventSchedule', 'faqGallery', 'giftRegistry', 'rsvp', 'venueInfo',
  'dailySpecials', 'servicePackages', 'ctaBand', 'headerBanner',
  'bookingStrip', 'statsCounter', 'socialProofBar', 'uspStrip',
  'testimonialMarquee', 'logoMarquee', 'featureShowcase', 'caseResults',
  'map', 'stats', 'coupleStory', 'dresscode', 'weddingMenu',
  'roomShowcase', 'wellness', 'ambience', 'signatureDishes',
  'portfolioGallery', 'bentoGrid', 'locationVibe',
  'horizontalScrollShowcase', 'verticalTimeline', 'beforeAfterSlider',
]);

export default async function SectionPreviewPage({ searchParams }: { searchParams: Promise<{ type?: string; industry?: string; style?: string }> }) {
  const params = await searchParams;
  const { type, industry = 'tradesman', style = 'classic' } = params;
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

  const data = SECTION_PREVIEW_DATA[type] || {};
  const styleCssVars = getStyleCssVars(industry, style);
  const isFullBleed = FULL_BLEED_TYPES.has(type);

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
            {isFullBleed ? (
              <Component data={data} variant={null} styleVariant={style} />
            ) : (
              <section>
                <div className="max-w-7xl mx-auto px-6 py-12">
                  <Component data={data} variant={null} styleVariant={style} />
                </div>
              </section>
            )}
          </main>
        </div>
      </body>
    </html>
  );
}
