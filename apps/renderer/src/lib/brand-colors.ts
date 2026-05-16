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

export function getBrandCssVars(brand: { primaryColor?: string; secondaryColor?: string; accentColor?: string; topBarColor?: string; footerColor?: string; footerLinkColor?: string; footerTextColor?: string; navLinkColor?: string; headingColor?: string; bodyTextColor?: string; linkColor?: string; linkHoverColor?: string; btnPrimaryBg?: string; btnPrimaryText?: string }): Record<string, string> {
  const vars: Record<string, string> = {};
  const primary = brand.primaryColor;
  if (!primary || !/^#[0-9a-fA-F]{6}$/.test(primary)) return vars;

  vars['--brand-primary'] = primary;
  vars['--brand-primary-rgb'] = hexToRgb(primary);
  vars['--brand-dark'] = darken(primary, 0.45);
  vars['--brand-secondary'] = brand.secondaryColor || lighten(primary, 0.3);
  vars['--brand-accent'] = brand.accentColor || '#f39c12';
  vars['--brand-topbar'] = brand.topBarColor || vars['--brand-dark'];
  vars['--brand-footer'] = brand.footerColor || vars['--brand-dark'];

  if (brand.footerLinkColor) vars['--brand-footer-link'] = brand.footerLinkColor;
  if (brand.footerTextColor) vars['--brand-footer-text'] = brand.footerTextColor;
  if (brand.navLinkColor) vars['--brand-nav-link'] = brand.navLinkColor;
  if (brand.headingColor) vars['--brand-heading'] = brand.headingColor;
  if (brand.bodyTextColor) vars['--brand-body-text'] = brand.bodyTextColor;
  if (brand.linkColor) vars['--brand-link'] = brand.linkColor;
  if (brand.linkHoverColor) vars['--brand-link-hover'] = brand.linkHoverColor;
  if (brand.btnPrimaryBg) vars['--brand-btn-bg'] = brand.btnPrimaryBg;
  if (brand.btnPrimaryText) vars['--brand-btn-text'] = brand.btnPrimaryText;

  return vars;
}
