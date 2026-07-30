'use client';

import { motion } from 'framer-motion';
import { baseHeader, IconRows, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type ValueItem = { icon?: string; title?: string; text?: string };

export function ValuesGridSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Unser Ansatz', 'Werte');
  const items = asList<ValueItem>(data.items);

  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: ValueItem[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg" data-card data-edit-collection="items" data-edit-index={index}>
            <IconRows items={[item]} />
          </article>
        ))}
      </motion.div>
    </div>
  );
}

