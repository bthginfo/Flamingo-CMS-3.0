'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ConsentGate } from '@/components/consent-gate';
import { safeMapEmbedUrl } from '@/lib/safe-embed-url';

type Props = { data: Record<string, unknown>; variant?: string | null };

const HEIGHT: Record<string, string> = { s: 'h-64', m: 'h-[400px]', l: 'h-[500px]' };

export function MapSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const embedUrl = safeMapEmbedUrl(data.embedUrl || data.mapEmbedUrl);
  const address = (data.address as string) || '';
  const height = HEIGHT[(data.height as string) || 'm'] || HEIGHT.m;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {headline && <h2 className="section-headline mb-4 text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>}
      {address && (
        <p className="mb-8 text-center text-[color:var(--token-muted)]">
          <span data-edit-path="address">{address}</span>
          {' · '}
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="font-medium text-[color:var(--token-link)] hover:text-[color:var(--token-link-hover)] hover:underline">Route planen</a>
        </p>
      )}
      <div className="overflow-hidden rounded-3xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-2 shadow-xl">
        <div className="rounded-2xl overflow-hidden">
          {embedUrl ? (
            <ConsentGate provider="Google Maps" className={`w-full ${height}`}>
              <iframe
                src={embedUrl}
                className="h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Standort"
              />
            </ConsentGate>
          ) : (
            <div className={`flex w-full ${height} items-center justify-center bg-[var(--token-section-bg-alt)] text-[color:var(--token-muted)]`}>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--token-card-bg)]">
                  <svg className="h-8 w-8 text-[color:var(--token-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <p className="text-sm">Karte nicht konfiguriert</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
