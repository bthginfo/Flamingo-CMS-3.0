'use client';

import { useState } from 'react';
import { useConsent, type ConsentCategory } from '@/lib/consent';

const CATEGORIES: { key: Exclude<ConsentCategory, 'necessary'>; label: string; desc: string }[] = [
  { key: 'functional', label: 'Funktional', desc: 'Eingebettete Karten, Videos und erweiterte Funktionen.' },
  { key: 'analytics', label: 'Analyse', desc: 'Anonyme Nutzungsstatistiken zur Verbesserung der Website.' },
  { key: 'marketing', label: 'Marketing', desc: 'Tracking und personalisierte Werbung.' },
];

export function CookieBanner() {
  const { needsDecision, consent, acceptAll, rejectAll, setConsent } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [draft, setDraft] = useState({ functional: consent.functional, analytics: consent.analytics, marketing: consent.marketing });

  if (!needsDecision) return null;

  return (
    <div role="dialog" aria-label="Cookie-Einstellungen" className="fixed inset-x-0 bottom-0 z-[100] p-4">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-100 p-6">
        <h2 className="font-display text-lg font-bold">Wir respektieren Ihre Privatsphäre</h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          Diese Website verwendet Cookies. Technisch notwendige Cookies sind immer aktiv.
          Optional können Sie Analyse- und Marketing-Cookies aktivieren.
        </p>

        {showDetails && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-center justify-between py-2">
              <div><span className="text-sm font-medium">Technisch notwendig</span><p className="text-xs text-gray-400">Immer aktiv</p></div>
              <div className="w-10 h-5 rounded-full bg-brand-primary opacity-60" />
            </div>
            {CATEGORIES.map(cat => (
              <div key={cat.key} className="flex items-center justify-between py-2">
                <div><span className="text-sm font-medium">{cat.label}</span><p className="text-xs text-gray-400">{cat.desc}</p></div>
                <button
                  onClick={() => setDraft(d => ({ ...d, [cat.key]: !d[cat.key] }))}
                  className={`w-10 h-5 rounded-full transition-colors ${draft[cat.key] ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${draft[cat.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={acceptAll} className="flex-1 rounded-full bg-brand-primary text-white text-sm font-medium py-2.5 px-4 hover:opacity-90 transition">
            Alle akzeptieren
          </button>
          {showDetails ? (
            <button onClick={() => setConsent(draft)} className="flex-1 rounded-full bg-gray-100 text-sm font-medium py-2.5 px-4 hover:bg-gray-200 transition">
              Auswahl speichern
            </button>
          ) : (
            <button onClick={() => setShowDetails(true)} className="flex-1 rounded-full bg-gray-100 text-sm font-medium py-2.5 px-4 hover:bg-gray-200 transition">
              Einstellungen
            </button>
          )}
          <button onClick={rejectAll} className="flex-1 rounded-full border border-gray-200 text-sm font-medium py-2.5 px-4 hover:bg-gray-50 transition">
            Nur notwendige
          </button>
        </div>
      </div>
    </div>
  );
}
