'use client';

import { Clock } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type Day = { label?: string; hours?: string; note?: string; closed?: boolean };

export function MedicalOpeningHoursSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Sprechzeiten', 'Zeiten');
  const days = asList<Day>(data.days);
  const acuteCareText = (data.acuteCareText as string) || '';
  const holidayNote = (data.holidayNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);
  return <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><SectionHeader {...header} />{acuteCareText && <p className="text-sm leading-6 text-[var(--style-text-secondary)]">{acuteCareText}</p>}{holidayNote && <p className="mt-3 text-xs text-[var(--style-text-secondary)]">{holidayNote}</p>}<div className="mt-6"><CtaButton cta={ctaPrimary} /></div></div><div className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)]">{days.map((day, index) => <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4 last:border-b-0"><div className="flex items-center gap-3"><Clock size={17} className="text-[var(--style-text-secondary)]" /><div><p className="font-semibold text-[var(--style-text-primary)]">{day.label || ''}</p>{day.note && <p className="text-xs text-[var(--style-text-secondary)]">{day.note}</p>}</div></div><p className="text-sm font-medium text-[var(--style-text-primary)]">{day.closed ? (day.note || '') : day.hours}</p></div>)}</div></div>;
}
