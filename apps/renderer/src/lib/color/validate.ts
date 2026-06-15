/**
 * COLOR SYSTEM VALIDATION — Build-time and dev-time guards.
 *
 * - validateRegistry(): ensures no broken inheritance or missing defaults
 * - validateContract(): ensures a section only declares known slots
 */
import { COLOR_TOKENS, ALL_SLOTS, type ColorSlot } from './registry';

/**
 * Validate the COLOR_TOKENS registry for structural integrity.
 * Returns an array of error messages (empty = valid).
 *
 * Checks:
 * - Root tokens (inheritsFrom: null) must have a `default` value
 * - Non-root tokens must reference existing slots
 * - No circular inheritance
 */
export function validateRegistry(): string[] {
  const errors: string[] = [];
  const slotSet = new Set<string>(ALL_SLOTS);

  for (const [id, def] of Object.entries(COLOR_TOKENS)) {
    // Root tokens need a default
    if (def.inheritsFrom === null && !def.default) {
      errors.push(`Slot "${id}" is a root token (inheritsFrom: null) but has no default value.`);
    }

    // Non-root tokens must reference valid slots
    if (def.inheritsFrom && !slotSet.has(def.inheritsFrom)) {
      errors.push(`Slot "${id}" inherits from unknown slot "${def.inheritsFrom}".`);
    }
  }

  // Check for circular inheritance
  for (const startSlot of ALL_SLOTS) {
    const visited = new Set<string>();
    let current: string | null = startSlot;
    while (current) {
      if (visited.has(current)) {
        errors.push(`Circular inheritance detected: ${[...visited, current].join(' → ')}`);
        break;
      }
      visited.add(current);
      current = COLOR_TOKENS[current as ColorSlot]?.inheritsFrom ?? null;
    }
  }

  return errors;
}

/**
 * Validate that a section contract only declares known slots.
 * Returns error messages for unknown slots (empty = valid).
 */
export function validateContract(sectionType: string, declaredSlots: string[]): string[] {
  const slotSet = new Set<string>(ALL_SLOTS);
  return declaredSlots
    .filter(s => !slotSet.has(s))
    .map(s => `Section "${sectionType}" declares unknown color slot "${s}".`);
}

/**
 * Validate that a set of overrides only contains known slot keys.
 * Returns error messages for unknown keys (empty = valid).
 */
export function validateOverrides(overrides: Record<string, unknown>): string[] {
  const slotSet = new Set<string>(ALL_SLOTS);
  return Object.keys(overrides)
    .filter(k => !slotSet.has(k))
    .map(k => `Unknown override key "${k}" — not a registered color slot.`);
}
