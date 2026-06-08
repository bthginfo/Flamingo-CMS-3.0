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
import { products } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import type { Metadata } from 'next';

export const revalidate = 60;

async function getProduct(slug: string, tenantId: string) {
  const db = getDb();
  const [product] = await db.select().from(products)
    .where(and(eq(products.tenantId, tenantId), eq(products.slug, slug), eq(products.status, 'active')));
  return product ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tenantId = await resolveTenant();
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

export default async function ShopProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenantId = await resolveTenant();
  if (!tenantId) notFound();

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={false} cta={navData.cta} />
      <main className="max-w-6xl mx-auto px-6">
        <ShopProductDetailSection data={{ _slug: slug, tenantId }} />
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
    </div>
  );
}
