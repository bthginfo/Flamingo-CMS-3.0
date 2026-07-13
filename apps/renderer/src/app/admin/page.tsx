import { getSession } from '@/lib/session';
import { getDb } from '@/lib/db';
import { pages, pageSections, collectionItems, tenants, mediaAssets, seoGlobal, seoPage, publishedSnapshots } from '@flamingo/db';
import { eq, count, and, desc } from 'drizzle-orm';
import { Camera, FileText, Home, Layers, FolderOpen, Rocket, Globe, ImageIcon, Search, AlertTriangle, CheckCircle2, Gift, Send, Zap } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { DashboardActions } from './dashboard-actions';
import { getContentHealthReport } from './content-health/actions';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const db = getDb();
  const tid = session.tenantId;
  const cookieStore = await cookies();
  const isPublicDemoMode = cookieStore.get('flamingo_public_demo')?.value === session.tenantId;

  const [
    tenantRows,
    pageCountRows,
    sectionCountRows,
    itemCountRows,
    publishedPageRows,
    mediaCountRows,
    seoRows,
    allPages,
    seoPages,
    allMedia,
    activeSnapshotRows,
    snapshotVersionRows,
  ] = await Promise.all([
    db.select().from(tenants).where(eq(tenants.id, tid)).limit(1),
    db.select({ value: count() }).from(pages).where(eq(pages.tenantId, tid)),
    db.select({ value: count() }).from(pageSections).where(eq(pageSections.tenantId, tid)),
    db.select({ value: count() }).from(collectionItems).where(eq(collectionItems.tenantId, tid)),
    db.select({ value: count() }).from(pages).where(and(eq(pages.tenantId, tid), eq(pages.status, 'published'))),
    db.select({ value: count() }).from(mediaAssets).where(eq(mediaAssets.tenantId, tid)),
    db.select().from(seoGlobal).where(eq(seoGlobal.tenantId, tid)).limit(1),
    db.select({ id: pages.id, title: pages.title, slug: pages.slug }).from(pages).where(eq(pages.tenantId, tid)),
    db.select({ pageId: seoPage.pageId }).from(seoPage).where(eq(seoPage.tenantId, tid)),
    db.select({ id: mediaAssets.id, alt: mediaAssets.alt }).from(mediaAssets).where(eq(mediaAssets.tenantId, tid)),
    db.select({ version: publishedSnapshots.version, createdAt: publishedSnapshots.createdAt })
      .from(publishedSnapshots)
      .where(and(eq(publishedSnapshots.tenantId, tid), eq(publishedSnapshots.isActive, true)))
      .orderBy(desc(publishedSnapshots.version))
      .limit(1),
    db.select({ version: publishedSnapshots.version })
      .from(publishedSnapshots)
      .where(eq(publishedSnapshots.tenantId, tid))
      .orderBy(desc(publishedSnapshots.version))
      .limit(25),
  ]);
  const tenant = tenantRows[0];
  const pageCount = pageCountRows[0];
  const sectionCount = sectionCountRows[0];
  const itemCount = itemCountRows[0];
  const publishedPages = publishedPageRows[0];
  const mediaCount = mediaCountRows[0];
  const seoRow = seoRows[0];
  const activeSnapshot = activeSnapshotRows[0];
  const hasPreviousSnapshot = activeSnapshot
    ? snapshotVersionRows.some(snapshot => snapshot.version < activeSnapshot.version)
    : false;
  const contentHealth = await getContentHealthReport();

  // Check SEO completeness
  const seoPageIds = new Set(seoPages.map(s => s.pageId));
  const pagesWithoutSeo = allPages.filter(p => !seoPageIds.has(p.id));
  const seoGlobalComplete = !!(seoRow?.defaultTitle && seoRow?.defaultDescription);
  const homePage = allPages.find(page => ['', 'home', 'startseite'].includes(page.slug));

  // Check media without alt
  const mediaWithoutAlt = allMedia.filter(m => !m.alt);

  const stats = [
    { label: 'Seiten', value: pageCount?.value ?? 0, icon: FileText, href: '/admin/pages' },
    { label: 'Sections', value: sectionCount?.value ?? 0, icon: Layers, href: '/admin/pages' },
    { label: 'Einträge', value: itemCount?.value ?? 0, icon: FolderOpen, href: '/admin/collections' },
    { label: 'Live-Seiten', value: publishedPages?.value ?? 0, icon: Rocket, href: '/admin/pages' },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {tenant?.name ?? 'Tenant'} · {tenant?.industry ?? '–'}
          </p>
        </div>
        <DashboardActions
          tenantId={tid}
          publishDisabled={isPublicDemoMode}
          activeVersion={activeSnapshot?.version}
          canRollback={hasPreviousSnapshot && !isPublicDemoMode}
          readiness={contentHealth.success ? {
            ready: contentHealth.readyToPublish,
            blockers: contentHealth.blockingCount,
            advisories: contentHealth.advisoryCount,
          } : undefined}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="admin-card p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={20} className="text-zinc-400 group-hover:text-admin-accent transition-colors" />
            </div>
            <p className="text-2xl font-semibold text-zinc-900">{s.value}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Schnellzugriff</h2>
          <div className="space-y-2">
            {[
              { label: 'Startseite bearbeiten', href: homePage ? `/admin/pages/${homePage.id}` : '/admin/pages', icon: Home },
              { label: 'Leistung hinzufügen', href: '/admin/collections', icon: Zap },
              { label: 'Referenz hinzufügen', href: '/admin/collections', icon: Camera },
              { label: 'SEO prüfen', href: '/admin/seo', icon: Search },
            ].map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
              >
                <q.icon size={16} className="text-admin-accent" />
                <span>{q.label}</span>
                <span className="ml-auto text-zinc-300">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Website-Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 flex items-center gap-2"><AlertTriangle size={14} /> Publish-Bereitschaft</span>
              {contentHealth.success ? (
                <Link href="/admin/content-health" className={`inline-flex items-center gap-1.5 font-medium hover:underline ${contentHealth.readyToPublish ? 'text-emerald-600' : 'text-amber-700'}`}>
                  {contentHealth.readyToPublish ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  {contentHealth.readyToPublish ? 'Bereit' : `${contentHealth.blockingCount} offen`}
                </Link>
              ) : <Link href="/admin/content-health" className="text-zinc-500 hover:underline">Prüfen</Link>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 flex items-center gap-2"><Search size={14} /> SEO Global</span>
              {seoGlobalComplete ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium"><CheckCircle2 size={14} /> Gepflegt</span>
              ) : (
                <Link href="/admin/seo" className="inline-flex items-center gap-1.5 text-amber-600 font-medium hover:underline"><AlertTriangle size={14} /> Unvollständig</Link>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 flex items-center gap-2"><FileText size={14} /> Seiten-SEO</span>
              {pagesWithoutSeo.length === 0 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium"><CheckCircle2 size={14} /> Alle gepflegt</span>
              ) : (
                <span className="text-amber-600 font-medium">{pagesWithoutSeo.length} ohne Meta</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 flex items-center gap-2"><ImageIcon size={14} /> Mediathek</span>
              <span className="text-zinc-900 font-medium">{mediaCount?.value ?? 0} Bilder</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 flex items-center gap-2"><ImageIcon size={14} /> Bilder ohne Alt-Text</span>
              {mediaWithoutAlt.length === 0 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium"><CheckCircle2 size={14} /> Alle gepflegt</span>
              ) : (
                <Link href="/admin/media" className="text-amber-600 font-medium hover:underline">{mediaWithoutAlt.length} ohne Alt</Link>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 flex items-center gap-2"><Globe size={14} /> Live Status</span>
              {(publishedPages?.value ?? 0) > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Online</span>
              ) : (
                <span className="text-zinc-400">Nicht veröffentlicht</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card mt-8 overflow-hidden border-pink-100 bg-gradient-to-r from-pink-50 via-white to-orange-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-white">
              <Gift size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-950">Du bist zufrieden mit Flamingo Media?</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Empfiehl uns weiter und erhalte 3 Monate Hosting kostenlos. Das kostenlose Hosting wird bei erfolgreicher Vermittlung eines neuen Projekts aktiviert.</p>
            </div>
          </div>
          <a href="mailto:hello@flamingomedia.online?subject=Empfehlung%20f%C3%BCr%20Flamingo%20Media" className="admin-btn-primary shrink-0">
            <Send size={16} /> Empfehlung senden
          </a>
        </div>
      </div>
    </>
  );
}

