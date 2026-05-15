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

  if (styleVariant === 'bold') return <EventsBold {...props} />;
  if (styleVariant === 'modern') return <EventsModern {...props} />;
  return <EventsClassic {...props} />;
}

function EventsClassic({ headline, subline, badgeText, events, fallbackText }: EventsViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="mb-10 max-w-3xl text-center mx-auto">
        {badgeText && <p className="inline-block rounded-full bg-[var(--style-accent)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-muted)]">{subline}</p>}
      </div>
      {events.length === 0 && fallbackText ? <p className="text-center text-[var(--style-text-muted)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <motion.article key={`${event.title}-${index}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="grid overflow-hidden rounded-xl border border-black/10 bg-[var(--style-card-bg)] shadow-md sm:grid-cols-[180px_1fr]">
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--style-text-muted)]">
                {event.dateLabel && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--style-accent)]/10 px-3 py-1 text-[var(--style-accent)]"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span className="rounded-full bg-black/5 px-3 py-1">{event.timeLabel}</span>}
                {event.priceLabel && <span className="rounded-full bg-black/5 px-3 py-1">{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold text-[var(--style-text-primary)]">{event.title || ''}</h3>
              {event.description && <p className="mt-3 text-sm leading-6 text-[var(--style-text-muted)]">{event.description}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {event.cta?.label && <a href={event.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--style-brand)] px-4 py-2 text-sm font-semibold text-white">{event.cta.label}</a>}
                {event.detailHref && event.detailLabel && <a href={event.detailHref} className="inline-flex items-center gap-1 text-sm text-[var(--style-text-muted)]">{event.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

function EventsModern({ headline, subline, badgeText, events, fallbackText }: EventsViewProps) {
  return (
    <div>
      <div className="mb-12 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[var(--style-text-muted)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light text-[var(--style-text-primary)] sm:text-5xl">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-[var(--style-accent)]" />
        {subline && <p className="mt-6 font-light text-[var(--style-text-muted)]">{subline}</p>}
      </div>
      {events.length === 0 && fallbackText ? <p className="font-light text-[var(--style-text-muted)]">{fallbackText}</p> : null}
      <div className="grid gap-8 lg:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="grid border border-black/5 sm:grid-cols-[160px_1fr]">
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="200px" /></div>}
            <div className="p-6">
              <div className="flex flex-wrap gap-4 text-xs font-light uppercase tracking-[0.15em] text-[var(--style-text-muted)]">
                {event.dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span>{event.timeLabel}</span>}
                {event.priceLabel && <span>{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-medium text-[var(--style-text-primary)]">{event.title || ''}</h3>
              {event.description && <p className="mt-3 text-sm font-light leading-6 text-[var(--style-text-muted)]">{event.description}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {event.cta?.label && <a href={event.cta.href || '#'} className="border-b border-[var(--style-text-primary)] pb-0.5 text-sm font-medium text-[var(--style-text-primary)]">{event.cta.label}</a>}
                {event.detailHref && event.detailLabel && <a href={event.detailHref} className="inline-flex items-center gap-1 text-sm font-light text-[var(--style-text-muted)]">{event.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function EventsBold({ headline, subline, badgeText, events, fallbackText }: EventsViewProps) {
  return (
    <div className="bg-[var(--style-text-primary)] p-6 text-white sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--style-accent)] px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--style-text-primary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-black uppercase sm:text-5xl">{headline}</h2>
        <div className="mt-2 h-1.5 w-20 bg-[var(--style-accent)]" />
        {subline && <p className="mt-4 text-white/70">{subline}</p>}
      </div>
      {events.length === 0 && fallbackText ? <p className="text-white/60">{fallbackText}</p> : null}
      <div className="grid gap-5 lg:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="grid overflow-hidden rounded-none border-2 border-white/20 shadow-[4px_4px_0_rgba(255,255,255,0.15)] sm:grid-cols-[160px_1fr]">
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="200px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-widest text-white/50">
                {event.dateLabel && <span className="inline-flex items-center gap-1 text-[var(--style-accent)]"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span>{event.timeLabel}</span>}
                {event.priceLabel && <span>{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold uppercase">{event.title || ''}</h3>
              {event.description && <p className="mt-3 text-sm leading-6 text-white/60">{event.description}</p>}
              <div className="mt-5 flex flex-wrap gap-4">
                {event.cta?.label && <a href={event.cta.href || '#'} className="rounded-none border-2 border-white bg-white px-4 py-2 text-sm font-bold uppercase text-[var(--style-text-primary)]">{event.cta.label}</a>}
                {event.detailHref && event.detailLabel && <a href={event.detailHref} className="inline-flex items-center gap-1 text-sm font-bold uppercase text-white/70">{event.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
