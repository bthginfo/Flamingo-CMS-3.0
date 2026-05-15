'use client';

import { baseHeader, IconRows, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type ValueItem = { icon?: string; title?: string; text?: string };

export function ValuesGridSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Unser Ansatz', 'Werte');
  const items = asList<ValueItem>(data.items);
  return <div><SectionHeader {...header} /><div className="grid gap-6 md:grid-cols-3">{items.map((item, index) => <article key={`${item.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]"><IconRows items={[item]} /></article>)}</div></div>;
}
