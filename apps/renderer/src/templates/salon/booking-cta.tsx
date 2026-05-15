'use client';

import { CalendarDays, Phone } from 'lucide-react';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

export function BookingCtaSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Termin buchen', 'Buchung');
  const introText = (data.introText as string) || '';
  const onlineCta = asButton(data.onlineCta);
  const phoneCta = asButton(data.phoneCta);
  const whatsappCta = asButton(data.whatsappCta);
  const notes = asList<string>(data.notes);
  return (
    <div className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-6 shadow-[var(--style-card-shadow)] sm:p-10">
      <SectionHeader {...header} />
      {introText && <p className="max-w-2xl text-[var(--style-text-secondary)]">{introText}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-black/15 px-5 py-3 font-semibold text-[var(--style-text-primary)]"><Phone size={17} />{phoneCta.label}</a>}
        {whatsappCta.label && <a href={whatsappCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-black/15 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{whatsappCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="rounded-full bg-[var(--style-section-bg-alt)] px-3 py-1 text-xs text-[var(--style-text-secondary)]">{note}</span>)}</div>
    </div>
  );
}
