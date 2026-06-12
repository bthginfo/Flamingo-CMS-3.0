import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getDesignCssVars } from '@/lib/design-vars';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LivePreviewClient } from './client';
import { serializeJsonForHtml } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

export default async function LivePreviewPage({ searchParams }: { searchParams: Promise<{ tenant?: string }> }) {
  // Live preview is an admin-only view of unpublished CMS data and must never
  // be reachable anonymously. Middleware enforces a cookie, this is the
  // defence-in-depth JWT check.
  const session = await getSession();
  if (!session) redirect('/admin/login');

  try {
    const { tenant: tenantParam } = await searchParams;
    // Honor explicit ?tenant= only if it matches the session tenant — never
    // let an authenticated admin peek into another tenant's drafts.
    const tenantId = tenantParam && tenantParam === session.tenantId ? tenantParam : session.tenantId;
    if (!tenantId) {
      return <LivePreviewClient initialData={{}} />;
    }

  const [navData, footerData, { brand, contact, socialLinks, design }, tenantStyle, snapshot] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
    getActiveSnapshot(tenantId),
  ]);

  // Load homepage sections as fallback when no editor is sending data
  const homePage = snapshot?.pages.find((p: { slug: string }) =>
    p.slug === '' || p.slug === 'home' || p.slug === 'startseite'
  );
  const initialSections = homePage?.sections || [];

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
    <>
      {/* Expose the active tenant ID to client sections (e.g. InstagramFeed)
          that need to call session-gated APIs from inside the live preview. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__FLAMINGO_TENANT_ID__=${serializeJsonForHtml(tenantId)};`,
        }}
      />
      <LivePreviewClient
      initialData={{
        industry: tenantStyle.industry,
        styleVariant: tenantStyle.activeStyle,
        cssVars,
        navItems: navData.items,
        navCta: navData.cta,
        navTopBar: navData.topBar,
        brand,
        contact,
        footer: footerData || undefined,
        socialLinks,
        fontsUrl: googleFontsUrl,
        sections: initialSections,
        collections: snapshot?.collections || [],
      }}
    />
    </>
  );
  } catch (err) {
    console.error('[live-preview] Error loading tenant data:', err);
    return <LivePreviewClient initialData={{}} />;
  }
}
