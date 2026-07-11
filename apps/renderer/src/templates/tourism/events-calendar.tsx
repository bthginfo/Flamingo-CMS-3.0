'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type EventItem = { title?: string; text?: string; image?: string; dateLabel?: string; timeLabel?: string; locationLabel?: string; category?: string; priceLabel?: string; cta?: { label?: string; href?: string } };

export function EventsCalendarSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Veranstaltungen', 'Kalender');
  const events = asList<EventItem>(data.events);
  const fallbackText = (data.fallbackText as string) || '';

  return <Classic header={header} events={events} fallbackText={fallbackText} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; events: EventItem[]; fallbackText: string };

function EventMeta({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--token-body)]">
      {event.dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.dateLabel}</span>}
      {event.timeLabel && <span>{event.timeLabel}</span>}
      {event.locationLabel && <span className="inline-flex items-center gap-1"><MapPin size={13} />{event.locationLabel}</span>}
      {event.category && <span data-edit-path="category">{event.category}</span>}
      {event.priceLabel && <span className="text-[color:var(--token-price)]" data-edit-path="priceLabel">{event.priceLabel}</span>}
    </div>
  );
}

function Classic({ header, events, fallbackText }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      {events.length === 0 && fallbackText ? <p className="text-[color:var(--token-body)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <motion.article key={`${event.title || 'item'}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="grid overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg sm:grid-cols-[180px_1fr]" data-edit-collection="events" data-edit-index={index}>
            {event.image && <div className="relative min-h-48"><Image data-edit-image="image" src={event.image} alt={event.title || ''} fill className="object-cover" sizes="220px" /></div>}
            <div className="p-5">
              <EventMeta event={event} />
              <h3 className="mt-3 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{event.title || ''}</h3>
              {event.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: event.text }} />}
              {event.cta?.label && <a href={event.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-[color:var(--token-link)] hover:text-[color:var(--token-link-hover)]"><span data-edit-path="label">{event.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

