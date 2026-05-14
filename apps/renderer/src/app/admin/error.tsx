'use client';

import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Flamingo Admin Error]', error.message, error.digest);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-xl">!</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Fehler aufgetreten</h2>
        <p className="text-sm text-gray-500 mb-4">{error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-admin-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
