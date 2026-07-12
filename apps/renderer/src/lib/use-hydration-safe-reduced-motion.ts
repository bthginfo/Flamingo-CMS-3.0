'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Framer Motion reads matchMedia synchronously in the browser but has no
 * preference during SSR. Defer the preference until after hydration so the
 * server and the first client render always produce the same motion markup.
 */
export function resolveHydrationSafeReducedMotion(
  mounted: boolean,
  prefersReducedMotion: boolean | null,
): boolean {
  return mounted && Boolean(prefersReducedMotion);
}

export function useHydrationSafeReducedMotion(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return resolveHydrationSafeReducedMotion(mounted, prefersReducedMotion);
}
