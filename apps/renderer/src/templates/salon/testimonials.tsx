'use client';

import { Star } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Testimonial = { quote?: string; name?: string; context?: string; rating?: number; sourceLabel?: string };

export function SalonTestimonialsSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Bewertungen', 'Stimmen');
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const items = asList<Testimonial>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="mb-6 flex flex-wrap gap-3 text-sm text-[var(--style-text-secondary)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, index) => <article key={`${item.name}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]"><div className="flex gap-1 text-[var(--style-badge-text,#c0528a)]">{Array.from({ length: item.rating || 5 }).map((_, i) => <Star key={i} size={14} />)}</div>{item.quote && <p className="mt-4 text-sm leading-6 text-[var(--style-text-primary)]">{item.quote}</p>}<p className="mt-4 font-semibold text-[var(--style-text-primary)]">{item.name || ''}</p><p className="text-xs text-[var(--style-text-secondary)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p></article>)}
      </div>
      <div className="mt-8"><CtaButton cta={ctaPrimary} /></div>
    </div>
  );
}
