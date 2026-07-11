/** Internal rendering surfaces never load tenant tracking and must stay unobstructed. */
const CONSENT_UI_SUPPRESSED_ROUTES = [
  '/section-preview',
  '/preview',
  '/live-preview',
  '/demo/showcase',
] as const;

export function isConsentUiSuppressed(pathname: string | null): boolean {
  if (!pathname) return false;
  return CONSENT_UI_SUPPRESSED_ROUTES.some((route) => (
    pathname === route || pathname.startsWith(`${route}/`)
  ));
}
