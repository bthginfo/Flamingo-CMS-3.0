import { compositeColors, parseCssColor } from './color-engine';
import { isValidColorString } from './color-validation';

/**
 * Derives --brand-* CSS variables from tenant brand colors (primaryColor, secondaryColor, accentColor).
 * These override the hardcoded defaults in globals.css so that the info bar, footer, and UI components
 * adapt to each tenant's branding.
 */

const DEFAULT_BRAND_DARK = '#0d2137';
const WCAG_AA_TEXT_CONTRAST = 4.5;

function normalizeHexColor(value: string | undefined, canvas = '#ffffff'): string | null {
  const parsed = parseCssColor(value);
  const parsedCanvas = parseCssColor(canvas);
  if (!parsed || !parsedCanvas) return null;
  const opaqueCanvas = compositeColors(parsedCanvas, { r: 255, g: 255, b: 255, a: 1 });
  const painted = compositeColors(parsed, opaqueCanvas);
  const toByte = (channel: number) => Math.round(channel).toString(16).padStart(2, '0');
  return `#${toByte(painted.r)}${toByte(painted.g)}${toByte(painted.b)}`;
}

function relativeLuminance(hex: string): number {
  const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
    .map((channel) => parseInt(channel, 16) / 255)
    .map((channel) => channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** WCAG contrast ratio for editor-supported opaque hex colors. */
export function getHexContrastRatio(foreground: string | undefined, background: string | undefined): number | null {
  const normalizedForeground = normalizeHexColor(foreground);
  const normalizedBackground = normalizeHexColor(background);
  if (!normalizedForeground || !normalizedBackground) return null;

  const foregroundLuminance = relativeLuminance(normalizedForeground);
  const backgroundLuminance = relativeLuminance(normalizedBackground);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Keep an explicit footer foreground only when it is AA-readable. */
export function resolveAccessibleFooterForeground(background: string, explicit?: string): string {
  const normalizedBackground = normalizeHexColor(background) ?? DEFAULT_BRAND_DARK;
  const normalizedExplicit = normalizeHexColor(explicit, normalizedBackground);
  if (normalizedExplicit) {
    const explicitContrast = getHexContrastRatio(normalizedExplicit, normalizedBackground);
    if (explicitContrast !== null && explicitContrast >= WCAG_AA_TEXT_CONTRAST) return normalizedExplicit;
  }

  const light = '#ffffff';
  const dark = '#000000';
  return (getHexContrastRatio(light, normalizedBackground) ?? 0) >= (getHexContrastRatio(dark, normalizedBackground) ?? 0)
    ? light
    : dark;
}

function resolveAccessibleText(
  background: string,
  explicit: string | undefined,
  lightSurfaceCandidate: string,
  darkSurfaceCandidate: string,
  minimumContrast = WCAG_AA_TEXT_CONTRAST,
): string {
  const normalizedBackground = normalizeHexColor(background) ?? '#ffffff';
  const normalizedExplicit = normalizeHexColor(explicit, normalizedBackground);
  if ((getHexContrastRatio(normalizedExplicit ?? undefined, normalizedBackground) ?? 0) >= minimumContrast) {
    return normalizedExplicit!;
  }

  const backgroundIsDark = relativeLuminance(normalizedBackground) < 0.45;
  const preferred = backgroundIsDark ? darkSurfaceCandidate : lightSurfaceCandidate;
  if ((getHexContrastRatio(preferred, normalizedBackground) ?? 0) >= minimumContrast) return preferred;
  return resolveAccessibleFooterForeground(normalizedBackground);
}

/**
 * Preserve a brand foreground as far as possible while keeping role tokens
 * readable on both the section and card surfaces where shared components use
 * them. This is intentionally for foreground roles only; --token-accent stays
 * the unmodified brand colour for decorative fills and gradients.
 */
export function resolveAccessibleRoleForeground(
  backgrounds: string[],
  explicit: string | undefined,
  minimumContrast = WCAG_AA_TEXT_CONTRAST,
): string {
  const normalizedBackgrounds = backgrounds
    .map((background) => normalizeHexColor(background))
    .filter((background): background is string => Boolean(background));
  if (!normalizedBackgrounds.length) normalizedBackgrounds.push('#ffffff');

  const foreground = normalizeHexColor(explicit, normalizedBackgrounds[0]);
  const meetsEverySurface = (candidate: string) => normalizedBackgrounds.every(
    (background) => (getHexContrastRatio(candidate, background) ?? 0) >= minimumContrast,
  );
  if (foreground && meetsEverySurface(foreground)) return foreground;

  // Walk toward black and white in small steps. The first valid result keeps
  // more of the requested hue than a blunt black/white replacement.
  if (foreground) {
    for (let step = 1; step <= 20; step += 1) {
      const amount = step / 20;
      const candidates = [darken(foreground, 1 - amount), lighten(foreground, amount)];
      const valid = candidates.filter(meetsEverySurface);
      if (valid.length) {
        return valid.sort((a, b) => {
          const minContrast = (candidate: string) => Math.min(
            ...normalizedBackgrounds.map((background) => getHexContrastRatio(candidate, background) ?? 0),
          );
          return minContrast(b) - minContrast(a);
        })[0];
      }
    }
  }

  const neutrals = ['#111827', '#ffffff', '#000000'];
  const validNeutral = neutrals.find(meetsEverySurface);
  if (validNeutral) return validNeutral;
  return neutrals.sort((a, b) => {
    const minContrast = (candidate: string) => Math.min(
      ...normalizedBackgrounds.map((background) => getHexContrastRatio(candidate, background) ?? 0),
    );
    return minContrast(b) - minContrast(a);
  })[0];
}

/** Darken a hex color by a factor (0-1, where 0 = black) */
function darken(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${Math.round(r * factor).toString(16).padStart(2, '0')}${Math.round(g * factor).toString(16).padStart(2, '0')}${Math.round(b * factor).toString(16).padStart(2, '0')}`;
}

/** Lighten a hex color toward white */
function lighten(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${Math.round(r + (255 - r) * factor).toString(16).padStart(2, '0')}${Math.round(g + (255 - g) * factor).toString(16).padStart(2, '0')}${Math.round(b + (255 - b) * factor).toString(16).padStart(2, '0')}`;
}

function hexToRgb(hex: string): string {
  return `${parseInt(hex.slice(1, 3), 16)} ${parseInt(hex.slice(3, 5), 16)} ${parseInt(hex.slice(5, 7), 16)}`;
}

export function getBrandCssVars(
  brand: { primaryColor?: string; secondaryColor?: string; accentColor?: string; pageBg?: string; sectionBg?: string; sectionBgAlt?: string; cardBg?: string; topBarColor?: string; footerColor?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; navBgColor?: string; navBrandColor?: string; navLogoColor?: string; headingColor?: string; bodyTextColor?: string; mutedTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string; btnSecondaryBg?: string; btnSecondaryText?: string; btnSecondaryBorder?: string; btnOutlineBg?: string; btnOutlineText?: string; btnOutlineBorder?: string; badgeBg?: string; badgeText?: string; badgeBorder?: string; cardBorder?: string; borderColor?: string; dividerColor?: string; iconColor?: string; btnRadius?: string; cardRadius?: string },
  fallbackVars: Record<string, string> = {},
): Record<string, string> {
  const vars: Record<string, string> = {};
  // Brand values are tenant-controlled and become CSS custom properties.
  // Treat persisted legacy data as untrusted too: only the small color grammar
  // accepted by the editor may reach a public `style` attribute.
  const configured = (value: unknown) => {
    const normalized = typeof value === 'string' ? value.trim() : undefined;
    return normalized && isValidColorString(normalized) ? normalized : undefined;
  };
  const configuredDimension = (value: unknown) => {
    const normalized = typeof value === 'string' ? value.trim() : undefined;
    return normalized && /^(?:\d+|\d*\.\d+)(?:px|rem|em|%)?$/.test(normalized) ? normalized : undefined;
  };
  const fallback = (...keys: string[]) => keys
    .map((key) => fallbackVars[key])
    .find((value) => typeof value === 'string' && value.trim());
  const pageCanvasSource = configured(brand.pageBg) ?? fallback('--background', '--token-section-bg', '--style-section-bg');
  const pageCanvas = normalizeHexColor(pageCanvasSource) ?? '#ffffff';
  const primarySource = configured(brand.primaryColor) ?? fallback('--brand-primary', '--style-brand');
  const normalizedPrimary = normalizeHexColor(primarySource, pageCanvas) ?? '#1a5276';
  const brandDark = darken(normalizedPrimary, 0.45);
  const footerBackground = normalizeHexColor(brand.footerColor, pageCanvas) ?? brandDark;
  vars['--brand-footer'] = footerBackground;
  vars['--brand-footer-text'] = resolveAccessibleFooterForeground(footerBackground, brand.footerTextColor);
  vars['--brand-footer-link'] = resolveAccessibleFooterForeground(footerBackground, brand.footerLinkColor);
  vars['--brand-primary'] = normalizedPrimary;
  vars['--brand-primary-rgb'] = hexToRgb(normalizedPrimary);
  vars['--color-primary'] = 'var(--brand-primary)';
  vars['--color-primary-rgb'] = 'var(--brand-primary-rgb)';
  vars['--brand-dark'] = brandDark;
  vars['--brand-secondary'] = normalizeHexColor(configured(brand.secondaryColor) ?? fallback('--brand-secondary'), pageCanvas) || lighten(normalizedPrimary, 0.3);
  const accent = normalizeHexColor(configured(brand.accentColor) ?? fallback('--token-accent', '--style-accent'), pageCanvas) || '#f39c12';
  vars['--brand-accent'] = accent;
  vars['--brand-topbar'] = configured(brand.topBarColor) || vars['--brand-dark'];

  // New brand emissions use canonical --token-* variables. The renderer keeps
  // a narrow legacy alias bridge solely for older published snapshots.

  if (configured(brand.pageBg)) vars['--background'] = configured(brand.pageBg)!;

  if (configured(brand.navLinkColor)) vars['--brand-nav-link'] = configured(brand.navLinkColor)!;
  if (configured(brand.navBgColor)) vars['--brand-nav-bg'] = configured(brand.navBgColor)!;
  if (configured(brand.navBrandColor)) vars['--brand-nav-brand'] = configured(brand.navBrandColor)!;
  if (configured(brand.navLogoColor)) vars['--brand-nav-logo'] = configured(brand.navLogoColor)!;
  if (configured(brand.headingColor)) vars['--brand-heading'] = configured(brand.headingColor)!;
  if (configured(brand.bodyTextColor)) vars['--brand-body-text'] = configured(brand.bodyTextColor)!;
  if (configured(brand.linkColor)) vars['--brand-link'] = configured(brand.linkColor)!;
  if (configured(brand.linkHoverColor)) vars['--brand-link-hover'] = configured(brand.linkHoverColor)!;
  if (configured(brand.btnPrimaryBg)) vars['--brand-btn-bg'] = configured(brand.btnPrimaryBg)!;
  if (configured(brand.btnPrimaryText)) vars['--brand-btn-text'] = configured(brand.btnPrimaryText)!;
  if (configured(brand.btnSecondaryBg)) vars['--brand-btn-secondary-bg'] = configured(brand.btnSecondaryBg)!;
  if (configured(brand.btnSecondaryText)) vars['--brand-btn-secondary-text'] = configured(brand.btnSecondaryText)!;
  if (configured(brand.btnSecondaryBorder)) vars['--brand-btn-secondary-border'] = configured(brand.btnSecondaryBorder)!;
  if (configured(brand.btnOutlineBg)) vars['--brand-btn-outline-bg'] = configured(brand.btnOutlineBg)!;
  if (configured(brand.btnOutlineText)) vars['--brand-btn-outline-text'] = configured(brand.btnOutlineText)!;
  if (configured(brand.btnOutlineBorder)) vars['--brand-btn-outline-border'] = configured(brand.btnOutlineBorder)!;

  // Badge overrides (modern --token-* equivalents are set further down).

  // Card & border overrides
  const borderColor = configured(brand.borderColor) || configured(brand.cardBorder) || fallback('--token-card-border', '--style-border-color');
  if (configured(brand.dividerColor)) vars['--brand-divider'] = configured(brand.dividerColor)!;

  // Preserve the industry's authored surface hierarchy when a tenant did not
  // explicitly override it. Main, alternate and card surfaces are independent.
  const sectionBg = configured(brand.sectionBg) ?? fallback('--token-section-bg', '--style-section-bg') ?? '#ffffff';
  const sectionBgAlt = configured(brand.sectionBgAlt) ?? fallback('--token-section-bg-alt', '--style-section-bg-alt') ?? '#f8fafc';
  const cardBg = configured(brand.cardBg) ?? fallback('--token-card-bg', '--style-card-bg') ?? '#ffffff';
  const paintedSectionBg = normalizeHexColor(sectionBg, pageCanvas) ?? '#ffffff';
  const paintedSectionBgAlt = normalizeHexColor(sectionBgAlt, pageCanvas) ?? paintedSectionBg;
  const paintedCardBg = normalizeHexColor(cardBg, paintedSectionBg) ?? '#ffffff';
  const headingSource = configured(brand.headingColor) ?? fallback('--token-heading', '--style-text-primary');
  const bodySource = configured(brand.bodyTextColor) ?? fallback('--token-body', '--style-text-secondary');
  const mutedSource = configured(brand.mutedTextColor) ?? fallback('--token-muted', '--style-text-muted', '--style-text-secondary');
  const headingValue = resolveAccessibleText(paintedSectionBg, headingSource, '#111827', '#ffffff');
  const bodyValue = resolveAccessibleText(paintedSectionBg, bodySource, '#374151', '#f3f4f6');
  const mutedValue = resolveAccessibleText(paintedSectionBg, mutedSource, '#4b5563', '#d1d5db');
  const cardHeadingValue = resolveAccessibleText(paintedCardBg, headingSource, '#111827', '#ffffff');
  const cardBodyValue = resolveAccessibleText(paintedCardBg, bodySource, '#374151', '#f3f4f6');
  const cardMutedValue = resolveAccessibleText(paintedCardBg, mutedSource, '#4b5563', '#d1d5db');
  const badgeBg = configured(brand.badgeBg) ?? fallback('--token-badge-bg', '--style-badge-bg') ?? `${normalizedPrimary}12`;
  const paintedBadgeBg = normalizeHexColor(badgeBg, paintedSectionBg) ?? paintedSectionBg;
  const badgeText = resolveAccessibleText(paintedBadgeBg, configured(brand.badgeText) ?? fallback('--token-badge-text', '--style-badge-text') ?? normalizedPrimary, '#111827', '#ffffff', 5);
  const primaryButtonBg = configured(brand.btnPrimaryBg) ?? fallback('--token-btn-bg', '--style-button-bg') ?? normalizedPrimary;
  const paintedPrimaryButtonBg = normalizeHexColor(primaryButtonBg, paintedSectionBg) ?? normalizedPrimary;
  const primaryButtonText = resolveAccessibleText(paintedPrimaryButtonBg, configured(brand.btnPrimaryText) ?? fallback('--token-btn-text', '--style-button-text'), '#111827', '#ffffff');
  const sharedRoleSurfaces = [paintedSectionBg, paintedSectionBgAlt, paintedCardBg];
  const readableAccent = resolveAccessibleRoleForeground(sharedRoleSurfaces, accent);
  const readableIcon = resolveAccessibleRoleForeground(sharedRoleSurfaces, configured(brand.iconColor) ?? fallback('--token-icon') ?? normalizedPrimary, 3);
  const readableCardIcon = resolveAccessibleRoleForeground([paintedCardBg], configured(brand.iconColor) ?? fallback('--token-card-icon', '--token-icon') ?? normalizedPrimary, 3);

  // Radius overrides handled by --token-card-radius / --token-button-radius below.

  // ---------------------------------------------------------------------------
  // Section color tokens (Layer 2 defaults) — additive, see
  // apps/renderer/src/lib/section-color-tokens.ts and
  // docs/color-architecture-audit.md.
  //
  // Each semantic slot gets its OWN var so per-section overrides cannot bleed
  // across roles (e.g. recolouring "eyebrow" no longer also recolours icons,
  // stat values, quote marks, rating stars and check marks).
  //
  // Defaults reference the Layer 1 brand vars above; the legacy `--style-*`
  // chain stays in place as a fallback in unmigrated templates.
  // ---------------------------------------------------------------------------
  vars['--token-section-bg']    = sectionBg;
  vars['--token-section-bg-alt']= sectionBgAlt;
  vars['--token-card-bg']       = cardBg;
  vars['--token-card-border']   = borderColor         ?? 'rgba(15,23,42,0.08)';
  vars['--token-heading']       = headingValue;
  vars['--token-subheading']    = headingValue;
  vars['--token-body']          = bodyValue;
  vars['--token-muted']         = mutedValue;
  vars['--token-card-heading']  = cardHeadingValue;
  vars['--token-card-body']     = cardBodyValue;
  vars['--token-card-muted']    = cardMutedValue;
  // Inverse contrast tokens for content on dark backgrounds.
  vars['--token-on-dark-heading']= '#ffffff';
  vars['--token-on-dark-body']   = 'rgba(255,255,255,0.82)';
  vars['--token-on-dark-muted']  = 'rgba(255,255,255,0.62)';
  // Accent family.
  vars['--token-accent']        = accent;
  vars['--token-eyebrow']       = readableAccent;
  vars['--token-icon']          = readableIcon;
  vars['--token-stat-value']    = readableAccent;
  vars['--token-quote']         = readableAccent;
  vars['--token-rating-star']   = resolveAccessibleRoleForeground(sharedRoleSurfaces, accent, 3);
  vars['--token-check']         = resolveAccessibleRoleForeground(sharedRoleSurfaces, accent, 3);
  vars['--token-badge-bg']      = badgeBg;
  vars['--token-badge-text']    = badgeText;
  vars['--token-badge-border']  = configured(brand.badgeBorder) ?? fallback('--token-badge-border', '--style-badge-border') ?? `${normalizedPrimary}28`;
  vars['--token-btn-bg']        = primaryButtonBg;
  vars['--token-btn-text']      = primaryButtonText;
  vars['--token-divider']       = configured(brand.dividerColor) ?? fallback('--token-divider', '--style-divider-color') ?? 'rgba(15,23,42,0.12)';

  // ── Independent page-level defaults for every remaining semantic slot. ──
  // Each is a VALUE (not a var() reference to another slot), so a slot can NEVER
  // be steered by editing a different field. Templates read these via a plain
  // `var(--token-<role>)` with no borrowed fallback (see gate: check:section-color-crosstalk).
  // NOTE: theme-aware text slots (heading/body/muted, card-heading/body/muted,
  // on-dark-*) are intentionally NOT defaulted here — their light/dark value is
  // resolved per section by section-renderer.tsx, so adding a flat default would
  // break dark sections.
  const HEADING_VALUE = headingValue;
  const BODY_VALUE = bodyValue;
  const MUTED_VALUE = mutedValue;
  const linkValue = resolveAccessibleRoleForeground(sharedRoleSurfaces, configured(brand.linkColor) ?? fallback('--token-link') ?? accent);
  const linkHoverValue = resolveAccessibleRoleForeground(sharedRoleSurfaces, configured(brand.linkHoverColor) ?? fallback('--token-link-hover') ?? normalizedPrimary);
  const inputBg = configured(brand.cardBg) ?? fallback('--token-input-bg', '--token-card-bg', '--style-card-bg') ?? '#ffffff';
  const paintedInputBg = normalizeHexColor(inputBg, paintedSectionBg) ?? paintedCardBg;
  const inputText = resolveAccessibleText(paintedInputBg, bodySource, '#374151', '#f3f4f6');
  const cardBadgeBg = configured(brand.badgeBg) ?? fallback('--token-card-badge-bg', '--token-badge-bg', '--style-badge-bg') ?? `${normalizedPrimary}12`;
  const paintedCardBadgeBg = normalizeHexColor(cardBadgeBg, paintedCardBg) ?? paintedCardBg;
  const cardBadgeText = resolveAccessibleText(paintedCardBadgeBg, configured(brand.badgeText) ?? fallback('--token-card-badge-text', '--token-badge-text') ?? normalizedPrimary, '#111827', '#ffffff', 5);
  const secondaryButtonBg = configured(brand.btnSecondaryBg) ?? fallback('--token-btn-secondary-bg', '--style-button-secondary-bg') ?? 'transparent';
  const paintedSecondaryButtonBg = normalizeHexColor(secondaryButtonBg, paintedSectionBg) ?? paintedSectionBg;
  const secondaryButtonText = resolveAccessibleText(paintedSecondaryButtonBg, configured(brand.btnSecondaryText) ?? fallback('--token-btn-secondary-text', '--style-button-secondary-text') ?? bodyValue, '#111827', '#ffffff');
  vars['--token-price']               = resolveAccessibleRoleForeground(sharedRoleSurfaces, HEADING_VALUE);
  vars['--token-price-strikethrough'] = resolveAccessibleRoleForeground(sharedRoleSurfaces, MUTED_VALUE);
  vars['--token-link']                = linkValue;
  vars['--token-link-hover']          = linkHoverValue;
  vars['--token-label']               = resolveAccessibleRoleForeground(sharedRoleSurfaces, MUTED_VALUE);
  vars['--token-input-bg']            = inputBg;
  vars['--token-input-border']        = borderColor ?? 'rgba(15,23,42,0.12)';
  vars['--token-input-text']          = inputText;
  vars['--token-success']             = '#15803d';
  vars['--token-success-bg']          = '#dcfce7';
  vars['--token-danger']              = '#b91c1c';
  vars['--token-danger-bg']           = '#fef2f2';
  vars['--token-glow-color']          = accent;
  vars['--token-shadow']              = 'rgba(15,23,42,0.08)';
  // Card sub-slots: independent values that visually match their section
  // counterparts by default, but can be overridden separately.
  vars['--token-card-badge-bg']       = cardBadgeBg;
  vars['--token-card-badge-text']     = cardBadgeText;
  vars['--token-card-icon']           = readableCardIcon;
  // Secondary button.
  vars['--token-btn-secondary-bg']     = secondaryButtonBg;
  vars['--token-btn-secondary-text']   = secondaryButtonText;
  vars['--token-btn-secondary-border'] = configured(brand.btnSecondaryBorder) ?? fallback('--token-btn-secondary-border', '--style-button-secondary-border') ?? 'color-mix(in srgb, currentColor 22%, transparent)';
  const cardRadius = configuredDimension(brand.cardRadius) ?? fallback('--token-card-radius', '--style-card-radius');
  const buttonRadius = configuredDimension(brand.btnRadius) ?? fallback('--token-button-radius', '--style-button-radius');
  if (cardRadius) vars['--token-card-radius'] = cardRadius;
  if (buttonRadius) vars['--token-button-radius'] = buttonRadius;
  // Phase 4: typography utilities + shadow + image overlay.
  vars['--token-card-shadow']      = fallback('--token-card-shadow', '--style-card-shadow') ?? '0 4px 20px rgba(0,0,0,0.06)';
  vars['--token-image-overlay']    = 'rgba(0,0,0,0.6)';
  vars['--token-heading-weight']   = fallback('--token-heading-weight', '--style-heading-weight') ?? '700';
  vars['--token-heading-tracking'] = fallback('--token-heading-tracking', '--style-heading-tracking') ?? '-0.02em';

  return vars;
}
