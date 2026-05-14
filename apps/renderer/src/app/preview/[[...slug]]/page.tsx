import { resolveTenant, getDraftSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle } from '@/lib/tenant-data';
import { getStyleCssVars } from '@/lib/styles';
import { notFound } from 'next/navigation';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params, searchParams }: { params: Promise<{ slug?: string[] }>; searchParams: Promise<{ token?: string }> }) {
  const { slug } = await params;
  const { token } = await searchParams;
  const secret = process.env.PREVIEW_SECRET || 'preview';

  if (token !== secret) notFound();

  const tenantId = await resolveTenant();
  if (!tenantId) notFound();

  const snapshot = await getDraftSnapshot(tenantId);
  if (!snapshot) notFound();

  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );
  if (!page) notFound();

  const [navData, footerData, { brand, contact, socialLinks }, tenantStyle] = await Promise.all([
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
  ]);

  const styleCssVars = getStyleCssVars(tenantStyle.industry, tenantStyle.activeStyle);
  const visibleSections = page.sections.filter(s => s.visible);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

  return (
    <div style={styleCssVars as React.CSSProperties}>
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center text-xs py-1 font-medium">
        Entwurfs-Vorschau — Nicht veröffentlicht
      </div>
      <div className="pt-6">
        <SiteHeader navItems={navData.items} brand={brand} contact={contact} darkBg={firstSectionIsHero} cta={navData.cta} />
        <main>
          {visibleSections.map((section) => (
            <SectionRenderer key={section.id} section={section} collections={snapshot.collections} />
          ))}
        </main>
        <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
      </div>
    </div>
  );
}
