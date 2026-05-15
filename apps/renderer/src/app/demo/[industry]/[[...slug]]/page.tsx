import { notFound } from 'next/navigation';
import { resolveDemoTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantStyle, getTenantNav, getTenantFooter, getTenantBrand } from '@/lib/tenant-data';
import { DemoPageShell } from '../../demo-page-shell';

// Map URL keys to DB industry enum values
const INDUSTRY_MAP: Record<string, string> = {
  handwerk: 'tradesman',
  hotel: 'hotel',
  restaurant: 'restaurant',
  salon: 'salon',
  tourism: 'tourism',
  medical: 'medical',
};

export default async function DemoPage({ params }: { params: Promise<{ industry: string; slug?: string[] }> }) {
  const { industry, slug } = await params;

  const dbIndustry = INDUSTRY_MAP[industry];
  if (!dbIndustry) return notFound();

  const tenantId = await resolveDemoTenant(dbIndustry);
  if (!tenantId) return notFound();

  const [snapshot, tenantStyle, navData, footerData, brandData] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantStyle(tenantId),
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
  ]);

  if (!snapshot) return notFound();

  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );
  if (!page) return notFound();

  const firstIsHero = page.sections[0]?.type === 'hero';

  const demoPrefix = `/demo/${industry}`;

  return (
    <DemoPageShell
      sections={page.sections.filter(s => s.visible)}
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
