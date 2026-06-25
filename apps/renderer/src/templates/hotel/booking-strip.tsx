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
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-6 shadow-lg text-center">
      {badgeText && <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]"><Star size={12} className="text-[color:var(--token-rating-star)]" /><span data-edit-path="badgeText">{badgeText}</span></p>}
      <h2 className="mt-3 text-2xl font-[700] text-[color:var(--token-heading)] sm:text-3xl" data-edit-path="headline">{headline}</h2>
      {subline && <div className="mx-auto mt-2 max-w-lg text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      {trustItems.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm text-[color:var(--token-muted)]" data-edit-collection="trustItems" data-edit-index={i}>
              <DynamicIcon editPath="icon" name={item.icon || 'check'} size={16} className="text-[color:var(--token-icon)]" />
              <span data-edit-path="text">{plain(item.text)}</span>
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {submitCta.label && <a data-edit-link="submitCta" href={submitCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md transition-transform hover:scale-105"><CalendarDays size={17} /><span data-edit-path="label">{submitCta.label}</span><ExternalLink size={14} /></a>}
        {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-black/15 px-6 py-3 font-semibold text-[color:var(--token-btn-secondary-text)]" data-edit-path="label">{secondaryCta.label}</a>}
      </div>
      {bookingNote && <p className="mt-4 text-sm text-[color:var(--token-muted)]">{bookingNote}</p>}
    </motion.div>
  );
}

/* --- MODERN --- */
function BookingModern({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, trustItems }: Props) {
  return (
    <div className="border border-black/10 bg-[var(--token-card-bg)] p-8 text-center">
      {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
      <h2 className="mt-3 text-2xl font-light text-[color:var(--token-heading)] sm:text-3xl" data-edit-path="headline">{headline}</h2>
      {subline && <div className="mx-auto mt-2 max-w-lg text-sm font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      {trustItems.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-light text-[color:var(--token-muted)]" data-edit-collection="trustItems" data-edit-index={i}>
              <DynamicIcon editPath="icon" name={item.icon || 'check'} size={16} className="text-[color:var(--token-icon)]" />
              <span data-edit-path="text">{plain(item.text)}</span>
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {submitCta.label && <a data-edit-link="submitCta" href={submitCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-light text-[color:var(--token-heading)] underline underline-offset-4"><CalendarDays size={16} /><span data-edit-path="label">{submitCta.label}</span></a>}
        {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} target="_blank" rel="noopener noreferrer" className="font-light text-[color:var(--token-muted)] underline underline-offset-4" data-edit-path="label">{secondaryCta.label}</a>}
      </div>
      {bookingNote && <p className="mt-4 text-sm font-light text-[color:var(--token-muted)]">{bookingNote}</p>}
    </div>
  );
}

/* --- BOLD --- */
function BookingBold({ headline, subline, badgeText, submitCta, secondaryCta, bookingNote, trustItems }: Props) {
  return (
    <div className="border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-[4px_4px_0_var(--token-card-border)] text-center">
      {badgeText && <p className="inline-block bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon)]" data-edit-path="badgeText">{badgeText}</p>}
      <h2 className="mt-3 text-2xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl" data-edit-path="headline">{headline}</h2>
      {subline && <div className="mx-auto mt-2 max-w-lg text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      {trustItems.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--token-muted)]" data-edit-collection="trustItems" data-edit-index={i}>
              <DynamicIcon editPath="icon" name={item.icon || 'check'} size={16} className="text-[color:var(--token-eyebrow)]" />
              <span data-edit-path="text">{plain(item.text)}</span>
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {submitCta.label && <a data-edit-link="submitCta" href={submitCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-[var(--token-card-border)] bg-[var(--token-btn-bg)] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_var(--token-icon)]"><CalendarDays size={17} /><span data-edit-path="label">{submitCta.label}</span><ExternalLink size={14} /></a>}
        {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-secondary-border)] px-6 py-3 font-black uppercase text-[color:var(--token-btn-secondary-text)]" data-edit-path="label">{secondaryCta.label}</a>}
      </div>
      {bookingNote && <p className="mt-4 text-sm font-bold text-[color:var(--token-muted)]">{bookingNote}</p>}
    </div>
  );
}
