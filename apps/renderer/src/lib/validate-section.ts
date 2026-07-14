import { z } from 'zod';
import { sanitizeHtml } from './sanitize-html';
import { isContentUrlField, safeContentUrl } from './safe-content-url';

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
  return sanitizeValue(sectionDataSchema.parse(data)) as Record<string, unknown>;
}

function sanitizeValue(value: unknown, key = ''): unknown {
  if (typeof value === 'string') {
    if (isContentUrlField(key)) return safeContentUrl(value);
    return /<[a-z][\s\S]*>/i.test(value) ? sanitizeHtml(value) : value;
  }
  if (Array.isArray(value)) return value.map(item => sanitizeValue(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, sanitizeValue(child, childKey)]));
  }
  return value;
}
