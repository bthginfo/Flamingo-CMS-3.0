import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Mounts a global Lenis smooth-scroll instance and keeps it in sync with rAF.
 * Disabled automatically for users with prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    // Expose for programmatic scrollTo helpers (lib/scroll.ts).
    (window as any).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if ((window as any).__lenis === lenis) delete (window as any).__lenis;
    };
  }, []);
  return null;
}
