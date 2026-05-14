'use client';

import { useTransition } from 'react';
import { publishAction } from './actions';
import { toast } from 'sonner';
import { Rocket, Clock, CheckCircle, Globe, Hash, Calendar, ArrowUpCircle } from 'lucide-react';

type Snapshot = { id: string; version: number; checksum: string; createdAt: Date; isActive: boolean } | null;
type HistoryEntry = { id: string; snapshotId: string; action: string; note: string | null; createdAt: Date };

export function PublishPanel({ activeSnapshot, history }: { activeSnapshot: Snapshot; history: HistoryEntry[] }) {
  const [pending, startTransition] = useTransition();

  function handlePublish() {
    if (!confirm('Alle aktuellen Änderungen veröffentlichen?')) return;
    startTransition(async () => {
      const result = await publishAction();
      if ('error' in result) {
        toast.error(result.error as string);
      } else {
        toast.success(`Version ${result.version} veröffentlicht!`);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Publish Action Card */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 py-10 text-center text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
            <ArrowUpCircle size={32} />
          </div>
          <h2 className="text-lg font-semibold mb-1">Änderungen veröffentlichen</h2>
          <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
            Erstellt einen neuen Snapshot aller Seiten, Sektionen und Sammlungen und schaltet ihn live.
          </p>
          <button
            onClick={handlePublish}
            disabled={pending}
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 shadow-lg"
          >
            <Rocket size={18} />
            {pending ? 'Wird veröffentlicht…' : 'Jetzt veröffentlichen'}
          </button>
        </div>
      </div>

      {/* Current Status */}
      {activeSnapshot && (
        <div className="admin-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={16} className="text-green-600" />
            <h3 className="font-semibold text-zinc-900">Aktuelle Live-Version</h3>
            <span className="ml-auto inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle size={12} /> Aktiv
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-50 rounded-lg p-3 text-center">
              <Hash size={14} className="text-zinc-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-zinc-900">v{activeSnapshot.version}</p>
              <p className="text-xs text-zinc-500">Version</p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-3 text-center">
              <Calendar size={14} className="text-zinc-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-zinc-900">{new Date(activeSnapshot.createdAt).toLocaleDateString('de-DE')}</p>
              <p className="text-xs text-zinc-500">Veröffentlicht</p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-3 text-center">
              <Clock size={14} className="text-zinc-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-zinc-900">{new Date(activeSnapshot.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-xs text-zinc-500">Uhrzeit</p>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-3 font-mono">SHA {activeSnapshot.checksum.slice(0, 16)}…</p>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="admin-card p-5">
          <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-zinc-400" /> Verlauf
          </h3>
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-zinc-200" />
            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={h.id} className="flex items-start gap-3 relative">
                  <div className={`w-[23px] h-[23px] rounded-full flex items-center justify-center shrink-0 z-10 ${i === 0 ? 'bg-blue-100' : 'bg-zinc-100'}`}>
                    <CheckCircle size={12} className={i === 0 ? 'text-blue-600' : 'text-zinc-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-700 capitalize">{h.action}</p>
                    <p className="text-xs text-zinc-400">
                      {new Date(h.createdAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
