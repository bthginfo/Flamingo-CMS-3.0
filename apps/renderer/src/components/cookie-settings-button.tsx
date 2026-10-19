'use client';

import { usePathname } from 'next/navigation';
import { useConsent } from '@/lib/consent';
import { isConsentUiSuppressed } from '@/lib/consent-routes';

/** Opening preferences never revokes or overwrites the visitor's saved choice. */
export function CookieSettingsButton() {
  const pathname = usePathname();
  const { ready, openSettings } = useConsent();
  if (!ready || isConsentUiSuppressed(pathname)) return null;
  const locale = pathname?.match(/^\/(en|es)(?:\/|$)/)?.[1];
  const label = locale === 'en' ? 'Cookie settings' : locale === 'es' ? 'Configuración de cookies' : 'Cookie-Einstellungen';
  return <button type="button" onClick={openSettings} aria-haspopup="dialog" aria-controls="cookie-settings-dialog" className="min-h-11 text-xs text-inherit underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{label}</button>;
}
