'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type LogoItem = { name: string; image?: string };

export function LogoMarqueeSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as LogoItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div ref={ref} className="overflow-hidden -mx-6 md:-mx-12 lg:-mx-20 py-8">
      {(headline || subline) && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }} className="text-center mb-8 px-6">
          {headline && <p className="text-sm font-medium uppercase tracking-widest text-[color:var(--token-body)]" data-edit-path="headline">{headline}</p>}
          {subline && <p className="text-xs text-[color:var(--token-body)] mt-1" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[color:var(--token-section-bg,var(--token-page-bg))] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[color:var(--token-section-bg,var(--token-page-bg))] to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div className="flex items-center gap-12 animate-scroll-x" style={{ animationDuration: '35s' }}>
            {doubled.map((item, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-12 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0" data-edit-collection="doubled" data-edit-index={i}>
                {item.image ? (
                  <img data-edit-image="image" src={item.image} alt={item.name} className="h-8 md:h-10 w-auto object-contain" />
                ) : (
                  <span className="text-lg font-bold text-[color:var(--token-body)] whitespace-nowrap" data-edit-path="name">{item.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-scroll-x { animation: scroll-x linear infinite; }
      `}</style>
    </div>
  );
}
