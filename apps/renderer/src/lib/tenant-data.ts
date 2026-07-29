import { getDb } from '@/lib/db';
import { navigation, footer, globalSettings, seoGlobal, seoPage, seoItem, tenants } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { normalizeContactFormFields, type ContactFormFieldDefinition } from '@/lib/contact-form';
import { normalizeFooterVariant, type FooterVariant } from '@/lib/footer-variants';

export type NavItem = { label: string; href: string; type?: string };
export type TopBarConfig = { enabled?: boolean; text?: string; linkLabel?: string; linkHref?: string; bgColor?: string; textColor?: string };
export type NavCta = { label: string; href: string; scriptProvider?: string; scriptConfig?: Record<string, string>; buttonColor?: string; buttonTextColor?: string; topBar?: TopBarConfig };
export type FooterColumn = { title: string; items: { text: string; href?: string }[] };
export type FooterData = { columns: FooterColumn[]; legalLinks: { label: string; href: string }[]; cta?: { label?: string; href?: string; variant?: FooterVariant } | null };
export type BrandData = { companyName?: string; tagline?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string; pageBg?: string; sectionBg?: string; sectionBgAlt?: string; cardBg?: string; logoUrl?: string; faviconUrl?: string; logoDisplay?: 'logo' | 'logoAndName' | 'name'; headingFont?: string; bodyFont?: string; topBarColor?: string; footerColor?: string; customHeadingFontUrl?: string; customHeadingFontName?: string; customBodyFontUrl?: string; customBodyFontName?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; navBgColor?: string; navBrandColor?: string; navLogoColor?: string; headingColor?: string; bodyTextColor?: string; mutedTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string; btnSecondaryBg?: string; btnSecondaryText?: string; btnSecondaryBorder?: string; btnOutlineBg?: string; btnOutlineText?: string; btnOutlineBorder?: string; badgeBg?: string; badgeText?: string; badgeBorder?: string; cardBorder?: string; borderColor?: string; dividerColor?: string; iconColor?: string; btnRadius?: string; cardRadius?: string; localSeo?: LocalSeoData };
export type SocialLinks = Record<string, string>;
export type ContactData = { phone?: string; email?: string; address?: string; whatsapp?: string; whatsappEnabled?: boolean; whatsappColor?: string };
export type OpeningHoursRow = { day?: string; hours?: string; note?: string; closed?: boolean; type?: 'regular' | 'special'; date?: string };
export type LocalSeoService = { name: string; description?: string; url?: string };
export type LocalSeoData = { businessType?: string; priceRange?: string; serviceArea?: string; googleBusinessUrl?: string; sameAs?: string[]; latitude?: number; longitude?: number; ratingValue?: number; ratingCount?: number; services?: LocalSeoService[] };

const PUBLIC_TENANT_DATA_REVALIDATE_SECONDS = 60 * 60;

function cachedTenantRead<T>(tenantId: string, key: string, read: () => Promise<T>): Promise<T> {
  return unstable_cache(read, ['public-tenant-data', key, tenantId], {
    revalidate: PUBLIC_TENANT_DATA_REVALIDATE_SECONDS,
    tags: [`tenant-${tenantId}`],
  })();
}

function isPlaceholderCompanyName(value?: string): boolean {
  const normalized = (value || '').trim().toLowerCase();
  return !normalized || normalized === 'firmenname' || normalized === 'firma' || normalized === 'company name';
}

function normalizeI18nConfig(config?: { locales?: string | null; defaultLocale?: string | null }) {
  const locales = (config?.locales || '')
    .split(',')
    .map(locale => locale.trim())
    .filter(Boolean);
  const defaultLocale = config?.defaultLocale?.trim() || locales[0] || 'de';
  return {
    locales: Array.from(new Set([defaultLocale, ...locales])),
    defaultLocale,
  };
}

