import { resolveTenant, getDraftSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { notFound } from 'next/navigation';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params, searchParams }: { params: Promise<{ slug?: string[] }>; searchParams: Promise<{ token?: string }> }) {
  const { slug } = await params;
  const { token } = await searchParams;
  const secret = process.env.PREVIEW_SECRET || process.env.NEXT_PUBLIC_PREVIEW_SECRET || 'preview';

  if (token !== secret) notFound();

  const tenantId = await resolveTenant();
  if (!tenantId) notFound();

  const snapshot = await getDraftSnapshot(tenantId);
  if (!snapshot) notFound();

  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );
  if (!page) notFound();

  const [navData, footerData, { brand, contact, socialLinks, design }, tenantStyle] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
  ]);

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);
  const brandCssVars = getBrandCssVars(brand);
  const designOverrides: Record<string, string> = {};
  const designToCssVar: Record<string, string> = {
    textPrimary: '--style-text-primary',
    textSecondary: '--style-text-secondary',
    sectionBg: '--style-section-bg',
    sectionBgAlt: '--style-section-bg-alt',
    cardBg: '--style-card-bg',
    badgeBg: '--style-badge-bg',
    badgeText: '--style-badge-text',
    brand: '--style-brand',
    dividerColor: '--style-divider-color',
  };
  if (brand.primaryColor) designOverrides['--style-brand'] = brand.primaryColor;
  if (brand.accentColor) designOverrides['--style-accent'] = brand.accentColor;
  for (const [key, cssVar] of Object.entries(designToCssVar)) {
    if (design[key]) designOverrides[cssVar] = design[key];
  }
  const fontCssVars: Record<string, string> = {};
  const headingFontName = brand.customHeadingFontName || brand.headingFont || '';
  const bodyFontName = brand.customBodyFontName || brand.bodyFont || '';
  if (headingFontName) fontCssVars['--style-heading-font'] = `"${headingFontName}", var(--font-outfit), system-ui, sans-serif`;
  if (bodyFontName) fontCssVars['--custom-body-font'] = `"${bodyFontName}", var(--font-inter), system-ui, sans-serif`;
  const customFonts = [brand.headingFont, brand.bodyFont].filter(Boolean) as string[];
  const googleFontsUrl = customFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${customFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`
    : null;
  const visibleSections = page.sections.filter(s => s.visible);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

  return (
    <div data-style={tenantStyle.activeStyle} style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties}>
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center text-xs py-1 font-medium">
        Entwurfs-Vorschau — Nicht veröffentlicht
      </div>
      <div className="pt-6">
        <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={firstSectionIsHero} cta={navData.cta} />
        <main>
          {visibleSections.map((section) => (
            <SectionRenderer key={section.id} section={section} collections={snapshot.collections} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} />
          ))}
        </main>
        <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
      </div>
    </div>
  );
}
