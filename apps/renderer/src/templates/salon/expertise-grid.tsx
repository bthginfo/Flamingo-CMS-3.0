'use client';

import { baseHeader, IconRows, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Expertise = { icon?: string; title?: string; text?: string; metaLabel?: string };

export function ExpertiseGridSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Expertise', 'Skills');
  const items = asList<Expertise>(data.items);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{items.map((item, index) => <article key={`${item.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]">{item.metaLabel && <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{item.metaLabel}</p>}<IconRows items={[item]} /></article>)}</div></div>;
}
