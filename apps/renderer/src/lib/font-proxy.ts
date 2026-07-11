export const GOOGLE_FONT_FAMILIES = [
  'Outfit',
  'Inter',
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Lora',
  'Raleway',
  'Open Sans',
  'Roboto',
  'Roboto Slab',
  'Source Sans 3',
  'Nunito',
  'DM Sans',
  'DM Serif Display',
  'Space Grotesk',
  'Plus Jakarta Sans',
  'Bricolage Grotesque',
  'Cormorant Garamond',
  'Josefin Sans',
] as const;

const ALLOWED_FAMILIES = new Set<string>(GOOGLE_FONT_FAMILIES);

export function normalizeGoogleFontFamilies(fonts: readonly unknown[]): string[] {
  return [...new Set(fonts
    .filter((font): font is string => typeof font === 'string')
    .map((font) => font.trim())
    .filter((font) => ALLOWED_FAMILIES.has(font)))];
}

/** Same-origin URL: browsers never contact Google directly. */
export function buildGoogleFontsProxyUrl(fonts: readonly unknown[]): string | null {
  const families = normalizeGoogleFontFamilies(fonts);
  if (families.length === 0) return null;
  const params = new URLSearchParams();
  for (const family of families) params.append('family', family);
  return `/api/fonts/google?${params.toString()}`;
}
