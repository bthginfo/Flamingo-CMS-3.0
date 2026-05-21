'use client';

import { motion } from 'framer-motion';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type PriceItem = { label: string; value: string; note?: string };

export function PricingInfoSection({ data }: Props) {
  const headline = (data.headline as string) || 'Preise & Konditionen';
  const subline = (data.subline as string) || '';
  const items = (data.items as PriceItem[]) || [];
  const notes = (data.notes as string[]) || [];

  return (
    <section className="py-20 px-6 bg-neutral-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{headline}</h2>
          {subline && <p className="mt-3 text-white/50">{subline}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <p className="text-white/50 text-sm uppercase tracking-wider">{item.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{item.value}</p>
              {item.note && <p className="text-white/30 text-xs mt-2">{item.note}</p>}
            </motion.div>
          ))}
        </div>

        {notes.length > 0 && (
          <div className="mt-10 space-y-2 text-sm text-white/40">
            {notes.map((n, i) => <p key={i}>• {n}</p>)}
          </div>
        )}
      </div>
    </section>
  );
}
