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

export function getBrandCssVars(brand: { primaryColor?: string; secondaryColor?: string; accentColor?: string; topBarColor?: string; footerColor?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; navBgColor?: string; navBrandColor?: string; navLogoColor?: string; headingColor?: string; bodyTextColor?: string; mutedTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string; btnSecondaryBg?: string; btnSecondaryText?: string; btnSecondaryBorder?: string; btnOutlineBg?: string; btnOutlineText?: string; btnOutlineBorder?: string; badgeBg?: string; badgeText?: string; badgeBorder?: string; cardBorder?: string; dividerColor?: string; btnRadius?: string; cardRadius?: string }): Record<string, string> {
  const vars: Record<string, string> = {};
  const primary = brand.primaryColor;
  if (!primary || !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(primary)) return vars;

  // Normalize 3-digit hex to 6-digit
  const normalizedPrimary = primary.length === 4
    ? `#${primary[1]}${primary[1]}${primary[2]}${primary[2]}${primary[3]}${primary[3]}`
    : primary;

  vars['--brand-primary'] = normalizedPrimary;
  vars['--brand-primary-rgb'] = hexToRgb(normalizedPrimary);
  vars['--brand-dark'] = darken(normalizedPrimary, 0.45);
  vars['--brand-secondary'] = brand.secondaryColor || lighten(normalizedPrimary, 0.3);
  vars['--brand-accent'] = brand.accentColor || '#f39c12';
  vars['--brand-topbar'] = brand.topBarColor || vars['--brand-dark'];
  vars['--brand-footer'] = brand.footerColor || vars['--brand-dark'];

  // Override style-level variables so industry style defaults (e.g. salon pink)
  // get replaced by the tenant's actual brand colors
  vars['--style-brand'] = normalizedPrimary;
  vars['--style-accent'] = brand.accentColor || vars['--brand-accent'];
  vars['--style-badge-bg'] = `${normalizedPrimary}12`;
  vars['--style-badge-border'] = `${normalizedPrimary}28`;
  vars['--style-badge-text'] = normalizedPrimary;
  vars['--style-accent-glow'] = `0 0 30px ${normalizedPrimary}33`;

  if (brand.footerLinkColor) vars['--brand-footer-link'] = brand.footerLinkColor;
  if (brand.footerTextColor) vars['--brand-footer-text'] = brand.footerTextColor;
  if (brand.navLinkColor) vars['--brand-nav-link'] = brand.navLinkColor;
  if (brand.navBgColor) vars['--brand-nav-bg'] = brand.navBgColor;
  if (brand.navBrandColor) vars['--brand-nav-brand'] = brand.navBrandColor;
  if (brand.navLogoColor) vars['--brand-nav-logo'] = brand.navLogoColor;
  if (brand.headingColor) vars['--brand-heading'] = brand.headingColor;
  if (brand.bodyTextColor) vars['--brand-body-text'] = brand.bodyTextColor;
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
  if (brand.cardBorder) vars['--style-card-border'] = `1px solid ${brand.cardBorder}`;
  if (brand.dividerColor) {
    vars['--style-divider'] = `1px solid ${brand.dividerColor}`;
    vars['--style-border-light'] = brand.dividerColor;
  }

  // Radius overrides
  if (brand.btnRadius) vars['--style-button-radius'] = brand.btnRadius;
  if (brand.cardRadius) vars['--style-card-radius'] = brand.cardRadius;

  return vars;
}
