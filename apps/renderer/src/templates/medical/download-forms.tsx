'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type DownloadItem = { title?: string; text?: string; fileLabel?: string; fileHref?: string; metaLabel?: string };

export function DownloadFormsSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Formulare', 'Downloads');
  const items = asList<DownloadItem>(data.items);

  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: DownloadItem[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg" data-edit-collection="items" data-edit-index={index}>
            <Download size={22} className="text-[var(--token-success)]" />
            {item.metaLabel && <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[var(--token-success)]">{item.metaLabel}</p>}
            <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.fileLabel && <a href={item.fileHref || '#'} className="mt-5 inline-flex font-semibold text-[var(--token-success)]">{item.fileLabel}</a>}
          </article>
        ))}
      </motion.div>
    </div>
  );
}

