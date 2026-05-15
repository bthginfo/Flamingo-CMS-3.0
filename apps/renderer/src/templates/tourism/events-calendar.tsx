'use client';

import Image from 'next/image';
import { CalendarDays, MapPin } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type EventItem = { title?: string; text?: string; image?: string; dateLabel?: string; timeLabel?: string; locationLabel?: string; category?: string; priceLabel?: string; cta?: { label?: string; href?: string } };

export function EventsCalendarSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Veranstaltungen', 'Kalender');
  const events = asList<EventItem>(data.events);
  const fallbackText = (data.fallbackText as string) || '';
  return (
    <div>
      <SectionHeader {...header} />
      {events.length === 0 && fallbackText ? <p className="text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="grid overflow-hidden rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)] sm:grid-cols-[180px_1fr]">
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="220px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--style-text-secondary)]">
                {event.dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span>{event.timeLabel}</span>}
                {event.locationLabel && <span className="inline-flex items-center gap-1"><MapPin size={13} />{event.locationLabel}</span>}
                {event.category && <span>{event.category}</span>}
                {event.priceLabel && <span>{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold text-[var(--style-text-primary)]">{event.title || ''}</h3>
              {event.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{event.text}</p>}
              {event.cta?.label && <a href={event.cta.href || '#'} className="mt-5 inline-flex font-semibold text-[var(--style-text-primary)]">{event.cta.label}</a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
