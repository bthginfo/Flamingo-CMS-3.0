'use client';

import { Clock } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Day = { label?: string; hours?: string; note?: string; closed?: boolean };

export function SalonOpeningHoursSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Oeffnungszeiten', 'Zeiten');
  const days = asList<Day>(data.days);
  const bookingNote = (data.bookingNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div><SectionHeader {...header} />{bookingNote && <p className="text-sm leading-6 text-[var(--style-text-secondary)]">{bookingNote}</p>}<div className="mt-6"><CtaButton cta={ctaPrimary} /></div></div>
      <div className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)]">{days.map((day, index) => <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4 last:border-b-0"><div className="flex items-center gap-3"><Clock size={17} className="text-[var(--style-text-secondary)]" /><div><p className="font-semibold text-[var(--style-text-primary)]">{day.label || ''}</p>{day.note && <p className="text-xs text-[var(--style-text-secondary)]">{day.note}</p>}</div></div><p className="text-sm font-medium text-[var(--style-text-primary)]">{day.closed ? (day.note || '') : day.hours}</p></div>)}</div>
    </div>
  );
}
