# Section Audit — duplication, code quality, enhancement

> Generated via `node scripts/audit-section-quality.cjs`. Re-run anytime.

## Landscape
- **204 template files** — 49 `shared/` + 155 industry-specific across 13 industries.
- Shared helpers are already widely adopted (good baseline):
  `asList` 254×, `plain` 206×, `SectionHeader` 109×, `baseHeader` 71×.
- Type safety is good: only **1** template uses `any`.

## Duplication — mostly intentional, not copy-paste

Same section type implemented per industry, with measured line-overlap:

| Type | Impls | Overlap | Verdict |
|---|---:|---:|---|
| `hero` | 11 | ~34% | Intentional — each industry is a distinct premium design. Keep. |
| `faq` | 9 | ~30% | Different styling, but all re-implement the **accordion behaviour**. → share the logic. |
| `testimonials` | 9 | ~31% | Intentional styling variation. Keep. |
| `contact` | 6 | ~36% | Presentational only (form submit lives elsewhere). Keep. |
| `gallery` | 4 | ~40% | Mild overlap. Optional. |
| `story` | 4 | **~62%** | **Strong overlap → consolidation candidate.** |
| `team` | 3 | ~32% | Keep. |
| `opening-hours` | 3 | ~29% | Keep. |
| `location-contact` | 2 | ~42% | Candidate. |

**Conclusion:** the industry system creates *visual* variety, not dead duplication.
The high-overlap pair worth merging is `story` (~62%); everything else earns its
separate file by looking genuinely different. Harmonisation should target shared
**behaviour**, not collapse the designs.

## Code-quality hotspots
| LOC | File | Note |
|---:|---|---|
| 735 | `shared/booking-widget.tsx` | 6 section components in one file → split per component |
| 370 | `shared/shop-checkout.tsx` | large stateful form → extract sub-components |
| 288 | `restaurant/hero.tsx` | heavy inline motion |
| 272 | `handwerk/hero.tsx` | heavy inline motion |
| 257 | `hotel/hero.tsx` | heavy inline motion |

- **`useInView` reveal boilerplate is repeated in 68 files** — the single biggest
  mechanical repetition. A shared `useReveal()` hook (ref + inView with the
  standard `{ once: true, margin: '-80px' }`) would remove ~3 lines × 68.
- **FAQ accordion logic re-implemented in 10 files** — a shared `<FaqAccordion>`
  (state + a11y, styling via props/children) removes the behavioural copy.

## Prioritised plan

**Safe / low-risk (no visual change expected):**
1. Split `shared/booking-widget.tsx` into one file per exported section
   (pure code move + re-export; tsc + section-color codegen verify resolution).
2. Add `useReveal()` to `templates/shared` and adopt it incrementally.

**Behaviour harmonisation (touches rendering → verify visually first):**
3. Shared `<FaqAccordion>` consumed by the 9 industry FAQ templates.
4. Merge the `story` variants (~62% overlap) behind one component + styleVariant.

**Enhancement ("aufwerten") — design work, needs visual review:**
5. Standardise motion/easing via the shared reveal hook for a consistent feel.
6. Audit spacing/typography rhythm per section against a shared scale.

> Items 3–6 change rendered output. Because this environment can't render/screenshot,
> they should land behind the visual-regression harness (see docs notes) so each
> change is diffed against the demo tenants before merge.
