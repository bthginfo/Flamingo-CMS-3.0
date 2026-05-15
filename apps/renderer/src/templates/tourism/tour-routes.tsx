'use client';

import Image from 'next/image';
import { Route } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type TourRoute = { title?: string; text?: string; image?: string; category?: string; lengthLabel?: string; durationLabel?: string; difficultyLabel?: string; startLabel?: string; highlights?: string[]; cta?: { label?: string; href?: string } };

export function TourRoutesSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Routen & Touren', 'Unterwegs');
  const routes = asList<TourRoute>(data.routes);
  const ctaPrimary = asButton(data.ctaPrimary);
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 lg:grid-cols-2">
        {routes.map((route, index) => (
          <article key={`${route.title}-${index}`} className="overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)]">
            {route.image && <div className="relative aspect-[16/9]"><Image src={route.image} alt={route.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-6">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--style-text-secondary)]">
                {route.lengthLabel && <span className="inline-flex items-center gap-1"><Route size={13} />{route.lengthLabel}</span>}
                {route.durationLabel && <span>{route.durationLabel}</span>}
                {route.category && <span>{route.category}</span>}
                {route.difficultyLabel && <span>{route.difficultyLabel}</span>}
                {route.startLabel && <span>{route.startLabel}</span>}
              </div>
              <h3 className="mt-3 text-2xl font-bold text-[var(--style-text-primary)]">{route.title || ''}</h3>
              {route.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{route.text}</p>}
              <div className="mt-4 flex flex-wrap gap-2">{asList<string>(route.highlights).map((item) => <span key={item} className="rounded-full bg-[var(--style-section-bg-alt)] px-3 py-1 text-xs text-[var(--style-text-secondary)]">{item}</span>)}</div>
              <div className="mt-5"><CtaButton cta={route.cta || {}} /></div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8"><CtaButton cta={ctaPrimary} /></div>
    </div>
  );
}
