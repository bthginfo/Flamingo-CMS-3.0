import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getDesignCssVars } from '@/lib/design-vars';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ShopProductDetailSection } from '@/templates/shared/shop-product-detail';

export const revalidate = 60;

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

  return (
    <div data-style={tenantStyle.activeStyle} className="overflow-x-hidden" style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties}>
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={false} cta={navData.cta} />
      <main className="max-w-6xl mx-auto px-6">
        <ShopProductDetailSection data={{ _slug: slug }} />
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
    </div>
  );
}
