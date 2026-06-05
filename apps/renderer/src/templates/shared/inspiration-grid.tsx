'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { plain } from '@/lib/strip-html';

type InspirationItem = {
  image?: string;
  title?: string;
  href?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null };

export function InspirationGridSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as InspirationItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <div className="text-center mb-10">
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--token-heading-weight,700)] tracking-[var(--token-heading-tracking,-0.02em)] text-[var(--token-body)]" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-3 text-[var(--token-body)] text-lg max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.a
            key={i}
            href={item.href || '#'}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative aspect-[3/4] md:aspect-square rounded-[var(--token-card-radius)] overflow-hidden ring-2 ring-transparent hover:ring-[var(--token-icon)] transition-all duration-300"
           data-edit-collection="items" data-edit-index={i}>
            {item.image ? (
              <img data-edit-image="image" src={item.image} alt={item.title || ''} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[var(--token-section-bg-alt)/0] group-hover:bg-[var(--token-section-bg-alt)/40] transition-colors duration-300 flex items-end">
              {item.title && (
                <div className="p-4 md:p-6 w-full translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block w-8 h-0.5 rounded bg-[var(--token-icon)] mb-2" />
                  <h3 className="text-[color:var(--token-on-dark-heading)] font-semibold text-sm md:text-base" data-edit-path="title">{item.title}</h3>
                </div>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
