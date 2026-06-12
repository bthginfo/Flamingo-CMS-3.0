import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getDesignCssVars } from '@/lib/design-vars';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ShopProductDetailSection } from '@/templates/shared/shop-product-detail';
import { getDb } from '@/lib/db';
import { products, tenantDomains, tenants } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { serializeJsonForHtml } from '@/lib/safe-json';

export const revalidate = 60;

type SearchParams = Promise<{ tenantId?: string }>;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function resolveExplicitTenant(queryTenantId: string | null) {
  const fixedTenantId = process.env.FIXED_TENANT_ID;
  if (!queryTenantId || !UUID_RE.test(queryTenantId)) return null;
  if (fixedTenantId) return queryTenantId === fixedTenantId ? queryTenantId : null;
  return queryTenantId;
}

async function getProduct(slug: string, tenantId: string) {
  const db = getDb();
  const [product] = await db.select().from(products)
    .where(and(eq(products.tenantId, tenantId), eq(products.slug, slug), eq(products.status, 'active')));
  return product ?? null;
}

async function resolveTenantForProduct(slug: string, queryTenantId: string | null) {
  const explicitTenantId = resolveExplicitTenant(queryTenantId);
  if (explicitTenantId) return explicitTenantId;

  const hostTenantId = await resolveTenant();
  if (hostTenantId) return hostTenantId;

  // Shared host fallback: resolve tenant from a unique active product slug.
  const db = getDb();
  const matches = await db
    .select({ tenantId: products.tenantId })
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.status, 'active')))
    .limit(2);
  if (matches.length !== 1) return null;
  return matches[0]?.tenantId ?? null;
}

async function resolveLinkPrefixForTenant(tenantId: string) {
  if (process.env.FIXED_TENANT_ID) return '';

  const host = ((await headers()).get('host') || '').toLowerCase();
  if (!host) return '';

  const db = getDb();
  const [domainMatch] = await db
    .select({ tenantId: tenantDomains.tenantId })
    .from(tenantDomains)
    .where(eq(tenantDomains.domain, host))
    .limit(1);

  if (domainMatch?.tenantId === tenantId) return '';

  const [tenant] = await db
    .select({ slug: tenants.slug })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);

  return tenant?.slug ? `/${tenant.slug}` : '';
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SearchParams }): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const tenantId = await resolveTenantForProduct(slug, query?.tenantId || null);
  if (!tenantId) return {};
  const product = await getProduct(slug, tenantId);
  if (!product) return {};
  const images = (product.images as string[]) ?? [];
  return {
    title: product.title,
    description: product.shortDescription || product.description || `${product.title} kaufen`,
    openGraph: {
      title: product.title,
      description: product.shortDescription || product.description || undefined,
      images: images[0] ? [{ url: images[0] }] : undefined,
    },
  };
}

export default async function ShopProductPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SearchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const tenantId = await resolveTenantForProduct(slug, query?.tenantId || null);
  if (!tenantId) notFound();
  const linkPrefix = await resolveLinkPrefixForTenant(tenantId);

  const [navData, footerData, { brand, contact, socialLinks, design }, tenantStyle] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
  ]);

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);
  const brandCssVars = getBrandCssVars(brand);
  const designOverrides = design ? getDesignCssVars(design) : {};

  const fontCssVars: Record<string, string> = {};
  const headingFontName = brand.customHeadingFontName || brand.headingFont || '';
  const bodyFontName = brand.customBodyFontName || brand.bodyFont || '';
  if (headingFontName) fontCssVars['--style-heading-font'] = `"${headingFontName}", var(--font-outfit), system-ui, sans-serif`;
  if (bodyFontName) fontCssVars['--custom-body-font'] = `"${bodyFontName}", var(--font-inter), system-ui, sans-serif`;

  const product = await getProduct(slug, tenantId);

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || undefined,
    image: (product.images as string[])?.[0] || undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: ((product.priceCents as number) / 100).toFixed(2),
      availability: (product.stock as number) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  } : null;

  return (
    <div data-style={tenantStyle.activeStyle} className="overflow-x-clip" style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties}>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(jsonLd) }} />
      )}
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={false} cta={navData.cta} topBar={navData.topBar} linkPrefix={linkPrefix} />
      <main className="max-w-6xl mx-auto px-6">
        <ShopProductDetailSection data={{ _slug: slug, tenantId, basePath: `${linkPrefix}/shop` || '/shop' }} />
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} linkPrefix={linkPrefix} />
    </div>
  );
}
