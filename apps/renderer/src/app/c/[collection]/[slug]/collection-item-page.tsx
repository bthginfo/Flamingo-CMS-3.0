import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle, getTenantSeoGlobal, getTenantSeoItem, getTenantI18n } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getDesignCssVars } from '@/lib/design-vars';
import { getDb } from '@/lib/db';
import { collections, collectionItems, tenants } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CollectionDetail } from '@/components/collection-detail';
import { WhatsAppFab } from '@/components/whatsapp-fab';

async function resolveTenantSlugForCollectionItem(collection: string, slug: string): Promise<string | null> {
  const db = getDb();
  const matches = await db
    .select({ tenantSlug: tenants.slug })
    .from(collectionItems)
    .innerJoin(collections, and(
      eq(collectionItems.collectionId, collections.id),
      eq(collectionItems.tenantId, collections.tenantId),
    ))
    .innerJoin(tenants, eq(collectionItems.tenantId, tenants.id))
    .where(and(
      eq(collections.key, collection),
      eq(collectionItems.slug, slug),
      eq(collectionItems.published, true),
      eq(tenants.status, 'active'),
    ))
    .limit(2);

  return matches.length === 1 ? matches[0].tenantSlug : null;
}

async function resolveItem(params: Promise<{ collection: string; slug: string }>, tenantSlug?: string) {
  const { collection, slug } = await params;
  const tenantId = await resolveTenant(tenantSlug);
  if (!tenantId) return null;
  const snapshot = await getActiveSnapshot(tenantId);
  if (!snapshot?.collections) return null;
  const col = snapshot.collections.find(c => c.key === collection);
  if (!col) return null;
  const item = col.items.find(i => i.slug === slug);
  if (!item) return null;
  return { tenantId, snapshot, col, item };
}

export async function generateCollectionItemMetadata(params: Promise<{ collection: string; slug: string }>, tenantSlug?: string): Promise<Metadata> {
  const resolved = await resolveItem(params, tenantSlug);
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

export async function renderCollectionItemPage(params: Promise<{ collection: string; slug: string }>, tenantSlug?: string, linkPrefix = '') {
  const { collection, slug } = await params;
  const tenantId = await resolveTenant(tenantSlug);
  if (!tenantId && !tenantSlug) {
    const resolvedTenantSlug = await resolveTenantSlugForCollectionItem(collection, slug);
    if (resolvedTenantSlug) redirect(`/${resolvedTenantSlug}/c/${collection}/${slug}`);
  }
  if (!tenantId) notFound();

  const [snapshot, navData, footerData, { brand, contact, socialLinks, design }, tenantStyle, i18n] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
    getTenantI18n(tenantId),
  ]);

  // Until collection items get proper /[locale]/c/... routing, render with
  // the tenant's default locale. This at minimum unpacks `_localized` section
  // data and item titles/excerpts correctly instead of leaking the raw locale
  // object structure into templates.
  const activeLocale = i18n.enabled ? i18n.defaultLocale : undefined;
  const defaultLocale = i18n.enabled ? i18n.defaultLocale : undefined;

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
  Object.assign(designOverrides, getDesignCssVars(design));

  const customFonts = [brand.headingFont, brand.bodyFont].filter(Boolean) as string[];
  const googleFontsUrl = customFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${customFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`
    : null;
  const fontCssVars: Record<string, string> = {};
  const headingFontName = brand.customHeadingFontName || brand.headingFont || '';
  const bodyFontName = brand.customBodyFontName || brand.bodyFont || '';
  if (headingFontName) fontCssVars['--style-heading-font'] = `"${headingFontName}", var(--font-outfit), system-ui, sans-serif`;
  if (bodyFontName) fontCssVars['--custom-body-font'] = `"${bodyFontName}", var(--font-inter), system-ui, sans-serif`;

  const fontFaceRules: string[] = [];
  if (brand.customHeadingFontUrl && brand.customHeadingFontName) {
    fontFaceRules.push(`@font-face { font-family: "${brand.customHeadingFontName}"; src: url("${brand.customHeadingFontUrl}"); font-display: swap; }`);
  }
  if (brand.customBodyFontUrl && brand.customBodyFontName) {
    fontFaceRules.push(`@font-face { font-family: "${brand.customBodyFontName}"; src: url("${brand.customBodyFontUrl}"); font-display: swap; }`);
  }

  const importantOverrides: string[] = [];
  if (brand.headingColor) importantOverrides.push(`[data-style] main h1, [data-style] main h2, [data-style] main h3, [data-style] main h4, [data-style] main h5, [data-style] main h6 { color: ${brand.headingColor} !important; }`);
  if (brand.bodyTextColor) importantOverrides.push(`[data-style] main p, [data-style] main li { color: ${brand.bodyTextColor} !important; }`);
  if (brand.mutedTextColor) importantOverrides.push(`[data-style] main .text-gray-500, [data-style] main .text-slate-500, [data-style] main .text-gray-600 { color: ${brand.mutedTextColor} !important; }`);
  if (brand.linkColor) importantOverrides.push(`[data-style] main a:not([class*="btn-"]):not([class*="bg-brand"]):not([class*="text-brand"]):not([class*="text-white"]) { color: ${brand.linkColor} !important; }`);

  return (
    <div data-style={tenantStyle.activeStyle} style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties} className="overflow-x-hidden">
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      {fontFaceRules.length > 0 && <style dangerouslySetInnerHTML={{ __html: fontFaceRules.join('\n') }} />}
      {bodyFontName && <style dangerouslySetInnerHTML={{ __html: `[data-style] { font-family: var(--custom-body-font) !important; }` }} />}
      {importantOverrides.length > 0 && <style dangerouslySetInnerHTML={{ __html: importantOverrides.join('\n') }} />}
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} cta={navData.cta} linkPrefix={linkPrefix} />
      <main>
        <CollectionDetail item={item} collection={col} collections={snapshot.collections} backHrefPrefix={linkPrefix} linkPrefix={linkPrefix} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} locale={activeLocale} defaultLocale={defaultLocale} />
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} linkPrefix={linkPrefix} />
      {contact.whatsappEnabled && contact.whatsapp && <WhatsAppFab phone={contact.whatsapp} color={contact.whatsappColor} />}
    </div>
  );
}
