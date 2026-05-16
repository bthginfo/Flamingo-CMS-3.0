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
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-6 shadow-lg">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          {badgeText && <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600"><Star size={12} className="text-brand-primary" />{badgeText}</p>}
          <h2 className="mt-2 text-2xl font-[700] text-gray-900">{headline}</h2>
          {subline && <p className="mt-1 text-sm text-gray-600">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm text-gray-600">{bookingNote}</p>}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {fields.map((field, index) => (
          <label key={`${field.label}-${index}`} className="block rounded-xl border border-[var(--brand-primary)]/15 bg-white px-4 py-3">
            <span className="text-xs text-gray-600">{field.label || ''}</span>
            <span className="mt-1 flex items-center gap-2 font-semibold text-gray-900"><CalendarDays size={15} />{field.value || field.type || ''}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {submitCta.label && <a href={submitCta.href || '#'} className="rounded-xl bg-[#111827] px-5 py-3 font-semibold text-white shadow-md">{submitCta.label}</a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} className="rounded-xl border border-black/15 px-5 py-3 font-semibold text-gray-900">{secondaryCta.label}</a>}
      </div>
    </motion.div>
  );
}

/* --- MODERN --- */
function BookingModern({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, fields }: Props) {
  return (
    <div className="border border-black/10 bg-white p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
          <h2 className="mt-2 text-2xl font-light text-gray-900">{headline}</h2>
          {subline && <p className="mt-1 text-sm font-light text-gray-600">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm font-light text-gray-600">{bookingNote}</p>}
      </div>
      <div className="grid gap-px border border-black/10 md:grid-cols-4">
        {fields.map((field, index) => (
          <label key={`${field.label}-${index}`} className="block border border-black/10 bg-white px-4 py-4">
            <span className="text-xs font-light text-gray-600">{field.label || ''}</span>
            <span className="mt-1 flex items-center gap-2 font-light text-gray-900"><CalendarDays size={15} />{field.value || field.type || ''}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        {submitCta.label && <a href={submitCta.href || '#'} className="font-light text-gray-900 underline underline-offset-4">{submitCta.label}</a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} className="font-light text-gray-600 underline underline-offset-4">{secondaryCta.label}</a>}
      </div>
    </div>
  );
}

/* --- BOLD --- */
function BookingBold({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, fields }: Props) {
  return (
    <div className="border-2 border-[#111827] bg-white p-5 shadow-[4px_4px_0_#111827]">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          {badgeText && <p className="inline-block bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary">{badgeText}</p>}
          <h2 className="mt-2 text-2xl font-black uppercase text-gray-900">{headline}</h2>
          {subline && <p className="mt-1 text-sm text-gray-600">{subline}</p>}
        </div>
        {bookingNote && <p className="text-sm font-bold text-gray-600">{bookingNote}</p>}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {fields.map((field, index) => (
          <label key={`${field.label}-${index}`} className="block border-2 border-[#111827] bg-white px-4 py-3">
            <span className="text-xs font-bold uppercase text-gray-600">{field.label || ''}</span>
            <span className="mt-1 flex items-center gap-2 font-black text-gray-900"><CalendarDays size={15} />{field.value || field.type || ''}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {submitCta.label && <a href={submitCta.href || '#'} className="border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--brand-primary)]">{submitCta.label}</a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} className="border-2 border-[#111827] px-5 py-3 font-black uppercase text-gray-900">{secondaryCta.label}</a>}
      </div>
    </div>
  );
}
