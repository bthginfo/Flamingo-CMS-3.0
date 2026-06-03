'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type DrinkItem = { name: string; description?: string; price: string };
type DrinkCategory = { title: string; items: DrinkItem[] };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function DrinkMenuSection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Karte';
  const subline = (data.subline as string) || '';
  const categories = (data.categories as DrinkCategory[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt,#fafafa)]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading,#18181b)]">{headline}</h2>
          {subline && <p className="text-[color:var(--token-muted,#52525b)] mt-3">{plain(subline)}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {categories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: ci * 0.15 }}
            >
              <h3 className="text-lg font-bold text-[color:var(--token-heading,#18181b)] mb-4 pb-2 border-b-2 border-amber-500/30">{cat.title}</h3>
              <ul className="space-y-3">
                {cat.items.map((item, ii) => (
                  <li key={ii} className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-medium text-[color:var(--token-heading,#18181b)] text-sm">{item.name}</span>
                      {item.description && <p className="text-xs text-[color:var(--token-muted,#71717a)] mt-0.5">{plain(item.description)}</p>}
                    </div>
                    <span className="text-sm font-semibold text-[color:var(--token-muted,#3f3f46)] whitespace-nowrap">{item.price}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
