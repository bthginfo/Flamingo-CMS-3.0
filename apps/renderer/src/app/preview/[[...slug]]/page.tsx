import { resolveTenant, getDraftSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getDesignCssVars } from '@/lib/design-vars';
import { notFound } from 'next/navigation';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getTenantFontAssets, getTenantFontCssVars } from '@/lib/tenant-theme';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params, searchParams }: { params: Promise<{ slug?: string[] }>; searchParams: Promise<{ token?: string }> }) {
  const { slug } = await params;
  const { token } = await searchParams;
  const secret = process.env.PREVIEW_SECRET;

  // Preview content is unpublished content. Fail closed when no private,
  // server-only secret is configured; NEXT_PUBLIC_* is never an auth secret.
  if (!secret || token !== secret) notFound();

  const tenantId = await resolveTenant();
  if (!tenantId) notFound();

  const snapshot = await getDraftSnapshot(tenantId);
  if (!snapshot) notFound();

  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );
  if (!page) notFound();

  const [navData, footerData, { brand, contact, socialLinks, design, formFields }, tenantStyle] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
  ]);

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);
  const brandCssVars = getBrandCssVars(brand, styleCssVars);
  const designOverrides: Record<string, string> = {};
  if (brand.primaryColor) designOverrides['--style-brand'] = brand.primaryColor;
  if (brand.accentColor) {
    designOverrides['--token-accent'] = brand.accentColor;
    designOverrides['--style-accent'] = brand.accentColor;
  }
  Object.assign(designOverrides, getDesignCssVars(design));
  const fontAssets = getTenantFontAssets(brand);
  const fontCssVars = getTenantFontCssVars(brand);
  const visibleSections = page.sections.filter(s => s.visible);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

  return (
    <div data-style={tenantStyle.activeStyle} className="overflow-x-clip" style={{ ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides } as React.CSSProperties}>
      {fontAssets.googleFontsUrl && <link rel="stylesheet" href={fontAssets.googleFontsUrl} />}
      {fontAssets.fontFaceCss && <style>{fontAssets.fontFaceCss}</style>}
      {fontAssets.hasBodyFont && <style>{'[data-style] { font-family: var(--custom-body-font) !important; }'}</style>}
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center text-xs py-1 font-medium">
        Entwurfs-Vorschau — Nicht veröffentlicht
      </div>
      <div className="pt-6">
        <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={firstSectionIsHero} cta={navData.cta} topBar={navData.topBar} />
        <main>
          {visibleSections.map((section) => (
            <SectionRenderer key={section.id} section={section} collections={snapshot.collections} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} globalFormFields={formFields} />
          ))}
        </main>
        <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
      </div>
    </div>
  );
}
