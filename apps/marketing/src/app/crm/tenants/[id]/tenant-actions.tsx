'use client';

import { useTransition } from 'react';
import { updateTenantAction } from '../actions';
import { toast } from 'sonner';
import { Power, Pause } from 'lucide-react';

export function TenantActions({ tenantId, currentStatus, currentStyle }: { tenantId: string; currentStatus: string; currentStyle: string }) {
  const [pending, startTransition] = useTransition();

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
    </div>
  );
}
