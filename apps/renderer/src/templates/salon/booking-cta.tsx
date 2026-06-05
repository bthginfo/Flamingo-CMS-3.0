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
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] p-6 shadow-md sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {introText && <div className="max-w-2xl text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-md"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-icon, var(--brand-primary))]/30 px-5 py-3 font-semibold text-[color:var(--token-heading,#18181b)]"><Phone size={17} />{phoneCta.label}</a>}
        {whatsappCta.label && <a href={whatsappCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-icon, var(--brand-primary))]/30 px-5 py-3 font-semibold text-[color:var(--token-heading,#18181b)]" data-edit-path="label">{whatsappCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="rounded-full bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] px-3 py-1 text-xs text-[var(--token-eyebrow, var(--brand-accent))]">{note}</span>)}</div>
    </motion.div>
  );
}

function BookingModern({ headline, subline, badgeText, introText, onlineCta, phoneCta, whatsappCta, notes }: Props) {
  return (
    <div className="border-y border-black/10 py-14">
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {introText && <div className="max-w-2xl font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 border border-[#111827] px-6 py-3 font-light text-[color:var(--token-heading,#18181b)]"><CalendarDays size={16} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 px-6 py-3 font-light text-[color:var(--token-muted,#52525b)]"><Phone size={16} />{phoneCta.label}</a>}
        {whatsappCta.label && <a href={whatsappCta.href || '#'} className="inline-flex items-center gap-2 px-6 py-3 font-light text-[color:var(--token-muted,#52525b)]" data-edit-path="label">{whatsappCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">{notes.map((note) => <span key={note} className="border-b border-[var(--token-card-border,var(--brand-accent,#f39c12))] pb-1 text-xs font-light text-[color:var(--token-muted,#52525b)]">{note}</span>)}</div>
    </div>
  );
}

function BookingBold({ headline, subline, badgeText, introText, onlineCta, phoneCta, whatsappCta, notes }: Props) {
  return (
    <div className="border-2 border-[#111827] bg-[#111] p-6 shadow-[4px_4px_0_var(--token-eyebrow, var(--brand-accent))] sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-on-dark-heading,#ffffff)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-on-dark-heading,#ffffff)/70] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      {introText && <div className="max-w-2xl font-bold text-[color:var(--token-on-dark-heading,#ffffff)/70] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      <div className="mt-8 flex flex-wrap gap-3">
        {onlineCta.label && <a href={onlineCta.href || '#'} className="inline-flex items-center gap-2 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]"><CalendarDays size={17} />{onlineCta.label}</a>}
        {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[color:var(--token-card-border,#ffffff)] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]"><Phone size={17} />{phoneCta.label}</a>}
        {whatsappCta.label && <a href={whatsappCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[color:var(--token-card-border,#ffffff)] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]" data-edit-path="label">{whatsappCta.label}</a>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{notes.map((note) => <span key={note} className="bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-3 py-1 text-xs font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)]">{note}</span>)}</div>
    </div>
  );
}
