import { ApiRequestBodyError } from './api-request-body';

export function pageMetadataUpdates(body: Record<string, unknown>): Record<string, string | boolean> {
  const updates: Record<string, string | boolean> = {};
  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 300) {
      throw new ApiRequestBodyError('TITLE_INVALID', 'title must be a non-empty string of at most 300 characters.');
    }
    updates.title = body.title.trim();
  }
  if (body.slug !== undefined) {
    if (typeof body.slug !== 'string') throw new ApiRequestBodyError('SLUG_INVALID', 'slug must be a URL-safe string.');
    const slug = body.slug.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
    if (slug.length > 200 || (slug !== '' && !/^[\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*$/u.test(slug))) {
      throw new ApiRequestBodyError('SLUG_INVALID', 'slug must contain URL-safe path segments without spaces, dots, query strings or fragments.');
    }
    updates.slug = slug;
  }
  if (body.visible !== undefined) {
    if (typeof body.visible !== 'boolean') throw new ApiRequestBodyError('VISIBLE_INVALID', 'visible must be a boolean.');
    updates.visible = body.visible;
  }
  return updates;
}

/** Null resets the complete color map; null values inside an object reset one role. */
export function mergeSectionStylePatch(existing: Record<string, unknown> | null, patch: unknown): Record<string, unknown> | null {
  if (patch === null) return null;
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    throw new ApiRequestBodyError('SECTION_STYLE_INVALID', 'styleOverrides must be an object or null to reset.');
  }
  return { ...(existing || {}), ...patch };
}

const PATCH_SECTION_KEYS = new Set(['id', 'data', 'visible', 'variant', 'styleOverrides', 'definitionKey', 'schemaVersion']);
export function validateSectionPatchKeys(patch: Record<string, unknown>, index: number): void {
  const unknown = Object.keys(patch).filter(key => !PATCH_SECTION_KEYS.has(key));
  if (unknown.length) throw new ApiRequestBodyError('PATCH_SECTION_UNKNOWN_FIELDS', `patchSections[${index}] has unsupported fields: ${unknown.join(', ')}.`);
  if (Object.keys(patch).every(key => key === 'id')) throw new ApiRequestBodyError('PATCH_SECTION_NO_CHANGES', `patchSections[${index}] contains no mutable fields.`);
  if (patch.variant !== undefined && patch.variant !== null && typeof patch.variant !== 'string') {
    throw new ApiRequestBodyError('SECTION_VARIANT_INVALID', 'variant must be a string or null.');
  }
}
