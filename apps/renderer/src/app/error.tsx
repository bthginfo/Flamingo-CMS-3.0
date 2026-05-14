'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to console in dev, could integrate Sentry/LogRocket here
    console.error('[Flamingo Error]', error.message, error.digest);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Etwas ist schiefgelaufen</h1>
        <p className="text-gray-500 mb-6">Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-dark transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
