'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/lib/consent';
import { isConsentUiSuppressed } from '@/lib/consent-routes';

// Internal preview/iframe routes that render public sections in isolation — the
// cookie banner is clutter there (the showcase shows it inside every preview
// iframe). It still shows on the real public site and on the demos.

// UI strings per locale — the banner is a shared platform component, so it
// follows the active locale (first path segment) rather than tenant content.
const STRINGS = {
  de: {
    dialog: 'Cookie-Einstellungen',
    title: 'Wir respektieren Ihre Privatsphäre',
    body: 'Diese Website verwendet Cookies. Technisch notwendige Cookies sind immer aktiv. Optional können Sie Analyse- und Marketing-Cookies aktivieren.',
    necessary: 'Technisch notwendig', always: 'Immer aktiv',
    acceptAll: 'Alle akzeptieren', save: 'Auswahl speichern', settings: 'Einstellungen', rejectAll: 'Nur notwendige', close: 'Schließen',
    cats: { functional: ['Funktional', 'Eingebettete Karten, Videos und erweiterte Funktionen.'], analytics: ['Analyse', 'Anonyme Nutzungsstatistiken zur Verbesserung der Website.'], marketing: ['Marketing', 'Tracking und personalisierte Werbung.'] },
  },
  en: {
    dialog: 'Cookie settings',
    title: 'We respect your privacy',
    body: 'This website uses cookies. Technically necessary cookies are always active. You can optionally enable analytics and marketing cookies.',
    necessary: 'Technically necessary', always: 'Always active',
    acceptAll: 'Accept all', save: 'Save selection', settings: 'Settings', rejectAll: 'Necessary only', close: 'Close',
    cats: { functional: ['Functional', 'Embedded maps, videos and enhanced features.'], analytics: ['Analytics', 'Anonymous usage statistics to improve the website.'], marketing: ['Marketing', 'Tracking and personalised advertising.'] },
  },
  es: {
    dialog: 'Configuración de cookies',
    title: 'Respetamos tu privacidad',
    body: 'Este sitio usa cookies. Las cookies técnicamente necesarias están siempre activas. De forma opcional puedes activar cookies de análisis y marketing.',
    necessary: 'Técnicamente necesarias', always: 'Siempre activas',
    acceptAll: 'Aceptar todo', save: 'Guardar selección', settings: 'Configuración', rejectAll: 'Solo necesarias', close: 'Cerrar',
    cats: { functional: ['Funcional', 'Mapas y vídeos integrados y funciones avanzadas.'], analytics: ['Análisis', 'Estadísticas de uso anónimas para mejorar el sitio.'], marketing: ['Marketing', 'Seguimiento y publicidad personalizada.'] },
  },
} as const;

const LOCALE_RE = /^\/([a-z]{2})(?:\/|$)/;
function localeFromPath(pathname: string | null): keyof typeof STRINGS {
  const code = pathname?.match(LOCALE_RE)?.[1];
  return code && code in STRINGS ? (code as keyof typeof STRINGS) : 'de';
}

export function CookieBanner() {
  const pathname = usePathname();
  const { ready, needsDecision, consent, acceptAll, rejectAll, setConsent, settingsOpen, closeSettings } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [draft, setDraft] = useState({ functional: consent.functional, analytics: consent.analytics, marketing: consent.marketing });

  useEffect(() => {
    if (settingsOpen) {
      setDraft({ functional: consent.functional, analytics: consent.analytics, marketing: consent.marketing });
      setShowDetails(true);
    }
  }, [settingsOpen, consent.functional, consent.analytics, consent.marketing]);

  if (isConsentUiSuppressed(pathname)) return null;
  // Do not render clickable-looking controls before React has hydrated and
  // loaded the persisted choice. This also removes the pre-hydration no-op race.
  if (!ready || (!needsDecision && !settingsOpen)) return null;

  const t = STRINGS[localeFromPath(pathname)];
  const CATEGORIES = (['functional', 'analytics', 'marketing'] as const).map((key) => ({ key, label: t.cats[key][0], desc: t.cats[key][1] }));

  const panel = (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white text-slate-950 shadow-2xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <h2 id="cookie-consent-title" className="font-display text-lg font-bold text-slate-950">{settingsOpen ? t.dialog : t.title}</h2>
          {settingsOpen && <button type="button" onClick={closeSettings} className="min-h-11 shrink-0 text-sm font-semibold text-slate-700 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t.close}</button>}
        </div>
        <p id="cookie-consent-description" className="mt-2 text-sm text-slate-600 leading-relaxed">
          {t.body}
        </p>

        {showDetails && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-center justify-between py-2">
              <div><span className="text-sm font-medium text-slate-950">{t.necessary}</span><p className="text-xs text-slate-600">{t.always}</p></div>
              <div aria-hidden="true" className="w-10 h-5 shrink-0 rounded-full bg-slate-900" />
            </div>
            {CATEGORIES.map(cat => (
              <div key={cat.key} className="flex items-center justify-between gap-5 py-2">
                <div><span className="text-sm font-medium text-slate-950">{cat.label}</span><p className="text-xs leading-5 text-slate-600">{cat.desc}</p></div>
                <button
                  type="button"
                  onClick={() => setDraft(d => ({ ...d, [cat.key]: !d[cat.key] }))}
                  role="switch"
                  aria-checked={draft[cat.key]}
                  aria-label={cat.label}
                  className="flex min-h-11 w-12 shrink-0 items-center justify-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  <span aria-hidden="true" className={`flex h-6 w-11 items-center rounded-full border transition-colors motion-reduce:transition-none ${draft[cat.key] ? 'border-slate-900 bg-slate-900' : 'border-slate-500 bg-slate-200'}`}><span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${draft[cat.key] ? 'translate-x-6' : 'translate-x-1'}`} /></span>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={acceptAll} className="min-h-11 flex-1 rounded-lg bg-slate-900 text-white text-sm font-semibold py-2.5 px-4 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
            {t.acceptAll}
          </button>
          {showDetails ? (
            <button type="button" onClick={() => setConsent(draft)} className="min-h-11 flex-1 rounded-lg bg-slate-100 text-slate-950 text-sm font-semibold py-2.5 px-4 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
              {t.save}
            </button>
          ) : (
            <button type="button" onClick={() => { setDraft({ functional: consent.functional, analytics: consent.analytics, marketing: consent.marketing }); setShowDetails(true); }} className="min-h-11 flex-1 rounded-lg bg-slate-100 text-slate-950 text-sm font-semibold py-2.5 px-4 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
              {t.settings}
            </button>
          )}
          <button type="button" onClick={rejectAll} className="min-h-11 flex-1 rounded-lg border border-slate-400 text-slate-950 text-sm font-semibold py-2.5 px-4 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
            {t.rejectAll}
          </button>
        </div>
      </div>
  );

  if (settingsOpen) return <CookieSettingsDialog onClose={closeSettings}>{panel}</CookieSettingsDialog>;
  return <div role="dialog" aria-live="polite" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description" data-consent-banner className="fixed inset-x-0 bottom-0 z-[100] p-4">{panel}</div>;
}

function CookieSettingsDialog({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!openerRef.current && document.activeElement instanceof HTMLElement) openerRef.current = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
    };
  }, []);
  return <dialog id="cookie-settings-dialog" ref={ref} aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description" onClose={() => { if (ref.current && !ref.current.open) onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto border-0 bg-transparent p-0 text-slate-950 backdrop:bg-black/60">{children}</dialog>;
}
