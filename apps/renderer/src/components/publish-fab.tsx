'use client';

import { useState } from 'react';
import { Save, Rocket, ExternalLink } from 'lucide-react';
import { publishAction } from '@/app/admin/actions/publish';
import { useSaveState } from './save-context';

export function PublishFab() {
  const { state, markSaving, markSaved } = useSaveState();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  async function handlePublish() {
    setPublishing(true);
    try {
      const result = await publishAction();
      if (result?.error) {
        alert(result.error);
      } else {
        setPublished(true);
        setTimeout(() => setPublished(false), 5000);
      }
    } finally {
      setPublishing(false);
    }
  }

  // After save: show Vorschau + Veröffentlichen
  if (state === 'saved' || published) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <a
          href="/preview/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-full shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={16} /> Vorschau
        </a>
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
      </div>
    );
  }

  // No unsaved state visible from FAB — individual pages handle their own "Speichern"
  return null;
}
