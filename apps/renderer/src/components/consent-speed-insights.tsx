'use client';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { useConsent } from '@/lib/consent';

export function ConsentSpeedInsights() {
  const { ready, consent } = useConsent();
  if (!ready || !consent.analytics) return null;
  return <SpeedInsights />;
}
