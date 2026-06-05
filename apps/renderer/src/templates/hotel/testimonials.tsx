'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type Testimonial = { quote?: string; name?: string; context?: string; rating?: number; stayLabel?: string };

export function HotelTestimonialsSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Gaestestimmen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Bewertungen';
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const sourceLabel = (data.sourceLabel as string) || '';
  const items = asList<Testimonial>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, ratingValue, ratingCount, sourceLabel, items, ctaPrimary };

  if (styleVariant === 'modern') return <TestimonialsModern {...props} />;
  if (styleVariant === 'bold') return <TestimonialsBold {...props} />;
  return <TestimonialsClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string;
  ratingValue: string; ratingCount: string; sourceLabel: string;
  items: Testimonial[]; ctaPrimary: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function TestimonialsClassic({ headline, subline, badgeText, ratingValue, ratingCount, sourceLabel, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]"><Star size={12} className="text-[color:var(--token-icon)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm text-[color:var(--token-muted)]">
        {ratingValue && <span>{ratingValue}</span>}
        {ratingCount && <span>{ratingCount}</span>}
        {sourceLabel && <span>{sourceLabel}</span>}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.article key={`${item.name}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-xl border border-[var(--token-icon)]/20 bg-[var(--token-card-bg)] p-5 shadow-md" data-edit-collection="items" data-edit-index={index}>
            <div className="flex gap-1 text-[color:var(--token-icon)]">{Array.from({ length: item.rating || 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor"  data-edit-collection="rating" data-edit-index={i}/>)}</div>
            {item.quote && <div className="mt-4 text-sm leading-6 text-[color:var(--token-heading)] rt-content" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs text-[color:var(--token-muted)]">{[item.context, item.stayLabel].filter(Boolean).join(' / ')}</p>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-xl bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

/* --- MODERN --- */
function TestimonialsModern({ headline, subline, badgeText, ratingValue, ratingCount, sourceLabel, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-8 flex flex-wrap gap-3 text-sm font-light text-[color:var(--token-muted)]">
        {ratingValue && <span>{ratingValue}</span>}
        {ratingCount && <span>{ratingCount}</span>}
        {sourceLabel && <span>{sourceLabel}</span>}
      </div>
      <div className="grid gap-px border border-black/10 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.name}-${index}`} className="border border-black/10 bg-[var(--token-card-bg)] p-6" data-edit-collection="items" data-edit-index={index}>
            <div className="flex gap-1 text-[color:var(--token-muted)]">{Array.from({ length: item.rating || 5 }).map((_, i) => <Star key={i} size={12}  data-edit-collection="rating" data-edit-index={i}/>)}</div>
            {item.quote && <div className="mt-4 text-sm font-light leading-7 text-[color:var(--token-heading)] rt-content" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-light text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs font-light text-[color:var(--token-muted)]">{[item.context, item.stayLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex font-light text-[color:var(--token-heading)] underline underline-offset-4" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

/* --- BOLD --- */
function TestimonialsBold({ headline, subline, badgeText, ratingValue, ratingCount, sourceLabel, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--token-btn-bg)/10] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-bold text-[color:var(--token-muted)]">
        {ratingValue && <span>{ratingValue}</span>}
        {ratingCount && <span>{ratingCount}</span>}
        {sourceLabel && <span>{sourceLabel}</span>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.name}-${index}`} className="border-2 border-[#111827] bg-[var(--token-card-bg)] p-5 shadow-[4px_4px_0_#111827]" data-edit-collection="items" data-edit-index={index}>
            <div className="flex gap-1 text-[color:var(--token-icon)]">{Array.from({ length: item.rating || 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor"  data-edit-collection="rating" data-edit-index={i}/>)}</div>
            {item.quote && <div className="mt-4 text-sm leading-6 text-[color:var(--token-heading)] rt-content" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs font-bold text-[color:var(--token-muted)]">{[item.context, item.stayLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_var(--token-icon)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}
