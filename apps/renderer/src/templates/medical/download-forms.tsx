'use client';

import { Download } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type DownloadItem = { title?: string; text?: string; fileLabel?: string; fileHref?: string; metaLabel?: string };

export function DownloadFormsSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Formulare', 'Downloads');
  const items = asList<DownloadItem>(data.items);
  return <div><SectionHeader {...header} /><div className="grid gap-4 md:grid-cols-3">{items.map((item, index) => <article key={`${item.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]"><Download size={22} />{item.metaLabel && <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{item.metaLabel}</p>}<h3 className="mt-2 text-xl font-bold text-[var(--style-text-primary)]">{item.title || ''}</h3>{item.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}{item.fileLabel && <a href={item.fileHref || '#'} className="mt-5 inline-flex font-semibold text-[var(--style-text-primary)]">{item.fileLabel}</a>}</article>)}</div></div>;
}
