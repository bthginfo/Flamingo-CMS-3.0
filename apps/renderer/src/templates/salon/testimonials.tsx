'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type Testimonial = { quote?: string; name?: string; context?: string; rating?: number; sourceLabel?: string };

export function SalonTestimonialsSection({ data, styleVariant }: SectionProps) {
  const headline = typeof data.headline === 'string' ? data.headline : 'Bewertungen';
  const subline = (data.subline as string) || '';
  const badgeText = typeof data.badgeText === 'string' ? data.badgeText : 'Stimmen';
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const items = asList<Testimonial>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary };

  if (styleVariant === 'modern') return <TestimonialsModern {...props} />;
  if (styleVariant === 'bold') return <TestimonialsBold {...props} />;
  return <TestimonialsClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; ratingValue: string; ratingCount: string; items: Testimonial[]; ctaPrimary: ButtonValue };

function TestimonialsClassic({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm text-[color:var(--token-muted)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`$<span data-edit-path="name">{item.name}</span>-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-5 shadow-md" data-edit-collection="items" data-edit-index={i}>
            <div className="flex gap-1 text-[color:var(--token-eyebrow)]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={14}  data-edit-collection="rating" data-edit-index={si}/>)}</div>
            {item.quote && <div className="mt-4 text-sm leading-6 text-[color:var(--token-heading)] rt-content" data-edit-rich="quote" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs text-[color:var(--token-muted)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function TestimonialsModern({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-light text-[color:var(--token-muted)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`$<span data-edit-path="name">{item.name}</span>-${i}`} className="border-t border-black/10 pt-6" data-edit-collection="items" data-edit-index={i}>
            <div className="flex gap-1 text-[color:var(--token-eyebrow)]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={12}  data-edit-collection="rating" data-edit-index={si}/>)}</div>
            {item.quote && <div className="mt-4 text-sm font-light leading-6 text-[color:var(--token-heading)] rt-content" data-edit-rich="quote" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-light text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs font-light text-[color:var(--token-muted)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[#111827] px-6 py-3 font-light text-[color:var(--token-heading)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function TestimonialsBold({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-bold uppercase text-[color:var(--token-muted)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`$<span data-edit-path="name">{item.name}</span>-${i}`} className="border-2 border-[#111827] bg-[#111] p-5 shadow-[4px_4px_0_var(--token-eyebrow)]" data-edit-collection="items" data-edit-index={i}>
            <div className="flex gap-1 text-[color:var(--token-eyebrow)]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={14}  data-edit-collection="rating" data-edit-index={si}/>)}</div>
            {item.quote && <div className="mt-4 text-sm leading-6 text-[color:var(--token-on-dark-heading)] rt-content" data-edit-rich="quote" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-black uppercase text-[color:var(--token-on-dark-heading)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-[var(--token-badge-bg)] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}
