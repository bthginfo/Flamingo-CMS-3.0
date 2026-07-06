'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent, type ConsentCategory } from '@/lib/consent';

// Internal preview/iframe routes that render public sections in isolation — the
// cookie banner is clutter there (the showcase shows it inside every preview
// iframe). It still shows on the real public site and on the demos.
const PREVIEW_ROUTES = ['/section-preview', '/preview', '/live-preview'];

// UI strings per locale — the banner is a shared platform component, so it
// follows the active locale (first path segment) rather than tenant content.
const STRINGS = {
  de: {
    dialog: 'Cookie-Einstellungen',
    title: 'Wir respektieren Ihre Privatsphäre',
    body: 'Diese Website verwendet Cookies. Technisch notwendige Cookies sind immer aktiv. Optional können Sie Analyse- und Marketing-Cookies aktivieren.',
    necessary: 'Technisch notwendig', always: 'Immer aktiv',
    acceptAll: 'Alle akzeptieren', save: 'Auswahl speichern', settings: 'Einstellungen', rejectAll: 'Nur notwendige',
    cats: { functional: ['Funktional', 'Eingebettete Karten, Videos und erweiterte Funktionen.'], analytics: ['Analyse', 'Anonyme Nutzungsstatistiken zur Verbesserung der Website.'], marketing: ['Marketing', 'Tracking und personalisierte Werbung.'] },
  },
  en: {
    dialog: 'Cookie settings',
    title: 'We respect your privacy',
    body: 'This website uses cookies. Technically necessary cookies are always active. You can optionally enable analytics and marketing cookies.',
    necessary: 'Technically necessary', always: 'Always active',
    acceptAll: 'Accept all', save: 'Save selection', settings: 'Settings', rejectAll: 'Necessary only',
    cats: { functional: ['Functional', 'Embedded maps, videos and enhanced features.'], analytics: ['Analytics', 'Anonymous usage statistics to improve the website.'], marketing: ['Marketing', 'Tracking and personalised advertising.'] },
  },
  es: {
    dialog: 'Configuración de cookies',
    title: 'Respetamos tu privacidad',
    body: 'Este sitio usa cookies. Las cookies técnicamente necesarias están siempre activas. De forma opcional puedes activar cookies de análisis y marketing.',
    necessary: 'Técnicamente necesarias', always: 'Siempre activas',
    acceptAll: 'Aceptar todo', save: 'Guardar selección', settings: 'Configuración', rejectAll: 'Solo necesarias',
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
  const { needsDecision, consent, acceptAll, rejectAll, setConsent } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [draft, setDraft] = useState({ functional: consent.functional, analytics: consent.analytics, marketing: consent.marketing });

  if (pathname && PREVIEW_ROUTES.some((r) => pathname.startsWith(r))) return null;
  if (!needsDecision) return null;

  const t = STRINGS[localeFromPath(pathname)];
  const CATEGORIES = (['functional', 'analytics', 'marketing'] as const).map((key) => ({ key, label: t.cats[key][0], desc: t.cats[key][1] }));

  return (
    <div role="dialog" aria-label={t.dialog} className="fixed inset-x-0 bottom-0 z-[100] p-4">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-100 p-6">
        <h2 className="font-display text-lg font-bold">{t.title}</h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          {t.body}
        </p>

        {showDetails && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-center justify-between py-2">
              <div><span className="text-sm font-medium">{t.necessary}</span><p className="text-xs text-gray-400">{t.always}</p></div>
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
            {t.acceptAll}
          </button>
          {showDetails ? (
            <button onClick={() => setConsent(draft)} className="flex-1 rounded-full bg-gray-100 text-sm font-medium py-2.5 px-4 hover:bg-gray-200 transition">
              {t.save}
            </button>
          ) : (
            <button onClick={() => setShowDetails(true)} className="flex-1 rounded-full bg-gray-100 text-sm font-medium py-2.5 px-4 hover:bg-gray-200 transition">
              {t.settings}
            </button>
          )}
          <button onClick={rejectAll} className="flex-1 rounded-full border border-gray-200 text-sm font-medium py-2.5 px-4 hover:bg-gray-50 transition">
            {t.rejectAll}
          </button>
        </div>
      </div>
    </div>
  );
}
