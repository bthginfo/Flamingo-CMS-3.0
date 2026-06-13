/**
 * Section Color Tokens — Phase 1 (additive, non-breaking).
 *
 * Architecture (3 layers):
 *
 *   Layer 1 — BRAND TOKENS (`--brand-*`)
 *     Set once per tenant from `globalSettings.design` (see `brand-colors.ts`).
 *     Carries the tenant's identity colors: primary, secondary, accent, neutrals,
 *     buttons, badges, surfaces. ~15 vars total. Never touched by sections.
 *
 *   Layer 2 — SEMANTIC SECTION SLOTS (`--token-*`)
 *     Every distinct visual role inside a section gets its OWN var (no overlap).
 *     Defaults are DERIVED from Layer 1 (e.g. `--token-eyebrow` = `--brand-accent`).
 *     Sections read these via `var(--token-eyebrow, <legacy-fallback>)`.
 *
 *   Layer 3 — PER-SECTION OVERRIDES (`section.styleOverrides`)
 *     CMS editor writes inline CSS vars on the <section> element for that one
 *     instance. Because slots are independent, overriding `--token-eyebrow`
 *     does NOT also recolor icons, stats, quotes, etc.
 *
 * Migration strategy:
 *   - This module is ADDITIVE today. Templates keep their `--style-*` fallbacks
 *     and ALSO read the new `--token-*` slot first:
 *       text-[var(--token-eyebrow,var(--style-accent-color,var(--brand-primary)))]
 *   - `section-renderer.tsx` calls `resolveSectionTokens(...)` and merges the
 *     resulting vars into the section's inline style.
 *   - Sections can be migrated one-by-one; the CMS editor can target either the
 *     old or new var name during the transition.
 *
 * Why this fixes the current pain (see `docs/color-architecture-audit.md`):
 *   Today `--style-accent-color` is reused by ~10 different visual roles
 *   (eyebrow, icon, stat value, quote mark, rating star, check mark, ...).
 *   Overriding it in the CMS for "eyebrow color" silently recolors all of them.
 *   With distinct slot vars, an "Eyebrow Color" field maps 1:1 to `--token-eyebrow`.
 */

export type SectionTokenSlot =
  // Surface
  | 'sectionBg'
  | 'cardBg'
  | 'cardBorder'
  // Text
  | 'heading'
  | 'subheading'
  | 'body'
  | 'muted'
  // Accents (split out — these used to all collide on --style-accent-color)
  | 'eyebrow'        // small uppercase label above the headline
  | 'icon'           // generic foreground icon color
  | 'statValue'      // large numeric/metric value
  | 'quoteMark'      // the " or Quote glyph in testimonial cards
  | 'ratingStar'     // star fills in reviews
  | 'check'          // check mark in feature/comparison lists
  // Badge
  | 'badgeBg'
  | 'badgeText'
  | 'badgeBorder'
  // Button (overrides on a per-section basis)
  | 'btnBg'
  | 'btnText'
  | 'btnSecondaryBg'
  | 'btnSecondaryText'
  | 'btnSecondaryBorder'
  // Divider/border
  | 'divider';

/** CSS variable name for a given slot. */
export const TOKEN_VAR: Record<SectionTokenSlot, `--token-${string}`> = {
  sectionBg:   '--token-section-bg',
  cardBg:      '--token-card-bg',
  cardBorder:  '--token-card-border',
  heading:     '--token-heading',
  subheading:  '--token-subheading',
  body:        '--token-body',
  muted:       '--token-muted',
  eyebrow:     '--token-eyebrow',
  icon:        '--token-icon',
  statValue:   '--token-stat-value',
  quoteMark:   '--token-quote',
  ratingStar:  '--token-rating-star',
  check:       '--token-check',
  badgeBg:     '--token-badge-bg',
  badgeText:   '--token-badge-text',
  badgeBorder: '--token-badge-border',
  btnBg:       '--token-btn-bg',
  btnText:     '--token-btn-text',
  btnSecondaryBg: '--token-btn-secondary-bg',
  btnSecondaryText: '--token-btn-secondary-text',
  btnSecondaryBorder: '--token-btn-secondary-border',
  divider:     '--token-divider',
};

/** Minimal brand shape consumed by the resolver. Mirrors `brand-colors.ts`. */
export interface BrandInput {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headingColor?: string;
  bodyTextColor?: string;
  mutedTextColor?: string;
  sectionBg?: string;
  cardBg?: string;
  borderColor?: string;
  dividerColor?: string;
  iconColor?: string;
  badgeBg?: string;
  badgeText?: string;
  badgeBorder?: string;
  btnPrimaryBg?: string;
  btnPrimaryText?: string;
  btnSecondaryBg?: string;
  btnSecondaryText?: string;
  btnSecondaryBorder?: string;
}

/**
 * Per-slot overrides supplied by the CMS for one section instance.
 * Keys are slot names (NOT raw CSS var names) — the resolver maps them.
 */
