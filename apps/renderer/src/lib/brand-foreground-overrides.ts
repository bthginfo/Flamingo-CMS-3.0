import { isValidColorString } from './color-validation';

/** Brand colors are defaults; section, image and card foreground roles stay local. */
export function getBrandForegroundOverrides(brand: Record<string, unknown>): string[] {
  const rules: string[] = [];
  const safeColor = (value: unknown) => typeof value === 'string' && isValidColorString(value) ? value.trim() : null;
  const heading = safeColor(brand.headingColor);
  const body = safeColor(brand.bodyTextColor);
  const muted = safeColor(brand.mutedTextColor);
  const link = safeColor(brand.linkColor);
  if (heading) rules.push(`[data-style] main h1, [data-style] main h2, [data-style] main h3, [data-style] main h4, [data-style] main h5, [data-style] main h6 { color: var(--token-heading, ${heading}) !important; }`);
  if (body) rules.push(`[data-style] main p, [data-style] main li { color: var(--token-body, ${body}) !important; }`);
  if (muted) rules.push(`[data-style] main .text-gray-500, [data-style] main .text-slate-500, [data-style] main .text-gray-600 { color: var(--token-muted, ${muted}) !important; }`);
  if (link) rules.push(`[data-style] main a:not([data-edit-link]):not(.cms-button):not([class*="cms-button"]):not([class*="btn-"]):not([class*="bg-brand"]):not([class*="text-brand"]):not([class*="text-white"]) { color: var(--token-link, ${link}) !important; }`);
  rules.push(`[data-style] main [data-color-context="dark"] :where(h1,h2,h3,h4,h5,h6,.cms-section-title) { color: var(--token-on-dark-heading, #fff) !important; }`);
  rules.push(`[data-style] main [data-color-context="dark"] :where(p,li,.cms-section-subtitle) { color: var(--token-on-dark-body, rgba(255,255,255,.78)) !important; }`);
  rules.push(`[data-style] main [data-color-context="dark"] :where(.section-badge,.eyebrow) { color: var(--token-eyebrow, var(--token-on-dark-muted, rgba(255,255,255,.62))) !important; }`);
  rules.push(`[data-style] main [data-card] :where(h1,h2,h3,h4,h5,h6,.cms-section-title) { color: var(--token-card-heading, var(--token-heading)) !important; }`);
  rules.push(`[data-style] main [data-card] :where(p,li,.cms-section-copy,.cms-section-subtitle) { color: var(--token-card-body, var(--token-body)) !important; }`);
  rules.push(`[data-style] main [data-card] :where(.section-badge,.eyebrow) { color: var(--token-eyebrow, var(--token-card-muted, var(--token-muted))) !important; }`);
  rules.push(`[data-style] main [data-color-context="light"] :where(h1,h2,h3,h4,h5,h6,.cms-section-title) { color: var(--token-card-heading, #0f172a) !important; }`);
  rules.push(`[data-style] main [data-color-context="light"] :where(p,li,.cms-section-copy,.cms-section-subtitle) { color: var(--token-card-body, #475569) !important; }`);
  rules.push(`[data-style] main [data-color-context="light"] :where(.section-badge,.eyebrow) { color: var(--token-card-muted, #64748b) !important; }`);
  return rules;
}
