import { getNavigationSettings, getFooterSettings, requireTenant } from '../settings-actions';
import { NavigationForm } from './navigation-form';
import { FooterForm } from './footer-form';
import { getDb } from '@/lib/db';
import { pages as pagesTable, tenants } from '@flamingo/db';
import { asc, eq } from 'drizzle-orm';

function hrefFromSlug(slug: string) {
  const clean = (slug || '').replace(/^\/+/, '');
  if (!clean || clean === 'home' || clean === 'startseite') return '/';
  return `/${clean}`;
}

export default async function NavigationPage() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [tenant] = await db.select({ i18nEnabled: tenants.i18nEnabled, i18nLocales: tenants.i18nLocales, i18nDefaultLocale: tenants.i18nDefaultLocale }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  const i18n = tenant?.i18nEnabled ? { enabled: true, locales: (tenant.i18nLocales || 'de').split(','), defaultLocale: tenant.i18nDefaultLocale || 'de' } : undefined;

  const [nav, footerData, pageRows] = await Promise.all([
    getNavigationSettings(),
    getFooterSettings(),
    db.select({ title: pagesTable.title, slug: pagesTable.slug }).from(pagesTable).where(eq(pagesTable.tenantId, tenantId)).orderBy(asc(pagesTable.sortOrder), asc(pagesTable.title)),
  ]);
  const pageOptions = pageRows.map((page) => ({ title: page.title, href: hrefFromSlug(page.slug) }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Navigation & Footer</h1>
      <p className="text-zinc-500 text-sm mb-8">Verwalten Sie die Hauptnavigation und den Footer Ihrer Website.</p>
      <div className="space-y-10">
        <NavigationForm initial={nav.items} initialCta={nav.cta} i18n={i18n} pages={pageOptions} />
        <FooterForm initial={footerData} i18n={i18n} />
      </div>
    </div>
  );
}
