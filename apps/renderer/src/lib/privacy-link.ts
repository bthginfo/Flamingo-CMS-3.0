/** Match the existing public demo/locale routing for privacy links. */
export function privacyHrefForPath(pathname: string | null) {
  const demo = pathname?.match(/^(\/demo\/[^/]+)/)?.[1];
  if (demo) return `${demo}/datenschutz`;
  const locale = pathname?.match(/^\/(de|en|es)(?:\/|$)/)?.[1];
  return locale ? `/${locale}/datenschutz` : '/datenschutz';
}
