import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantSeoGlobal, getTenantSeoPage, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
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
  const [navData, footerData, { brand, contact, socialLinks }, tenantStyle] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
  ]);

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);
  const visibleSections = page.sections.filter(s => s.visible);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

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

  return (
    <div data-style={tenantStyle.activeStyle} style={styleCssVars as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={firstSectionIsHero} cta={navData.cta} />
      <main>
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} collections={snapshot.collections} />
        ))}
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
    </div>
  );
}
