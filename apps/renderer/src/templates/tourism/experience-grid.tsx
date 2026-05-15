'use client';

import { Clock, Users } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import Image from 'next/image';
import type { SectionProps } from './types';

type Experience = { title?: string; text?: string; image?: string; category?: string; durationLabel?: string; audienceLabel?: string; difficultyLabel?: string; priceLabel?: string; cta?: { label?: string; href?: string } };

export function ExperienceGridSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Erlebnisse & Aktivitaeten', 'Erleben');
  const items = asList<Experience>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="grid overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)] sm:grid-cols-[220px_1fr]">
            {item.image && <div className="relative min-h-56"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="260px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--style-text-secondary)]">
                {item.durationLabel && <span className="inline-flex items-center gap-1"><Clock size={13} />{item.durationLabel}</span>}
                {item.audienceLabel && <span className="inline-flex items-center gap-1"><Users size={13} />{item.audienceLabel}</span>}
                {item.category && <span>{item.category}</span>}
                {item.difficultyLabel && <span>{item.difficultyLabel}</span>}
                {item.priceLabel && <span>{item.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-2xl font-bold text-[var(--style-text-primary)]">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.text}</p>}
              <div className="mt-5"><CtaButton cta={item.cta || {}} /></div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8"><CtaButton cta={ctaPrimary} /></div>
    </div>
  );
}
