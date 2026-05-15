'use client';

import { Clock } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type Day = { label?: string; hours?: string; note?: string; closed?: boolean };

export function OpeningHoursSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Oeffnungszeiten';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Besuchen Sie uns';
  const days = asList<Day>(data.days);
  const kitchenHoursHeadline = (data.kitchenHoursHeadline as string) || '';
  const kitchenHoursText = (data.kitchenHoursText as string) || '';
  const holidayNote = (data.holidayNote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
        {kitchenHoursHeadline && <h3 className="mt-8 font-semibold text-[var(--style-text-primary)]">{kitchenHoursHeadline}</h3>}
        {kitchenHoursText && <p className="mt-2 text-sm leading-6 text-[var(--style-text-secondary)]">{kitchenHoursText}</p>}
        {holidayNote && <p className="mt-4 text-xs text-[var(--style-text-secondary)]">{holidayNote}</p>}
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-6 inline-flex rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}</a>}
      </div>
      <div className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] shadow-[var(--style-card-shadow)]">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <Clock size={17} className="text-[var(--style-text-secondary)]" />
              <div>
                <p className="font-semibold text-[var(--style-text-primary)]">{day.label || ''}</p>
                {day.note && <p className="text-xs text-[var(--style-text-secondary)]">{day.note}</p>}
              </div>
            </div>
            <p className="text-sm font-medium text-[var(--style-text-primary)]">{day.closed ? (day.note || '') : day.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

