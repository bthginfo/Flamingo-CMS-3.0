'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Star } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type BookingField = { label?: string; value?: string; type?: string };

export function BookingStripSection({ data, styleVariant }: SectionProps) {
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

  const resolvedFields = fields.length ? fields : [
    { label: arrivalLabel, value: '', type: 'date' },
    { label: departureLabel, value: '', type: 'date' },
    { label: guestsLabel, value: '', type: 'select' },
    { label: roomLabel, value: '', type: 'select' },
  ];

  const props = { headline, subline, badgeText, submitCta, secondaryCta, bookingNote, fields: resolvedFields };

  if (styleVariant === 'modern') return <BookingModern {...props} />;
  if (styleVariant === 'bold') return <BookingBold {...props} />;
  return <BookingClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string;
  submitCta: { label?: string; href?: string }; secondaryCta: { label?: string; href?: string };
  bookingNote: string; fields: BookingField[];
};

/* --- CLASSIC --- */
function BookingClassic({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, fields }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] p-6 shadow-lg">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          {badgeText && <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]"><Star size={12} className="text-[var(--style-badge-bg)]" />{badgeText}</p>}
          <h2 className="mt-2 text-2xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-1 text-sm text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm text-[var(--style-text-secondary)]">{bookingNote}</p>}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {fields.map((field, index) => (
          <label key={`${field.label}-${index}`} className="block rounded-xl border border-[var(--style-badge-bg)]/15 bg-white px-4 py-3">
            <span className="text-xs text-[var(--style-text-secondary)]">{field.label || ''}</span>
            <span className="mt-1 flex items-center gap-2 font-semibold text-[var(--style-text-primary)]"><CalendarDays size={15} />{field.value || field.type || ''}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {submitCta.label && <a href={submitCta.href || '#'} className="rounded-xl bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{submitCta.label}</a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} className="rounded-xl border border-black/15 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{secondaryCta.label}</a>}
      </div>
    </motion.div>
  );
}

/* --- MODERN --- */
function BookingModern({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, fields }: Props) {
  return (
    <div className="border border-black/10 bg-[var(--style-card-bg)] p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
          <h2 className="mt-2 text-2xl font-light text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-1 text-sm font-light text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm font-light text-[var(--style-text-secondary)]">{bookingNote}</p>}
      </div>
      <div className="grid gap-px border border-black/10 md:grid-cols-4">
        {fields.map((field, index) => (
          <label key={`${field.label}-${index}`} className="block border border-black/10 bg-white px-4 py-4">
            <span className="text-xs font-light text-[var(--style-text-secondary)]">{field.label || ''}</span>
            <span className="mt-1 flex items-center gap-2 font-light text-[var(--style-text-primary)]"><CalendarDays size={15} />{field.value || field.type || ''}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        {submitCta.label && <a href={submitCta.href || '#'} className="font-light text-[var(--style-text-primary)] underline underline-offset-4">{submitCta.label}</a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} className="font-light text-[var(--style-text-secondary)] underline underline-offset-4">{secondaryCta.label}</a>}
      </div>
    </div>
  );
}

/* --- BOLD --- */
function BookingBold({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, fields }: Props) {
  return (
    <div className="border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] p-5 shadow-[4px_4px_0_var(--style-text-primary)]">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          {badgeText && <p className="inline-block bg-[var(--style-badge-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--style-badge-text)]">{badgeText}</p>}
          <h2 className="mt-2 text-2xl font-black uppercase text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-1 text-sm text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm font-bold text-[var(--style-text-secondary)]">{bookingNote}</p>}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {fields.map((field, index) => (
          <label key={`${field.label}-${index}`} className="block border-2 border-[var(--style-text-primary)] bg-white px-4 py-3">
            <span className="text-xs font-bold uppercase text-[var(--style-text-secondary)]">{field.label || ''}</span>
            <span className="mt-1 flex items-center gap-2 font-black text-[var(--style-text-primary)]"><CalendarDays size={15} />{field.value || field.type || ''}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {submitCta.label && <a href={submitCta.href || '#'} className="border-2 border-[var(--style-text-primary)] bg-[var(--style-text-primary)] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--style-badge-bg)]">{submitCta.label}</a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} className="border-2 border-[var(--style-text-primary)] px-5 py-3 font-black uppercase text-[var(--style-text-primary)]">{secondaryCta.label}</a>}
      </div>
    </div>
  );
}
