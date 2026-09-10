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
  canonical slots — see FIELD_DEFS in
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
a checked-in file containing the generated maps:

- `SECTION_COLOR_CONTRACTS_GENERATED` — per `(type, industry)` pair, keyed
  as `${type}${IndustryPascalCase}` (e.g. `heroSalon`, `proofWallHotel`).
- `SECTION_COLOR_CONTRACTS_GENERIC` — per `type`, for shared templates only.
  Used when no exact industry definition exists.
- `SECTION_COLOR_CONTRACTS_ANY` — legacy catalog discovery for the API's list
  of available section types. The colour resolver does not use this union for
  field selection.

### 2. Editor uses the same definition registry as the renderer

`section-color-resolver.ts > resolveColorContractForSection(type, industry,
definitionKey)` builds a lightweight registry from the generated contract data
and follows the renderer's exact precedence:

```ts
// 1. Stored definition key when it matches the requested type
// 2. Exact industry template (including the renderer's aliases)
// 3. Shared template
// 4. One deterministic legacy cross-industry definition
// 5. Unknown type → background only
```

The resolver returns the fields read by that one selected definition. It does
not union every industry's fields for a borrowed type, so an editor cannot
offer controls for roles that the rendered variant does not paint. Invalid or
stale definition keys safely use the legacy path, and invalid schema versions
are reported as incompatible by the shared registry.

`SECTION_INDUSTRY_ALIASES` and `LEGACY_SECTION_FALLBACK_INDUSTRY_ORDER` live in
`section-industry-config.ts`, which is shared by the resolver and the render
mirror. Add an alias only when the renderer's template lookup supports it.

### 3. Runtime DOM-scan (trims the contract to reality — in BOTH editors)

Both colour editors retain the statically supported editable field set from
the selected contract. Their runtime DOM scan reads the rendered section's class
and inline-style attributes for `var(--token-X)` substrings and annotates each
field with whether that role is visible in the current preview; user
overrides are annotated separately. Injected `<style>` elements and text
content are ignored. Preview visibility is metadata for the editor, so an
inactive role remains available for editing when it is rendered conditionally
or becomes active after content changes.

- **Live-preview overlay** (`live-preview/edit-overlays.tsx`) — `useUsedTokens`.
- **Page-editor card** (`admin/pages/[id]/section-color-editor.tsx`) — scans the
  same `[data-section-id]` element through the preview iframe ref.

When no preview iframe is reachable the scan returns nothing and every
contract field is shown (we never hide a control we cannot prove is unused).
The scan also accounts for renderer-forced roles such as heading/body/muted,
card text, badges, buttons, and dividers. This handles conditionally rendered
markup while retaining a useful fallback for legacy sections.

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

3. **Role-coverage gate** (`scripts/audit-color-role-coverage.cjs --strict`):
   for each semantic role that has a dedicated slot (badge, eyebrow, price, …)
   it checks every section that RENDERS the role actually binds it to its own
   token — not to a borrowed one. This catches the subtle bug where a badge is
   painted via `color-mix(var(--token-on-dark-body))`: the codegen sees only
   `on-dark-body`, so no "Badge" field appears and editing body text silently
   recolours the badge. The fix is to bind the element to `--token-badge-*`
   (text-only roles via `scripts/rebind-text-roles.cjs`, pill badges via the
   `.section-badge` class which the renderer wires to the badge slots).

4. **Render-mirror gate** (`scripts/check-section-color-render-mirror.cjs`):
   for every `(industry, type)` the renderer can paint, re-derives the
   actually-rendered component (`specific ?? shared ?? all`, mirroring
   `getIndustryTemplates`) and asserts the contract resolver exposes **at
   least** every field that component reads. This is the invariant that makes
   "missing fields" impossible: the editor can never be a strict subset of the
   FE. It also catches industry-alias drift and templates that read tokens
   through an import the codegen doesn't follow.

`pnpm check:section-colors` runs the contract, render-mirror, role-coverage,
and token-crosstalk gates. Wired into `.github/workflows/ci.yml` before any app
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
| `apps/renderer/src/lib/section-text-color-selectors.ts`                       | Section-local legacy text cascade and semantic role defaults |
| `apps/renderer/src/lib/section-color-resolver.ts`                             | Definition registry resolver (exact → shared → deterministic legacy borrow) |
| `apps/renderer/src/lib/section-industry-config.ts`                            | Shared industry aliases and legacy fallback order |
| `scripts/generate-section-color-contracts.cjs`                                | Codegen (emits GENERATED + GENERIC + catalog ANY) |
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
