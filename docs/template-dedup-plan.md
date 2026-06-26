# Template De-duplication Plan (audit follow-up "H")

**Status:** scoped, not yet executed. This is a deliberately incremental epic —
a bulk rewrite is too regression-prone to do in one pass (see risks below).

## Problem

204 template files under `apps/renderer/src/templates/`, of which ~13 section
types are re-implemented per industry. A bug in e.g. `contact` must be fixed in
up to 6 places; a new colour token must be wired N times.

Most-duplicated section base names (across industry folders):

| section        | # industries | notes |
|----------------|--------------|-------|
| `hero`         | 11 | most divergent (bg modes, overlays, trust strips) |
| `testimonials` | 9  | fairly uniform |
| `faq`          | 9  | very uniform (accordion + items) |
| `contact`      | 6  | 71–133 LOC — form + map + hours variations |
| `story`        | 4  | |
| `gallery`      | 4  | |
| `team`, `opening-hours` | 3 each | |

## Why not bulk-rewrite now

1. **Coupled to the colour-contract codegen.** `generate-section-color-contracts.cjs`
   extracts `var(--token-*)` per *template file per industry* and emits
   `_GENERATED[${type}${Industry}]`. Collapsing files changes which contract a
   section resolves to (`_GENERIC`/`_ANY` instead of industry-specific). Every
   merge must be followed by a regen + `npm run check:section-colors`.
2. **They are near-duplicates, not exact.** Each carries industry-specific
   markup/variants. A naive merge silently changes a tenant's live design.
3. **Blast radius.** These render every customer site; a regression ships to all.

## Target structure

For each consolidated type, one parametrized component in `templates/shared/`:

```
shared/contact-section.tsx        // single implementation, variant-driven
```

- Industry/visual differences become **variants** (`variant?: string`) + data
  flags, not separate files. The renderer already passes `variant`/`styleVariant`.
- Per-industry colour stays automatic via the existing `--token-*` contract —
  the consolidated file's `var(--token-*)` usage becomes the `_GENERIC`/`_ANY`
  contract for that type, which `getFieldsForSection` already falls back to.
- Keep a thin industry shim ONLY where markup genuinely diverges (e.g. `hero`).

## Migration order (one section type per PR, gate-protected)

1. **`faq`** first — most uniform, lowest risk; proves the pattern end-to-end.
2. **`testimonials`** — uniform.
3. **`opening-hours`**, **`team`**, **`gallery`** — small, contained.
4. **`contact`** — medium; fold form/map/hours differences into variants.
5. **`story`** — medium.
6. **`hero`** LAST — most divergent; may stay partly per-industry.

## Per-step checklist (do not skip)

1. Diff the N industry variants; design the superset props/variants.
2. Write the single `shared/<type>-section.tsx`; map each old industry file's
   markup to a variant.
3. Point the template registry (`templates/index.ts`) for every industry at the
   shared component; delete the old per-industry files.
4. `node scripts/generate-section-color-contracts.cjs` → regen contracts.
5. `npm run check:section-colors` (contracts + render-mirror + role-coverage
   `--strict` + crosstalk) must be green.
6. Visually verify each affected industry's demo (`/demo/<industry>`) before
   merge — the contract gate proves colour wiring, not pixel layout.

## Definition of done

`templates/*/` industry folders shrink to only genuinely industry-specific
sections; the duplicated types live once in `shared/`; colour gates green; demos
visually unchanged.
