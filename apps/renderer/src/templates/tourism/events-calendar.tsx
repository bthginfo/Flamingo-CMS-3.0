'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CalendarDays, CalendarPlus, MapPin, ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';
import { buildIcsCalendar, isCalendarDate, normalizeCalendarFilename } from '@/lib/calendar-export';

type EventItem = { title?: string; text?: string; image?: string; dateLabel?: string; timeLabel?: string; startDate?: string; startTime?: string; endDate?: string; endTime?: string; allDay?: boolean; locationLabel?: string; category?: string; priceLabel?: string; cta?: { label?: string; href?: string } };

export function EventsCalendarSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Veranstaltungen', 'Kalender');
  const events = asList<EventItem>(data.events);
  const fallbackText = (data.fallbackText as string) || '';
  const showCalendarDownload = data.showCalendarDownload === true;
  const calendarButtonLabel = (data.calendarButtonLabel as string) || 'Alle Termine zum Kalender hinzufügen';
  const calendarFilename = (data.calendarFilename as string) || 'veranstaltungen.ics';
  const calendarName = (data.calendarName as string) || header.headline;
  const calendarTimezone = (data.calendarTimezone as string) || 'Europe/Berlin';

  return <Classic header={header} events={events} fallbackText={fallbackText} showCalendarDownload={showCalendarDownload} calendarButtonLabel={calendarButtonLabel} calendarFilename={calendarFilename} calendarName={calendarName} calendarTimezone={calendarTimezone} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; events: EventItem[]; fallbackText: string; showCalendarDownload: boolean; calendarButtonLabel: string; calendarFilename: string; calendarName: string; calendarTimezone: string };

function EventMeta({ event }: { event: EventItem }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--token-card-muted)]">
        {(event.dateLabel || event.startDate) && <span className="inline-flex items-center gap-2 whitespace-nowrap"><CalendarDays size={14} aria-hidden="true" />{event.dateLabel || formatDateLabel(event.startDate)}</span>}
        {(event.timeLabel || event.startTime) && !event.allDay && <span className="whitespace-nowrap">{event.timeLabel || `${event.startTime} Uhr`}</span>}
        {event.category && <span className="rounded-full border border-[var(--token-card-border)] px-2.5 py-1 text-[color:var(--token-label)]" data-edit-path="category">{event.category}</span>}
        {event.priceLabel && <span className="rounded-full bg-[var(--token-section-bg)] px-2.5 py-1 text-[color:var(--token-price)]" data-edit-path="priceLabel">{event.priceLabel}</span>}
      </div>
      {event.locationLabel && <div className="mt-3 inline-flex items-start gap-2 text-sm font-medium leading-5 text-[color:var(--token-card-muted)]"><MapPin className="mt-0.5 shrink-0" size={15} aria-hidden="true" /><span>{event.locationLabel}</span></div>}
    </div>
  );
}

function Classic({ header, events, fallbackText, showCalendarDownload, calendarButtonLabel, calendarFilename, calendarName, calendarTimezone }: Props) {
  const exportableEvents = events.filter(event => event.title?.trim() && isCalendarDate(event.startDate));

  function downloadCalendar() {
    const content = buildIcsCalendar(exportableEvents, { calendarName, timezone: calendarTimezone });
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = normalizeCalendarFilename(calendarFilename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div>
      <SectionHeader {...header} />
      {showCalendarDownload && exportableEvents.length > 0 && (
        <div className="mb-8 flex justify-start sm:justify-end">
          <button type="button" onClick={downloadCalendar} className="inline-flex items-center gap-2 rounded-xl bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-btn-bg)]">
            <CalendarPlus size={18} aria-hidden="true" />
            <span data-edit-path="calendarButtonLabel">{calendarButtonLabel}</span>
          </button>
        </div>
      )}
      {events.length === 0 && fallbackText ? <p className="text-[color:var(--token-body)]">{fallbackText}</p> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event, index) => (
          <motion.article key={`${event.title || 'item'}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }} className={`group relative min-w-0 overflow-hidden rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_12px_35px_rgba(20,16,12,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(20,16,12,0.13)] ${event.image ? 'grid sm:grid-cols-[220px_minmax(0,1fr)]' : 'flex'}`} data-card data-edit-collection="events" data-edit-index={index}>
            <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[var(--token-label)]" aria-hidden="true" />
            {event.image && <div className="relative min-h-56"><Image data-edit-image="image" src={event.image} alt={event.title || ''} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 220px, (min-width: 640px) 220px, 100vw" /></div>}
            <div className="min-w-0 flex-1 p-6 sm:p-7">
              <EventMeta event={event} />
              <h3 className="mt-5 text-2xl font-bold leading-tight text-[color:var(--token-card-heading)]" data-edit-path="title">{event.title || ''}</h3>
              {event.text && <div className="mt-3 max-w-2xl text-base leading-7 text-[color:var(--token-card-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: event.text }} />}
              {event.cta?.label && <a href={event.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 font-semibold text-[color:var(--token-link)] hover:text-[color:var(--token-link-hover)]"><span data-edit-path="label">{event.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function formatDateLabel(value?: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

