'use client';

import { usePathname } from 'next/navigation';
import { MonitorPlay, Save } from 'lucide-react';
import { useSaveState } from '@/components/save-context';
import { usePreview } from '@/components/admin/preview-context';

export function PublishFab() {
  const pathname = usePathname();
  const { state: saveState, hasSaveHandler, triggerSave } = useSaveState();
  const preview = usePreview();

  // Editors with their own EditorActionBar hide the global action bar.
  if (/^\/admin\/pages\/[^/]+$/.test(pathname)) return null;
  if (/^\/admin\/collections\/[^/]+\/[^/]+$/.test(pathname)) return null;
  if (/^\/admin\/shop\/products\/[^/]+$/.test(pathname)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3" data-tour="publish-fab">
      <button
        onClick={() => preview.isOpen ? preview.close() : preview.open()}
        className={`flex items-center gap-2 px-4 py-3 border rounded-full shadow-lg text-sm font-medium transition-colors ${
          preview.isOpen ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <MonitorPlay size={16} /> Vorschau
      </button>
      {hasSaveHandler && (
        <button
          onClick={triggerSave}
          disabled={saveState === 'saving'}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> {saveState === 'saving' ? 'Speichert...' : 'Speichern'}
        </button>
      )}
    </div>
  );
}
