import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantSeoGlobal, getTenantSeoPage } from '@/lib/tenant-data';
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
    openGraph: {
      title,
      description,
      ...(ogImage && { images: [{ url: ogImage }] }),
      locale: seoGlobal?.locale || 'de_DE',
      siteName: brand.companyName || undefined,
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
  const [navItems, footerData, { brand, contact, socialLinks }] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
  ]);

  const visibleSections = page.sections.filter(s => s.visible);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

  return (
    <>
      <SiteHeader navItems={navItems} brand={brand} contact={contact} darkBg={firstSectionIsHero} />
      <main>
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} collections={snapshot.collections} />
        ))}
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
    </>
  );
}
