# Hardcoded-Color → CMS-Field Gap Map

> Status after the Phase-8 semantic tokenisation
> (`scripts/tokenise-semantic-colors.cjs`).

## What was done

Every **solid** hardcoded Tailwind colour utility in the templates was rewritten
to a semantic CMS-editable token, keeping the original value as a `theme()`
fallback:

```
text-slate-900            → text-[var(--token-heading,theme(colors.slate.900))]
bg-red-600  (emergency)   → bg-[var(--token-danger-bg,theme(colors.red.600))]
text-teal-700 (success)   → text-[var(--token-success,theme(colors.teal.700))]
text-blue-500 (accent)    → text-[var(--token-accent,theme(colors.blue.500))]
```

The mapping is **semantic, not mechanical**, so it does not reintroduce
crosstalk: red → `danger`, green/teal → `success`, grey shades →
`heading`/`body`/`muted`, coloured families → `accent`, etc. (full table in the
script header).

Result: hardcoded colour refs **341 → 218**; sections the surface-audit flags
as carrying hardcoded colour classes **114 → 51**. Every newly-tokenised colour
now appears as an editable field in the section colour editor (e.g. the medical
hero's emergency button is now editable via "Warnung-Farbe").

## What is deliberately NOT tokenised (≈50 refs, 23 files)

Two classes of colour are intentionally left hardcoded because they cannot be
expressed as a single editable `var()` without visual regressions:

1. **Alpha / glass utilities** — `bg-white/15`, `border-red-500/40`, … The
   opacity modifier (`/NN`) cannot ride on an arbitrary `var()` cleanly, and
   most are decorative glass/overlay effects.
2. **Gradient stops** — `from-…`, `via-…`, `to-…`. Per-stop tokens would flood
   the editor with low-value controls and risk breaking the gradient.

These are tracked by `scripts/check-hardcoded-colors-regression.cjs`
(baseline 218) so they cannot silently grow. If a specific glass/gradient colour
turns out to be worth exposing, tokenise that one occurrence by hand with an
alpha-preserving form (`color-mix(in srgb, var(--token-x) NN%, transparent)`)
and lower the baseline.

## How to verify / re-run

```sh
node scripts/tokenise-semantic-colors.cjs --dry   # preview remaining candidates
node scripts/audit-template-colors.cjs            # per-file hardcoded breakdown
pnpm audit:section-surface                         # full FE↔CMS parity report
```
