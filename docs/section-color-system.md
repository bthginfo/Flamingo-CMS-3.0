# Section Color System

> Single source of truth for how per-section color editing works.
> If you change anything in this file or in the system it describes,
> run `node scripts/check-section-color-contracts.cjs` before committing.

## Why this exists

Two recurring bugs in older versions of the CMS:

1. **Phantom fields** — The editor shows a "Heading Color" picker, but the
   template never renders a `var(--token-heading)` anywhere, so the picker
   silently does nothing.
2. **Missing fields** — The template DOES render `var(--token-eyebrow)`, but
   the editor has no eyebrow picker, so the user can't change that colour.

Both come from the same root cause: a hand-maintained map of
`sectionType -> editable color fields` that drifts away from what the
template actually renders.

This document describes the **system that makes both bugs impossible**.

## The three layers

```
Layer 1 — BRAND TOKENS (--brand-*)
  Set once per tenant from globalSettings.design.
  Carries the tenant's identity colors. ~15 vars.
  Never touched by sections.

Layer 2 — SECTION SLOTS (--token-*)
  Every distinct visual role in a section gets its own var.
  Defaults derive from Layer 1, but each is independent so overriding
  one cannot bleed into another.
  ~27 canonical slots — see FIELD_DEFS in
  apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx.

Layer 3 — PER-SECTION OVERRIDES (section.styleOverrides)
  The CMS writes the user's per-section colour picks as inline CSS vars
  on the <section> element. Cascades to descendants of that one section only.
```

## How a template consumes a colour

Templates never reference brand vars directly. They always use Layer 2:

```tsx
// Inline style
<div style={{ background: 'var(--token-card-bg)' }} />

// Tailwind arbitrary value
<div className="bg-[var(--token-card-bg)] text-[var(--token-heading)]" />
```

The substring `var(--token-X)` appears literally in the source code
regardless of which syntax is used. **This is the single source of truth.**

## How the editor knows which fields to show

Three things, in this order:

### 1. Codegen (build-time, scripts/generate-section-color-contracts.cjs)

For every `(industry, sectionType)` pair registered in
`apps/renderer/src/templates/index.ts`:

1. Resolve the exact template component file via the import map.
2. Read the template file + any sibling templates it imports (3 levels deep,
   only within `apps/renderer/src/templates/`).
3. Regex-extract every `var(--token-NAME)` substring.
4. Reverse-map each `--token-NAME` to a `ColorFieldKey` via FIELD_DEFS in
   the editor file.
5. Sort and dedupe.

Output: `apps/renderer/src/lib/section-color-contracts-generated.ts` —
a checked-in file containing two maps:

- `SECTION_COLOR_CONTRACTS_GENERATED` — per `(type, industry)` pair, keyed
  as `${type}${IndustryPascalCase}` (e.g. `heroSalon`, `proofWallHotel`).
- `SECTION_COLOR_CONTRACTS_GENERIC` — per `type`, union across all
  industries. Used as fallback when no industry-specific entry exists.

### 2. Editor reads only the generated file

`section-color-resolver.ts > resolveColorContractForSection(type, industry)` does:

```ts
// 1. Exact industry template:        heroSalon
const industrySpecific = SECTION_COLOR_CONTRACTS_GENERATED[`${type}${Industry}`];
if (industrySpecific?.length) return { source: 'industry', fields: industrySpecific };
// 2. Shared template:                hero (shared only)
const generic = SECTION_COLOR_CONTRACTS_GENERIC[type];
if (generic?.length) return { source: 'generic', fields: generic };
// 3. Cross-industry borrow (UNION):  any industry that defines this type
const any = SECTION_COLOR_CONTRACTS_ANY[type];
if (any?.length) return { source: 'any', fields: any };
// 4. Unknown type → background only
return { source: 'none', fields: ['sectionBg'] };
```

No hand-curated map, no heuristics, no per-industry escape hatches.

