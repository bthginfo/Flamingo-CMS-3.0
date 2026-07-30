'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { asList, type SectionProps } from './types';

type RestaurantEvent = { title?: string; dateLabel?: string; timeLabel?: string; description?: string; image?: string; priceLabel?: string; cta?: { label?: string; href?: string }; detailHref?: string; detailLabel?: string };

type EventsViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  events: RestaurantEvent[];
  fallbackText: string;
};

export function EventsSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Events';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Kalender';
  const events = asList<RestaurantEvent>(data.events);
  const fallbackText = (data.fallbackText as string) || '';

  const props: EventsViewProps = { headline, subline, badgeText, events, fallbackText };

  return <EventsClassic {...props} />;
}

function EventsClassic({ headline, subline, badgeText, events, fallbackText }: EventsViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="mb-10 max-w-3xl text-center mx-auto">
        {badgeText && <p className="inline-block rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {events.length === 0 && fallbackText ? <p className="text-center text-[color:var(--token-muted)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <motion.article key={`${event.title || 'item'}-${index}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="grid overflow-hidden rounded-xl border border-black/10 bg-[var(--token-card-bg)] shadow-md sm:grid-cols-[180px_1fr]" data-card data-edit-collection="events" data-edit-index={index}>
            {event.image && <div className="relative min-h-48"><Image data-edit-image="image" src={event.image} alt={event.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--token-muted)]">
                {event.dateLabel && <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_10%,transparent)] px-3 py-1 text-[color:var(--token-badge-text)]"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span className="rounded-full bg-[color-mix(in_srgb,var(--token-section-bg-alt)_5%,transparent)] px-3 py-1">{event.timeLabel}</span>}
                {event.priceLabel && <span className="rounded-full bg-[color-mix(in_srgb,var(--token-section-bg-alt)_5%,transparent)] px-3 py-1 text-[color:var(--token-price)]" data-edit-path="priceLabel">{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{event.title || ''}</h3>
              {event.description && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: event.description }} />}
              <div className="mt-5 flex flex-wrap gap-4">
                {event.cta?.label && <a href={event.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--token-btn-text)]" data-edit-path="label">{event.cta.label}</a>}
                {event.detailHref && event.detailLabel && <a href={event.detailHref} className="inline-flex items-center gap-1 text-sm text-[color:var(--token-muted)]">{event.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

