'use client';

import { useState, useTransition } from 'react';
import { addDomainAction, removeDomainAction, checkDomainAction } from '../actions';
import { toast } from 'sonner';
import { Globe, Plus, Trash2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

type DomainEntry = { id: string; domain: string; type: string; verified: boolean };

export function DomainManager({ tenantId, domains }: { tenantId: string; domains: DomainEntry[] }) {
  const [newDomain, setNewDomain] = useState('');
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    const domain = newDomain.trim().toLowerCase();
    if (!domain) return;
    startTransition(async () => {
      const result = await addDomainAction(tenantId, domain);
      if (result.success) {
        toast.success(`Domain ${domain} hinzugefügt`);
        setNewDomain('');
      } else {
        toast.error(result.error || 'Fehler');
      }
    });
  }

  function handleRemove(domain: string) {
    if (!confirm(`Domain "${domain}" wirklich entfernen?`)) return;
    startTransition(async () => {
      await removeDomainAction(tenantId, domain);
      toast.success(`Domain ${domain} entfernt`);
    });
  }

  function handleCheck(domain: string) {
    startTransition(async () => {
      const status = await checkDomainAction(domain);
      if (status.verified) {
        toast.success(`${domain} ist verifiziert`);
      } else {
        toast.info(`${domain} ist noch nicht verifiziert. DNS-Eintrag prüfen.`);
      }
    });
  }

  return (
    <div className="crm-card">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <Globe size={16} className="text-slate-400" /> Domains
        </h2>
      </div>

      {domains.length > 0 && (
        <div className="divide-y divide-slate-100">
          {domains.map(d => (
            <div key={d.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {d.verified ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <AlertCircle size={14} className="text-amber-500" />
                )}
                <span className="text-sm font-mono text-slate-700">{d.domain}</span>
                <span className="text-xs text-slate-400">{d.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleCheck(d.domain)} disabled={pending} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Status prüfen">
                  <RefreshCw size={14} />
                </button>
                <button onClick={() => handleRemove(d.domain)} disabled={pending} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Entfernen">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 py-3 border-t border-slate-100 flex gap-2">
        <input
          className="crm-input flex-1"
          value={newDomain}
          onChange={e => setNewDomain(e.target.value)}
          placeholder="www.neue-domain.de"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} disabled={pending || !newDomain.trim()} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
          <Plus size={14} /> Hinzufügen
        </button>
      </div>
    </div>
  );
}
