'use client';

import { useSyncExternalStore } from 'react';

/**
 * The external store reacts to preference changes without remounting content.
 * getServerSnapshot also supplies the first client hydration render.
 */
export function resolveHydrationSafeReducedMotion(
  mounted: boolean,
  prefersReducedMotion: boolean | null,
): boolean {
  return mounted && Boolean(prefersReducedMotion);
}

export function useHydrationSafeReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

const query = '(prefers-reduced-motion: reduce)';

export function getReducedMotionSnapshot(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
}

export function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
