import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand, getTenantStyle } from '@/lib/tenant-data';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CollectionDetail } from '@/components/collection-detail';

export default async function CollectionItemPage({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  const tenantId = await resolveTenant();
  if (!tenantId) notFound();

  const [snapshot, navData, footerData, { brand, contact, socialLinks }, tenantStyle] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
    getTenantStyle(tenantId),
  ]);

  if (!snapshot?.collections) notFound();

  const col = snapshot.collections.find(c => c.key === collection);
  if (!col) notFound();

  const item = col.items.find(i => i.slug === slug);
  if (!item) notFound();

  return (
    <>
      <SiteHeader navItems={navData.items} brand={brand} contact={contact} cta={navData.cta} />
      <main>
        <CollectionDetail item={item} collection={col} collections={snapshot.collections} styleVariant={tenantStyle.activeStyle} industry={tenantStyle.industry} />
      </main>
      <SiteFooter footer={footerData} brand={brand} contact={contact} socialLinks={socialLinks} />
    </>
  );
}
