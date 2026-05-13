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
      {headline && <h2 className="section-headline mb-10">{headline}</h2>}
      <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white p-2">
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
            <div className={`w-full ${height} bg-gradient-to-br from-surface to-gray-100 flex items-center justify-center text-gray-400`}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-gray-200/50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
