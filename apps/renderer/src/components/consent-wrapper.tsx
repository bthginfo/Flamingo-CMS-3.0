'use client';

import { ConsentProvider } from '@/lib/consent';
import { CookieBanner } from '@/components/cookie-banner';

export function ConsentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      {children}
      <CookieBanner />
    </ConsentProvider>
  );
}
