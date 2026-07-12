import { getBrandCssVars } from './brand-colors';
import { getDesignCssVars } from './design-vars';
import { buildGoogleFontsProxyUrl } from './font-proxy';
import { getStyleCssVars } from './styles';
import type { BrandData } from './tenant-data';

const MAX_FONT_FAMILY_LENGTH = 80;

/**
 * Tenant-controlled font names are written into CSS custom properties and
 * @font-face rules. Keep only characters that can be part of a family name so
 * uploaded filenames cannot terminate a CSS declaration.
 */
export function normalizeTenantFontFamily(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N} _-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_FONT_FAMILY_LENGTH);
}

function normalizeTenantFontUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function fontStack(name: string, fallback: string) {
  return `${JSON.stringify(name)}, ${fallback}`;
}

function resolveTenantFontFamily(
  customName: unknown,
  customUrl: unknown,
  configuredFamily: unknown,
) {
  const safeCustomName = normalizeTenantFontFamily(customName);
  return safeCustomName && normalizeTenantFontUrl(customUrl)
    ? safeCustomName
    : normalizeTenantFontFamily(configuredFamily);
}

export function getTenantFontAssets(brand: BrandData): {
  googleFontsUrl: string | null;
  fontFaceCss: string;
  hasBodyFont: boolean;
} {
  const rules: string[] = [];
  const pairs = [
    [brand.customHeadingFontName, brand.customHeadingFontUrl],
    [brand.customBodyFontName, brand.customBodyFontUrl],
  ] as const;

  for (const [rawName, rawUrl] of pairs) {
    const name = normalizeTenantFontFamily(rawName);
    const url = normalizeTenantFontUrl(rawUrl);
    if (!name || !url) continue;
    rules.push(`@font-face { font-family: ${JSON.stringify(name)}; src: url(${JSON.stringify(url)}); font-display: swap; }`);
  }

  return {
    googleFontsUrl: buildGoogleFontsProxyUrl([brand.headingFont, brand.bodyFont]),
    fontFaceCss: rules.join('\n'),
    hasBodyFont: Boolean(resolveTenantFontFamily(
      brand.customBodyFontName,
      brand.customBodyFontUrl,
      brand.bodyFont,
    )),
  };
}

export function getTenantFontCssVars(brand: BrandData): Record<string, string> {
  const headingFontName = resolveTenantFontFamily(
    brand.customHeadingFontName,
    brand.customHeadingFontUrl,
    brand.headingFont,
  );
  const bodyFontName = resolveTenantFontFamily(
    brand.customBodyFontName,
    brand.customBodyFontUrl,
    brand.bodyFont,
  );
  const vars: Record<string, string> = {};

  if (headingFontName) {
    vars['--style-heading-font'] = fontStack(headingFontName, 'var(--font-outfit), system-ui, sans-serif');
  }
  if (bodyFontName) {
    vars['--custom-body-font'] = fontStack(bodyFontName, 'var(--font-inter), system-ui, sans-serif');
  }
  return vars;
}

/** Canonical page-theme precedence: industry style -> brand -> fonts -> design. */
export function getTenantThemeCssVars({
  industry,
  style,
  brand,
  design = {},
}: {
  industry: string;
  style: string;
  brand: BrandData;
  design?: Record<string, string>;
}): Record<string, string> {
  const styleVars = getStyleCssVars(industry, style);
  const brandVars = getBrandCssVars(brand, styleVars);
  const fontVars = getTenantFontCssVars(brand);

  return {
    ...styleVars,
    ...brandVars,
    ...fontVars,
    ...getDesignCssVars(design),
  };
}
