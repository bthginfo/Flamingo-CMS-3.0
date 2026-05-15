'use client';

import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type DownloadItem = { title?: string; text?: string; fileLabel?: string; fileHref?: string; metaLabel?: string };

export function DownloadGuidesSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Karten & Broschueren', 'Downloads');
  const items = asList<DownloadItem>(data.items);

  if (styleVariant === 'modern') return <Modern header={header} items={items} />;
  if (styleVariant === 'bold') return <Bold header={header} items={items} />;
  return <Classic header={header} items={items} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; items: DownloadItem[] };

function Classic({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.article key={`${item.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="rounded-2xl bg-[var(--style-card-bg)] p-5 shadow-lg">
            <Download size={22} className="text-green-700" />
            {item.metaLabel && <p className="mt-4 text-xs font-bold uppercase tracking-widest text-green-700">{item.metaLabel}</p>}
            <h3 className="mt-2 text-xl font-bold text-[var(--style-text-primary)]">{item.title || ''}</h3>
            {item.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
            {item.fileLabel && <a href={item.fileHref || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-green-700">{item.fileLabel}<ArrowRight size={14} /></a>}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Modern({ header, items }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border border-black/10 bg-[var(--style-card-bg)] p-5">
            <Download size={22} className="text-teal-600" />
            {item.metaLabel && <p className="mt-4 text-xs font-light uppercase tracking-widest text-teal-600">{item.metaLabel}</p>}
            <h3 className="mt-2 text-xl font-light text-[var(--style-text-primary)]">{item.title || ''}</h3>
            {item.text && <p className="mt-3 text-sm font-light leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
            {item.fileLabel && <a href={item.fileHref || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-teal-600">{item.fileLabel}<ArrowRight size={14} /></a>}
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
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-text-primary)] sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-[var(--style-text-secondary)]">{header.subline}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] p-5 shadow-[4px_4px_0_var(--style-text-primary)]">
            <Download size={22} className="text-orange-500" />
            {item.metaLabel && <p className="mt-4 text-xs font-black uppercase tracking-widest text-orange-500">{item.metaLabel}</p>}
            <h3 className="mt-2 text-xl font-black uppercase text-[var(--style-text-primary)]">{item.title || ''}</h3>
            {item.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
            {item.fileLabel && <a href={item.fileHref || '#'} className="mt-5 inline-flex items-center gap-2 font-black uppercase text-orange-500">{item.fileLabel}<ArrowRight size={14} /></a>}
          </article>
        ))}
      </div>
    </div>
  );
}
