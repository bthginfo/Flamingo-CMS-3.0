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
        className={`w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          currentStatus === 'active'
            ? 'bg-red-50 text-red-700 hover:bg-red-100'
            : 'bg-green-50 text-green-700 hover:bg-green-100'
        }`}
      >
        {currentStatus === 'active' ? <><Pause size={14} /> Suspendieren</> : <><Power size={14} /> Aktivieren</>}
      </button>
    </div>
  );
}
