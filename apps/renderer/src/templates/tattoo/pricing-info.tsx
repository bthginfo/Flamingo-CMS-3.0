'use client';

import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type PriceItem = { label: string; value: string; note?: string };

export function PricingInfoSection({ data }: Props) {
  const headline = (data.headline as string) || 'Preise & Konditionen';
  const subline = (data.subline as string) || '';
  const items = (data.items as PriceItem[]) || [];
  const notes = (data.notes as string[]) || [];

  return (
    <section className="py-20 px-6 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)]" data-edit-path="subline">{plain(subline)}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-[color-mix(in_srgb,var(--token-card-bg)_5%,transparent)] border border-[color:color-mix(in_srgb,var(--token-card-border)_10%,transparent)] rounded-lg p-6 text-center" data-edit-collection="items" data-edit-index={i}>
              <p className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] text-sm uppercase tracking-wider" data-edit-path="label">{item.label}</p>
              <p className="text-3xl font-bold text-[color:var(--token-on-dark-heading)] mt-2" data-edit-path="value">{item.value}</p>
              {item.note && <p className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_30%,transparent)] text-xs mt-2" data-edit-path="note">{item.note}</p>}
            </motion.div>
          ))}
        </div>

        {notes.length > 0 && (
          <div className="mt-10 space-y-2 text-sm text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_40%,transparent)]">
            {notes.map((n, i) => <p key={i} data-edit-collection="notes" data-edit-index={i}>• {n}</p>)}
          </div>
        )}
      </div>
    </section>
  );
}
