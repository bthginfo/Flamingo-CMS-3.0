'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type DownloadItem = { title?: string; text?: string; fileLabel?: string; fileHref?: string; metaLabel?: string };

export function DownloadFormsSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Formulare', 'Downloads');
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
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg" data-edit-collection="items" data-edit-index={index}>
            <Download size={22} className="text-teal-700" />
            {item.metaLabel && <p className="mt-4 text-xs font-bold uppercase tracking-widest text-teal-700">{item.metaLabel}</p>}
            <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.fileLabel && <a href={item.fileHref || '#'} className="mt-5 inline-flex font-semibold text-teal-700">{item.fileLabel}</a>}
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
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border border-black/10 bg-[var(--token-card-bg)] p-5" data-edit-collection="items" data-edit-index={index}>
            <Download size={22} className="text-blue-500" />
            {item.metaLabel && <p className="mt-4 text-xs font-light uppercase tracking-widest text-blue-500">{item.metaLabel}</p>}
            <h3 className="mt-2 text-xl font-light text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-3 text-sm font-light leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.fileLabel && <a href={item.fileHref || '#'} className="mt-5 inline-flex font-semibold text-blue-600">{item.fileLabel}</a>}
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
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${index}`} className="border-2 border-[#111827] bg-[var(--token-card-bg)] p-5 shadow-[4px_4px_0_#111827]" data-edit-collection="items" data-edit-index={index}>
            <Download size={22} className="text-teal-400" />
            {item.metaLabel && <p className="mt-4 text-xs font-black uppercase tracking-widest text-teal-500">{item.metaLabel}</p>}
            <h3 className="mt-2 text-xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
            {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />}
            {item.fileLabel && <a href={item.fileHref || '#'} className="mt-5 inline-flex font-black uppercase text-teal-400">{item.fileLabel}</a>}
          </article>
        ))}
      </div>
    </div>
  );
}
