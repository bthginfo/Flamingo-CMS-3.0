import { z } from 'zod';

/**
 * Recursive schema for section data.
 * Allows strings, numbers, booleans, null, arrays, and nested objects.
 * Strings are limited to 50KB to prevent abuse.
 */
const JsonValue: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string().max(50000),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonValue),
    z.record(z.string(), JsonValue),
  ])
);

/** Schema for section data — a flat JSON object with safe values. */
export const sectionDataSchema = z.record(z.string().max(100), JsonValue).refine(
  (obj) => JSON.stringify(obj).length < 500_000,
  { message: 'Section data exceeds maximum size (500KB)' }
);

/** Validate and return cleaned section data. Throws on invalid input. */
export function validateSectionData(data: unknown): Record<string, unknown> {
  return sectionDataSchema.parse(data) as Record<string, unknown>;
}
