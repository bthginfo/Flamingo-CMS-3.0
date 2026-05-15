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

  if (styleVariant === 'modern') return <Modern header={header} events={events} fallbackText={fallbackText} />;
  if (styleVariant === 'bold') return <Bold header={header} events={events} fallbackText={fallbackText} />;
  return <Classic header={header} events={events} fallbackText={fallbackText} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; events: EventItem[]; fallbackText: string };

function EventMeta({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--style-text-secondary)]">
      {event.dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.dateLabel}</span>}
      {event.timeLabel && <span>{event.timeLabel}</span>}
      {event.locationLabel && <span className="inline-flex items-center gap-1"><MapPin size={13} />{event.locationLabel}</span>}
      {event.category && <span>{event.category}</span>}
      {event.priceLabel && <span>{event.priceLabel}</span>}
    </div>
  );
}

function Classic({ header, events, fallbackText }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      {events.length === 0 && fallbackText ? <p className="text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <motion.article key={`${event.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="grid overflow-hidden rounded-xl bg-[var(--style-card-bg)] shadow-lg sm:grid-cols-[180px_1fr]">
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="220px" /></div>}
            <div className="p-5">
              <EventMeta event={event} />
              <h3 className="mt-3 text-xl font-bold text-[var(--style-text-primary)]">{event.title || ''}</h3>
              {event.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{event.text}</p>}
              {event.cta?.label && <a href={event.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-green-700">{event.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Modern({ header, events, fallbackText }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      {events.length === 0 && fallbackText ? <p className="text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="grid overflow-hidden border border-black/10 bg-[var(--style-card-bg)] sm:grid-cols-[180px_1fr]">
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="220px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-light uppercase tracking-widest text-teal-600">
                {event.dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span>{event.timeLabel}</span>}
                {event.locationLabel && <span className="inline-flex items-center gap-1"><MapPin size={13} />{event.locationLabel}</span>}
                {event.category && <span>{event.category}</span>}
                {event.priceLabel && <span>{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-light text-[var(--style-text-primary)]">{event.title || ''}</h3>
              {event.text && <p className="mt-3 text-sm font-light leading-6 text-[var(--style-text-secondary)]">{event.text}</p>}
              {event.cta?.label && <a href={event.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-teal-600">{event.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, events, fallbackText }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-text-primary)] sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-[var(--style-text-secondary)]">{header.subline}</p>}
      </div>
      {events.length === 0 && fallbackText ? <p className="text-[var(--style-text-secondary)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="grid overflow-hidden border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] shadow-[4px_4px_0_var(--style-text-primary)] sm:grid-cols-[180px_1fr]">
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="220px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-widest text-orange-500">
                {event.dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span>{event.timeLabel}</span>}
                {event.locationLabel && <span className="inline-flex items-center gap-1"><MapPin size={13} />{event.locationLabel}</span>}
                {event.category && <span>{event.category}</span>}
                {event.priceLabel && <span>{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-black uppercase text-[var(--style-text-primary)]">{event.title || ''}</h3>
              {event.text && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{event.text}</p>}
              {event.cta?.label && <a href={event.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-black uppercase text-orange-500">{event.cta.label}<ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
