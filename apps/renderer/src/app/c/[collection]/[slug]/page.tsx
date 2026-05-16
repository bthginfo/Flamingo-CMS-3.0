import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle, getTenantSeoGlobal, getTenantSeoItem } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import type { Metadata } from 'next';

export const revalidate = 60;
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CollectionDetail } from '@/components/collection-detail';

async function resolveItem(params: Promise<{ collection: string; slug: string }>) {
  const { collection, slug } = await params;
  const tenantId = await resolveTenant();
  if (!tenantId) return null;
  const snapshot = await getActiveSnapshot(tenantId);
  if (!snapshot?.collections) return null;
  const col = snapshot.collections.find(c => c.key === collection);
  if (!col) return null;
  const item = col.items.find(i => i.slug === slug);
  if (!item) return null;
  return { tenantId, snapshot, col, item };
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string; slug: string }> }): Promise<Metadata> {
  const resolved = await resolveItem(params);
  if (!resolved) return {};
  const { tenantId, item } = resolved;

  const [seoGlobal, seoItemData, { brand }] = await Promise.all([
    getTenantSeoGlobal(tenantId),
    getTenantSeoItem(tenantId, item.id),
    getTenantBrand(tenantId),
  ]);

  const itemTitle = seoItemData?.metaTitle || item.title;
  const title = seoGlobal?.titleTemplate
    ? seoGlobal.titleTemplate.replace('%s', itemTitle)
    : itemTitle;
  const description = seoItemData?.metaDescription || seoGlobal?.defaultDescription || undefined;
  const ogImage = seoItemData?.ogImage || seoGlobal?.defaultOgImage || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand.companyName || undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    robots: seoItemData?.noindex ? 'noindex,nofollow' : (seoGlobal?.robots || 'index,follow'),
  };
}

export default async function CollectionItemPage({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  const tenantId = await resolveTenant();
  if (!tenantId) notFound();

  const [snapshot, navData, footerData, { brand, contact, socialLinks }, tenantStyle, seoGlobal] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
    getTenantSeoGlobal(tenantId),
  ]);

  if (!snapshot?.collections) notFound();

  const col = snapshot.collections.find(c => c.key === collection);
  if (!col) notFound();

  const item = col.items.find(i => i.slug === slug);
  if (!item) notFound();

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);
  const brandCssVars = getBrandCssVars(brand);
  const designOverrides: Record<string, string> = {};
  if (brand.primaryColor) designOverrides['--style-brand'] = brand.primaryColor;
  if (brand.accentColor) designOverrides['--style-accent'] = brand.accentColor;

  return (
    <div data-style={tenantStyle.activeStyle} style={{ ...styleCssVars, ...brandCssVars, ...designOverrides } as React.CSSProperties} className="overflow-x-hidden">
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} cta={navData.cta} />
      <main>
        <CollectionDetail item={item} collection={col} collections={snapshot.collections} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} />
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
    </div>
  );
}
