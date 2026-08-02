import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantI18n, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import { getDesignCssVars } from '@/lib/design-vars';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LivePreviewClient } from './client';
import { getTenantFontAssets, getTenantFontCssVars } from '@/lib/tenant-theme';

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

  const [navData, footerData, { brand, contact, socialLinks, design, formFields }, tenantStyle, i18n, snapshot] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
    getTenantI18n(tenantId),
    getActiveSnapshot(tenantId),
  ]);

  // Load homepage sections as fallback when no editor is sending data
  const homePage = snapshot?.pages.find((p: { slug: string }) =>
    p.slug === '' || p.slug === 'home' || p.slug === 'startseite'
  );
  const initialSections = homePage?.sections || [];

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

  const cssVars = { ...styleCssVars, ...brandCssVars, ...fontCssVars, ...designOverrides };

  return (
    <>
      {/* Expose the active tenant ID to client sections (e.g. InstagramFeed)
          that need to call session-gated APIs from inside the live preview. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__FLAMINGO_TENANT_ID__=${JSON.stringify(tenantId)};`,
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
        formFields,
        fontsUrl: fontAssets.googleFontsUrl,
        fontFaceCss: fontAssets.fontFaceCss,
        defaultLocale: i18n.defaultLocale,
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
