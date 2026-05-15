'use client';

import { baseHeader, IconRows, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type InfoCard = { icon?: string; title?: string; text?: string; items?: string[] };

export function PatientInfoSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Patienteninfo', 'Hinweise');
  const introText = (data.introText as string) || '';
  const cards = asList<InfoCard>(data.cards);
  return <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><SectionHeader {...header} />{introText && <p className="text-[var(--style-text-secondary)]">{introText}</p>}</div><div className="grid gap-6 sm:grid-cols-2">{cards.map((card, index) => <article key={`${card.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]"><IconRows items={[card]} /><div className="mt-4 flex flex-wrap gap-2">{asList<string>(card.items).map((item) => <span key={item} className="rounded-full bg-[var(--style-section-bg-alt)] px-3 py-1 text-xs text-[var(--style-text-secondary)]">{item}</span>)}</div></article>)}</div></div>;
}
