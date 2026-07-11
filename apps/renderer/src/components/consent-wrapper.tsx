'use client';

import { useEffect } from 'react';
import { ConsentProvider } from '@/lib/consent';
import { CookieBanner } from '@/components/cookie-banner';
import { ConsentSpeedInsights } from '@/components/consent-speed-insights';

export function ConsentWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.flamingoHydrated = 'true';
    return () => { delete document.documentElement.dataset.flamingoHydrated; };
  }, []);

  return (
    <ConsentProvider>
      {children}
      <CookieBanner />
      <ConsentSpeedInsights />
    </ConsentProvider>
  );
}
