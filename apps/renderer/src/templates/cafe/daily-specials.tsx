'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Special = { title: string; description: string; price?: string; day?: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function DailySpecialsSection({ data }: Props) {
  const headline = (data.headline as string) || 'Wochenkarte';
  const subline = (data.subline as string) || '';
  const specials = (data.specials as Special[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-amber-50/50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
          <Sparkles className="mx-auto text-[var(--token-accent)] mb-3" size={24} />
          <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-[color:var(--token-muted)] mt-2" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <div className="space-y-4">
          {specials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-[var(--token-card-bg)] rounded-lg p-5 border border-[var(--token-accent)] shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl"
             data-edit-collection="specials" data-edit-index={i}>
              {item.day && (
                <span className="text-xs font-bold uppercase text-[var(--token-accent)] bg-[var(--token-accent)] px-2.5 py-1 rounded-full whitespace-nowrap">{item.day}</span>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{item.title}</h3>
                <p className="text-sm text-[color:var(--token-muted)] mt-0.5" data-edit-path="description">{plain(item.description)}</p>
              </div>
              {item.price && <span className="font-bold text-[color:var(--token-price)] whitespace-nowrap" data-edit-path="price">{item.price}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
