const BLOCKED_PATH_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor']);
const MAX_PREVIEW_PATH_SEGMENTS = 32;
const MAX_PREVIEW_ARRAY_INDEX = 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parsePreviewEditPath(path: unknown): string[] | null {
  if (typeof path !== 'string' || path.length === 0 || path.length > 512) return null;
  const segments = path.split('.');
  if (segments.length === 0 || segments.length > MAX_PREVIEW_PATH_SEGMENTS) return null;
  if (segments.some(segment => {
    if (segment.length === 0 || BLOCKED_PATH_SEGMENTS.has(segment)) return true;
    return /^\d+$/.test(segment) && Number(segment) > MAX_PREVIEW_ARRAY_INDEX;
  })) return null;
  return segments;
}

export function previewValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
    return left.every((entry, index) => previewValuesEqual(entry, right[index]));
  }
  if (isRecord(left) || isRecord(right)) {
    if (!isRecord(left) || !isRecord(right)) return false;
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) return false;
    return leftKeys.every(key => Object.hasOwn(right, key) && previewValuesEqual(left[key], right[key]));
  }
  return false;
}

export function readPreviewValueAtPath(root: unknown, segments: readonly string[]): unknown {
  let current = root;
  for (const segment of segments) {
    if (current === null || typeof current !== 'object') return undefined;
    if (!Object.hasOwn(current, segment)) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function setPreviewValueAtPath(root: unknown, segments: readonly string[], value: unknown): Record<string, unknown> | unknown[] {
  const [head, ...rest] = segments;
  if (rest.length === 0) {
    if (Array.isArray(root)) {
      const index = Number(head);
      if (!Number.isSafeInteger(index) || index < 0) return root;
      const copy = [...root];
      copy[index] = value;
      return copy;
    }
    return { ...(isRecord(root) ? root : {}), [head]: value };
  }

  const existing = root !== null && typeof root === 'object'
    ? (root as Record<string, unknown>)[head]
    : undefined;
  const nextNeedsArray = /^\d+$/.test(rest[0]);
  const child = nextNeedsArray
    ? (Array.isArray(existing) ? existing : [])
    : (isRecord(existing) ? existing : {});
  const nextChild = setPreviewValueAtPath(child, rest, value);

  if (Array.isArray(root)) {
    const index = Number(head);
    if (!Number.isSafeInteger(index) || index < 0) return root;
    const copy = [...root];
    copy[index] = nextChild;
    return copy;
  }
  return { ...(isRecord(root) ? root : {}), [head]: nextChild };
}

export function patchPreviewSectionData(
  base: Record<string, unknown>,
  path: unknown,
  value: unknown,
): Record<string, unknown> | null {
  const segments = parsePreviewEditPath(path);
  if (!segments) return null;
  if (previewValuesEqual(readPreviewValueAtPath(base, segments), value)) return null;
  return setPreviewValueAtPath(base, segments, value) as Record<string, unknown>;
}
