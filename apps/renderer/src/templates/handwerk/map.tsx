'use client';

import { AnimateOnScroll } from '@/components/animate';

type Props = { data: Record<string, unknown>; variant?: string | null };

const HEIGHT: Record<string, string> = { s: 'h-64', m: 'h-96', l: 'h-[500px]' };

export function MapSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const embedUrl = (data.embedUrl as string) || '';
  const height = HEIGHT[(data.height as string) || 'm'] || HEIGHT.m;

  return (
    <AnimateOnScroll>
      {headline && <h2 className="section-headline mb-8">{headline}</h2>}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className={`w-full ${height} border-0`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Standort"
          />
        ) : (
          <div className={`w-full ${height} bg-surface flex items-center justify-center text-gray-400`}>
            Karte nicht konfiguriert
          </div>
        )}
      </div>
    </AnimateOnScroll>
  );
}
