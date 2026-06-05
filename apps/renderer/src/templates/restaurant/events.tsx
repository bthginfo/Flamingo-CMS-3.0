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
        {badgeText && <p className="inline-block rounded-full bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))/10] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {events.length === 0 && fallbackText ? <p className="text-center text-[color:var(--token-muted,#71717a)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <motion.article key={`${event.title}-${index}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="grid overflow-hidden rounded-xl border border-black/10 bg-[var(--token-card-bg,#ffffff)] shadow-md sm:grid-cols-[180px_1fr]" data-edit-collection="events" data-edit-index={index}>
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="240px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--token-muted,#71717a)]">
                {event.dateLabel && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))/10] px-3 py-1 text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span className="rounded-full bg-[var(--token-section-bg-alt,#000000)/5] px-3 py-1">{event.timeLabel}</span>}
                {event.priceLabel && <span className="rounded-full bg-[var(--token-section-bg-alt,#000000)/5] px-3 py-1" data-edit-path="priceLabel">{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold text-[color:var(--token-heading,#18181b)]">{event.title || ''}</h3>
              {event.description && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: event.description }} />}
              <div className="mt-5 flex flex-wrap gap-4">
                {event.cta?.label && <a href={event.cta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] px-4 py-2 text-sm font-semibold text-[color:var(--token-on-dark-heading,#ffffff)]" data-edit-path="label">{event.cta.label}</a>}
                {event.detailHref && event.detailLabel && <a href={event.detailHref} className="inline-flex items-center gap-1 text-sm text-[color:var(--token-muted,#71717a)]">{event.detailLabel}<ArrowRight size={14} /></a>}
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
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[color:var(--token-muted,#71717a)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light text-[color:var(--token-heading,#18181b)] sm:text-3xl md:text-5xl" data-edit-path="headline">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))]" />
        {subline && <div className="mt-6 font-light text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {events.length === 0 && fallbackText ? <p className="font-light text-[color:var(--token-muted,#71717a)]">{fallbackText}</p> : null}
      <div className="grid gap-8 lg:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="grid border border-black/5 sm:grid-cols-[160px_1fr]" data-edit-collection="events" data-edit-index={index}>
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="200px" /></div>}
            <div className="p-6">
              <div className="flex flex-wrap gap-4 text-xs font-light uppercase tracking-[0.15em] text-[color:var(--token-muted,#71717a)]">
                {event.dateLabel && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span>{event.timeLabel}</span>}
                {event.priceLabel && <span data-edit-path="priceLabel">{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-medium text-[color:var(--token-heading,#18181b)]">{event.title || ''}</h3>
              {event.description && <div className="mt-3 text-sm font-light leading-6 text-[color:var(--token-muted,#71717a)] rt-content" dangerouslySetInnerHTML={{ __html: event.description }} />}
              <div className="mt-5 flex flex-wrap gap-4">
                {event.cta?.label && <a href={event.cta.href || '#'} className="border-b border-[#111827] pb-0.5 text-sm font-medium text-[color:var(--token-heading,#18181b)]" data-edit-path="label">{event.cta.label}</a>}
                {event.detailHref && event.detailLabel && <a href={event.detailHref} className="inline-flex items-center gap-1 text-sm font-light text-[color:var(--token-muted,#71717a)]">{event.detailLabel}<ArrowRight size={14} /></a>}
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
    <div className="bg-[#111827] p-6 text-[color:var(--token-on-dark-heading,#ffffff)] sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-3 py-1 text-xs font-black uppercase tracking-widest text-[color:var(--token-heading,#18181b)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-black uppercase sm:text-3xl md:text-5xl" data-edit-path="headline">{headline}</h2>
        <div className="mt-2 h-1.5 w-20 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))]" />
        {subline && <div className="mt-4 text-[color:var(--token-on-dark-heading,#ffffff)/70] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {events.length === 0 && fallbackText ? <p className="text-[color:var(--token-on-dark-heading,#ffffff)/60]">{fallbackText}</p> : null}
      <div className="grid gap-5 lg:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="grid overflow-hidden rounded-none border-2 border-[color:var(--token-card-border,#ffffff)/20] shadow-[4px_4px_0_rgba(255,255,255,0.15)] sm:grid-cols-[160px_1fr]" data-edit-collection="events" data-edit-index={index}>
            {event.image && <div className="relative min-h-48"><Image src={event.image} alt={event.title || ''} fill className="object-cover" sizes="200px" /></div>}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-widest text-[color:var(--token-on-dark-heading,#ffffff)/50]">
                {event.dateLabel && <span className="inline-flex items-center gap-1 text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]"><CalendarDays size={13} />{event.dateLabel}</span>}
                {event.timeLabel && <span>{event.timeLabel}</span>}
                {event.priceLabel && <span data-edit-path="priceLabel">{event.priceLabel}</span>}
              </div>
              <h3 className="mt-3 text-xl font-bold uppercase">{event.title || ''}</h3>
              {event.description && <div className="mt-3 text-sm leading-6 text-[color:var(--token-on-dark-heading,#ffffff)/60] rt-content" dangerouslySetInnerHTML={{ __html: event.description }} />}
              <div className="mt-5 flex flex-wrap gap-4">
                {event.cta?.label && <a href={event.cta.href || '#'} className="rounded-none border-2 border-[color:var(--token-card-border,#ffffff)] bg-[var(--token-card-bg,#ffffff)] px-4 py-2 text-sm font-bold uppercase text-[color:var(--token-heading,#18181b)]" data-edit-path="label">{event.cta.label}</a>}
                {event.detailHref && event.detailLabel && <a href={event.detailHref} className="inline-flex items-center gap-1 text-sm font-bold uppercase text-[color:var(--token-on-dark-heading,#ffffff)/70]">{event.detailLabel}<ArrowRight size={14} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
