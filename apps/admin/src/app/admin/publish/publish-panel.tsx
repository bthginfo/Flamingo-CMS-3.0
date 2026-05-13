'use client';

import { useTransition } from 'react';
import { publishAction } from './actions';
import { toast } from 'sonner';
import { Rocket, Clock, CheckCircle } from 'lucide-react';

type Snapshot = { id: string; version: number; checksum: string; createdAt: Date; isActive: boolean } | null;
type HistoryEntry = { id: string; snapshotId: string; action: string; note: string | null; createdAt: Date };

export function PublishPanel({ activeSnapshot, history }: { activeSnapshot: Snapshot; history: HistoryEntry[] }) {
  const [pending, startTransition] = useTransition();

  function handlePublish() {
    if (!confirm('Alle aktuellen Änderungen veröffentlichen?')) return;
    startTransition(async () => {
      const result = await publishAction();
      toast.success(`Version ${result.version} veröffentlicht!`);
    });
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Aktueller Status</h2>
        {activeSnapshot ? (
          <div className="text-sm space-y-1">
            <p>Aktive Version: <strong>v{activeSnapshot.version}</strong></p>
            <p className="text-gray-500 text-xs">Checksum: {activeSnapshot.checksum.slice(0, 16)}…</p>
            <p className="text-gray-500 text-xs">Veröffentlicht: {new Date(activeSnapshot.createdAt).toLocaleString('de-DE')}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Noch keine Version veröffentlicht.</p>
        )}
      </div>

      {/* Publish Button */}
      <div className="admin-card text-center py-8">
        <Rocket size={48} className="mx-auto mb-4 text-blue-500" />
        <p className="text-gray-600 mb-4">Erstelle einen neuen Snapshot aller Seiten und Sektionen.</p>
        <button onClick={handlePublish} disabled={pending} className="admin-btn-primary text-lg px-8 py-3">
          {pending ? 'Wird veröffentlicht…' : '🚀 Jetzt veröffentlichen'}
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="admin-card">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Clock size={20} /> Verlauf</h2>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm py-2 border-b last:border-b-0">
                <span>{h.action}</span>
                <span className="text-gray-400 text-xs">{new Date(h.createdAt).toLocaleString('de-DE')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
