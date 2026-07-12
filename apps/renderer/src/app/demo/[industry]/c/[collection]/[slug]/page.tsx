import { notFound } from 'next/navigation';
import { prefixInternalHref } from '@/lib/link-prefix';
import { resolveDemoTenantResult, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantStyle, getTenantNav, getTenantFooter, getTenantBrand } from '@/lib/tenant-data';
import { DemoPageShell } from '../../../../demo-page-shell';
import { CollectionDetail } from '@/components/collection-detail';
import { getTenantSeoGlobal, getTenantSeoItem } from '@/lib/tenant-data';
import { composeSeoTitle } from '@/lib/seo-title';
import { plain } from '@/lib/strip-html';
import type { Metadata } from 'next';
import { DEMO_UNAVAILABLE_METADATA } from '@/lib/demo-static-fallback-policy';

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
  shop: 'ecommerce',
  retail: 'retail',
  florist: 'florist',
  fitness: 'fitness',
  location: 'location',
  eishockey: 'verein',
};

class DemoCollectionLookupUnavailableError extends Error {
  constructor() {
    super('Demo collection lookup is temporarily unavailable.');
    this.name = 'DemoCollectionLookupUnavailableError';
  }
}

async function resolveDemoCollectionItem(industry: string, collection: string, slug: string) {
  const dbIndustry = INDUSTRY_MAP[industry] || industry;

  const tenantResolution = await resolveDemoTenantResult(dbIndustry, industry);
  if (tenantResolution.status === 'error') {
    console.error(JSON.stringify({
      event: 'demo_collection_tenant_lookup_failed',
      industry: industry.slice(0, 64),
      collection: collection.slice(0, 120),
      stage: tenantResolution.stage,
      errorType: tenantResolution.error instanceof Error ? tenantResolution.error.name : 'UnknownError',
    }));
    throw new DemoCollectionLookupUnavailableError();
  }
  if (tenantResolution.status === 'not-found') return null;
  const tenantId = tenantResolution.tenantId;

  const snapshot = await getActiveSnapshot(tenantId);
  const col = snapshot?.collections?.find((candidate) => candidate.key === collection);
  const item = col?.items.find((candidate) => candidate.slug === slug);
  if (!snapshot || !col || !item) return null;
  return { tenantId, snapshot, col, item };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string; collection: string; slug: string }>;
}): Promise<Metadata> {
  try {
    const { industry, collection, slug } = await params;
    const resolved = await resolveDemoCollectionItem(industry, collection, slug);
    if (!resolved) return DEMO_UNAVAILABLE_METADATA;

    const [seoGlobal, seoItem, { brand }] = await Promise.all([
      getTenantSeoGlobal(resolved.tenantId),
      getTenantSeoItem(resolved.tenantId, resolved.item.id),
      getTenantBrand(resolved.tenantId),
    ]);
    const title = composeSeoTitle({
      contentTitle: seoItem?.metaTitle || resolved.item.title,
      defaultTitle: seoGlobal?.defaultTitle,
      titleTemplate: seoGlobal?.titleTemplate,
      brandName: brand.companyName,
      preferDefaultForGeneric: false,
    });
    const rawDescription = seoItem?.metaDescription
      || (resolved.item.data.excerpt as string | undefined)
      || (resolved.item.data.description as string | undefined)
      || seoGlobal?.defaultDescription
      || '';
    const description = plain(rawDescription).slice(0, 170) || undefined;
    const ogImage = seoItem?.ogImage || seoGlobal?.defaultOgImage || undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: brand.companyName || undefined,
        ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      },
      robots: seoItem?.noindex ? 'noindex,nofollow' : (seoGlobal?.robots || 'index,follow'),
    };
  } catch (error) {
    console.error(JSON.stringify({
      event: 'demo_collection_metadata_failed',
      errorType: error instanceof Error ? error.name : 'UnknownError',
    }));
    return DEMO_UNAVAILABLE_METADATA;
  }
}

export default async function DemoCollectionDetailPage({
  params,
}: {
  params: Promise<{ industry: string; collection: string; slug: string }>;
}) {
  const { industry, collection, slug } = await params;

  const resolved = await resolveDemoCollectionItem(industry, collection, slug);
  if (!resolved) return notFound();
  const { tenantId, snapshot, col, item } = resolved;

  const [tenantStyle, navData, footerData, brandData] = await Promise.all([
    getTenantStyle(tenantId),
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
  ]);

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
          href: prefixInternalHref(item.href, demoPrefix) as string,
        })),
        cta: navData.cta
          ? { ...navData.cta, href: prefixInternalHref(navData.cta.href, demoPrefix) as string }
          : { label: '', href: '' },
        brand: brandData.brand,
        design: brandData.design,
        contact: brandData.contact,
        socialLinks: brandData.socialLinks,
        formFields: brandData.formFields,
        footer: footerData
          ? {
              columns: footerData.columns.map((col) => ({
                ...col,
                items: col.items.map((item) => ({
                  ...item,
                  href: prefixInternalHref(item.href, demoPrefix) as string,
                })),
              })),
              legalLinks: footerData.legalLinks.map((l) => ({
                ...l,
                href: prefixInternalHref(l.href, demoPrefix) as string,
              })),
            }
          : { columns: [], legalLinks: [] },
      }}
      darkBg={false}
    >
      <CollectionDetail item={item} collection={col} collections={snapshot.collections} backHrefPrefix={demoPrefix} linkPrefix={demoPrefix} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} globalFormFields={brandData.formFields} />
    </DemoPageShell>
  );
}
