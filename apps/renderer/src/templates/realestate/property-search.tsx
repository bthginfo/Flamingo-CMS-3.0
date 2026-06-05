'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, LayoutGrid, Building2, Home, Landmark, ArrowRight } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Category = { label: string; href?: string; icon?: string; count?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PropertySearchSection({ data }: Props) {
  const headline = (data.headline as string) || 'Ihre Traumimmobilie finden';
  const subline = (data.subline as string) || '';
  const categories = (data.categories as (string | Category)[]) || ['Kaufen', 'Mieten'];
  const collectionKey = (data.collectionKey as string) || 'objekte';
  const ctaLabel = (data.ctaLabel as string) || 'Alle Objekte anzeigen';
  const ctaHref = (data.ctaHref as string) || `/c/${collectionKey}`;
  const bgColor = (data.bgColor as string) || '';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [activeCategory, setActiveCategory] = useState(0);

  // Normalize categories — support both string[] and object[]
  const normalizedCategories: Category[] = categories.map(cat =>
    typeof cat === 'string' ? { label: cat } : cat
  );

  const defaultIcons = [LayoutGrid, Home, Building2, Landmark];

  return (
    <section ref={ref} className="py-16 md:py-20" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-2 text-[color:var(--token-muted,#52525b)]" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {normalizedCategories.map((cat, i) => {
            const Icon = defaultIcons[i % defaultIcons.length];
            return (
              <a
                key={i}
                href={cat.href || ctaHref}
                className={`group relative flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-lg hover:border-[var(--token-card-border,var(--brand-primary,#1a5276))/30] ${i === activeCategory ? 'border-[var(--token-card-border,var(--brand-primary,#1a5276))/40] bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/5]' : 'border-[color:var(--token-card-border,#e4e4e7)] bg-[var(--token-card-bg,#ffffff)]'}`}
                onMouseEnter={() => setActiveCategory(i)}
              >
                <div className="rounded-full bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] p-3 text-[color:var(--token-icon,var(--brand-primary,#1a5276))] group-hover:bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] group-hover:text-[color:var(--token-on-dark-heading,#ffffff)] transition-colors">
                  <Icon size={24} />
                </div>
                <span className="font-semibold text-[color:var(--token-heading,#18181b)]" data-edit-path="label">{cat.label}</span>
                {cat.count && <span className="text-xs text-[color:var(--token-muted,#71717a)]">{cat.count}</span>}
                <ArrowRight size={16} className="absolute top-4 right-4 text-[color:var(--token-body,#d4d4d8)] group-hover:text-[color:var(--token-icon,var(--brand-primary,#1a5276))] transition-colors" />
              </a>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }} className="mt-8 text-center">
          <a href={ctaHref} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] text-[color:var(--token-on-dark-heading,#ffffff)] font-semibold rounded-lg hover:bg-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))] transition-colors">
            <Search size={18} />
            <span data-edit-path="ctaLabel">{ctaLabel}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
