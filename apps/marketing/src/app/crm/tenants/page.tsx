import { getDb } from '@/lib/db';
import { tenants, tenantDomains } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Building2, Plus, ArrowRight, Globe } from 'lucide-react';
import { TenantAccordion } from './tenant-accordion';

export const dynamic = 'force-dynamic';

export default async function TenantsPage() {
  const db = getDb();
  const tenantList = await db.select().from(tenants).orderBy(tenants.createdAt);
  const domains = await db.select().from(tenantDomains);

  const domainMap = new Map<string, string[]>();
  for (const d of domains) {
    const list = domainMap.get(d.tenantId) || [];
    list.push(d.domain);
    domainMap.set(d.tenantId, list);
  }

  const liveTenants = tenantList.filter(t => !t.isDemo);
  const demoTenants = tenantList.filter(t => t.isDemo);

  function TenantCard({ t }: { t: typeof tenantList[number] }) {
    const tDomains = domainMap.get(t.id) || [];
    return (
      <Link href={`/crm/tenants/${t.id}`} className="crm-card p-5 hover:border-indigo-300 hover:shadow-sm transition-all group block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
              {t.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{t.name}</h3>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                <span className="font-mono">{t.slug}</span>
                <span>·</span>
                <span className="capitalize">{t.industry}</span>
                <span>·</span>
                <span>Stil: {t.activeStyle}</span>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tenants</h1>
          <p className="text-sm text-slate-500 mt-1">{tenantList.length} Tenant{tenantList.length !== 1 ? 's' : ''} registriert</p>
        </div>
        <Link href="/crm/tenants/new" className="crm-btn-primary">
          <Plus size={16} /> Neuer Tenant
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
