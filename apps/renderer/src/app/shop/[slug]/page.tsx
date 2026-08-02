import { resolveTenant } from '@/lib/snapshot';
import { resolvePublicTenantId } from '@/lib/public-tenant';
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
import { eq, and, inArray, or } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { serializeJsonForHtml } from '@/lib/safe-json';
import { getTenantFontAssets, getTenantFontCssVars } from '@/lib/tenant-theme';

export const revalidate = 60;

type SearchParams = Promise<{ tenantId?: string }>;

async function getProduct(slug: string, tenantId: string) {
  const db = getDb();
  const [product] = await db.select().from(products)
    .where(and(eq(products.tenantId, tenantId), eq(products.slug, slug), eq(products.status, 'active')));
  return product ?? null;
}

async function resolveTenantForProduct(slug: string, queryTenantId: string | null) {
  const hostTenantId = await resolveTenant();
  if (hostTenantId) return hostTenantId;

  // On a shared renderer, explicit IDs are public only for demo/lead tenants.
  if (queryTenantId) return resolvePublicTenantId(queryTenantId);

  // Shared host fallback: resolve tenant from a unique active product slug.
  const db = getDb();
  const matches = await db
    .select({ tenantId: products.tenantId })
    .from(products)
    .innerJoin(tenants, eq(tenants.id, products.tenantId))
    .where(and(
      eq(products.slug, slug),
      eq(products.status, 'active'),
      eq(tenants.status, 'active'),
      inArray(tenants.deploymentMode, ['shared', 'lead_shared']),
      or(eq(tenants.isDemo, true), eq(tenants.isLead, true)),
    ))
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
  const brandCssVars = getBrandCssVars(brand, styleCssVars);
  const designOverrides = design ? getDesignCssVars(design) : {};

  const fontAssets = getTenantFontAssets(brand);
  const fontCssVars = getTenantFontCssVars(brand);

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
      {fontAssets.googleFontsUrl && <link rel="stylesheet" href={fontAssets.googleFontsUrl} />}
      {fontAssets.fontFaceCss && <style>{fontAssets.fontFaceCss}</style>}
      {fontAssets.hasBodyFont && <style>{'[data-style] { font-family: var(--custom-body-font) !important; }'}</style>}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(jsonLd) }} />
      )}
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={false} cta={navData.cta} topBar={navData.topBar} linkPrefix={linkPrefix} />
      <main className="max-w-6xl mx-auto px-6">
        <ShopProductDetailSection data={{ _slug: slug, tenantId, basePath: `${linkPrefix}/shop` || '/shop' }} />
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} linkPrefix={linkPrefix} shopEnabled />
    </div>
  );
}
