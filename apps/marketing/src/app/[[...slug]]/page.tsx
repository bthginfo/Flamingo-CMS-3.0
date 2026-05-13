'use client';

import dynamic from 'next/dynamic';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SmoothScroll } from '@/components/SmoothScroll';

// Dynamic import to avoid SSR issues with react-router-dom and browser APIs
const AgencyShowcase = dynamic(() => import('@/showcase/AgencyShowcase'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen grid place-items-center text-slate-500">Lädt …</div>
  ),
});

export default function MarketingPage() {
  return (
    <BrowserRouter>
      <SmoothScroll />
      <AgencyShowcase />
      <Toaster position="top-right" richColors closeButton expand={false} />
    </BrowserRouter>
  );
}
