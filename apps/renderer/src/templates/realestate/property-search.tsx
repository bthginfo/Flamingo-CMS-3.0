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
          <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-2 text-[color:var(--token-muted)]" data-edit-path="subline">{plain(subline)}</p>}
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
                className={`group relative flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5 ${i === activeCategory ? 'border-[color:color-mix(in_srgb,var(--token-accent)_34%,var(--token-card-border))] bg-[color:color-mix(in_srgb,var(--token-accent)_8%,var(--token-card-bg,#fff))]' : 'border-[color:var(--token-card-border)] bg-[var(--token-card-bg)]'}`}
                onMouseEnter={() => setActiveCategory(i)}
              >
                <div className="rounded-full bg-[color:color-mix(in_srgb,var(--token-accent)_12%,transparent)] p-3 text-[color:var(--token-icon)] transition-colors group-hover:bg-[var(--token-btn-bg)] group-hover:text-[color:var(--token-btn-text)]">
                  <Icon size={24} />
                </div>
                <span className="font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{cat.label}</span>
                {cat.count && <span className="text-xs text-[color:var(--token-muted)]">{cat.count}</span>}
                <ArrowRight size={16} className="absolute top-4 right-4 text-[color:var(--token-body)] group-hover:text-[color:var(--token-icon)] transition-colors" />
              </a>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }} className="mt-8 text-center">
          <a href={ctaHref} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <Search size={18} />
            <span data-edit-path="ctaLabel">{ctaLabel}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
