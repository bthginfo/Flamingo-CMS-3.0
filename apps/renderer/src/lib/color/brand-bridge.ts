/**
 * BRAND → TOKEN BRIDGE
 *
 * Extracts a BrandPalette from the tenant's brand configuration.
 * This is the single interface between brand-colors.ts (Layer 1) and the
 * color token system (Layer 2).
 *
 * The BrandPalette is used by resolveAppearance() to derive token defaults
 * when no per-section override is set.
 */
import type { BrandPalette } from './registry';

/**
 * Extract a BrandPalette from the tenant's brand config object.
 * All values are optional — missing values let the registry defaults through.
 */
export function extractBrandPalette(brand: {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  pageBg?: string;
  sectionBg?: string;
  cardBg?: string;
  headingColor?: string;
  bodyTextColor?: string;
  mutedTextColor?: string;
  iconColor?: string;
  btnPrimaryBg?: string;
  btnPrimaryText?: string;
  btnSecondaryBg?: string;
  btnSecondaryText?: string;
  badgeBg?: string;
  badgeText?: string;
  badgeBorder?: string;
  borderColor?: string;
  cardBorder?: string;
  dividerColor?: string;
}): BrandPalette {
  const primary = brand.primaryColor;
  const accent = brand.accentColor || '#f39c12';

  return {
    sectionBg: brand.sectionBg,
    cardBg: brand.cardBg,
    cardBorder: brand.borderColor || brand.cardBorder,
    heading: brand.headingColor,
    subheading: brand.headingColor,
    body: brand.bodyTextColor,
    muted: brand.mutedTextColor,
    accent: accent,
    eyebrow: accent,
    icon: brand.iconColor || primary,
    statValue: accent,
    quoteMark: accent,
    ratingStar: accent,
    check: accent,
    badgeBg: brand.badgeBg,
    badgeText: brand.badgeText || primary,
    badgeBorder: brand.badgeBorder,
    btnBg: brand.btnPrimaryBg || primary,
    btnText: brand.btnPrimaryText,
    btnSecondaryBg: brand.btnSecondaryBg,
    btnSecondaryText: brand.btnSecondaryText,
    divider: brand.dividerColor,
  };
}