export type SectionTokenOverrides = Partial<Record<SectionTokenSlot, string | undefined | null>>;

/**
 * Derive default slot values from brand tokens. Each slot has an explicit
 * default so that overriding one cannot leak into another.
 *
 * The values returned here reference Layer 1 vars (`var(--brand-*)`) rather
 * than baking in raw hex, so that updating a brand color cascades automatically.
 */
function deriveDefaults(brand: BrandInput): Record<SectionTokenSlot, string> {
  // Reference brand vars; static fallbacks match `globals.css` defaults.
  const PRIMARY = 'var(--brand-primary, #2563eb)';
  const ACCENT  = 'var(--brand-accent, var(--brand-primary, #f39c12))';

  return {
    sectionBg:   brand.sectionBg     ?? 'var(--style-section-bg, transparent)',
    cardBg:      brand.cardBg        ?? 'var(--style-card-bg, #ffffff)',
    cardBorder:  brand.borderColor   ?? 'var(--style-border-color, rgba(15,23,42,0.08))',
    heading:     brand.headingColor  ?? 'var(--brand-heading, #0f172a)',
    subheading:  brand.headingColor  ?? 'var(--brand-heading, #0f172a)',
    body:        brand.bodyTextColor ?? 'var(--brand-body-text, #27272a)',
    muted:       brand.mutedTextColor ?? 'var(--style-text-muted, #71717a)',
    // Accent family — all default to the same brand accent, but each is its
    // OWN var so editor controls can diverge per-section without bleed.
    eyebrow:     ACCENT,
    icon:        brand.iconColor ?? PRIMARY,
    statValue:   ACCENT,
    quoteMark:   ACCENT,
    ratingStar:  ACCENT,
    check:       ACCENT,
    // Badge
    badgeBg:     brand.badgeBg     ?? 'var(--style-badge-bg, rgba(0,0,0,0.06))',
    badgeText:   brand.badgeText   ?? PRIMARY,
    badgeBorder: brand.badgeBorder ?? 'var(--style-badge-border, transparent)',
    // Button
    btnBg:       brand.btnPrimaryBg   ?? PRIMARY,
    btnText:     brand.btnPrimaryText ?? '#ffffff',
    btnSecondaryBg: brand.btnSecondaryBg ?? 'transparent',
    btnSecondaryText: brand.btnSecondaryText ?? brand.bodyTextColor ?? 'var(--brand-body-text, #27272a)',
    btnSecondaryBorder: brand.btnSecondaryBorder ?? 'color-mix(in srgb, var(--brand-body-text, #27272a) 22%, transparent)',
    // Divider
    divider:     brand.dividerColor ?? 'var(--style-divider-color, rgba(0,0,0,0.08))',
  };
}

/**
 * Build the inline-style record of `--token-*` CSS variables for one section.
 *
 * Caller (typically `section-renderer.tsx`) spreads the result into the
 * `<section style={...}>` so the vars cascade to all descendants of that
 * one section only.
 *
 * @param brand     Tenant brand input (from `getTenantBrand`).
 * @param sectionType e.g. 'principlesGrid' — currently unused but reserved for
 *                    section-specific default tweaks (e.g. dark hero sections).
 * @param overrides Per-section overrides from the CMS (`section.styleOverrides`,
 *                  already filtered to slot keys — see `pickSlotOverrides`).
 */
export function resolveSectionTokens(
  brand: BrandInput | null | undefined,
  _sectionType: string,
  overrides?: SectionTokenOverrides | null,
): Record<string, string> {
  const defaults = deriveDefaults(brand ?? {});
  const out: Record<string, string> = {};
  (Object.keys(defaults) as SectionTokenSlot[]).forEach(slot => {
    const override = overrides?.[slot];
    const value = (override && override.trim()) ? override : defaults[slot];
    out[TOKEN_VAR[slot]] = value;
  });
  return out;
}

/**
 * Extract slot-shaped overrides from a free-form `styleOverrides` object.
 *
 * The CMS currently stores raw CSS var names as keys (`--style-accent-color: '#ff0'`)
 * AND/OR slot names. This helper accepts both styles and produces a clean
 * slot-keyed object for `resolveSectionTokens`. Unknown keys are ignored.
 */
export function pickSlotOverrides(
  raw: Record<string, unknown> | null | undefined,
): SectionTokenOverrides {
  if (!raw) return {};
  const out: SectionTokenOverrides = {};
  const slotByVar: Record<string, SectionTokenSlot> = Object.fromEntries(
    (Object.entries(TOKEN_VAR) as [SectionTokenSlot, string][])
      .map(([slot, varName]) => [varName, slot]),
  );
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v !== 'string' || !v) continue;
    if (k in TOKEN_VAR) {
      out[k as SectionTokenSlot] = v;
    } else if (k in slotByVar) {
      out[slotByVar[k]] = v;
    }
  }
  return out;
}
