'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type Day = { label?: string; hours?: string; note?: string; closed?: boolean };

type OpeningHoursViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  days: Day[];
  kitchenHoursHeadline: string;
  kitchenHoursText: string;
  holidayNote: string;
  ctaPrimary: { label?: string; href?: string };
};

export function OpeningHoursSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Oeffnungszeiten';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Besuchen Sie uns';
  const days = asList<Day>(data.days);
  const kitchenHoursHeadline = (data.kitchenHoursHeadline as string) || '';
  const kitchenHoursText = (data.kitchenHoursText as string) || '';
  const holidayNote = (data.holidayNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  const props: OpeningHoursViewProps = { headline, subline, badgeText, days, kitchenHoursHeadline, kitchenHoursText, holidayNote, ctaPrimary };

  if (styleVariant === 'bold') return <OpeningHoursBold {...props} />;
  if (styleVariant === 'modern') return <OpeningHoursModern {...props} />;
  return <OpeningHoursClassic {...props} />;
}

function OpeningHoursClassic({ headline, subline, badgeText, days, kitchenHoursHeadline, kitchenHoursText, holidayNote, ctaPrimary }: OpeningHoursViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        {badgeText && <p className="inline-block rounded-full bg-[var(--style-accent)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-muted)]">{subline}</p>}
        {kitchenHoursHeadline && <h3 className="mt-8 font-semibold text-[var(--style-text-primary)]">{kitchenHoursHeadline}</h3>}
        {kitchenHoursText && <p className="mt-2 text-sm leading-6 text-[var(--style-text-muted)]">{kitchenHoursText}</p>}
        {holidayNote && <p className="mt-4 text-xs text-[var(--style-text-muted)]">{holidayNote}</p>}
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-6 inline-flex rounded-full bg-[var(--style-brand)] px-6 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
      </div>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-[var(--style-card-bg)] shadow-lg">
        {days.map((day, index) => (
          <motion.div key={`${day.label}-${index}`} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between gap-4 border-b border-black/10 px-6 py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[var(--style-accent)]/10 p-1.5 text-[var(--style-accent)]"><Clock size={15} /></div>
              <div>
                <p className="font-semibold text-[var(--style-text-primary)]">{day.label || ''}</p>
                {day.note && <p className="text-xs text-[var(--style-text-muted)]">{day.note}</p>}
              </div>
            </div>
            <p className={`text-sm font-medium ${day.closed ? 'text-[var(--style-text-muted)]' : 'text-[var(--style-text-primary)]'}`}>{day.closed ? (day.note || '') : day.hours}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function OpeningHoursModern({ headline, subline, badgeText, days, kitchenHoursHeadline, kitchenHoursText, holidayNote, ctaPrimary }: OpeningHoursViewProps) {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-[var(--style-text-muted)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light text-[var(--style-text-primary)] sm:text-5xl">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-[var(--style-accent)]" />
        {subline && <p className="mt-6 font-light text-[var(--style-text-muted)]">{subline}</p>}
        {kitchenHoursHeadline && <h3 className="mt-8 font-medium text-[var(--style-text-primary)]">{kitchenHoursHeadline}</h3>}
        {kitchenHoursText && <p className="mt-2 text-sm font-light leading-6 text-[var(--style-text-muted)]">{kitchenHoursText}</p>}
        {holidayNote && <p className="mt-4 text-xs font-light text-[var(--style-text-muted)]">{holidayNote}</p>}
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-6 inline-flex border-b-2 border-[var(--style-text-primary)] pb-1 font-medium text-[var(--style-text-primary)]">{ctaPrimary.label}</a>}
      </div>
      <div className="border border-black/5">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-5 last:border-b-0">
            <div className="flex items-center gap-3">
              <Clock size={15} className="text-[var(--style-text-muted)]" />
              <div>
                <p className="font-medium text-[var(--style-text-primary)]">{day.label || ''}</p>
                {day.note && <p className="text-xs font-light text-[var(--style-text-muted)]">{day.note}</p>}
              </div>
            </div>
            <p className={`text-sm font-light ${day.closed ? 'text-[var(--style-text-muted)]' : 'text-[var(--style-text-primary)]'}`}>{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpeningHoursBold({ headline, subline, badgeText, days, kitchenHoursHeadline, kitchenHoursText, holidayNote, ctaPrimary }: OpeningHoursViewProps) {
  return (
    <div className="bg-[var(--style-text-primary)] p-6 text-white sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          {badgeText && <p className="inline-block bg-[var(--style-accent)] px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--style-text-primary)]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-black uppercase sm:text-5xl">{headline}</h2>
          <div className="mt-2 h-1.5 w-20 bg-[var(--style-accent)]" />
          {subline && <p className="mt-4 text-white/70">{subline}</p>}
          {kitchenHoursHeadline && <h3 className="mt-8 font-bold uppercase">{kitchenHoursHeadline}</h3>}
          {kitchenHoursText && <p className="mt-2 text-sm leading-6 text-white/60">{kitchenHoursText}</p>}
          {holidayNote && <p className="mt-4 text-xs text-white/50">{holidayNote}</p>}
          {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-6 inline-flex rounded-none border-2 border-white bg-white px-6 py-3 font-black uppercase text-[var(--style-text-primary)] shadow-[4px_4px_0_rgba(255,255,255,0.3)]">{ctaPrimary.label}</a>}
        </div>
        <div className="border-2 border-white/20">
          {days.map((day, index) => (
            <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b-2 border-white/10 px-5 py-4 last:border-b-0">
              <div className="flex items-center gap-3">
                <Clock size={17} className="text-[var(--style-accent)]" />
                <div>
                  <p className="font-bold uppercase">{day.label || ''}</p>
                  {day.note && <p className="text-xs text-white/50">{day.note}</p>}
                </div>
              </div>
              <p className={`text-sm font-bold ${day.closed ? 'text-white/40' : ''}`}>{day.closed ? (day.note || '') : day.hours}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

