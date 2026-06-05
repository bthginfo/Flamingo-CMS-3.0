// ─────────────────────────────────────────────────────────────────────────────
// FLAMINGO DESIGN TOKENS — single source of truth
// ─────────────────────────────────────────────────────────────────────────────
//
// Why this file exists:
//   Templates used to reference ~80 distinct CSS variables across three
//   uncoordinated prefixes (`--token-*`, `--style-*`, `--brand-*`) plus a
//   booking-specific subset and a few legacy outliers. The editor tried to
//   guess editable fields from this drift, which never worked reliably.
//
//   This file collapses that mess into one canonical TokenKey enum. Every
//   token has exactly one cssVar, one default, and a human description.
//   Templates declare which tokens they consume via `export const tokens`,
//   and four build gates enforce no drift between this list, the templates,
//   and the editor.
//
// Adding a token:
//   1. Add an entry to DESIGN_TOKENS below.
//   2. Run `node scripts/gate-tokens.cjs` to refresh the drift report.
//   3. Use it in templates as `var(--token-NAME)` (no fallback chain).
//
// Removing a token:
//   1. Verify no template still references it (gate B will catch you).
//   2. Remove the entry. Gate A will confirm cleanup is complete.
//
// Naming:
//   - cssVar is always `--token-<kebab-case-name>`. No exceptions.
//   - TokenKey uses camelCase to match TypeScript convention.

export const DESIGN_TOKENS = {
  // ─── Typography colors ────────────────────────────────────────────────
  heading:         { cssVar: '--token-heading',         kind: 'color', default: '#0f172a',          description: 'Primary heading color (h1–h3 on light backgrounds)' },
  subheading:      { cssVar: '--token-subheading',      kind: 'color', default: '#1e293b',          description: 'Secondary heading color (h4–h6, section subtitles)' },
  body:            { cssVar: '--token-body',            kind: 'color', default: '#475569',          description: 'Body copy color on light backgrounds' },
  muted:           { cssVar: '--token-muted',           kind: 'color', default: '#64748b',          description: 'De-emphasized text (captions, helper text, labels)' },
  eyebrow:         { cssVar: '--token-eyebrow',         kind: 'color', default: '#dc2626',          description: 'Eyebrow / kicker text above headlines' },
  quote:           { cssVar: '--token-quote',           kind: 'color', default: '#0f172a',          description: 'Pullquote / testimonial body text' },

  // ─── Inverted (on-dark) typography ────────────────────────────────────
  onDarkHeading:   { cssVar: '--token-on-dark-heading', kind: 'color', default: '#ffffff',          description: 'Heading color when section background is dark' },
  onDarkBody:      { cssVar: '--token-on-dark-body',    kind: 'color', default: 'rgba(255,255,255,0.78)', description: 'Body color when section background is dark' },
  onDarkMuted:     { cssVar: '--token-on-dark-muted',   kind: 'color', default: 'rgba(255,255,255,0.56)', description: 'Muted color when section background is dark' },

  // ─── Surfaces / structure ─────────────────────────────────────────────
  sectionBg:       { cssVar: '--token-section-bg',      kind: 'color', default: '#ffffff',          description: 'Default section background color' },
  sectionBgAlt:    { cssVar: '--token-section-bg-alt',  kind: 'color', default: '#f8fafc',          description: 'Alternating section background (every other section)' },
  cardBg:          { cssVar: '--token-card-bg',         kind: 'color', default: '#ffffff',          description: 'Card / tile background color' },
  cardBorder:      { cssVar: '--token-card-border',     kind: 'color', default: 'rgba(15,23,42,0.08)', description: 'Card / tile border color' },
  divider:         { cssVar: '--token-divider',         kind: 'color', default: 'rgba(15,23,42,0.12)', description: 'Horizontal rule / section divider color' },

  // ─── Accents / actions ────────────────────────────────────────────────
  accent:          { cssVar: '--token-accent',          kind: 'color', default: '#dc2626',          description: 'Primary accent color (links, focused states, hero highlights)' },
  icon:            { cssVar: '--token-icon',            kind: 'color', default: '#dc2626',          description: 'Default icon stroke / fill color' },
  check:           { cssVar: '--token-check',           kind: 'color', default: '#16a34a',          description: 'Success checkmark / "included" indicator color' },
  ratingStar:      { cssVar: '--token-rating-star',     kind: 'color', default: '#eab308',          description: 'Filled rating star color' },

  // ─── Badges (eyebrow pills, status chips) ─────────────────────────────
  badgeBg:         { cssVar: '--token-badge-bg',        kind: 'color', default: 'rgba(220,38,38,0.10)', description: 'Pill / badge background color' },
  badgeText:       { cssVar: '--token-badge-text',      kind: 'color', default: '#dc2626',          description: 'Pill / badge text color' },
  badgeBorder:     { cssVar: '--token-badge-border',    kind: 'color', default: 'rgba(220,38,38,0.20)', description: 'Pill / badge border color' },

  // ─── Buttons ──────────────────────────────────────────────────────────
  btnBg:           { cssVar: '--token-btn-bg',          kind: 'color', default: '#0f172a',          description: 'Primary button background' },
  btnText:         { cssVar: '--token-btn-text',        kind: 'color', default: '#ffffff',          description: 'Primary button text' },

  // ─── Stats ────────────────────────────────────────────────────────────
  statValue:       { cssVar: '--token-stat-value',      kind: 'color', default: '#dc2626',          description: 'Large stat number color' },

  // ─── Radii ────────────────────────────────────────────────────────────
  cardRadius:      { cssVar: '--token-card-radius',     kind: 'radius', default: '1rem',            description: 'Card / tile border-radius' },
  buttonRadius:    { cssVar: '--token-button-radius',   kind: 'radius', default: '0.75rem',         description: 'Button border-radius' },
} as const satisfies Record<string, DesignTokenDef>;

export type DesignTokenDef = {
  cssVar: `--token-${string}`;
  kind: 'color' | 'radius' | 'shadow' | 'spacing';
  default: string;
  description: string;
};

export type TokenKey = keyof typeof DESIGN_TOKENS;

export const TOKEN_KEYS = Object.keys(DESIGN_TOKENS) as TokenKey[];

// Emit a CSS string with one custom-property declaration per token. Used to
// build the `:root` defaults stylesheet (loaded once per page) and the
// per-tenant override stylesheet (only contains keys the tenant overrode).
export function tokensToCss(
  values: Partial<Record<TokenKey, string>>,
  selector = ':root',
): string {
  const decls: string[] = [];
  for (const key of TOKEN_KEYS) {
    const def = DESIGN_TOKENS[key];
    const value = values[key] ?? def.default;
    decls.push(`  ${def.cssVar}: ${value};`);
  }
  return `${selector} {\n${decls.join('\n')}\n}\n`;
}

// Render JUST the defaults (no tenant overrides). Used at app boot to
// guarantee every var(--token-*) resolves to *something* even before the
// per-tenant stylesheet loads.
export function defaultTokensCss(selector = ':root'): string {
  return tokensToCss({}, selector);
}
