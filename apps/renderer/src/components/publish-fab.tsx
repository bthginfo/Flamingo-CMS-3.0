'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Rocket, MonitorPlay, Save } from 'lucide-react';
import { publishAction } from '@/app/admin/actions/publish';
import { useSaveState } from '@/components/save-context';
import { usePreview } from '@/components/admin/preview-context';

export function PublishFab() {
  const pathname = usePathname();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const { state: saveState, hasSaveHandler, triggerSave, reset } = useSaveState();
  const preview = usePreview();

  // Page editor and collection item editor have their own FAB bars
  if (/^\/admin\/pages\/[^/]+$/.test(pathname)) return null;
  if (/^\/admin\/collections\/[^/]+\/[^/]+$/.test(pathname)) return null;

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

  // Show "Speichern" when dirty or saving, or idle with a registered handler (initial state)
  const showSave = saveState !== 'saved' && hasSaveHandler;
  // Show "Veröffentlichen" when saved (after a successful save)
  const showPublish = saveState === 'saved' || !hasSaveHandler;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3" data-tour="publish-fab">
      <button
        onClick={() => preview.isOpen ? preview.close() : preview.open('/live-preview')}
        className={`flex items-center gap-2 px-4 py-3 border rounded-full shadow-lg text-sm font-medium transition-colors ${
          preview.isOpen ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <MonitorPlay size={16} /> Vorschau
      </button>
      {showSave ? (
        <button
          onClick={triggerSave}
          disabled={saveState === 'saving' || saveState === 'idle'}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> {saveState === 'saving' ? 'Speichert…' : 'Speichern'}
        </button>
      ) : (
        <button
          onClick={handlePublish}
          disabled={publishing}
          className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-sm font-semibold transition-all ${
            published
              ? 'bg-green-500 text-white'
              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl active:scale-95'
          } disabled:opacity-60`}
        >
          <Rocket size={16} className={publishing ? 'animate-pulse' : ''} />
          {publishing ? 'Wird veröffentlicht…' : published ? 'Live!' : 'Veröffentlichen'}
        </button>
      )}
    </div>
  );
}
