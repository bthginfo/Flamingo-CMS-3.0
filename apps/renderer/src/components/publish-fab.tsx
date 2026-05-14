'use client';

import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { publishAction } from '@/app/admin/publish/actions';

export function PublishFab() {
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState(false);

  async function handlePublish() {
    setPublishing(true);
    try {
      const result = await publishAction();
      if (result?.error) {
        alert(result.error);
      } else {
        setDone(true);
        setTimeout(() => setDone(false), 3000);
      }
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handlePublish}
        disabled={publishing}
        className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-sm font-semibold transition-all ${
          done
            ? 'bg-green-500 text-white'
            : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl active:scale-95'
        } disabled:opacity-60`}
      >
        <Rocket size={16} className={publishing ? 'animate-pulse' : ''} />
        {publishing ? 'Wird veröffentlicht…' : done ? 'Live!' : 'Veröffentlichen'}
      </button>
    </div>
  );
}
