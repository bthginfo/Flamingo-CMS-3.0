const META_FIELDS = new Set([
  'type', 'definitionKey', 'schemaVersion', 'visible', 'titleInternal', 'variant',
  'container', 'spacingTop', 'spacingBottom', 'anchorId', 'styleOverrides',
]);
const NULLABLE_TEXT = new Set(['definitionKey', 'titleInternal', 'variant', 'anchorId']);

/** Server Actions receive untrusted runtime objects, even with a TS signature. */
export function pickSectionMetadata<T extends Record<string, unknown>>(input: T): T {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid section metadata.');
  const entries = Object.entries(input);
  for (const [key, value] of entries) {
    if (!META_FIELDS.has(key)) throw new Error(`Unsupported section metadata: ${key}.`);
    if (value === undefined) continue;
    if (key === 'visible') {
      if (typeof value !== 'boolean') throw new Error('visible must be a boolean.');
    } else if (key === 'schemaVersion') {
      if (value !== null && (!Number.isSafeInteger(value) || (value as number) < 1)) throw new Error('Invalid schema version.');
    } else if (key !== 'styleOverrides') {
      if (value === null && NULLABLE_TEXT.has(key)) continue;
      if (typeof value !== 'string' || value.length > 500) throw new Error(`Invalid ${key}.`);
    }
  }
  return Object.fromEntries(entries) as T;
}
