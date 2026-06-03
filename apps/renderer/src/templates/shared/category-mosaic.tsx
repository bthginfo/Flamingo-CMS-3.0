'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { plain } from '@/lib/strip-html';

type Category = {
  image?: string;
  title: string;
  href?: string;
  size?: 'large' | 'small';
};

type Props = { data: Record<string, unknown>; variant?: string | null };

export function CategoryMosaicSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as Category[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  // Split into large and small
  const largeItems = items.filter(i => i.size === 'large').slice(0, 2);
  const smallItems = items.filter(i => i.size !== 'large');
  // If no size specified, auto-assign: first 2 = large, rest = small
  const displayLarge = largeItems.length > 0 ? largeItems : items.slice(0, 2);
  const displaySmall = largeItems.length > 0 ? smallItems : items.slice(2);

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <div className="text-center mb-10">
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--style-heading-weight,700)] tracking-[var(--style-heading-tracking,-0.02em)] text-[var(--style-text-primary,#0f172a)]">{headline}</h2>}
          {subline && <p className="mt-3 text-[var(--style-text-secondary,#64748b)] text-lg max-w-2xl mx-auto">{plain(subline)}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
        {displayLarge.map((item, i) => (
          <motion.a
            key={`lg-${i}`}
            href={item.href || '#'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative col-span-2 row-span-2 rounded-[var(--style-card-radius,1rem)] overflow-hidden group ring-2 ring-transparent hover:ring-[var(--token-icon, var(--brand-primary,var(--style-brand,#2563eb)))] transition-all duration-300"
          >
            {item.image ? (
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-[var(--token-icon, var(--brand-primary,var(--style-brand,#2563eb)))]" />
              <h3 className="text-white font-display font-bold text-xl md:text-2xl">{item.title}</h3>
            </div>
          </motion.a>
        ))}
        {displaySmall.map((item, i) => (
          <motion.a
            key={`sm-${i}`}
            href={item.href || '#'}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
            className="relative col-span-1 row-span-1 rounded-[var(--style-card-radius,1rem)] overflow-hidden group ring-2 ring-transparent hover:ring-[var(--token-icon, var(--brand-primary,var(--style-brand,#2563eb)))] transition-all duration-300"
          >
            {item.image ? (
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2">
              <span className="w-0.5 h-4 rounded-full bg-[var(--token-icon, var(--brand-primary,var(--style-brand,#2563eb)))]" />
              <h3 className="text-white font-semibold text-sm md:text-base">{item.title}</h3>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
