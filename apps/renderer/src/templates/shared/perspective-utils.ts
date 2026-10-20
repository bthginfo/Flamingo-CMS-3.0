import { safeContentUrl } from '@/lib/safe-content-url';

export type PerspectiveAction = { label?: string; href?: string };

export function copy(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Keep the authored index even when an API payload contains a malformed row. */
export function sourceRows<T extends object>(value: unknown): { item: T; sourceIndex: number }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, sourceIndex) => item && typeof item === 'object' && !Array.isArray(item)
    ? [{ item: item as T, sourceIndex }]
    : []);
}

export function stringRows(value: unknown): { value: string; sourceIndex: number }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, sourceIndex) => typeof item === 'string' && item.trim()
    ? [{ value: item, sourceIndex }]
    : []);
}

export function imageUrl(value: unknown): string {
  const url = safeContentUrl(copy(value));
  return url.startsWith('/') || url.startsWith('https://') ? url : '';
}

export function action(value: unknown): PerspectiveAction {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const item = value as Record<string, unknown>;
  return { label: copy(item.label), href: safeContentUrl(copy(item.href)) };
}

export function nativeId(value: unknown): string | undefined {
  const id = copy(value).trim();
  return id && /^[\p{L}\p{N}_][\p{L}\p{N}_.:-]*$/u.test(id) ? id : undefined;
}