**Why stage 3 exists (the cross-industry UNION).** The renderer's
`getIndustryTemplates(industry)` falls back to `ALL_TEMPLATES` when a section
type is *borrowed* into an industry that doesn't define it (the editor catalog
offers foreign sections under "Andere: …"). Before stage 3, those sections
rendered a full template in the FE but the editor collapsed to a single
"Hintergrund" picker — ~1300 (industry, type) pairs were affected. Stage 3
mirrors that borrow: `SECTION_COLOR_CONTRACTS_ANY[type]` is the **union** of the
fields every industry's variant reads, so the editor can never expose *fewer*
controls than the FE paints. It is a deliberate superset; stage 3 of the
runtime DOM-scan (below) trims it back down to what the rendered variant
actually uses.

**Industry aliases must match the renderer.** `INDUSTRY_CONTRACT_ALIASES`
(`handwerk → tradesman`) exists only because the renderer serves the same
template for that string. Never add an alias the renderer's
`getIndustryTemplates` does not honor — it would point the editor at a
different template than the one painted (the render-mirror guard fails if you
do).

### 3. Runtime DOM-scan (trims the contract to reality — in BOTH editors)

Both colour editors scan the rendered section's `outerHTML` for
`var(--token-X)` substrings and split the contract fields into *active* (token
present in the DOM, or already overridden by the user) and *inactive*. Inactive
pickers are hidden behind an "Erweitert: N ungenutzte Slots anzeigen" toggle, so
the user is never shown a no-op control.

- **Live-preview overlay** (`live-preview/edit-overlays.tsx`) — `useUsedTokens`.
- **Page-editor card** (`admin/pages/[id]/section-color-editor.tsx`) — scans the
  same `[data-section-id]` element through the preview iframe ref.

When no preview iframe is reachable the scan returns nothing and **every**
contract field is shown (we never hide a control we cannot prove is unused).

This handles two cases at once: the codegen over-including a slot the template
only uses conditionally (`data.bordered === true`), and the stage-3 union
above contributing slots a particular industry variant doesn't paint.

## CI guard — drift is forbidden

`scripts/check-section-color-contracts.cjs` runs two gates:

1. **Vocabulary gate** (`scripts/audit-token-vocabulary.cjs --strict`):
   every `var(--token-X)` literally used in any template must have a
   matching entry in FIELD_DEFS. Anything else means the codegen
   silently drops it and the editor never exposes a picker for it.
   If you intentionally use a derived token that should NOT be
   user-editable (e.g. `--token-accent-rgb` is computed from
   `--token-accent` for `rgba()` syntax), add it to the WHITELIST
   inside `audit-token-vocabulary.cjs`.

2. **Contracts gate**: re-runs the codegen in a sandbox and compares
   the output to the committed `section-color-contracts-generated.ts`.
   If they differ it exits 1 with a diff summary.

4. **Role-coverage gate** (`scripts/audit-color-role-coverage.cjs --strict`):
   for each semantic role that has a dedicated slot (badge, eyebrow, price, …)
   it checks every section that RENDERS the role actually binds it to its own
   token — not to a borrowed one. This catches the subtle bug where a badge is
   painted via `color-mix(var(--token-on-dark-body))`: the codegen sees only
   `on-dark-body`, so no "Badge" field appears and editing body text silently
   recolours the badge. The fix is to bind the element to `--token-badge-*`
   (text-only roles via `scripts/rebind-text-roles.cjs`, pill badges via the
   `.section-badge` class which the renderer wires to the badge slots).

3. **Render-mirror gate** (`scripts/check-section-color-render-mirror.cjs`):
   for every `(industry, type)` the renderer can paint, re-derives the
   actually-rendered component (`specific ?? shared ?? all`, mirroring
   `getIndustryTemplates`) and asserts the contract resolver exposes **at
   least** every field that component reads. This is the invariant that makes
   "missing fields" impossible: the editor can never be a strict subset of the
   FE. It also catches industry-alias drift and templates that read tokens
   through an import the codegen doesn't follow.

