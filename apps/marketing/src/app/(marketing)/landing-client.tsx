'use client';

import type { ReactNode } from 'react';
import { Landing } from '@/showcase/AgencyShowcase';

export function LandingPage({ children }: { children?: ReactNode }) {
  return <Landing newsSlot={children} />;
}
