'use client';

import { useTransition } from 'react';
import { updateTenantAction, deleteTenantAction, configureBlobAction, toggleShopAddonAction, toggleI18nAction, updateI18nSettingsAction, convertLeadSharedToStandaloneAction } from '../actions';
import { toast } from 'sonner';
import { Power, Pause, Trash2, Eye, ShoppingBag, UserCheck, Globe, CloudUpload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TenantActions({ tenantId, currentStatus, currentStyle, isDemo, isLead, deploymentMode, shopActive, i18nEnabled, i18nMaxLanguages }: { tenantId: string; currentStatus: string; currentStyle: string; isDemo?: boolean; isLead?: boolean; deploymentMode?: string; shopActive?: boolean; i18nEnabled?: boolean; i18nMaxLanguages?: number }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggleStatus() {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    startTransition(async () => {
      await updateTenantAction(tenantId, { status: newStatus as 'active' | 'suspended' });
      toast.success(`Status geändert: ${newStatus}`);
    });
  }

  function toggleDemo() {
    startTransition(async () => {
      await updateTenantAction(tenantId, { isDemo: !isDemo });
      toast.success(isDemo ? 'Demo-Flag entfernt' : 'Als Demo markiert');
    });
  }

  function toggleLead() {
    startTransition(async () => {
      await updateTenantAction(tenantId, { isLead: !isLead });
      toast.success(isLead ? 'Lead-Flag entfernt' : 'Als Lead-Seite markiert');
    });
  }

  return (
    <div className="crm-card p-5 space-y-3">
      <h3 className="font-semibold text-slate-900 text-sm">Aktionen</h3>
      <button
        onClick={toggleStatus}
        disabled={pending}
        className={`w-full ${currentStatus === 'active' ? 'crm-btn-danger' : 'crm-btn bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200'}`}
      >
        {currentStatus === 'active' ? <><Pause size={14} /> Suspendieren</> : <><Power size={14} /> Aktivieren</>}
      </button>
      <button
        onClick={toggleDemo}
        disabled={pending}
        className={`w-full crm-btn ${isDemo ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
      >
        <Eye size={14} /> {isDemo ? 'Demo-Flag entfernen' : 'Als Demo markieren'}
      </button>
      <button
        onClick={toggleLead}
        disabled={pending}
        className={`w-full crm-btn ${isLead ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
      >
        <UserCheck size={14} /> {isLead ? 'Lead-Flag entfernen' : 'Als Lead-Seite markieren'}
      </button>
      <button
        onClick={() => {
          startTransition(async () => {
            const result = await toggleShopAddonAction(tenantId, !shopActive);
            if (result.success) toast.success(shopActive ? 'Shop-Modul deaktiviert' : 'Shop-Modul aktiviert');
            router.refresh();
          });
        }}
        disabled={pending}
        className={`w-full crm-btn ${shopActive ? 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
      >
        <ShoppingBag size={14} /> {shopActive ? 'Shop-Modul deaktivieren' : 'Shop-Modul aktivieren'}
      </button>
      {/* i18n */}
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <button
          onClick={() => {
            startTransition(async () => {
              const result = await toggleI18nAction(tenantId, !i18nEnabled);
              if (result.success) toast.success(i18nEnabled ? 'i18n deaktiviert' : 'i18n aktiviert');
              router.refresh();
            });
          }}
          disabled={pending}
          className={`w-full crm-btn ${i18nEnabled ? 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
        >
          <Globe size={14} /> {i18nEnabled ? 'Mehrsprachigkeit deaktivieren' : 'Mehrsprachigkeit aktivieren'}
        </button>
        {i18nEnabled && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Max. Sprachen:</span>
            <select
              value={i18nMaxLanguages ?? 2}
              onChange={e => {
                startTransition(async () => {
                  await updateI18nSettingsAction(tenantId, { maxLanguages: Number(e.target.value) });
                  router.refresh();
                });
              }}
              className="border rounded px-2 py-1 text-xs"
            >
              {[2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          if (!confirm('Tenant wirklich endgültig löschen? Alle Daten und das Vercel-Projekt werden unwiderruflich gelöscht.')) return;
          startTransition(async () => {
            const result = await deleteTenantAction(tenantId);
            if (result.success) {
              toast.success('Tenant gelöscht');
              router.push('/crm/tenants');
            } else {
              toast.error(result.error || 'Fehler beim Löschen');
            }
          });
        }}
        disabled={pending}
        className="w-full crm-btn bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 border border-red-200"
      >
        <Trash2 size={14} /> Löschen
      </button>
      {deploymentMode === 'standalone' && (
        <button
          onClick={() => {
            startTransition(async () => {
              const result = await configureBlobAction(tenantId);
              if (result.success) {
                toast.success('Blob Storage erfolgreich konfiguriert');
              } else {
                toast.error(result.error || 'Fehler bei der Blob-Konfiguration');
              }
            });
          }}
          disabled={pending}
          className="w-full crm-btn bg-amber-50 text-amber-700 hover:bg-amber-100 active:bg-amber-200 border border-amber-200"
        >
          Blob Storage konfigurieren
        </button>
      )}
      {deploymentMode === 'lead_shared' && (
        <button
          onClick={() => {
            if (!confirm('Lead-Shared-Tenant jetzt in ein eigenes Standalone-Projekt umziehen?')) return;
            startTransition(async () => {
              const result = await convertLeadSharedToStandaloneAction(tenantId);
              if (result.success) {
                toast.success(result.warning || 'Tenant wurde in ein Standalone-Projekt umgezogen');
                router.refresh();
              } else {
                toast.error(result.error || 'Umzug fehlgeschlagen');
              }
            });
          }}
          disabled={pending}
          className="w-full crm-btn bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200"
        >
          <CloudUpload size={14} /> Zu Standalone umziehen
        </button>
      )}
    </div>
  );
}
