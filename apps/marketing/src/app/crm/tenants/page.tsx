import { getDb } from '@/lib/db';
import { tenants, tenantDatabaseConnections, tenantDomains } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Building2, Plus, ArrowRight, Globe } from 'lucide-react';
import { TenantAccordion } from './tenant-accordion';
import { requireCrmAdmin } from '@/lib/session';
import { getNeonOrganizationPlan } from '@/lib/neon';

export const dynamic = 'force-dynamic';

export default async function TenantsPage() {
  await requireCrmAdmin();
  const db = getDb();
  const tenantList = await db.select().from(tenants).orderBy(tenants.createdAt);
  const [domains, databaseConnections] = await Promise.all([
    db.select().from(tenantDomains),
    db.select({
      tenantId: tenantDatabaseConnections.tenantId,
      billingPlanIntent: tenantDatabaseConnections.billingPlanIntent,
      status: tenantDatabaseConnections.status,
      projectId: tenantDatabaseConnections.projectId,
    }).from(tenantDatabaseConnections)
      .catch(error => {
        if (/billing_plan_intent|column .* does not exist/i.test(error instanceof Error ? error.message : String(error))) return [];
        throw error;
      }),
  ]);
  const neonPlan = tenantList.some(tenant => tenant.deploymentMode === 'standalone')
    ? await getNeonOrganizationPlan().catch(() => null)
    : null;
  const neonPlanLabel = neonPlan ? neonPlan.charAt(0).toUpperCase() + neonPlan.slice(1) : 'unbekannt';

  const domainMap = new Map<string, string[]>();
  const databaseConnectionMap = new Map(databaseConnections.map(connection => [connection.tenantId, connection]));
  for (const d of domains) {
    const list = domainMap.get(d.tenantId) || [];
    list.push(d.domain);
    domainMap.set(d.tenantId, list);
  }

  const liveTenants = tenantList.filter(t => !t.isDemo && !t.isLead);
  const leadTenants = tenantList.filter(t => t.isLead);
  const demoTenants = tenantList.filter(t => t.isDemo);

  function TenantCard({ t }: { t: typeof tenantList[number] }) {
    const tDomains = domainMap.get(t.id) || [];
    const databaseConnection = databaseConnectionMap.get(t.id);
    const standaloneBadge = (() => {
      if (t.deploymentMode !== 'standalone') return null;
      if (!databaseConnection) return { label: 'Standalone · DB fehlt', className: 'crm-badge-amber' };
      if (databaseConnection.status === 'migration_failed') return { label: 'Standalone · Migration offen', className: 'crm-badge-red' };
      if (databaseConnection.status !== 'active') return { label: `Standalone · DB ${databaseConnection.status}`, className: 'crm-badge-amber' };
      if (databaseConnection.projectId?.startsWith('external:')) return { label: 'Standalone · Neon extern', className: 'crm-badge-green' };
      return { label: `Standalone · ${neonPlan ? `Neon ${neonPlanLabel}` : 'DB aktiv'}`, className: neonPlan === 'free' || !neonPlan ? 'crm-badge-green' : 'crm-badge-amber' };
    })();
    return (
      <Link href={`/crm/tenants/${t.id}`} className="crm-card p-4 sm:p-5 hover:border-indigo-300 hover:shadow-sm transition-all group block">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center text-base sm:text-lg font-bold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shrink-0">
              {t.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{t.name}</h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-slate-400">
                <span className="font-mono">{t.slug}</span>
                <span className="hidden sm:inline">·</span>
                <span className="capitalize">{t.industry}</span>
                {standaloneBadge && <span className={standaloneBadge.className}>{standaloneBadge.label}</span>}
                {databaseConnection?.billingPlanIntent === 'paid_requested' && <span className="crm-badge-amber">Paid-DB vorgemerkt</span>}
                {t.deploymentMode === 'lead_shared' && <span className="crm-badge-amber">Lead-Shared</span>}
                {t.deploymentMode === 'shared' && <span className="crm-badge-slate">Demo-Shared</span>}
              </div>
              {tDomains.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600">
                  <Globe size={12} />
                  {tDomains.join(', ')}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={t.status === 'active' ? 'crm-badge-green' : t.status === 'provisioning' ? 'crm-badge-amber' : 'crm-badge-red'}>{t.status}</span>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Tenants</h1>
          <p className="text-sm text-slate-500 mt-1">{tenantList.length} Tenant{tenantList.length !== 1 ? 's' : ''} registriert</p>
        </div>
        <Link href="/crm/tenants/new" className="crm-btn-primary">
          <Plus size={16} /> <span className="hidden sm:inline">Neuer Tenant</span><span className="sm:hidden">Neu</span>
        </Link>
      </div>

      {tenantList.length === 0 ? (
        <div className="crm-card p-16 text-center">
          <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 mb-4">Noch keine Tenants vorhanden.</p>
          <Link href="/crm/tenants/new" className="crm-btn-primary">
            <Plus size={16} /> Ersten Tenant anlegen
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {liveTenants.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Live ({liveTenants.length})</h2>
              <div className="grid gap-4">
                {liveTenants.map(t => <TenantCard key={t.id} t={t} />)}
              </div>
            </div>
          )}

          {leadTenants.length > 0 && (
            <TenantAccordion label={`Seiten für Leads (${leadTenants.length})`}>
              <div className="grid gap-4">
                {leadTenants.map(t => <TenantCard key={t.id} t={t} />)}
              </div>
            </TenantAccordion>
          )}

          {demoTenants.length > 0 && (
            <TenantAccordion label={`Demo-Tenants (${demoTenants.length})`}>
              <div className="grid gap-4">
                {demoTenants.map(t => <TenantCard key={t.id} t={t} />)}
              </div>
            </TenantAccordion>
          )}
        </div>
      )}
    </div>
  );
}
