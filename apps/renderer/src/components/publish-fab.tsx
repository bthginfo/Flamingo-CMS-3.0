'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MonitorPlay, Rocket, Save } from 'lucide-react';
import { publishAction } from '@/app/admin/actions/publish';
import { useSaveState } from '@/components/save-context';
import { usePreview } from '@/components/admin/preview-context';
import { PreviewNudge } from '@/components/admin/preview-nudge';
import { toast } from 'sonner';
import { getPublishFailureDescription } from '@/app/admin/publish-feedback';

export function PublishFab() {
  const pathname = usePathname();
  const { state: saveState, hasSaveHandler, hasLocalActions, triggerSave, reset } = useSaveState();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const preview = usePreview();

  // Editors with their own EditorActionBar hide the global action bar.
  if (pathname === '/admin' || hasLocalActions) return null;
  if (/^\/admin\/pages\/[^/]+$/.test(pathname)) return null;
  if (/^\/admin\/collections\/[^/]+\/[^/]+$/.test(pathname)) return null;
  if (/^\/admin\/shop\/products\/[^/]+$/.test(pathname)) return null;

  async function handlePublish() {
    setPublishing(true);
    try {
      const result = await publishAction();
      if (result.error) {
        toast.error(result.error, {
          description: getPublishFailureDescription(result), duration: 9000,
        });
      } else {
        setPublished(true);
        reset();
        toast.success(result.unchanged ? 'Website ist bereits aktuell' : 'Website veröffentlicht');
        setTimeout(() => setPublished(false), 5000);
      }
    } catch {
      toast.error('Veröffentlichen fehlgeschlagen');
    } finally {
      setPublishing(false);
    }
  }

  async function handleSave() {
    try {
      await triggerSave();
    } catch {
      toast.error('Speichern fehlgeschlagen');
    }
  }

  const showSave = hasSaveHandler && saveState !== 'saved';
  const showPublish = !hasSaveHandler || saveState === 'saved';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3" data-tour="publish-fab">
      <div className="relative">
        <button
          type="button"
          onClick={() => preview.isOpen ? preview.close() : preview.open()}
          className={`flex items-center gap-2 px-4 py-3 border rounded-full shadow-lg text-sm font-medium transition-colors ${
            preview.isOpen ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MonitorPlay size={16} /> Vorschau
        </button>
        <PreviewNudge variant="top-right" priority={2} />
      </div>
      {showSave ? (
        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === 'saving'}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> {saveState === 'saving' ? 'Speichert...' : 'Speichern'}
        </button>
      ) : showPublish ? (
        <button
          type="button"
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
