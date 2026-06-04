'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, IconRows, asList } from './shared';
import type { SectionProps } from './types';

type Certification = { icon?: string; title?: string; text?: string; metaLabel?: string };

export function CertificationsSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Qualifikationen', 'Zertifikate');
  const items = asList<Certification>(data.items);

  if (styleVariant === 'modern') return <Modern header={header} items={items} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} />;
  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: Certification[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-xl bg-[var(--token-card-bg,#ffffff)] p-5 shadow-lg">
            {item.metaLabel && <p className="mb-3 text-xs font-bold uppercase tracking-widest text-teal-700">{item.metaLabel}</p>}
            <IconRows items={[item]} />
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function Modern({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border border-black/10 bg-[var(--token-card-bg,#ffffff)] p-5">
            {item.metaLabel && <p className="mb-3 text-xs font-light uppercase tracking-widest text-blue-500">{item.metaLabel}</p>}
            <IconRows items={[item]} />
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, items }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading,#18181b)] sm:text-3xl md:text-5xl">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-2 border-[#111827] bg-[var(--token-card-bg,#ffffff)] p-5 shadow-[4px_4px_0_#111827]">
            {item.metaLabel && <p className="mb-3 text-xs font-black uppercase tracking-widest text-teal-500">{item.metaLabel}</p>}
            <IconRows items={[item]} />
          </article>
        ))}
      </div>
    </div>
  );
}
