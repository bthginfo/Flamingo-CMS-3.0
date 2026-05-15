'use client';

import { Star } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type Testimonial = { quote?: string; name?: string; context?: string; rating?: number; stayLabel?: string };

export function HotelTestimonialsSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Gaestestimmen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Bewertungen';
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const sourceLabel = (data.sourceLabel as string) || '';
  const items = asList<Testimonial>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div>
      <Header badgeText={badgeText} headline={headline} subline={subline} />
      <div className="mb-6 flex flex-wrap gap-3 text-sm text-[var(--style-text-secondary)]">
        {ratingValue && <span>{ratingValue}</span>}
        {ratingCount && <span>{ratingCount}</span>}
        {sourceLabel && <span>{sourceLabel}</span>}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.name}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]">
            <div className="flex gap-1 text-[var(--style-badge-text,#b88745)]">{Array.from({ length: item.rating || 5 }).map((_, i) => <Star key={i} size={14} />)}</div>
            {item.quote && <p className="mt-4 text-sm leading-6 text-[var(--style-text-primary)]">{item.quote}</p>}
            <p className="mt-4 font-semibold text-[var(--style-text-primary)]">{item.name || ''}</p>
            <p className="text-xs text-[var(--style-text-secondary)]">{[item.context, item.stayLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}</a>}
    </div>
  );
}

function Header({ badgeText, headline, subline }: { badgeText: string; headline: string; subline: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}

