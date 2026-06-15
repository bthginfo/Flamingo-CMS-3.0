/**
 * APPEARANCE RESOLVER — One resolver, one application point.
 *
 * Deterministic: every slot ALWAYS gets a concrete color value.
 * No undefined, no var() chains, no CSS fallbacks.
 *
 * Resolution order per slot:
 *   1. Section override (from CMS styleOverrides)
 *   2. Brand value (from tenant design settings)
 *   3. Inherited slot value (recursive via `inheritsFrom`)
 *   4. Registry default (always present for root tokens)
 */
import { COLOR_TOKENS, ALL_SLOTS, type ColorSlot, type Appearance } from './registry';

/**
 * Resolve a fully-populated Appearance from brand defaults and per-section overrides.
 *
 * @param brand     Brand-level color values (from tenant design settings).
 * @param overrides Per-section CMS overrides (from section.styleOverrides, already migrated).
 * @returns         A frozen Appearance object with every slot populated.
 */
export function resolveAppearance(
  brand: Partial<Record<ColorSlot, string>> = {},
  overrides: Partial<Record<ColorSlot, string>> = {},
): Appearance {
  const out = {} as Record<ColorSlot, string>;

  const resolve = (slot: ColorSlot, seen: Set<ColorSlot>): string => {
    // 1. Section override
    const o = overrides[slot]?.trim();
    if (o) return o;

    // 2. Brand value
    const b = brand[slot]?.trim();
    if (b) return b;

    // 3. Inheritance chain
    const def = COLOR_TOKENS[slot];
    if (def.inheritsFrom) {
      if (seen.has(slot)) throw new Error(`Color token inheritance cycle at "${slot}"`);
      return resolve(def.inheritsFrom as ColorSlot, new Set(seen).add(slot));
    }

    // 4. Registry default (guaranteed for root tokens by validateRegistry)
    return def.default!;
  };

  for (const slot of ALL_SLOTS) {
    out[slot] = resolve(slot, new Set());
  }

  return Object.freeze(out);
}

/**
 * Convert a resolved Appearance to CSS custom property assignments.
 * Caller spreads this into the section's inline style.
 */
export function appearanceToCssVars(appearance: Appearance): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const slot of ALL_SLOTS) {
    vars[COLOR_TOKENS[slot].cssVar] = appearance[slot];
  }
  return vars;
}
