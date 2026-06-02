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

function normalizeHex(value?: string): string | null {
  if (!value || !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)) return null;
  return value.length === 4
    ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    : value;
}

export function getBrandCssVars(brand: { primaryColor?: string; secondaryColor?: string; accentColor?: string; pageBg?: string; sectionBg?: string; sectionBgAlt?: string; cardBg?: string; topBarColor?: string; footerColor?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; navBgColor?: string; navBrandColor?: string; navLogoColor?: string; headingColor?: string; bodyTextColor?: string; mutedTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string; btnSecondaryBg?: string; btnSecondaryText?: string; btnSecondaryBorder?: string; btnOutlineBg?: string; btnOutlineText?: string; btnOutlineBorder?: string; badgeBg?: string; badgeText?: string; badgeBorder?: string; cardBorder?: string; borderColor?: string; dividerColor?: string; iconColor?: string; btnRadius?: string; cardRadius?: string }): Record<string, string> {
  const vars: Record<string, string> = {};
  const normalizedPrimary = normalizeHex(brand.primaryColor);
  const secondary = normalizeHex(brand.secondaryColor);
  const accent = normalizeHex(brand.accentColor);

  if (normalizedPrimary) {
    vars['--brand-primary'] = normalizedPrimary;
    vars['--brand-primary-rgb'] = hexToRgb(normalizedPrimary);
    vars['--color-primary'] = 'var(--brand-primary)';
    vars['--color-primary-rgb'] = 'var(--brand-primary-rgb)';
    vars['--brand-dark'] = darken(normalizedPrimary, 0.45);
    vars['--style-brand'] = normalizedPrimary;
    vars['--style-icon-color'] = brand.iconColor || normalizedPrimary;
    vars['--style-badge-bg'] = `${normalizedPrimary}12`;
    vars['--style-badge-border'] = `${normalizedPrimary}28`;
    vars['--style-badge-text'] = normalizedPrimary;
    vars['--style-accent-glow'] = `0 0 30px ${normalizedPrimary}33`;
  }

  if (secondary || normalizedPrimary) vars['--brand-secondary'] = secondary || lighten(normalizedPrimary as string, 0.3);
  if (accent) {
    vars['--brand-accent'] = accent;
    vars['--style-accent'] = accent;
    vars['--style-accent-color'] = accent;
  }
  if (brand.topBarColor) vars['--brand-topbar'] = brand.topBarColor;
  else if (vars['--brand-dark']) vars['--brand-topbar'] = vars['--brand-dark'];
  if (brand.footerColor) vars['--brand-footer'] = brand.footerColor;
  else if (vars['--brand-dark']) vars['--brand-footer'] = vars['--brand-dark'];

  if (brand.pageBg) vars['--background'] = brand.pageBg;
  if (brand.sectionBg) vars['--style-section-bg'] = brand.sectionBg;
  if (brand.sectionBgAlt) vars['--style-section-bg-alt'] = brand.sectionBgAlt;
  if (brand.cardBg) vars['--style-card-bg'] = brand.cardBg;

  if (brand.footerLinkColor) vars['--brand-footer-link'] = brand.footerLinkColor;
  if (brand.footerTextColor) vars['--brand-footer-text'] = brand.footerTextColor;
  if (brand.navLinkColor) vars['--brand-nav-link'] = brand.navLinkColor;
  if (brand.navBgColor) vars['--brand-nav-bg'] = brand.navBgColor;
  if (brand.navBrandColor) vars['--brand-nav-brand'] = brand.navBrandColor;
  if (brand.navLogoColor) vars['--brand-nav-logo'] = brand.navLogoColor;
  if (brand.headingColor) {
    vars['--brand-heading'] = brand.headingColor;
    vars['--style-heading-color'] = brand.headingColor;
  }
  if (brand.bodyTextColor) {
    vars['--brand-body-text'] = brand.bodyTextColor;
    vars['--style-body-color'] = brand.bodyTextColor;
    vars['--style-text-primary'] = brand.bodyTextColor;
  }
  if (brand.mutedTextColor) vars['--style-text-muted'] = brand.mutedTextColor;
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

  // Badge overrides
  if (brand.badgeBg) vars['--style-badge-bg'] = brand.badgeBg;
  if (brand.badgeText) vars['--style-badge-text'] = brand.badgeText;
  if (brand.badgeBorder) vars['--style-badge-border'] = brand.badgeBorder;

  // Card & border overrides
  const borderColor = brand.borderColor || brand.cardBorder;
  if (borderColor) {
    vars['--style-border-color'] = borderColor;
    vars['--style-card-border'] = `1px solid ${borderColor}`;
  }
  if (brand.dividerColor) {
    vars['--style-divider'] = `1px solid ${brand.dividerColor}`;
    vars['--style-border-light'] = brand.dividerColor;
    vars['--style-divider-color'] = brand.dividerColor;
  }

  // Radius overrides
  if (brand.btnRadius) vars['--style-button-radius'] = brand.btnRadius;
  if (brand.cardRadius) vars['--style-card-radius'] = brand.cardRadius;

  return vars;
}
