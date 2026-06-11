'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { plain } from '@/lib/strip-html';

type FoodItem = { name: string; description?: string; price: string; image?: string; badge?: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FoodMenuSection({ data }: Props) {
  const headline = typeof data.headline === 'string' ? data.headline : 'Speisen & Snacks';
  const subline = (data.subline as string) || '';
  const items = (data.items as FoodItem[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-[color:var(--token-muted)] mt-3" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="bg-[var(--token-card-bg)] rounded-xl border border-[color:var(--token-card-border)] overflow-hidden group hover:shadow-md transition-shadow"
             data-edit-collection="items" data-edit-index={i}>
              {item.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image data-edit-image="image" src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-amber-600 text-[color:var(--token-on-dark-heading)] text-[10px] font-bold px-2.5 py-1 rounded-full" data-edit-path="badge">{item.badge}</span>
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{item.name}</h3>
                  <span className="font-bold text-[color:var(--token-icon)] whitespace-nowrap" data-edit-path="price">{item.price}</span>
                </div>
                {item.description && <p className="text-sm text-[color:var(--token-muted)] mt-1.5" data-edit-path="description">{plain(item.description)}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
