'use client';

import { AlertCircle } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type EmergencyItem = { title?: string; text?: string; phoneLabel?: string; phoneHref?: string };

export function EmergencyInfoSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Notfallhinweise', 'Akut');
  const introText = (data.introText as string) || '';
  const items = asList<EmergencyItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);
  return <div className="rounded-[var(--style-card-radius)] border border-red-200 bg-red-50 p-6 shadow-[var(--style-card-shadow)] sm:p-8"><SectionHeader {...header} />{introText && <p className="max-w-3xl text-sm leading-6 text-red-900/80">{introText}</p>}<div className="mt-6 grid gap-4 md:grid-cols-3">{items.map((item, index) => <article key={`${item.title}-${index}`} className="border-t border-red-200 pt-4"><AlertCircle size={18} className="text-red-700" /><h3 className="mt-2 font-bold text-red-950">{item.title || ''}</h3>{item.text && <p className="mt-2 text-sm leading-6 text-red-900/75">{item.text}</p>}{item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-semibold text-red-950">{item.phoneLabel}</a>}</article>)}</div><div className="mt-6"><CtaButton cta={ctaPrimary} /></div></div>;
}
