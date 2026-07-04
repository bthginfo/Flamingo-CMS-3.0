'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Phone } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function BookingCtaSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Termin buchen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Buchung';
  const introText = (data.introText as string) || '';
  const onlineCta = asButton(data.onlineCta);
  const phoneCta = asButton(data.phoneCta);
  const whatsappCta = asButton(data.whatsappCta);
  const notes = asList<string>(data.notes);

  const props = { headline, subline, badgeText, introText, onlineCta, phoneCta, whatsappCta, notes };

  return <BookingClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; introText: string; onlineCta: ButtonValue; phoneCta: ButtonValue; whatsappCta: ButtonValue; notes: string[] };

function BookingClassic({ headline, subline, badgeText, introText, onlineCta, phoneCta, whatsappCta, notes }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-6 shadow-md sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {introText && <div className="max-w-2xl text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a data-edit-link="onlineCta" href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md"><CalendarDays size={17} /><span data-edit-path="label">{onlineCta.label}</span></a>}
        {phoneCta.label && <a data-edit-link="phoneCta" href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--token-icon)_30%,transparent)] px-5 py-3 font-semibold text-[color:var(--token-heading)]"><Phone size={17} /><span data-edit-path="label">{phoneCta.label}</span></a>}
        {whatsappCta.label && <a data-edit-link="whatsappCta" href={whatsappCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--token-icon)_30%,transparent)] px-5 py-3 font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{whatsappCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs text-[color:var(--token-eyebrow)]" data-edit-path="note">{note}</span>)}</div>
    </motion.div>
  );
}

