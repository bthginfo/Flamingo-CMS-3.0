import { resolveTenant } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getDesignCssVars } from '@/lib/design-vars';
import { LivePreviewClient } from './client';

export const dynamic = 'force-dynamic';

export default async function LivePreviewPage() {
  try {
    const tenantId = await resolveTenant();
    if (!tenantId) {
      return <LivePreviewClient initialData={{}} />;
    }

  const [navData, footerData, { brand, contact, socialLinks, design }, tenantStyle] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
  ]);

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);
  const brandCssVars = getBrandCssVars(brand);
  const designOverrides: Record<string, string> = {};
  if (brand.primaryColor) designOverrides['--style-brand'] = brand.primaryColor;
  if (brand.accentColor) designOverrides['--style-accent'] = brand.accentColor;
  Object.assign(designOverrides, getDesignCssVars(design));
  const fontCssVars: Record<string, string> = {};
  const headingFontName = brand.customHeadingFontName || brand.headingFont || '';
  const bodyFontName = brand.customBodyFontName || brand.bodyFont || '';
  if (headingFontName) fontCssVars['--style-heading-font'] = `"${headingFontName}", var(--font-outfit), system-ui, sans-serif`;
  if (bodyFontName) fontCssVars['--custom-body-font'] = `"${bodyFontName}", var(--font-inter), system-ui, sans-serif`;
  const customFonts = [brand.headingFont, brand.bodyFont].filter(Boolean) as string[];
  const googleFontsUrl = customFonts.length > 0
    ? `https://fonts.googleapis.com/css2?${customFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`
    : null;

  const cssVars = { ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides };

  return (
    <LivePreviewClient
      initialData={{
        industry: tenantStyle.industry,
        styleVariant: tenantStyle.activeStyle,
        cssVars,
        navItems: navData.items,
        navCta: navData.cta,
        brand,
        contact,
        footer: footerData || undefined,
        socialLinks,
        fontsUrl: googleFontsUrl,
      }}
    />
  );
  } catch (err) {
    console.error('[live-preview] Error loading tenant data:', err);
    return <LivePreviewClient initialData={{}} />;
  }
}
