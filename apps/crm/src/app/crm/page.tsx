import { getDb } from '@/lib/db';
import { tenants, tenantDomains, publishedSnapshots, pages } from '@flamingo/db';
import { eq, count, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Building2, Globe, FileText, ArrowRight, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CrmDashboard() {
  const db = getDb();

  const [tenantList] = await Promise.all([
    db.select().from(tenants).orderBy(tenants.createdAt),
  ]);

  const tenantCount = tenantList.length;
  const activeCount = tenantList.filter(t => t.status === 'active').length;
  const provisioningCount = tenantList.filter(t => t.status === 'provisioning').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Übersicht aller Tenants und Systeme</p>
        </div>
        <Link href="/crm/tenants/new" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm">
          <Plus size={16} /> Neuer Tenant
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="crm-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Building2 size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{tenantCount}</p>
              <p className="text-xs text-slate-500">Tenants gesamt</p>
            </div>
          </div>
        </div>
        <div className="crm-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Globe size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
              <p className="text-xs text-slate-500">Aktiv</p>
            </div>
          </div>
        </div>
        <div className="crm-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <FileText size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{provisioningCount}</p>
              <p className="text-xs text-slate-500">Provisioning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent tenants */}
      <div className="crm-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Alle Tenants</h2>
          <Link href="/crm/tenants" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            Alle anzeigen <ArrowRight size={14} />
          </Link>
        </div>
        {tenantList.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Building2 size={40} className="mx-auto mb-3 opacity-40" />
            <p>Noch keine Tenants vorhanden</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tenantList.slice(0, 10).map(t => (
              <Link key={t.id} href={`/crm/tenants/${t.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.slug} · {t.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    t.status === 'active' ? 'bg-green-100 text-green-700' :
                    t.status === 'provisioning' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>{t.status}</span>
                  <ArrowRight size={14} className="text-slate-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
