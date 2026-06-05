'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Props = { data: Record<string, unknown>; variant?: string | null };

const HEIGHT: Record<string, string> = { s: 'h-64', m: 'h-[400px]', l: 'h-[500px]' };

export function MapSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const embedUrl = (data.embedUrl as string) || '';
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
      {headline && <h2 className="section-headline mb-10 text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,inherit))))]">{headline}</h2>}
      <div className="overflow-hidden rounded-3xl border border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,rgba(0,0,0,0.08))))] bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#ffffff)))] p-2 shadow-xl">
        <div className="rounded-2xl overflow-hidden">
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
            <div className={`flex w-full ${height} items-center justify-center bg-[var(--token-section-bg-alt, var(--token-section-bg-alt, var(--style-section-bg-alt,#f3f4f6)))] text-[var(--token-muted, var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af))))]`}>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,rgba(255,255,255,0.55))))]">
                  <svg className="h-8 w-8 text-[var(--token-muted, var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#9ca3af))))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
