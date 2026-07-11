'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type Day = { label?: string; day?: string; hours?: string; note?: string; closed?: boolean };

export function SalonOpeningHoursSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Oeffnungszeiten';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Zeiten';
  const days = asList<Day>(data.days).map((d) => d && ({ ...d, label: d.label ?? d.day }));
  const bookingNote = (data.bookingNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, days, bookingNote, ctaPrimary };

  return <HoursClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; days: Day[]; bookingNote: string; ctaPrimary: ButtonValue };

function HoursClassic({ headline, subline, badgeText, days, bookingNote, ctaPrimary }: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="mb-10 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {bookingNote && <p className="text-sm leading-6 text-[color:var(--token-muted)]">{bookingNote}</p>}
        {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-6 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
      </div>
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md">
        {days.map((day, i) => (
          <motion.div key={`${day.label || 'item'}-${i}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] px-5 py-4 last:border-b-0" data-edit-collection="days" data-edit-index={i}>
            <div className="flex items-center gap-3"><Clock size={17} className="text-[color:var(--token-eyebrow)]" /><div><p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{day.label || ''}</p>{day.note && <p className="text-xs text-[color:var(--token-muted)]" data-edit-path="note">{day.note}</p>}</div></div>
            <p className="text-sm font-medium text-[color:var(--token-heading)]">{day.closed ? (day.note || '') : day.hours}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

