import { notFound } from 'next/navigation';
import { resolveDemoTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantStyle, getTenantNav, getTenantFooter, getTenantBrand } from '@/lib/tenant-data';
import { DemoPageShell } from '../../../../demo-page-shell';
import { CollectionDetail } from '@/components/collection-detail';

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
  retail: 'retail',
  florist: 'florist',
  fitness: 'fitness',
  location: 'location',
};

export default async function DemoCollectionDetailPage({
  params,
}: {
  params: Promise<{ industry: string; collection: string; slug: string }>;
}) {
  const { industry, collection, slug } = await params;

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

  const col = snapshot.collections?.find((c) => c.key === collection);
  if (!col) return notFound();

  const item = col.items.find((i) => i.slug === slug);
  if (!item) return notFound();

  const demoPrefix = `/demo/${industry}`;

  return (
    <DemoPageShell
      sections={[]}
      industry={tenantStyle.industry}
      industryKey={industry}
      defaultStyle={tenantStyle.activeStyle}
      siteData={{
        navItems: navData.items.map((item) => ({
          ...item,
          href: item.href.startsWith('/demo/') ? item.href : `${demoPrefix}${item.href}`,
        })),
        cta: navData.cta
          ? {
              ...navData.cta,
              href: navData.cta.href.startsWith('/demo/')
                ? navData.cta.href
                : `${demoPrefix}${navData.cta.href}`,
            }
          : { label: '', href: '' },
        brand: brandData.brand,
        contact: brandData.contact,
        socialLinks: brandData.socialLinks,
        footer: footerData
          ? {
              columns: footerData.columns.map((col) => ({
                ...col,
                items: col.items.map((item) => ({
                  ...item,
                  href:
                    item.href && !item.href.startsWith('/demo/')
                      ? `${demoPrefix}${item.href}`
                      : item.href,
                })),
              })),
              legalLinks: footerData.legalLinks.map((l) => ({
                ...l,
                href: l.href.startsWith('/demo/') ? l.href : `${demoPrefix}${l.href}`,
              })),
            }
          : { columns: [], legalLinks: [] },
      }}
      darkBg={false}
    >
      <CollectionDetail item={item} collection={col} collections={snapshot.collections} backHrefPrefix={demoPrefix} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} />
    </DemoPageShell>
  );
}
