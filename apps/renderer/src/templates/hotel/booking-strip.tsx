'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Star, ExternalLink } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';
import { plain } from '@/lib/strip-html';

type TrustItem = { icon?: string; text?: string };

export function BookingStripSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Jetzt buchen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Direkt buchen';
  const submitCta = asButton(data.submitCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bookingNote = (data.bookingNote as string) || '';
  const trustItems = asList<TrustItem>(data.trustItems);

  const props = { headline, subline, badgeText, submitCta, secondaryCta, bookingNote, trustItems };

  if (styleVariant === 'modern') return <BookingModern {...props} />;
  if (styleVariant === 'bold') return <BookingBold {...props} />;
  return <BookingClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string;
  submitCta: { label?: string; href?: string }; secondaryCta: { label?: string; href?: string };
  bookingNote: string; trustItems: TrustItem[];
};

/* --- CLASSIC --- */
function BookingClassic({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, trustItems }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-6 shadow-lg text-center">
      {badgeText && <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600"><Star size={12} className="text-brand-primary" />{badgeText}</p>}
      <h2 className="mt-3 text-2xl font-[700] text-gray-900 sm:text-3xl">{headline}</h2>
      {subline && <div className="mx-auto mt-2 max-w-lg text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      {trustItems.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm text-gray-600">
              <DynamicIcon name={item.icon || 'check'} size={16} className="text-brand-primary" />
              {plain(item.text)}
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {submitCta.label && <a href={submitCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-6 py-3 font-semibold text-white shadow-md transition-transform hover:scale-105"><CalendarDays size={17} />{submitCta.label}<ExternalLink size={14} /></a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/15 px-6 py-3 font-semibold text-gray-900">{secondaryCta.label}</a>}
      </div>
      {bookingNote && <p className="mt-4 text-sm text-gray-500">{bookingNote}</p>}
    </motion.div>
  );
}

/* --- MODERN --- */
function BookingModern({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, trustItems }: Props) {
  return (
    <div className="border border-black/10 bg-white p-8 text-center">
      {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
      <h2 className="mt-3 text-2xl font-light text-gray-900 sm:text-3xl">{headline}</h2>
      {subline && <div className="mx-auto mt-2 max-w-lg text-sm font-light text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      {trustItems.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-light text-gray-600">
              <DynamicIcon name={item.icon || 'check'} size={16} className="text-brand-primary" />
              {plain(item.text)}
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {submitCta.label && <a href={submitCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-light text-gray-900 underline underline-offset-4"><CalendarDays size={16} />{submitCta.label}</a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} target="_blank" rel="noopener noreferrer" className="font-light text-gray-600 underline underline-offset-4">{secondaryCta.label}</a>}
      </div>
      {bookingNote && <p className="mt-4 text-sm font-light text-gray-500">{bookingNote}</p>}
    </div>
  );
}

/* --- BOLD --- */
function BookingBold({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, trustItems }: Props) {
  return (
    <div className="border-2 border-[#111827] bg-white p-6 shadow-[4px_4px_0_#111827] text-center">
      {badgeText && <p className="inline-block bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary">{badgeText}</p>}
      <h2 className="mt-3 text-2xl font-black uppercase text-gray-900 sm:text-3xl">{headline}</h2>
      {subline && <div className="mx-auto mt-2 max-w-lg text-sm text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      {trustItems.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-bold text-gray-700">
              <DynamicIcon name={item.icon || 'check'} size={16} className="text-brand-accent" />
              {plain(item.text)}
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {submitCta.label && <a href={submitCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-[#111827] bg-[#111827] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--brand-primary)]"><CalendarDays size={17} />{submitCta.label}<ExternalLink size={14} /></a>}
        {secondaryCta.label && <a href={secondaryCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-[#111827] px-6 py-3 font-black uppercase text-gray-900">{secondaryCta.label}</a>}
      </div>
      {bookingNote && <p className="mt-4 text-sm font-bold text-gray-500">{bookingNote}</p>}
    </div>
  );
}
