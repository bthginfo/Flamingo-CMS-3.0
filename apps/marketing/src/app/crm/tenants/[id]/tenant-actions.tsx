'use client';

import { useTransition } from 'react';
import { updateTenantAction, deleteTenantAction } from '../actions';
import { toast } from 'sonner';
import { Power, Pause, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TenantActions({ tenantId, currentStatus, currentStyle }: { tenantId: string; currentStatus: string; currentStyle: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggleStatus() {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    startTransition(async () => {
      await updateTenantAction(tenantId, { status: newStatus as 'active' | 'suspended' });
      toast.success(`Status geändert: ${newStatus}`);
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
    </div>
  );
}
