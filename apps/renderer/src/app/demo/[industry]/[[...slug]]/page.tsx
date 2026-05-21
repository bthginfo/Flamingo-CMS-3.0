import { notFound } from 'next/navigation';
import { resolveDemoTenant, resolveDemoTenantBySlug, getActiveSnapshot } from '@/lib/snapshot';
import type { SnapshotSection } from '@/lib/snapshot';
import { getTenantStyle, getTenantNav, getTenantFooter, getTenantBrand } from '@/lib/tenant-data';
import { DemoPageShell } from '../../demo-page-shell';
import { getDemoSite } from '../../pages';
import { getDemoSiteData, type IndustryKey } from '../../demo-data';

// Map URL keys to DB industry enum values
const INDUSTRY_MAP: Record<string, string> = {
  handwerk: 'tradesman',
  hotel: 'hotel',
  restaurant: 'restaurant',
  salon: 'salon',
  tourism: 'tourism',
  medical: 'medical',
  wedding: 'wedding',
  photography: 'photography',
  consulting: 'consulting',
  realestate: 'realestate',
  cafe: 'cafe',
  tattoo: 'tattoo',
  showcase: 'tradesman',
};

/** Recursively prefix internal hrefs in section data with the demo path */
function prefixSectionHrefs(data: Record<string, unknown>, prefix: string): Record<string, unknown> {
  const json = JSON.stringify(data);
  // Match "href":"/" patterns that are internal links (not /demo/, not external)
  const rewritten = json.replace(/"href"\s*:\s*"(\/(?!demo\/)[^"]*?)"/g, (_match, path) => {
    // Skip anchors, tel:, mailto: etc. that somehow start with /
    return `"href":"${prefix}${path}"`;
  });
  return JSON.parse(rewritten);
}

function prefixSections(sections: SnapshotSection[], prefix: string): SnapshotSection[] {
  return sections.map(s => ({
    ...s,
    data: prefixSectionHrefs(s.data, prefix),
  }));
}

export default async function DemoPage({ params }: { params: Promise<{ industry: string; slug?: string[] }> }) {
  const { industry, slug } = await params;

  const dbIndustry = INDUSTRY_MAP[industry];
  if (!dbIndustry) return notFound();

  // Resolve by slug for special demos (e.g. showcase), otherwise by industry
  const SLUG_MAP: Record<string, string> = { showcase: 'demo-showcase' };
  const tenantId = SLUG_MAP[industry]
    ? await resolveDemoTenantBySlug(SLUG_MAP[industry])
    : await resolveDemoTenant(dbIndustry);

  // Fallback to static demo pages if no DB tenant exists
  if (!tenantId) {
    const staticSite = getDemoSite(industry);
    if (!staticSite) return notFound();
    const targetSlug = slug?.join('/') || '';
    const page = staticSite.pages.find(p =>
      p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
    );
    if (!page) return notFound();
    const siteData = getDemoSiteData(industry as IndustryKey);
    const demoPrefix = `/demo/${industry}`;
    return (
      <DemoPageShell
        sections={prefixSections(page.sections.filter(s => s.visible) as SnapshotSection[], demoPrefix)}
        industry={staticSite.industry}
        industryKey={industry}
        defaultStyle={staticSite.defaultStyle}
        siteData={{
          navItems: siteData.navItems,
          cta: siteData.cta,
          brand: siteData.brand,
          contact: siteData.contact,
          socialLinks: siteData.socialLinks,
          footer: siteData.footer,
        }}
        darkBg={page.sections[0]?.type === 'hero'}
      />
    );
  }

  const [snapshot, tenantStyle, navData, footerData, brandData] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantStyle(tenantId),
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
  ]).catch(() => [null, null, null, null, null] as const);

  // If DB data is incomplete, fall back to static demo
  if (!snapshot || !tenantStyle || !navData || !brandData) {
    const staticSite = getDemoSite(industry);
    if (!staticSite) return notFound();
    const targetSlug = slug?.join('/') || '';
    const page = staticSite.pages.find(p =>
      p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
    );
    if (!page) return notFound();
    const siteData = getDemoSiteData(industry as IndustryKey);
    const demoPrefix = `/demo/${industry}`;
    return (
      <DemoPageShell
        sections={prefixSections(page.sections.filter(s => s.visible) as SnapshotSection[], demoPrefix)}
        industry={staticSite.industry}
        industryKey={industry}
        defaultStyle={staticSite.defaultStyle}
        siteData={{
          navItems: siteData.navItems,
          cta: siteData.cta,
          brand: siteData.brand,
          contact: siteData.contact,
          socialLinks: siteData.socialLinks,
          footer: siteData.footer,
        }}
        darkBg={page.sections[0]?.type === 'hero'}
      />
    );
  }

  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );
  if (!page) return notFound();

  const firstIsHero = page.sections[0]?.type === 'hero';

  const demoPrefix = `/demo/${industry}`;

  return (
    <DemoPageShell
      sections={prefixSections(page.sections.filter(s => s.visible), demoPrefix)}
      industry={tenantStyle.industry}
      industryKey={industry}
      defaultStyle={tenantStyle.activeStyle}
      siteData={{
        navItems: navData.items.map(item => ({ ...item, href: item.href.startsWith('/demo/') ? item.href : `${demoPrefix}${item.href}` })),
        cta: navData.cta ? { ...navData.cta, href: navData.cta.href.startsWith('/demo/') ? navData.cta.href : `${demoPrefix}${navData.cta.href}` } : { label: '', href: '' },
        brand: brandData.brand,
        contact: brandData.contact,
        socialLinks: brandData.socialLinks,
        footer: footerData ? {
          columns: footerData.columns.map(col => ({
            ...col,
            items: col.items.map(item => ({ ...item, href: item.href && !item.href.startsWith('/demo/') ? `${demoPrefix}${item.href}` : item.href })),
          })),
          legalLinks: footerData.legalLinks.map(l => ({ ...l, href: l.href.startsWith('/demo/') ? l.href : `${demoPrefix}${l.href}` })),
        } : { columns: [], legalLinks: [] },
      }}
      darkBg={firstIsHero}
    />
  );
}
