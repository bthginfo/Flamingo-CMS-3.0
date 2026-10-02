import { ApiRequestBodyError } from './api-request-body';

export function collectionItemSlug(title: string, supplied?: string): string {
  const slug = supplied ?? title.normalize('NFKC').trim().toLowerCase().replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '');
  if (!/^[\p{L}\p{N}_-]{1,255}$/u.test(slug)) {
    throw new ApiRequestBodyError('COLLECTION_ITEM_INVALID', 'Provide a URL-safe slug when the title has no letters or numbers.');
  }
  return slug;
}

export function validateCollectionItemInput(body: Record<string, unknown>, creating = false): void {
  const invalid = (field: string, expected: string): never => { throw new ApiRequestBodyError('COLLECTION_ITEM_INVALID', `${field} ${expected}`); };
  if ((creating || body.title !== undefined) && (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 255)) invalid('title', 'must be a non-empty string of at most 255 characters.');
  if (body.slug !== undefined && (typeof body.slug !== 'string' || !/^[\p{L}\p{N}_-]{1,255}$/u.test(body.slug))) invalid('slug', 'must be one URL-safe path segment.');
  if (body.published !== undefined && typeof body.published !== 'boolean') invalid('published', 'must be a boolean.');
  if (body.priority !== undefined && (!Number.isInteger(body.priority) || (body.priority as number) < -2147483648 || (body.priority as number) > 2147483647)) invalid('priority', 'must be a 32-bit integer.');
  if (body.data !== undefined) {
    if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) invalid('data', 'must be an object.');
    const sections = (body.data as Record<string, unknown>).sections;
    if (sections !== undefined && !Array.isArray(sections)) invalid('data.sections', 'must be an array.');
  }
}
