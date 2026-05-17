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
import { WhatsAppFab } from '@/components/whatsapp-fab';

async function resolvePageData(slug?: string[]) {
  const tenantId = await resolveTenant();
  if (!tenantId) return null;
  const snapshot = await getActiveSnapshot(tenantId);
  if (!snapshot) return null;
  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );
  if (!page || page.visible === false) return null;
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
  const [navData, footerData, { brand, contact, socialLinks, design }, tenantStyle, seoGlobal] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
    getTenantSeoGlobal(tenantId),
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
  // Custom uploaded fonts take priority
  const headingFontName = brand.customHeadingFontName || brand.headingFont || '';
  const bodyFontName = brand.customBodyFontName || brand.bodyFont || '';
  if (headingFontName) fontCssVars['--style-heading-font'] = `"${headingFontName}", var(--font-outfit), system-ui, sans-serif`;
  if (bodyFontName) fontCssVars['--custom-body-font'] = `"${bodyFontName}", var(--font-inter), system-ui, sans-serif`;

  // @font-face declarations for custom uploaded fonts
  const fontFaceRules: string[] = [];
  if (brand.customHeadingFontUrl && brand.customHeadingFontName) {
    fontFaceRules.push(`@font-face { font-family: "${brand.customHeadingFontName}"; src: url("${brand.customHeadingFontUrl}"); font-display: swap; }`);
  }
  if (brand.customBodyFontUrl && brand.customBodyFontName) {
    fontFaceRules.push(`@font-face { font-family: "${brand.customBodyFontName}"; src: url("${brand.customBodyFontUrl}"); font-display: swap; }`);
  }

  // JSON-LD structured data
  const isHome = !slug || slug.length === 0;
  const canonicalBase = seoGlobal?.canonicalBase || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'localhost:3000'}`;
  const pageUrl = isHome ? canonicalBase : `${canonicalBase.replace(/\/$/, '')}/${page.slug}`;

  // Parse address into structured components
  const addressParts = contact.address?.split(',').map(s => s.trim()) || [];
  const structuredAddress = contact.address ? {
    '@type': 'PostalAddress' as const,
    streetAddress: addressParts[0] || contact.address,
    ...(addressParts[1] && { addressLocality: addressParts[1] }),
    ...(addressParts[2] && { postalCode: addressParts[2] }),
    addressCountry: 'DE',
  } : undefined;

  // Build breadcrumb list
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Startseite', item: canonicalBase },
    ...(!isHome ? [{ '@type': 'ListItem', position: 2, name: page.title, item: pageUrl }] : []),
  ];

  // Detect FAQ sections for FAQPage schema
  const faqSections = visibleSections.filter(s => s.type === 'faq');
  const faqEntries = faqSections.flatMap(s => {
    const items = (s.data.items as { question: string; answer: string }[] | undefined) || [];
    return items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }));
  });

  const jsonLdList: Record<string, unknown>[] = [];

  // Main entity
  if (isHome) {
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${canonicalBase}/#business`,
      name: brand.companyName || '',
      url: canonicalBase,
      ...(brand.logoUrl && { logo: brand.logoUrl, image: brand.logoUrl }),
      ...(contact.phone && { telephone: contact.phone }),
      ...(contact.email && { email: contact.email }),
      ...(structuredAddress && { address: structuredAddress }),
    });
  } else {
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': pageUrl,
      name: page.title,
      url: pageUrl,
      isPartOf: { '@type': 'WebSite', '@id': `${canonicalBase}/#website`, name: brand.companyName || '', url: canonicalBase },
    });
  }

  // BreadcrumbList (always)
  jsonLdList.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  });

  // FAQPage if FAQ sections exist
  if (faqEntries.length > 0) {
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqEntries,
    });
  }

  const brandCssVars = getBrandCssVars(brand);

  return (
    <div data-style={tenantStyle.activeStyle} className="overflow-x-hidden" style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties}>
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      {fontFaceRules.length > 0 && <style dangerouslySetInnerHTML={{ __html: fontFaceRules.join('\n') }} />}
      {bodyFontName && <style dangerouslySetInnerHTML={{ __html: `[data-style] { font-family: var(--custom-body-font) !important; }` }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={firstSectionIsHero} cta={navData.cta} />
      <main>
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} collections={snapshot.collections} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} />
        ))}
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
      {contact.whatsappEnabled && contact.whatsapp && <WhatsAppFab phone={contact.whatsapp} color={contact.whatsappColor} />}
    </div>
  );
}
