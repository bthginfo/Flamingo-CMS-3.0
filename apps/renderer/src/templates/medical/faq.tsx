'use client';

import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type FaqItem = { question?: string; answer?: string };

export function MedicalFaqSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Haeufige Fragen', 'FAQ');
  const items = asList<FaqItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);
  return <div><SectionHeader {...header} /><div className="divide-y divide-black/10 rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)]">{items.map((item, index) => <details key={`${item.question}-${index}`} className="p-5"><summary className="cursor-pointer font-semibold text-[var(--style-text-primary)]">{item.question || ''}</summary>{item.answer && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}</details>)}</div><div className="mt-8"><CtaButton cta={ctaPrimary} /></div></div>;
}
