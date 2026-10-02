import { ApiRequestBodyError } from './api-request-body';
import { safeContentUrl } from './safe-content-url';

function invalid(message: string): never {
  throw new ApiRequestBodyError('NAVIGATION_INVALID', message);
}

export function mergeNavigationInput(
  existing: { items?: unknown; cta?: unknown } | undefined,
  body: Record<string, unknown>,
  i18n: { enabled: boolean; locales: string[] },
): { items: unknown; cta: unknown } {
  if (body.items === undefined && body.cta === undefined) invalid('Provide items or cta. Omitted fields are preserved.');
  const validateItems = (items: unknown, depth = 0): void => {
    if (!Array.isArray(items) || items.length > 100 || depth > 4) invalid('items must be an array of at most 100 links with at most four submenu levels.');
    for (const item of items) {
      if (!item || typeof item !== 'object' || typeof item.label !== 'string' || !item.label.trim()) invalid('Each navigation item needs a non-empty label.');
      if (item.href !== undefined && (typeof item.href !== 'string' || (item.href && !safeContentUrl(item.href)))) invalid('Navigation href must be a safe URL.');
      if (item.children !== undefined) validateItems(item.children, depth + 1);
    }
  };
  if (body.items !== undefined) validateItems(body.items);
  if (body.cta !== undefined && body.cta !== null) {
    const cta = body.cta as Record<string, unknown>;
    if (typeof cta !== 'object' || Array.isArray(cta)) invalid('cta must be an object or null to clear.');
    if (cta.label !== undefined && typeof cta.label !== 'string') invalid('cta.label must be a string.');
    if (cta.href !== undefined && (typeof cta.href !== 'string' || (cta.href && !safeContentUrl(cta.href)))) invalid('cta.href must be a safe URL.');
  }
  const locale = body.locale;
  if (locale !== undefined && (typeof locale !== 'string' || !i18n.enabled || !i18n.locales.includes(locale))) invalid('locale must be configured for this tenant and localization must be enabled.');

  const merge = (current: unknown, value: unknown, empty: unknown): unknown => {
    if (value === undefined) return current ?? empty;
    const map = current && typeof current === 'object' && !Array.isArray(current) ? current as Record<string, unknown> : {};
    if (locale) return map._localized
      ? { ...map, [locale as string]: value ?? empty }
      : { _localized: true, _default: current ?? empty, [locale as string]: value ?? empty };
    return map._localized ? { ...map, _default: value ?? empty } : value ?? empty;
  };
  return { items: merge(existing?.items, body.items, []), cta: merge(existing?.cta, body.cta, {}) };
}
