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

  if (styleVariant === 'modern') return <BookingModern {...props} />;
  if (styleVariant === 'bold') return <BookingBold {...props} />;
  return <BookingClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; introText: string; onlineCta: ButtonValue; phoneCta: ButtonValue; whatsappCta: ButtonValue; notes: string[] };

function BookingClassic({ headline, subline, badgeText, introText, onlineCta, phoneCta, whatsappCta, notes }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] p-6 shadow-md sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      {introText && <p className="max-w-2xl text-[var(--style-text-secondary)]">{introText}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--style-badge-bg)]/30 px-5 py-3 font-semibold text-[var(--style-text-primary)]"><Phone size={17} />{phoneCta.label}</a>}
        {whatsappCta.label && <a href={whatsappCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--style-badge-bg)]/30 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{whatsappCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="rounded-full bg-[var(--style-badge-bg)] px-3 py-1 text-xs text-[var(--style-badge-text,#c0528a)]">{note}</span>)}</div>
    </motion.div>
  );
}

function BookingModern({ headline, subline, badgeText, introText, onlineCta, phoneCta, whatsappCta, notes }: Props) {
  return (
    <div className="border-y border-black/10 py-14">
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      {introText && <p className="max-w-2xl font-light text-[var(--style-text-secondary)]">{introText}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 border border-[var(--style-text-primary)] px-6 py-3 font-light text-[var(--style-text-primary)]"><CalendarDays size={16} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 px-6 py-3 font-light text-[var(--style-text-secondary)]"><Phone size={16} />{phoneCta.label}</a>}
        {whatsappCta.label && <a href={whatsappCta.href || '#'} className="inline-flex items-center gap-2 px-6 py-3 font-light text-[var(--style-text-secondary)]">{whatsappCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">{notes.map((note) => <span key={note} className="border-b border-[var(--style-accent)] pb-1 text-xs font-light text-[var(--style-text-secondary)]">{note}</span>)}</div>
    </div>
  );
}

function BookingBold({ headline, subline, badgeText, introText, onlineCta, phoneCta, whatsappCta, notes }: Props) {
  return (
    <div className="border-2 border-[var(--style-text-primary)] bg-[#111] p-6 shadow-[4px_4px_0_var(--style-accent)] sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-white">{headline}</h2>
        {subline && <p className="mt-4 font-bold text-white/70">{subline}</p>}
      </div>
      {introText && <p className="max-w-2xl font-bold text-white/70">{introText}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 bg-[var(--style-accent)] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]"><Phone size={17} />{phoneCta.label}</a>}
        {whatsappCta.label && <a href={whatsappCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{whatsappCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="bg-[var(--style-accent)] px-3 py-1 text-xs font-black uppercase text-white">{note}</span>)}</div>
    </div>
  );
}
