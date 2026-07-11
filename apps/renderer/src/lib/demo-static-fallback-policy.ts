/**
 * Static demo pages are legacy development fixtures. They are intentionally
 * unavailable in production so a missing tenant can never expose stale copy.
 */
export type DemoStaticFallbackEnvironment = Readonly<{
  NODE_ENV?: string;
  DEMO_STATIC_FALLBACK?: string;
}>;

export type DemoStaticFallbackPolicy = Readonly<
  | { enabled: true; reason: 'explicit-development-opt-in' }
  | { enabled: false; reason: 'not-opted-in' | 'blocked-in-production' }
>;

export function getDemoStaticFallbackPolicy(
  env: DemoStaticFallbackEnvironment,
): DemoStaticFallbackPolicy {
  if (env.NODE_ENV === 'production') {
    return { enabled: false, reason: 'blocked-in-production' };
  }

  if (env.DEMO_STATIC_FALLBACK === '1') {
    return { enabled: true, reason: 'explicit-development-opt-in' };
  }

  return { enabled: false, reason: 'not-opted-in' };
}

export const DEMO_UNAVAILABLE_METADATA = {
  title: 'Demo nicht verfügbar',
  robots: {
    index: false,
    follow: false,
  },
} as const;
