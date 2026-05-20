import { getDb } from '@/lib/db';
import { tenants, tenantDomains, pages, publishedSnapshots, globalSettings } from '@flamingo/db';
import { eq, and, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, FileText, Layers, ExternalLink, Shield, Server, Cloud } from 'lucide-react';
import { TenantActions } from './tenant-actions';
import { DomainManager } from './domain-manager';
import { DesignEditor } from './design-editor';
import { PatManager } from './pat-manager';
import { getActiveToken } from './pat-actions';

export const dynamic = 'force-dynamic';

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
  if (!tenant) notFound();

  const [domains, tenantPages, [snapCount], settings, activeToken] = await Promise.all([
    db.select().from(tenantDomains).where(eq(tenantDomains.tenantId, id)),
    db.select().from(pages).where(eq(pages.tenantId, id)),
    db.select({ count: count() }).from(publishedSnapshots).where(eq(publishedSnapshots.tenantId, id)),
    db.select().from(globalSettings).where(eq(globalSettings.tenantId, id)),
    getActiveToken(id),
  ]);

  const brand = settings[0]?.brand as Record<string, unknown> | undefined;
  const design = settings[0]?.design as Record<string, unknown> | undefined;

  return (
    <div>
      <Link href="/crm/tenants" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={14} /> Zurück zu Tenants
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600">
            {tenant.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{tenant.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span className="font-mono">{tenant.slug}</span>
              <span>·</span>
              <span className="capitalize">{tenant.industry}</span>
              <span>·</span>
              <span className={tenant.status === 'active' ? 'crm-badge-green' : tenant.status === 'provisioning' ? 'crm-badge-amber' : 'crm-badge-red'}>{tenant.status}</span>
              {tenant.deploymentMode === 'standalone' && <span className="crm-badge-amber">Standalone</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column */}
        <div className="col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="crm-card p-4 text-center">
              <FileText size={18} className="mx-auto mb-1.5 text-slate-400" />
              <p className="text-2xl font-bold text-slate-900">{tenantPages.length}</p>
              <p className="text-xs text-slate-500">Seiten</p>
            </div>
            <div className="crm-card p-4 text-center">
              <Layers size={18} className="mx-auto mb-1.5 text-slate-400" />
              <p className="text-2xl font-bold text-slate-900">{snapCount?.count ?? 0}</p>
              <p className="text-xs text-slate-500">Snapshots</p>
            </div>
            <div className="crm-card p-4 text-center">
              <Globe size={18} className="mx-auto mb-1.5 text-slate-400" />
              <p className="text-2xl font-bold text-slate-900">{domains.length}</p>
              <p className="text-xs text-slate-500">Domains</p>
            </div>
          </div>

          {/* Domains */}
          <DomainManager tenantId={id} domains={domains.map(d => ({ id: d.id, domain: d.domain, type: d.type, verified: d.verified }))} />

          {/* Design Editor */}
          <DesignEditor tenantId={id} initialBrand={brand || {}} initialDesign={design || {}} />

          {/* Pages */}
          <div className="crm-card">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Seiten</h2>
            </div>
            {tenantPages.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">Keine Seiten vorhanden</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {tenantPages.map(p => (
                  <div key={p.id} className="px-5 py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-slate-900">{p.title}</span>
                      <span className="text-slate-400 ml-2 font-mono text-xs">/{p.slug}</span>
                    </div>
                    <span className={p.status === 'published' ? 'crm-badge-green' : 'crm-badge-slate'}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <TenantActions tenantId={id} currentStatus={tenant.status} currentStyle={tenant.activeStyle} isDemo={tenant.isDemo} />

          {/* Info */}
          <div className="crm-card p-5 space-y-3 text-sm">
            <h3 className="font-semibold text-slate-900">Details</h3>
            <div className="space-y-2 text-slate-500">
              <div className="flex justify-between">
                <span>Erstellt</span>
                <span className="text-slate-900">{new Date(tenant.createdAt).toLocaleDateString('de-DE')}</span>
              </div>
              <div className="flex justify-between">
                <span>Stil</span>
                <span className="text-slate-900 capitalize">{tenant.activeStyle}</span>
              </div>
              <div className="flex justify-between">
                <span>Deployment</span>
                <span className="inline-flex items-center gap-1 text-slate-900">
                  {tenant.deploymentMode === 'standalone' ? <><Cloud size={12} /> Standalone</> : <><Server size={12} /> Shared</>}
                </span>
              </div>
              {tenant.vercelProjectId && (
                <div className="flex justify-between">
                  <span>Vercel Project</span>
                  <span className="text-slate-900 font-mono text-xs">{tenant.vercelProjectId.slice(0, 12)}…</span>
                </div>
              )}
              {typeof brand?.companyName === 'string' && brand.companyName && (
                <div className="flex justify-between">
                  <span>Anzeigename</span>
                  <span className="text-slate-900">{brand.companyName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tenant-ID</span>
                <span className="text-slate-900 font-mono text-xs">{id.slice(0, 8)}…</span>
              </div>
            </div>
          </div>

          {/* PAT Manager */}
          <PatManager tenantId={id} activeToken={activeToken} />

          {/* Quick links */}
          <div className="crm-card p-5 space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm">Quick Links</h3>
            {domains.map(d => (
              <a key={d.id} href={`https://${d.domain}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 truncate">
                <ExternalLink size={14} className="shrink-0" /> {d.domain}
              </a>
            ))}
            {domains[0] && (
              <a href={`https://${domains[0].domain}/admin`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
                <Shield size={14} className="shrink-0" /> Admin öffnen
              </a>
            )}
            {tenant.slug?.startsWith('demo-') && (() => {
              const industryMap: Record<string, string> = { tradesman: 'handwerk', hotel: 'hotel', restaurant: 'restaurant', salon: 'salon', tourism: 'tourism', medical: 'medical', wedding: 'wedding', photography: 'photography' };
              const demoKey = industryMap[tenant.industry] || tenant.industry;
              const rendererBase = domains[0] ? `https://${domains[0].domain}` : 'https://www.flamingomedia.online';
              const adminUrl = domains[0] ? `${rendererBase}/admin` : `${rendererBase}/admin/demo-login?industry=${demoKey}`;
              const frontendPath = domains[0] ? '' : `/demo/${demoKey}`;
              return (
                <>
                  <a href={adminUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
                    <Shield size={14} className="shrink-0" /> Admin ({demoKey})
                  </a>
                  <a href={`${rendererBase}${frontendPath}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
                    <Globe size={14} className="shrink-0" /> Frontend ({demoKey})
                  </a>
                  <a href={`${rendererBase}/live-preview`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
                    <ExternalLink size={14} className="shrink-0" /> Live-Preview
                  </a>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
