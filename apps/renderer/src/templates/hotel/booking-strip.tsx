'use client';

import { CalendarDays } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type BookingField = { label?: string; value?: string; type?: string };

export function BookingStripSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Verfuegbarkeit pruefen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Direkt buchen';
  const arrivalLabel = (data.arrivalLabel as string) || '';
  const departureLabel = (data.departureLabel as string) || '';
  const guestsLabel = (data.guestsLabel as string) || '';
  const roomLabel = (data.roomLabel as string) || '';
  const submitCta = asButton(data.submitCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bookingNote = (data.bookingNote as string) || '';
  const fields = asList<BookingField>(data.fields);

  return (
    <div className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
          <h2 className="mt-2 text-2xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-1 text-sm text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm text-[var(--style-text-secondary)]">{bookingNote}</p>}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {(fields.length ? fields : [
          { label: arrivalLabel, value: '', type: 'date' },
          { label: departureLabel, value: '', type: 'date' },
          { label: guestsLabel, value: '', type: 'select' },
          { label: roomLabel, value: '', type: 'select' },
        ]).map((field, index) => (
          <label key={`${field.label}-${index}`} className="block rounded-[var(--style-radius-md)] border border-black/10 bg-white px-4 py-3">
            <span className="text-xs text-[var(--style-text-secondary)]">{field.label || ''}</span>
            <span className="mt-1 flex items-center gap-2 font-semibold text-[var(--style-text-primary)]"><CalendarDays size={15} />{field.value || field.type || ''}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {submitCta.label && <a href={submitCta.href || '#'} className="rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{submitCta.label}</a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} className="rounded-[var(--style-button-radius)] border border-black/15 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{secondaryCta.label}</a>}
      </div>
    </div>
  );
}

