export const MOBILE_ACTION_KINDS = ['call', 'route', 'booking', 'enquiry', 'internal', 'cart'] as const;

export type MobileActionKind = (typeof MOBILE_ACTION_KINDS)[number];

export type MobileAction = {
  kind: MobileActionKind;
  label: string;
  href: string;
  icon: string;
};

export type MobileActionDockConfig = {
  compactLabel: string;
  actions: MobileAction[];
  revealAfterScroll: boolean;
  revealAfterPx: number;
  desktopMode: 'hidden' | 'inline';
  hideOnPaths: string[];
};

const DEFAULT_ICONS: Record<MobileActionKind, string> = {
  call: 'Phone',
  route: 'MapPin',
  booking: 'CalendarCheck',
  enquiry: 'MessageCircle',
  internal: 'ArrowRight',
  cart: 'ShoppingBag',
};

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string'
    ? value.replace(CONTROL_CHARACTERS, '').trim().slice(0, maxLength)
    : '';
}

export function safeDockHref(value: unknown, kind: MobileActionKind): string {
  let href = cleanText(value, 500);
  if (!href && kind === 'cart') return '/warenkorb';
  if (kind === 'call' && /^tel:/i.test(href)) href = `tel:${href.slice(4).replace(/\s/g, '')}`;
  if (!href || /\s/.test(href)) return '';
  if (href.startsWith('#') || (href.startsWith('/') && !href.startsWith('//'))) return href;
  if (/^https?:\/\//i.test(href)) return href;
  if (kind === 'call' && /^tel:\+?[0-9().\-/]+$/i.test(href)) return href;
  if (kind === 'enquiry' && /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(href)) return href;
  return '';
}

function normalizeKind(value: unknown): MobileActionKind {
  return MOBILE_ACTION_KINDS.includes(value as MobileActionKind) ? value as MobileActionKind : 'internal';
}

export function normalizeMobileActionDockData(data: Record<string, unknown>): MobileActionDockConfig {
  const actions = Array.isArray(data.actions)
    ? data.actions.slice(0, 3).flatMap((entry): MobileAction[] => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return [];
        const source = entry as Record<string, unknown>;
        const kind = normalizeKind(source.kind);
        const label = cleanText(source.label, 48);
        const href = safeDockHref(source.href, kind);
        if (!label || !href) return [];
        return [{
          kind,
          label,
          href,
          icon: cleanText(source.icon, 64) || DEFAULT_ICONS[kind],
        }];
      })
    : [];

  const revealAfterPx = Number(data.revealAfterPx);
  const hideOnPaths = Array.isArray(data.hideOnPaths)
    ? data.hideOnPaths
        .map((value) => cleanText(value, 120))
        .filter((value) => value.startsWith('/') && !value.startsWith('//'))
        .slice(0, 12)
    : ['/checkout', '/warenkorb'];

  return {
    compactLabel: cleanText(data.compactLabel, 80),
    actions,
    revealAfterScroll: Boolean(data.revealAfterScroll),
    revealAfterPx: Number.isFinite(revealAfterPx) ? Math.min(2000, Math.max(0, Math.round(revealAfterPx))) : 220,
    desktopMode: data.desktopMode === 'inline' ? 'inline' : 'hidden',
    hideOnPaths,
  };
}

export function shouldHideActionDockForPath(pathname: string, hideOnPaths: string[]) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return hideOnPaths.some((path) => {
    const hidden = path.replace(/\/+$/, '') || '/';
    return normalized === hidden || normalized.endsWith(hidden);
  });
}
