import { resolveTenant, getActiveSnapshot } from '@/lib/snapshot';
import { getTenantNav, getTenantFooter, getTenantBrand } from '@/lib/tenant-data';
import { notFound } from 'next/navigation';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const tenantId = await resolveTenant();
  if (!tenantId) notFound();

  const [snapshot, navItems, footerData, { brand, contact }] = await Promise.all([
    getActiveSnapshot(tenantId),
    getTenantNav(tenantId),
    getTenantFooter(tenantId),
    getTenantBrand(tenantId),
  ]);

  if (!snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Website wird eingerichtet</h1>
          <p className="text-gray-500">Noch keine Inhalte veröffentlicht.</p>
        </div>
      </div>
    );
  }

  // Find page by slug
  const targetSlug = slug?.join('/') || '';
  const page = snapshot.pages.find(p =>
    p.slug === targetSlug || (targetSlug === '' && (p.slug === '' || p.slug === 'home' || p.slug === 'startseite'))
  );

  if (!page || !page.visible) notFound();

  const visibleSections = page.sections.filter(s => s.visible);

  return (
    <>
      <SiteHeader navItems={navItems} brand={brand} contact={contact} />
      <main>
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} collections={snapshot.collections} />
        ))}
      </main>
      <SiteFooter footer={footerData} brand={brand} />
    </>
  );
}
