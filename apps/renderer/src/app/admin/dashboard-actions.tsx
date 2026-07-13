'use client';

import { useState } from 'react';
import { Eye, History, Loader2, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { publishAction, rollbackPublishAction } from './actions/publish';
import { getPublishFailureDescription } from './publish-feedback';
import { useRouter } from 'next/navigation';

export function DashboardActions({
  tenantId,
  publishDisabled = false,
  activeVersion,
  canRollback = false,
}: {
  tenantId: string;
  publishDisabled?: boolean;
  activeVersion?: number;
  canRollback?: boolean;
}) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [rollingBack, setRollingBack] = useState(false);
  const previewUrl = `/live-preview?tenant=${encodeURIComponent(tenantId)}`;

  async function handlePublish() {
    setPublishing(true);
    try {
      const result = await publishAction();
      if (result.error) {
        toast.error(result.error, {
          description: getPublishFailureDescription(result), duration: 9000,
        });
        return;
      }
      toast.success(result.unchanged ? 'Website ist bereits aktuell' : 'Website veröffentlicht');
      router.refresh();
    } catch {
      toast.error('Veröffentlichen fehlgeschlagen');
    } finally {
      setPublishing(false);
    }
  }

  async function handleRollback() {
    if (!window.confirm('Wirklich die vorherige Live-Version wiederherstellen? Aktuelle Entwürfe bleiben erhalten.')) return;
    setRollingBack(true);
    try {
      const result = await rollbackPublishAction();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`Live-Version ${result.version ?? ''} wiederhergestellt`);
      router.refresh();
    } catch {
      toast.error('Wiederherstellen fehlgeschlagen');
    } finally {
      setRollingBack(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="admin-btn-secondary">
        <Eye size={16} /> Preview
      </a>
      {activeVersion !== undefined && (
        <span className="hidden items-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-500 lg:inline-flex">
          Live v{activeVersion}
        </span>
      )}
      {canRollback && (
        <button
          type="button"
          onClick={handleRollback}
          className="admin-btn-secondary"
          disabled={publishing || rollingBack}
          title="Vorherige Live-Version wiederherstellen"
        >
          {rollingBack ? <Loader2 size={16} className="animate-spin" /> : <History size={16} />}
          <span className="hidden xl:inline">Vorherige Version</span>
        </button>
      )}
      <button
        type="button"
        onClick={handlePublish}
        className="admin-btn-primary"
        disabled={publishDisabled || publishing || rollingBack}
        title={publishDisabled ? 'Im öffentlichen Demo-Modus deaktiviert' : undefined}
      >
        {publishing ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
        {publishing ? 'Prüft & veröffentlicht…' : 'Veröffentlichen'}
      </button>
    </div>
  );
}
