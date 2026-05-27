import { getDb } from '@/lib/db';
import { navigation, footer, globalSettings, seoGlobal, seoPage, seoItem, tenants } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export type NavItem = { label: string; href: string; type?: string };
export type NavCta = { label: string; href: string };
export type FooterColumn = { title: string; items: { text: string; href?: string }[] };
export type FooterData = { columns: FooterColumn[]; legalLinks: { label: string; href: string }[]; cta?: { label: string; href: string } | null };
export type BrandData = { companyName?: string; tagline?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; logoUrl?: string; logoDisplay?: 'logo' | 'logoAndName' | 'name'; headingFont?: string; bodyFont?: string; topBarColor?: string; footerColor?: string; customHeadingFontUrl?: string; customHeadingFontName?: string; customBodyFontUrl?: string; customBodyFontName?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; navBgColor?: string; navBrandColor?: string; navLogoColor?: string; headingColor?: string; bodyTextColor?: string; mutedTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string; btnSecondaryBg?: string; btnSecondaryText?: string; btnSecondaryBorder?: string; btnOutlineBg?: string; btnOutlineText?: string; btnOutlineBorder?: string; badgeBg?: string; badgeText?: string; badgeBorder?: string; cardBorder?: string; dividerColor?: string; btnRadius?: string; cardRadius?: string };
export type SocialLinks = Record<string, string>;
export type ContactData = { phone?: string; email?: string; address?: string; whatsapp?: string; whatsappEnabled?: boolean; whatsappColor?: string };

function isPlaceholderCompanyName(value?: string): boolean {
  const normalized = (value || '').trim().toLowerCase();
  return !normalized || normalized === 'firmenname' || normalized === 'firma' || normalized === 'company name';
}

export async function getTenantStyle(tenantId: string): Promise<{ industry: string; activeStyle: string }> {
  const db = getDb();
  const [t] = await db.select({ industry: tenants.industry, activeStyle: tenants.activeStyle }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  return { industry: t?.industry ?? 'tradesman', activeStyle: t?.activeStyle ?? 'classic' };
}

export async function getTenantI18n(tenantId: string): Promise<{ enabled: boolean; locales: string[]; defaultLocale: string }> {
  const db = getDb();
  const [t] = await db.select({ enabled: tenants.i18nEnabled, locales: tenants.i18nLocales, defaultLocale: tenants.i18nDefaultLocale }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  return {
    enabled: t?.enabled ?? false,
    locales: (t?.locales || 'de').split(','),
    defaultLocale: t?.defaultLocale || 'de',
  };
}

export async function getTenantNav(tenantId: string, locale?: string): Promise<{ items: NavItem[]; cta: NavCta | null }> {
  const db = getDb();
  const [nav] = await db.select().from(navigation).where(eq(navigation.tenantId, tenantId)).limit(1);
  let items = nav?.items as any;
  let cta = nav?.cta as any;
  if (items?._localized && locale) {
    items = items[locale] ?? items._default ?? [];
  } else if (items?._localized) {
    items = items._default ?? [];
  }
  if (cta?._localized && locale) {
    cta = cta[locale] ?? cta._default ?? null;
  } else if (cta?._localized) {
    cta = cta._default ?? null;
  }
  return {
    items: (items as NavItem[]) || [],
    cta: cta?.label ? cta : null,
  };
}

export async function getTenantFooter(tenantId: string, locale?: string): Promise<FooterData | null> {
  const db = getDb();
  const [f] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);
  if (!f) return null;
  let columns = f.columns as any;
  let legalLinks = f.legalLinks as any;
  let cta = (f as any).cta as any;
  if (columns?._localized && locale) {
    columns = columns[locale] ?? columns._default ?? [];
  } else if (columns?._localized) {
    columns = columns._default ?? [];
  }
  if (legalLinks?._localized && locale) {
    legalLinks = legalLinks[locale] ?? legalLinks._default ?? [];
  } else if (legalLinks?._localized) {
    legalLinks = legalLinks._default ?? [];
  }
  if (cta?._localized && locale) {
    cta = cta[locale] ?? cta._default ?? null;
  } else if (cta?._localized) {
    cta = cta._default ?? null;
  }
  return { columns: columns as FooterColumn[], legalLinks: legalLinks as { label: string; href: string }[], cta: cta as { label: string; href: string } | null };
}

export async function getTenantBrand(tenantId: string): Promise<{ brand: BrandData; contact: ContactData; socialLinks: SocialLinks; design: Record<string, string> }> {
  const db = getDb();
  const [s] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  const [tenant] = await db.select({ name: tenants.name }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  const brand = { ...(((s?.brand as BrandData) || {}) as BrandData) };
  if (tenant?.name && isPlaceholderCompanyName(brand.companyName)) {
    brand.companyName = tenant.name;
  }
  return { brand, contact: (s?.contact as ContactData) || {}, socialLinks: (s?.socialLinks as SocialLinks) || {}, design: (s?.design as Record<string, string>) || {} };
}

export type SeoGlobalData = {
  defaultTitle: string | null;
  titleTemplate: string | null;
  defaultDescription: string | null;
  defaultOgImage: string | null;
  canonicalBase: string | null;
  locale: string;
  robots: string;
};

export type SeoPageData = {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  canonical: string | null;
  noindex: boolean;
};

export async function getTenantSeoGlobal(tenantId: string): Promise<SeoGlobalData | null> {
  const db = getDb();
  const [row] = await db.select().from(seoGlobal).where(eq(seoGlobal.tenantId, tenantId)).limit(1);
  if (!row) return null;
  return {
    defaultTitle: row.defaultTitle,
    titleTemplate: row.titleTemplate,
    defaultDescription: row.defaultDescription,
    defaultOgImage: row.defaultOgImage,
    canonicalBase: row.canonicalBase,
    locale: row.locale,
    robots: row.robots,
  };
}

export async function getTenantSeoPage(tenantId: string, pageId: string): Promise<SeoPageData | null> {
  const db = getDb();
  const [row] = await db.select().from(seoPage).where(and(eq(seoPage.tenantId, tenantId), eq(seoPage.pageId, pageId))).limit(1);
  if (!row) return null;
  return {
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImage: row.ogImage,
    canonical: row.canonical,
    noindex: row.noindex,
  };
}

export async function getTenantSeoItem(tenantId: string, itemId: string): Promise<SeoPageData | null> {
  const db = getDb();
  const [row] = await db.select().from(seoItem).where(and(eq(seoItem.tenantId, tenantId), eq(seoItem.collectionItemId, itemId))).limit(1);
  if (!row) return null;
  return {
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImage: row.ogImage,
    canonical: row.canonical,
    noindex: row.noindex,
  };
}
