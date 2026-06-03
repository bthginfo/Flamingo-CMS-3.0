'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { plain } from '@/lib/strip-html';

type MaterialItem = {
  image?: string;
  name: string;
  category?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null };

export function MaterialGallerySection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as MaterialItem[]) || [];
  const categories = (data.categories as string[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [activeFilter, setActiveFilter] = useState('Alle');

  const derivedCategories = useMemo(() => {
    if (categories.length > 0) return ['Alle', ...categories];
    const cats = [...new Set(items.map(i => i.category).filter(Boolean))] as string[];
    return ['Alle', ...cats];
  }, [categories, items]);

  const filtered = activeFilter === 'Alle' ? items : items.filter(i => i.category === activeFilter);

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <div className="text-center mb-8">
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--style-heading-weight,700)] tracking-[var(--style-heading-tracking,-0.02em)] text-[var(--style-text-primary,#0f172a)]">{headline}</h2>}
          {subline && <p className="mt-3 text-[var(--style-text-secondary,#64748b)] text-lg max-w-2xl mx-auto">{plain(subline)}</p>}
        </div>
      )}

      {/* Filter Pills */}
      {derivedCategories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {derivedCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                activeFilter === cat
                  ? 'bg-[var(--token-icon, var(--brand-primary,#2563eb))] text-[color:var(--token-on-dark-heading,#ffffff)] border-transparent shadow-md'
                  : 'bg-[var(--token-card-bg,#ffffff)] text-[var(--style-text-secondary,#64748b)] border-[color:var(--token-card-border,#e4e4e7)] hover:border-[var(--token-icon, var(--brand-primary,#2563eb))]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item, i) => (
          <motion.div
            key={`${item.name}-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group"
          >
            <div className="aspect-square rounded-[var(--style-card-radius,1rem)] overflow-hidden bg-[var(--token-section-bg-alt,#f4f4f5)] border border-[rgba(0,0,0,0.06)] shadow-sm group-hover:shadow-lg transition-shadow duration-300">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              )}
            </div>
            <p className="mt-2 text-center text-sm font-medium text-[var(--style-text-primary,#0f172a)] truncate">{item.name}</p>
            {item.category && <p className="text-center text-xs text-[var(--style-text-secondary,#64748b)]">{item.category}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
