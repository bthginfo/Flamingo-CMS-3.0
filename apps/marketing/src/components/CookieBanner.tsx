/**
 * DSGVO-konformer Cookie-Banner.
 *  - Erscheint, solange der Nutzer keine Wahl getroffen hat (`needsDecision`).
 *  - Drei gleichwertige Buttons: Akzeptieren, Ablehnen, Einstellungen.
 *  - In den Einstellungen kann jede Kategorie einzeln aktiviert werden.
 *  - Verlinkt auf /datenschutz und /impressum.
 *  - Keine Cookies werden gesetzt, bevor der Nutzer zustimmt — die Auswahl
 *    selbst wird in localStorage (technisch notwendig) abgelegt.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsent, type ConsentCategory } from '../lib/consent';

const CATEGORY_INFO: { key: Exclude<ConsentCategory, 'necessary'>; label: string; desc: string }[] = [
  { key: 'functional', label: 'Funktional', desc: 'Erweiterte Komfortfunktionen wie eingebettete Karten oder Videos.' },
  { key: 'analytics',  label: 'Analyse',    desc: 'Anonyme Statistiken zur Verbesserung der Website (z. B. Plausible, Google Analytics).' },
  { key: 'marketing',  label: 'Marketing',  desc: 'Tracking-Pixel und Re-Targeting (z. B. Meta Pixel, Google Ads).' },
];

export function CookieBanner({ privacyHref = '/datenschutz', imprintHref = '/impressum' }: { privacyHref?: string; imprintHref?: string }) {
  const { needsDecision, consent, acceptAll, rejectAll, setConsent } = useConsent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    functional: consent.functional,
    analytics: consent.analytics,
    marketing: consent.marketing,
  });

  if (!needsDecision) return null;

  const saveSelection = () => {
    setConsent(draft);
    setOpen(false);
  };

  return (
    <>
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Cookie-Einstellungen"
        className="fixed inset-x-0 bottom-0 z-[100] p-4 md:p-6"
      >
        <div className="mx-auto max-w-5xl rounded-2xl border border-line bg-white shadow-2xl p-5 md:p-7">
          <div className="md:flex md:items-start md:gap-6">
            <div className="flex-1">
              <h2 className="font-display text-xl md:text-2xl">Wir respektieren Ihre Privatsphäre.</h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Diese Website verwendet technisch notwendige Cookies. Mit Ihrer Einwilligung
                nutzen wir zusätzlich Analyse- und Marketing-Tools, um unser Angebot zu verbessern.
                Sie können Ihre Auswahl jederzeit ändern oder widerrufen. Mehr in unserer{' '}
                <Link to={privacyHref} className="underline hover:no-underline">Datenschutzerklärung</Link>
                {' '}und im{' '}
                <Link to={imprintHref} className="underline hover:no-underline">Impressum</Link>.
              </p>
            </div>
            <div className="mt-4 md:mt-0 grid grid-cols-1 sm:grid-cols-3 gap-2 md:w-auto md:min-w-[26rem]">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="px-4 py-2.5 rounded-full border border-line text-sm hover:bg-black hover:text-white transition"
              >
                Einstellungen
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="px-4 py-2.5 rounded-full border border-line text-sm hover:bg-black hover:text-white transition"
              >
                Ablehnen
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="px-4 py-2.5 rounded-full bg-black text-white text-sm hover:opacity-90 transition"
              >
                Akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-black/50 p-4">
          <div role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl">Cookie-Einstellungen</h3>
              <button
                type="button"
                aria-label="Schließen"
                className="text-muted hover:text-black"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <ul className="mt-5 divide-y divide-line">
              <li className="py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">Notwendig</p>
                  <p className="text-sm text-muted mt-1">
                    Erforderlich für den Betrieb der Website (z. B. Speicherung Ihrer Cookie-Auswahl). Lässt sich nicht deaktivieren.
                  </p>
                </div>
                <span className="text-xs uppercase tracking-widest text-muted mt-1.5">Aktiv</span>
              </li>
              {CATEGORY_INFO.map((c) => (
                <li key={c.key} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{c.label}</p>
                    <p className="text-sm text-muted mt-1">{c.desc}</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={draft[c.key]}
                      onChange={(e) => setDraft({ ...draft, [c.key]: e.target.checked })}
                    />
                    <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black relative transition">
                      <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={rejectAll}
                className="px-4 py-2.5 rounded-full border border-line text-sm hover:bg-black hover:text-white transition"
              >
                Alle ablehnen
              </button>
              <button
                type="button"
                onClick={saveSelection}
                className="px-4 py-2.5 rounded-full border border-line text-sm hover:bg-black hover:text-white transition"
              >
                Auswahl speichern
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="px-4 py-2.5 rounded-full bg-black text-white text-sm hover:opacity-90 transition"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Inline-Button zum erneuten Aufruf des Banners (z. B. in der Datenschutzseite). */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  const { revoke } = useConsent();
  return (
    <button
      type="button"
      onClick={revoke}
      className={className || 'underline hover:no-underline'}
    >
      Cookie-Einstellungen ändern
    </button>
  );
}
