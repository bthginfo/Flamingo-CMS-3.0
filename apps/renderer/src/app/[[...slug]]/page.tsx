import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantSeoGlobal, getTenantSeoPage, getTenantStyle } from '@/lib/tenant-data';

// ISR: revalidate every 60s, on-demand revalidation via publish webhook
export const revalidate = 60;
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

async function resolvePageData(slug?: string[]) {
  const tenantId = await resolveTenant();
  if (!tenantId) return null;
  const snapshot = await getActiveSnapshot(tenantId);
  if (!snapshot) return null;
  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );
  if (!page || !page.visible) return null;
  return { tenantId, snapshot, page };
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await resolvePageData(slug);
  if (!result) return {};

  const { tenantId, page } = result;
  const [seoGlobal, seoPage, { brand }] = await Promise.all([
    getTenantSeoGlobal(tenantId),
    getTenantSeoPage(tenantId, page.id),
    getTenantBrand(tenantId),
  ]);

  const pageTitle = seoPage?.metaTitle || page.title;
  const title = seoGlobal?.titleTemplate
    ? seoGlobal.titleTemplate.replace('%s', pageTitle)
    : pageTitle;
  const description = seoPage?.metaDescription || seoGlobal?.defaultDescription || undefined;
  const ogImage = seoPage?.ogImage || seoGlobal?.defaultOgImage || undefined;
  const canonical = seoPage?.canonical || (seoGlobal?.canonicalBase ? `${seoGlobal.canonicalBase}/${page.slug}` : undefined);

  return {
    title,
    description,
    ...(brand.logoUrl && {
      icons: {
        icon: brand.logoUrl,
        apple: brand.logoUrl,
      },
    }),
    openGraph: {
      title,
      description,
      type: page.slug === '' || page.slug === 'home' || page.slug === 'startseite' ? 'website' : 'article',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
      locale: seoGlobal?.locale || 'de_DE',
      siteName: brand.companyName || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    ...(canonical && { alternates: { canonical } }),
    robots: seoPage?.noindex ? 'noindex,nofollow' : (seoGlobal?.robots || 'index,follow'),
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const result = await resolvePageData(slug);
  if (!result) notFound();

  const { tenantId, snapshot, page } = result;
  const [navData, footerData, { brand, contact, socialLinks, design }, tenantStyle] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
  ]);

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);

  // Merge custom design overrides from DB into CSS variables
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
  // Map brand colors to accent/brand vars
  if (brand.primaryColor) designOverrides['--style-brand'] = brand.primaryColor;
  if (brand.accentColor) designOverrides['--style-accent'] = brand.accentColor;
  // Map extended design fields
  for (const [key, cssVar] of Object.entries(designToCssVar)) {
    if (design[key]) designOverrides[cssVar] = design[key];
  }
  const visibleSections = page.sections.filter(s => s.visible);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

  // Custom font loading
  const customFonts = [brand.headingFont, brand.bodyFont].filter(Boolean) as string[];
  const googleFontsUrl = customFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${customFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`
    : null;
  const fontCssVars: Record<string, string> = {};
  if (brand.headingFont) fontCssVars['--style-heading-font'] = `"${brand.headingFont}", var(--font-outfit), system-ui, sans-serif`;
  if (brand.bodyFont) fontCssVars['--custom-body-font'] = `"${brand.bodyFont}", var(--font-inter), system-ui, sans-serif`;

  // JSON-LD structured data
  const isHome = !slug || slug.length === 0;
  const jsonLd = isHome ? {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: brand.companyName || '',
    ...(brand.logoUrl && { logo: brand.logoUrl, image: brand.logoUrl }),
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.email && { email: contact.email }),
    ...(contact.address && { address: { '@type': 'PostalAddress', streetAddress: contact.address } }),
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    ...(brand.companyName && { isPartOf: { '@type': 'WebSite', name: brand.companyName } }),
  };

  const brandCssVars = getBrandCssVars(brand);

  return (
    <div data-style={tenantStyle.activeStyle} style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties}>
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      {brand.bodyFont && <style dangerouslySetInnerHTML={{ __html: `[data-style] { font-family: var(--custom-body-font) !important; }` }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={firstSectionIsHero} cta={navData.cta} />
      <main>
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} collections={snapshot.collections} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} />
        ))}
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
    </div>
  );
}
