'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Wraps the app so EVERY framer-motion animation honours the visitor's
 * `prefers-reduced-motion` setting. With `reducedMotion="user"`, transform/layout
 * animations are skipped (opacity still fades) for users who asked for reduced
 * motion — without touching the 180+ section files individually. The CSS
 * counterpart (for plain transitions) lives in globals.css.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