export async function getTenantStyle(tenantId: string): Promise<{ industry: string; activeStyle: string }> {
  return cachedTenantRead(tenantId, 'style', async () => {
    const db = getDb();
    const [t] = await db.select({ industry: tenants.industry }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    return { industry: t?.industry ?? 'tradesman', activeStyle: 'classic' };
  });
}

export async function getTenantI18n(tenantId: string): Promise<{ enabled: boolean; locales: string[]; defaultLocale: string }> {
  return cachedTenantRead(tenantId, 'i18n', async () => {
    const db = getDb();
    const [t] = await db.select({ enabled: tenants.i18nEnabled, locales: tenants.i18nLocales, defaultLocale: tenants.i18nDefaultLocale }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    const i18n = normalizeI18nConfig({ locales: t?.locales, defaultLocale: t?.defaultLocale });
    return {
      enabled: t?.enabled ?? false,
      locales: i18n.locales,
      defaultLocale: i18n.defaultLocale,
    };
  });
}

export async function getTenantNav(tenantId: string, locale?: string): Promise<{ items: NavItem[]; cta: NavCta | null; topBar: TopBarConfig }> {
  return cachedTenantRead(tenantId, `navigation-${locale || 'default'}`, async () => {
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
  const topBarRaw = (cta as Record<string, unknown> | null)?.topBar;
  const topBarObj = (typeof topBarRaw === 'object' && topBarRaw !== null) ? (topBarRaw as Record<string, unknown>) : {};
  const topBar: TopBarConfig = {
    enabled: typeof topBarObj.enabled === 'boolean' ? (topBarObj.enabled as boolean) : true,
    text: typeof topBarObj.text === 'string' ? (topBarObj.text as string) : '',
    linkLabel: typeof topBarObj.linkLabel === 'string' ? (topBarObj.linkLabel as string) : '',
    linkHref: typeof topBarObj.linkHref === 'string' ? (topBarObj.linkHref as string) : '',
    bgColor: typeof topBarObj.bgColor === 'string' ? (topBarObj.bgColor as string) : '',
    textColor: typeof topBarObj.textColor === 'string' ? (topBarObj.textColor as string) : '',
  };
  return {
    items: (items as NavItem[]) || [],
    cta: cta?.label ? cta : null,
    topBar,
  };
  });
}

export async function getTenantFooter(tenantId: string, locale?: string): Promise<FooterData | null> {
  return cachedTenantRead(tenantId, `footer-${locale || 'default'}`, async () => {
  const db = getDb();
  const [f] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);
  if (!f) return null;
  let columns = f.columns as any;
  let legalLinks = f.legalLinks as any;
  const rawCta = (f as any).cta as any;
  const variant = normalizeFooterVariant(rawCta?.variant);
  let cta = rawCta;
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
  const ctaObject = cta && typeof cta === 'object' && !Array.isArray(cta) ? cta as Record<string, unknown> : {};
  return { columns: columns as FooterColumn[], legalLinks: legalLinks as { label: string; href: string }[], cta: { ...ctaObject, variant } as FooterData['cta'] };
  });
}

export async function getTenantBrand(tenantId: string): Promise<{ brand: BrandData; contact: ContactData; openingHours: OpeningHoursRow[]; socialLinks: SocialLinks; design: Record<string, string>; formFields: ContactFormFieldDefinition[] }> {
  return cachedTenantRead(tenantId, 'brand', async () => {
  const db = getDb();
  const [[s], [tenant]] = await Promise.all([
    db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1),
    db.select({ name: tenants.name }).from(tenants).where(eq(tenants.id, tenantId)).limit(1),
  ]);
  const brand = { ...(((s?.brand as BrandData) || {}) as BrandData) };
  if (tenant?.name && isPlaceholderCompanyName(brand.companyName)) {
    brand.companyName = tenant.name;
  }
  return {
    brand,
    contact: (s?.contact as ContactData) || {},
    openingHours: (s?.openingHours as OpeningHoursRow[]) || [],
    socialLinks: (s?.socialLinks as SocialLinks) || {},
    design: (s?.design as Record<string, string>) || {},
    formFields: normalizeContactFormFields(s?.formFields),
  };
  });
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
  return cachedTenantRead(tenantId, 'seo-global', async () => {
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
  });
}

export async function getTenantSeoPage(tenantId: string, pageId: string): Promise<SeoPageData | null> {
  return cachedTenantRead(tenantId, `seo-page-${pageId}`, async () => {
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
  });
}

export async function getTenantSeoItem(tenantId: string, itemId: string): Promise<SeoPageData | null> {
  return cachedTenantRead(tenantId, `seo-item-${itemId}`, async () => {
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
  });
}
