import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { isShopActive } from '@/lib/shop-pages';
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
  const { tenantId, item, col } = resolved;

  const [seoGlobal, seoItemData, { brand }, i18n] = await Promise.all([
    getTenantSeoGlobal(tenantId),
    getTenantSeoItem(tenantId, item.id),
    getTenantBrand(tenantId),
    getTenantI18n(tenantId),
  ]);

  const itemTitle = seoItemData?.metaTitle || item.title;
  const title = seoGlobal?.titleTemplate
    ? seoGlobal.titleTemplate.replace('%s', itemTitle)
    : itemTitle;
  const description = seoItemData?.metaDescription || seoGlobal?.defaultDescription || undefined;
  const ogImage = seoItemData?.ogImage || seoGlobal?.defaultOgImage || undefined;

  // hreflang alternates per enabled locale so Google understands /en/c/... is
  // the English version of /c/...
  let languageAlternates: Record<string, string> | undefined;
  if (i18n.enabled && i18n.locales.length > 0 && seoGlobal?.canonicalBase) {
    const base = seoGlobal.canonicalBase.replace(/\/$/, '');
    const slugForUrl = `c/${col.key}/${item.slug}`;
    languageAlternates = {};
    for (const loc of i18n.locales) {
      const prefix = loc !== i18n.defaultLocale ? `/${loc}` : '';
      languageAlternates[loc] = `${base}${prefix}/${slugForUrl}`;
    }
    languageAlternates['x-default'] = `${base}/${slugForUrl}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand.companyName || undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    ...(languageAlternates && {
      alternates: { languages: languageAlternates },
    }),
    robots: seoItemData?.noindex ? 'noindex,nofollow' : (seoGlobal?.robots || 'index,follow'),
  };
}

export async function renderCollectionItemPage(params: Promise<{ collection: string; slug: string }>, tenantSlug?: string, linkPrefix = '', explicitLocale?: string) {
  const { collection, slug } = await params;
  const tenantId = await resolveTenant(tenantSlug);
  if (!tenantId && !tenantSlug) {
    const resolvedTenantSlug = await resolveTenantSlugForCollectionItem(collection, slug);
    if (resolvedTenantSlug) redirect(`/${resolvedTenantSlug}/c/${collection}/${slug}`);
  }
  if (!tenantId) notFound();

  const [snapshot, navData, footerData, { brand, contact, socialLinks, design }, tenantStyle, i18n] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantNav(tenantId, explicitLocale),
    getTenantFooter(tenantId, explicitLocale),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
    getTenantI18n(tenantId),
  ]);

  // Locale resolution: explicit param from /<locale>/c/... routing takes
  // precedence, otherwise default to the tenant's default locale (so
  // _localized data is unpacked instead of leaking as a raw object).
  const activeLocale = i18n.enabled
    ? (explicitLocale && i18n.locales.includes(explicitLocale) ? explicitLocale : i18n.defaultLocale)
    : undefined;
  const defaultLocale = i18n.enabled ? i18n.defaultLocale : undefined;

  if (!snapshot?.collections) notFound();

  const col = snapshot.collections.find(c => c.key === collection);
  if (!col) notFound();

  const item = col.items.find(i => i.slug === slug);
  if (!item) notFound();

  const shopEnabled = await isShopActive(tenantId);
  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);
  const brandCssVars = getBrandCssVars(brand);
  const designOverrides: Record<string, string> = {};
  if (brand.primaryColor) designOverrides['--style-brand'] = brand.primaryColor;
  if (brand.accentColor) {
    designOverrides['--token-accent'] = brand.accentColor;
    designOverrides['--style-accent'] = brand.accentColor;
  }
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

  return (
    <div data-style={tenantStyle.activeStyle} style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties} className="overflow-x-hidden">
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      {fontFaceRules.length > 0 && <style dangerouslySetInnerHTML={{ __html: fontFaceRules.join('\n') }} />}
      {bodyFontName && <style dangerouslySetInnerHTML={{ __html: `[data-style] { font-family: var(--custom-body-font) !important; }` }} />}
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} cta={navData.cta} topBar={navData.topBar} linkPrefix={linkPrefix} i18n={i18n.enabled ? { locales: i18n.locales, currentLocale: activeLocale || i18n.defaultLocale, defaultLocale: i18n.defaultLocale } : undefined} />
      <main>
        <CollectionDetail item={item} collection={col} collections={snapshot.collections} backHrefPrefix={linkPrefix} linkPrefix={linkPrefix} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} locale={activeLocale} defaultLocale={defaultLocale} />
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} linkPrefix={linkPrefix} shopEnabled={shopEnabled} />
      {contact.whatsappEnabled && contact.whatsapp && <WhatsAppFab phone={contact.whatsapp} color={contact.whatsappColor} />}
    </div>
  );
}
