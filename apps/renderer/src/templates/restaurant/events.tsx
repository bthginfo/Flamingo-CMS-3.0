'use client';

import Image from 'next/image';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { asList, type SectionProps } from './types';

type RestaurantEvent = { title?: string; dateLabel?: string; timeLabel?: string; description?: string; image?: string; priceLabel?: string; cta?: { label?: string; href?: string }; detailHref?: string; detailLabel?: string };

export function EventsSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Events';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Kalender';
  const events = asList<RestaurantEvent>(data.events);
  const fallbackText = (data.fallbackText as string) || '';

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      {events.length === 0 && fallbackText ? <p className="text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="grid overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)] sm:grid-cols-[180px_1fr]">
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--style-text-secondary)]">
                {event.dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span>{event.timeLabel}</span>}
                {event.priceLabel && <span>{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold text-[var(--style-text-primary)]">{event.title || ''}</h3>
              {event.description && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{event.description}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {event.cta?.label && <a href={event.cta.href || '#'} className="font-semibold text-[var(--style-text-primary)]">{event.cta.label}</a>}
                {event.detailHref && event.detailLabel && <a href={event.detailHref} className="inline-flex items-center gap-1 text-sm text-[var(--style-text-secondary)]">{event.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
