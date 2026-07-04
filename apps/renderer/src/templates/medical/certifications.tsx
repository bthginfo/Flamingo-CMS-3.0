'use client';

import { motion } from 'framer-motion';
import { baseHeader, SectionHeader, IconRows, asList } from './shared';
import type { SectionProps } from './types';

type Certification = { icon?: string; title?: string; text?: string; metaLabel?: string };

export function CertificationsSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Qualifikationen', 'Zertifikate');
  const items = asList<Certification>(data.items);

  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Certification[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg" data-edit-collection="items" data-edit-index={index}>
            {item.metaLabel && <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--token-success)]">{item.metaLabel}</p>}
            <IconRows items={[item]} />
          </article>
        ))}
      </motion.div>
    </div>
  );
}

