'use client';

import { MonitorPlay, Save } from 'lucide-react';

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
};

export function EditorActionBar({
  previewOpen,
  saving,
  onTogglePreview,
  onSave,
  saveDisabled = false,
  saveLabel = 'Speichern',
  savingLabel = 'Speichert...',
}: Props) {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
      <button
        onClick={onTogglePreview}
        className={`flex items-center gap-2 px-4 py-2.5 border rounded-full shadow-lg text-sm font-medium transition-colors ${previewOpen ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
      >
        <MonitorPlay size={16} /> Vorschau
      </button>
      <button
        onClick={onSave}
        disabled={saving || saveDisabled}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full shadow-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Save size={16} /> {saving ? savingLabel : saveLabel}
      </button>
    </div>
  );
}
