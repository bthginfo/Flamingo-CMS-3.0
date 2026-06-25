# Color Architecture Audit (Phase 0)

> Scope: identify every place where colors are defined, consumed, or overridden in
> the renderer so we can refactor toward a clean 3-layer token system without
> breaking existing tenant sites.

## TL;DR — what's wrong today

1. **One CSS var, many meanings.** `--style-accent-color` is consumed by
   ~10 different visual roles across templates (eyebrows, icons, stat values,
   quote marks, rating stars, check marks, …). Overriding it in the CMS to
   change one of these silently recolors all of them.
2. **Brand layer leaks into section layer.** `getBrandCssVars()` in
   [apps/renderer/src/lib/brand-colors.ts](apps/renderer/src/lib/brand-colors.ts)
   writes BOTH `--brand-*` AND `--style-*` variables. That couples brand
   identity to section overrides, so a tenant-wide brand edit can break
   per-section customisations and vice-versa.
3. **CMS field names don't match the underlying var.** The editor in
   [section-color-editor.tsx](apps/renderer/src/app/admin/pages/%5Bid%5D/section-color-editor.tsx)
   exposes fields like `iconColor` / `accentColor` per section, but multiple
   visual roles in the rendered template read from the SAME var, so a field
   labelled "Icon Color" can change an unrelated eyebrow text and vice-versa.
4. **Fallbacks are inconsistent.** Some templates use
   `var(--style-X, var(--brand-Y, #hex))`, others jump straight to a hex,
   others use Tailwind classes (`bg-[var(--color-primary)]`). No single
   authoritative source.

## The three-layer target architecture

| Layer | Var prefix | Scope | Source of truth |
|---|---|---|---|
| 1. Brand tokens | `--brand-*` | Tenant-wide | `globalSettings.design` → `getBrandCssVars` |
| 2. Section slots | `--token-*` | Per `<section>` | `resolveSectionTokens(brand, type, overrides)` |
| 3. Per-section overrides | `--token-*` (inline) | Single section instance | `section.styleOverrides` from CMS |

- Each layer can only read FROM the layer above. Section overrides never
  mutate brand. Brand never mutates section slots.
- Each semantic role gets its OWN slot var (`--token-eyebrow`,
  `--token-icon`, `--token-stat-value`, `--token-quote`, …). No more
  N-roles-on-1-var.

See [apps/renderer/src/lib/section-color-fields.ts](apps/renderer/src/lib/section-color-fields.ts)
for the slot taxonomy (FIELD_DEFS) and
[apps/renderer/src/lib/brand-colors.ts](apps/renderer/src/lib/brand-colors.ts)
(`getBrandCssVars`) for the single source of per-slot page-level defaults.
(The former additive `section-color-tokens.ts` resolver was never wired in and
has been removed.)

## Audit — confirmed cross-contamination cases

All of these read `--style-accent-color` for fundamentally different roles
(found via `grep '--style-accent-color' apps/renderer/src/templates`):

| File | Role | Should be slot |
|---|---|---|
| `shared/principles-grid.tsx:41` | Card eyebrow | `eyebrow` |
| `shared/glow-hero.tsx:60` | Stat value | `statValue` |
| `shared/signature-grid.tsx:39` | Stat value | `statValue` |
| `shared/immersive-cta-banner.tsx:56` | Metric value | `statValue` |
| `shared/proof-wall.tsx:31` | Award icon | `icon` |
| `shared/proof-wall.tsx:43` | Quote glyph | `quoteMark` |
| `shared/proof-wall.tsx:50` | Rating star fill | `ratingStar` |
| `shared/comparison-cards-pro.tsx:31` | Feature check | `check` |
| `shared/comparison-cards-pro.tsx:27` | Plan name eyebrow | `eyebrow` |
| `shared/comparison-cards-pro.tsx:25` | Highlighted card border | `cardBorder` |
| `shared/before-after-story-pro.tsx:29` | Step label | `eyebrow` |
| `shared/before-after-story-pro.tsx:46` | Bullet check | `check` |
| `shared/editorial-feature-rail.tsx:20` | Badge text | `badgeText` |
| `shared/offer-campaign-strip.tsx:29` | Badge | `badgeText` |
| `shared/offer-campaign-strip.tsx:35` | Benefit check | `check` |
| `shared/popup.tsx:57` | Decorative blob | (decorative — keep brand) |
| `shared/popup.tsx:68` | Subtitle | `eyebrow` |
| `additional-locations.tsx:92,98` | Hover link color | `eyebrow`/link |

`--style-icon-color` similarly conflates: real icons (Phone, Mail, Clock)
and "round number badges" in principles-grid. Splitting `icon` from
`badgeText` / `eyebrow` fixes this.

## Migration plan (5 phases, all backwards-compatible)

- **Phase 1 — Token resolver** ✅ done in this commit.
  - Add `section-color-tokens.ts` with slot taxonomy + `resolveSectionTokens`.
  - Non-breaking: nothing consumes the new vars yet.
- **Phase 2 — Wire renderer.** ✅ done in this commit.
  - `getBrandCssVars` now emits Layer-2 `--token-*` defaults alongside the
    existing `--brand-*` and `--style-*` vars, so every page root carries the
    full slot set automatically. `section-renderer.tsx` continues to spread
    `section.styleOverrides` inline, so per-section overrides on slot vars
    cascade only to the descendants of that one section.
- **Phase 3 — Migrate templates.**
  - One at a time, replace
    `text-[var(--style-accent-color,…)]` with
    `text-[var(--token-eyebrow,var(--style-accent-color,…))]`
    (keeping the old fallback so unmigrated tenants are unaffected).
  - Start with the highest-impact files: `principles-grid`, `proof-wall`,
    `comparison-cards-pro`, `glow-hero`.
- **Phase 4 — CMS editor field rebind.**
  - `section-color-editor.tsx` `SECTION_FIELDS` map switches to slot names.
  - "Eyebrow Color" writes `eyebrow` → `--token-eyebrow`. No more accidental
    icon recolour.
- **Phase 5 — Cleanup.**
  - Remove `--style-*` writes from `getBrandCssVars` once all templates are
    migrated. Brand layer only writes `--brand-*`.
  - Drop dead fallbacks.

## What is NOT changing (and why)

- `--brand-*` var names — already widely consumed by the marketing layer,
  topbar, footer, nav. Leaving these untouched keeps demos rendering today.
- Existing `styleOverrides` payloads in the DB — the resolver accepts BOTH
  slot-keyed and raw `--style-*`-keyed objects (`pickSlotOverrides`), so
  saved content keeps rendering as it did before.
- The `industry style` variant system (salon-pink, etc.) — those still set
  `--style-*` defaults; the new slots fall through to them when the brand
  doesn't override and the CMS hasn't overridden either.

## Risk register

| Risk | Mitigation |
|---|---|
| Tenant changed a brand color that previously cascaded into an eyebrow → now eyebrow is "wrong" colour | Slot defaults still derive from `--brand-accent`, so the cascade keeps working. |
| Templates touched mid-migration may render wrong if `--token-*` undefined | The new vars are only consumed by migrated templates; unmigrated templates stay on the old chain. |
| Cache: `getActiveSnapshot` revalidates every 60s | Brand + section vars are computed at request time, not cached. |
