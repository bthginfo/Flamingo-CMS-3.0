/**
 * Programmatic scroll-to-top that cooperates with the global Lenis smooth-scroll.
 *
 * Plain `window.scrollTo` does NOT work reliably while Lenis is active because
 * Lenis overrides wheel/scroll behaviour and keeps its own internal position.
 * We expose the Lenis instance on `window.__lenis` from SmoothScroll and use
 * its `scrollTo(0, { immediate: true })` here.
 */
export function scrollToTop(opts: { smooth?: boolean } = {}): void {
  if (typeof window === 'undefined') return;
  const lenis = (window as any).__lenis as { scrollTo?: (t: number | string | HTMLElement, o?: any) => void } | undefined;
  if (lenis?.scrollTo) {
    lenis.scrollTo(0, { immediate: !opts.smooth, force: true });
    return;
  }
  // Fallback for reduced-motion users (Lenis is disabled there).
  try {
    window.scrollTo({ top: 0, left: 0, behavior: opts.smooth ? 'smooth' : 'auto' });
  } catch {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}
