'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MonitorPlay, Rocket, Save } from 'lucide-react';
import { publishAction } from '@/app/admin/actions/publish';
import { useSaveState } from '@/components/save-context';
import { usePreview } from '@/components/admin/preview-context';

export function PublishFab() {
  const pathname = usePathname();
  const { state: saveState, hasSaveHandler, triggerSave, reset } = useSaveState();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const preview = usePreview();

  // Editors with their own EditorActionBar hide the global action bar.
  if (/^\/admin\/pages\/[^/]+$/.test(pathname)) return null;
  if (/^\/admin\/collections\/[^/]+\/[^/]+$/.test(pathname)) return null;
  if (/^\/admin\/shop\/products\/[^/]+$/.test(pathname)) return null;

  async function handlePublish() {
    setPublishing(true);
    try {
      const result = await publishAction();
      if (result?.error) {
        alert(result.error);
      } else {
        setPublished(true);
        reset();
        setTimeout(() => setPublished(false), 5000);
      }
    } finally {
      setPublishing(false);
    }
  }

  const showSave = hasSaveHandler && saveState !== 'saved';
  const showPublish = !hasSaveHandler || saveState === 'saved';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3" data-tour="publish-fab">
      <div className="relative group/preview">
        <button
          onClick={() => preview.isOpen ? preview.close() : preview.open()}
          className={`flex items-center gap-2 px-4 py-3 border rounded-full shadow-lg text-sm font-medium transition-colors ${
            preview.isOpen ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MonitorPlay size={16} /> Vorschau
        </button>
        {!preview.isOpen && (
          <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-gray-900 text-white text-xs px-3 py-2 shadow-xl opacity-0 group-hover/preview:opacity-100 transition-opacity">
            <div className="font-semibold mb-0.5 flex items-center gap-1.5">
              <span>✏️</span> Texte direkt in der Vorschau bearbeiten
            </div>
            <div className="text-gray-300 font-normal leading-relaxed">
              Öffne die Vorschau und klicke auf Texte oder Sektionen, um sie direkt zu ändern.
            </div>
            <div className="absolute top-full right-6 h-2 w-2 -mt-1 rotate-45 bg-gray-900" />
          </div>
        )}
      </div>
      {showSave ? (
        <button
          onClick={triggerSave}
          disabled={saveState === 'saving'}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> {saveState === 'saving' ? 'Speichert...' : 'Speichern'}
        </button>
      ) : showPublish ? (
        <button
          onClick={handlePublish}
          disabled={publishing}
          className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-sm font-semibold transition-all ${
            published ? 'bg-green-500 text-white' : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl active:scale-95'
          } disabled:opacity-60`}
        >
          <Rocket size={16} className={publishing ? 'animate-pulse' : ''} />
          {publishing ? 'Wird veröffentlicht...' : published ? 'Live!' : 'Veröffentlichen'}
        </button>
      ) : null}
    </div>
  );
}
