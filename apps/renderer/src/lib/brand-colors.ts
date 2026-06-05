/**
 * Derives --brand-* CSS variables from tenant brand colors (primaryColor, secondaryColor, accentColor).
 * These override the hardcoded defaults in globals.css so that the info bar, footer, and UI components
 * adapt to each tenant's branding.
 */

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

export function getBrandCssVars(brand: { primaryColor?: string; secondaryColor?: string; accentColor?: string; pageBg?: string; sectionBg?: string; sectionBgAlt?: string; cardBg?: string; topBarColor?: string; footerColor?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; navBgColor?: string; navBrandColor?: string; navLogoColor?: string; headingColor?: string; bodyTextColor?: string; mutedTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string; btnSecondaryBg?: string; btnSecondaryText?: string; btnSecondaryBorder?: string; btnOutlineBg?: string; btnOutlineText?: string; btnOutlineBorder?: string; badgeBg?: string; badgeText?: string; badgeBorder?: string; cardBorder?: string; borderColor?: string; dividerColor?: string; iconColor?: string; btnRadius?: string; cardRadius?: string }): Record<string, string> {
  const vars: Record<string, string> = {};
  const primary = brand.primaryColor;
  if (!primary || !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(primary)) return vars;

  // Normalize 3-digit hex to 6-digit
  const normalizedPrimary = primary.length === 4
    ? `#${primary[1]}${primary[1]}${primary[2]}${primary[2]}${primary[3]}${primary[3]}`
    : primary;

  vars['--brand-primary'] = normalizedPrimary;
  vars['--brand-primary-rgb'] = hexToRgb(normalizedPrimary);
  vars['--color-primary'] = 'var(--brand-primary)';
  vars['--color-primary-rgb'] = 'var(--brand-primary-rgb)';
  vars['--brand-dark'] = darken(normalizedPrimary, 0.45);
  vars['--brand-secondary'] = brand.secondaryColor || lighten(normalizedPrimary, 0.3);
  const accent = brand.accentColor || '#f39c12';
  vars['--brand-accent'] = accent;
  vars['--brand-topbar'] = brand.topBarColor || vars['--brand-dark'];
  vars['--brand-footer'] = brand.footerColor || vars['--brand-dark'];

  // Phase 4: legacy --style-* emissions are gone. No template references
  // --style-brand / --style-accent / --style-badge-* / --style-accent-glow
  // anymore (verified via gate-tokens.cjs). The canonical --token-* vars
  // below are the single source of truth.

  if (brand.pageBg) vars['--background'] = brand.pageBg;

  if (brand.footerLinkColor) vars['--brand-footer-link'] = brand.footerLinkColor;
  if (brand.footerTextColor) vars['--brand-footer-text'] = brand.footerTextColor;
  if (brand.navLinkColor) vars['--brand-nav-link'] = brand.navLinkColor;
  if (brand.navBgColor) vars['--brand-nav-bg'] = brand.navBgColor;
  if (brand.navBrandColor) vars['--brand-nav-brand'] = brand.navBrandColor;
  if (brand.navLogoColor) vars['--brand-nav-logo'] = brand.navLogoColor;
  if (brand.headingColor) vars['--brand-heading'] = brand.headingColor;
  if (brand.bodyTextColor) vars['--brand-body-text'] = brand.bodyTextColor;
  if (brand.linkColor) vars['--brand-link'] = brand.linkColor;
  if (brand.linkHoverColor) vars['--brand-link-hover'] = brand.linkHoverColor;
  if (brand.btnPrimaryBg) vars['--brand-btn-bg'] = brand.btnPrimaryBg;
  if (brand.btnPrimaryText) vars['--brand-btn-text'] = brand.btnPrimaryText;
  if (brand.btnSecondaryBg) vars['--brand-btn-secondary-bg'] = brand.btnSecondaryBg;
  if (brand.btnSecondaryText) vars['--brand-btn-secondary-text'] = brand.btnSecondaryText;
  if (brand.btnSecondaryBorder) vars['--brand-btn-secondary-border'] = brand.btnSecondaryBorder;
  if (brand.btnOutlineBg) vars['--brand-btn-outline-bg'] = brand.btnOutlineBg;
  if (brand.btnOutlineText) vars['--brand-btn-outline-text'] = brand.btnOutlineText;
  if (brand.btnOutlineBorder) vars['--brand-btn-outline-border'] = brand.btnOutlineBorder;

  // Badge overrides (modern --token-* equivalents are set further down).

  // Card & border overrides
  const borderColor = brand.borderColor || brand.cardBorder;
  if (brand.dividerColor) vars['--brand-divider'] = brand.dividerColor;

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
  vars['--token-section-bg']    = brand.sectionBg     ?? '#ffffff';
  vars['--token-section-bg-alt']= brand.sectionBgAlt  ?? brand.sectionBg ?? '#f8fafc';
  vars['--token-card-bg']       = brand.cardBg        ?? '#ffffff';
  vars['--token-card-border']   = borderColor         ?? 'rgba(15,23,42,0.08)';
  vars['--token-heading']       = brand.headingColor  ?? '#0f172a';
  vars['--token-subheading']    = brand.headingColor  ?? '#1e293b';
  vars['--token-body']          = brand.bodyTextColor ?? '#475569';
  vars['--token-muted']         = brand.mutedTextColor ?? '#64748b';
  // Inverse contrast tokens for content on dark backgrounds.
  vars['--token-on-dark-heading']= '#ffffff';
  vars['--token-on-dark-body']   = 'rgba(255,255,255,0.82)';
  vars['--token-on-dark-muted']  = 'rgba(255,255,255,0.62)';
  // Accent family.
  vars['--token-accent']        = accent;
  vars['--token-accent-rgb']    = accent.startsWith('#') ? hexToRgb(accent) : '220 38 38';
  vars['--token-eyebrow']       = accent;
  vars['--token-icon']          = brand.iconColor ?? normalizedPrimary;
  vars['--token-stat-value']    = accent;
  vars['--token-quote']         = accent;
  vars['--token-rating-star']   = accent;
  vars['--token-check']         = accent;
  vars['--token-badge-bg']      = brand.badgeBg     ?? `${normalizedPrimary}12`;
  vars['--token-badge-text']    = brand.badgeText   ?? normalizedPrimary;
  vars['--token-badge-border']  = brand.badgeBorder ?? `${normalizedPrimary}28`;
  vars['--token-btn-bg']        = brand.btnPrimaryBg   ?? normalizedPrimary;
  vars['--token-btn-text']      = brand.btnPrimaryText ?? '#ffffff';
  vars['--token-divider']       = brand.dividerColor ?? 'rgba(15,23,42,0.12)';
  if (brand.cardRadius) vars['--token-card-radius'] = brand.cardRadius;
  if (brand.btnRadius) vars['--token-button-radius'] = brand.btnRadius;
  // Phase 4: typography utilities + shadow + image overlay.
  vars['--token-card-shadow']      = '0 4px 20px rgba(0,0,0,0.06)';
  vars['--token-image-overlay']    = 'rgba(0,0,0,0.6)';
  vars['--token-heading-weight']   = '700';
  vars['--token-heading-tracking'] = '-0.02em';

  return vars;
}
