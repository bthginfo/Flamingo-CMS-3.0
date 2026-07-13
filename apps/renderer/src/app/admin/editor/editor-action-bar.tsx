'use client';

import { MonitorPlay, Rocket, Save } from 'lucide-react';
import { PreviewNudge } from '@/components/admin/preview-nudge';
import { useSuppressGlobalActions } from '@/components/save-context';

type Props = {
  previewOpen: boolean;
  saved?: boolean;
  saving: boolean;
  publishing?: boolean;
  publishable?: boolean;
  onTogglePreview: () => void;
  onSave: () => void | Promise<void>;
  onPublish?: () => void | Promise<void>;
  saveDisabled?: boolean;
  saveLabel?: string;
  savingLabel?: string;
  publishLabel?: string;
  publishingLabel?: string;
  publishDisabled?: boolean;
};

export function EditorActionBar({
  previewOpen,
  saved = false,
  saving,
  publishing = false,
  publishable = true,
  onTogglePreview,
  onSave,
  onPublish,
  saveDisabled = false,
  saveLabel = 'Speichern',
  savingLabel = 'Speichert...',
  publishLabel = 'Veröffentlichen',
  publishingLabel = 'Wird veröffentlicht...',
  publishDisabled = false,
}: Props) {
  useSuppressGlobalActions();
  const showPublish = publishable && saved && onPublish;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex min-h-[var(--editor-action-bar-height,5rem)] items-center border-t border-zinc-200 bg-white/95 px-3 py-3 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:px-6" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <div className="mx-auto flex max-w-[1600px] items-center justify-end gap-2 sm:gap-3">
        <span className="mr-auto hidden text-xs text-zinc-500 sm:inline" aria-live="polite">{saving ? savingLabel : publishing ? publishingLabel : saved ? 'Alle Änderungen gespeichert' : 'Ungespeicherte Änderungen'}</span>
        <div className="relative">
          <button
            type="button"
            onClick={onTogglePreview}
            className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:px-4 ${previewOpen ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'}`}
          >
            <MonitorPlay size={16} /> Vorschau
          </button>
          <PreviewNudge variant="top-right" priority={3} />
        </div>
        {!showPublish ? (
          <button
            type="button"
            onClick={onSave}
            disabled={saving || saveDisabled}
            className="flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
          >
            <Save size={16} /> {saving ? savingLabel : saveLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing || saving || publishDisabled}
            className="flex min-h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
          >
            <Rocket size={16} /> {publishing ? publishingLabel : publishLabel}
          </button>
        )}
      </div>
    </div>
  );
}