`pnpm check:section-colors` runs gates 2 + 3 (gate 1 via
`audit-token-vocabulary`). Wired into `.github/workflows/ci.yml` before any app
build runs.

Locally before pushing:

```sh
node scripts/check-section-color-contracts.cjs
```

If it fails, fix with:

```sh
node scripts/generate-section-color-contracts.cjs
git add apps/renderer/src/lib/section-color-contracts-generated.ts
```

## How to add a new section

1. Create the template file `apps/renderer/src/templates/<industry>/<name>.tsx`.
2. Use `var(--token-X)` for every colour you want the user to be able to edit.
   - Pick from the 27 canonical slots in FIELD_DEFS. Do NOT invent new tokens.
   - If you need a token that doesn't exist, add it to FIELD_DEFS in
     section-color-editor.tsx first.
3. Register the section in `apps/renderer/src/templates/index.ts` under the
   appropriate industry block (`hotel: { yourSection: YourSectionComponent }`).
4. Run `node scripts/generate-section-color-contracts.cjs`.
5. Commit both the template and the regenerated contracts file.

The editor will pick up the new section automatically. There is nothing
else to register.

## Migrating an existing section

If a section has hardcoded hex colours instead of `var(--token-*)`:

1. Run `node scripts/audit-template-colors.cjs` to see what's hardcoded.
2. Replace each hardcoded colour with the matching `var(--token-*)`.
3. Re-run the codegen — the editor will now expose those fields automatically.

Common mappings:

| Hardcoded                    | Token                   |
|------------------------------|-------------------------|
| `#ffffff` background         | `--token-section-bg`    |
| `bg-white` for cards         | `--token-card-bg`       |
| `text-slate-900` for h1/h2   | `--token-heading`       |
| `text-slate-600` for body    | `--token-body`          |
| `text-slate-400` for muted   | `--token-muted`         |
| `bg-blue-600` button         | `--token-btn-bg`        |
| `text-white` on button       | `--token-btn-text`      |
| accent / icon / underline    | `--token-accent`        |
| border line                  | `--token-card-border`   |

## Files that own this system

| File                                                                          | Role                                       |
|-------------------------------------------------------------------------------|--------------------------------------------|
| `apps/renderer/src/lib/brand-colors.ts` (`getBrandCssVars`)                   | Resolves brand → independent page-level `--token-*` defaults (single source) |
| `apps/renderer/src/app/admin/pages/[id]/section-color-editor.tsx`             | FIELD_DEFS + editor UI                     |
| `apps/renderer/src/lib/section-color-contracts-generated.ts`                  | AUTO-GENERATED contracts (do not edit)     |
| `apps/renderer/src/app/live-preview/edit-overlays.tsx`                        | Live overlay + runtime DOM-scan filter     |
| `apps/renderer/src/templates/index.ts`                                        | sectionType → component registry           |
| `apps/renderer/src/lib/section-color-resolver.ts`                             | 4-stage resolver (industry → generic → any → none) |
| `scripts/generate-section-color-contracts.cjs`                                | Codegen (emits GENERATED + GENERIC + ANY)  |
| `scripts/check-section-color-contracts.cjs`                                   | CI drift guard                             |
| `scripts/check-section-color-render-mirror.cjs`                               | CI render-mirror guard (resolver ⊇ renderer) |
| `scripts/audit-template-colors.cjs`                                           | Reports hardcoded colours per template     |

## Anti-patterns — do not do these

- Hand-edit `section-color-contracts-generated.ts`. It is regenerated.
- Add a per-industry override map outside the codegen.
- Reference brand vars (`var(--brand-*)`) directly in template JSX.
- Hardcode hex colours in new template code.
- Introduce a new `--token-X` without adding it to FIELD_DEFS.
- Bypass the editor by storing raw CSS vars in `styleOverrides` whose names
  are not in FIELD_DEFS (the migrator will drop them on next load).
