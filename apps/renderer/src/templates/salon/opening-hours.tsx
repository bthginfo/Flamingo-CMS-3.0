'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type Day = { label?: string; hours?: string; note?: string; closed?: boolean };

export function SalonOpeningHoursSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Oeffnungszeiten';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Zeiten';
  const days = asList<Day>(data.days);
  const bookingNote = (data.bookingNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, days, bookingNote, ctaPrimary };

  if (styleVariant === 'modern') return <HoursModern {...props} />;
  if (styleVariant === 'bold') return <HoursBold {...props} />;
  return <HoursClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; days: Day[]; bookingNote: string; ctaPrimary: ButtonValue };

function HoursClassic({ headline, subline, badgeText, days, bookingNote, ctaPrimary }: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="mb-10 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
          {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm leading-6 text-[var(--style-text-secondary)]">{bookingNote}</p>}
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-6 inline-flex rounded-full bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
      </div>
      <div className="rounded-xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] shadow-md">
        {days.map((day, i) => (
          <motion.div key={`${day.label}-${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between gap-4 border-b border-[var(--style-badge-bg)]/20 px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3"><Clock size={17} className="text-[var(--style-accent)]" /><div><p className="font-semibold text-[var(--style-text-primary)]">{day.label || ''}</p>{day.note && <p className="text-xs text-[var(--style-text-secondary)]">{day.note}</p>}</div></div>
            <p className="text-sm font-medium text-[var(--style-text-primary)]">{day.closed ? (day.note || '') : day.hours}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HoursModern({ headline, subline, badgeText, days, bookingNote, ctaPrimary }: Props) {
  return (
    <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="mb-14 max-w-3xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm font-light leading-6 text-[var(--style-text-secondary)]">{bookingNote}</p>}
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-6 inline-flex border border-[var(--style-text-primary)] px-6 py-3 font-light text-[var(--style-text-primary)]">{ctaPrimary.label}</a>}
      </div>
      <div className="border-y border-black/10">
        {days.map((day, i) => (
          <div key={`${day.label}-${i}`} className="flex items-center justify-between gap-4 border-b border-black/10 px-2 py-5 last:border-b-0">
            <div className="flex items-center gap-3"><Clock size={16} className="text-[var(--style-accent)]" /><div><p className="font-light text-[var(--style-text-primary)]">{day.label || ''}</p>{day.note && <p className="text-xs font-light text-[var(--style-text-secondary)]">{day.note}</p>}</div></div>
            <p className="text-sm font-light text-[var(--style-text-primary)]">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoursBold({ headline, subline, badgeText, days, bookingNote, ctaPrimary }: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="mb-10 max-w-3xl">
          {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-4 font-bold text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm font-bold leading-6 text-[var(--style-text-secondary)]">{bookingNote}</p>}
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-6 inline-flex bg-[var(--style-accent)] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{ctaPrimary.label}</a>}
      </div>
      <div className="border-2 border-[var(--style-text-primary)] bg-[#111] shadow-[4px_4px_0_var(--style-accent)]">
        {days.map((day, i) => (
          <div key={`${day.label}-${i}`} className="flex items-center justify-between gap-4 border-b-2 border-[var(--style-text-primary)] px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3"><Clock size={17} className="text-[var(--style-accent)]" /><div><p className="font-black uppercase text-white">{day.label || ''}</p>{day.note && <p className="text-xs text-white/60">{day.note}</p>}</div></div>
            <p className="text-sm font-black uppercase text-white">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
