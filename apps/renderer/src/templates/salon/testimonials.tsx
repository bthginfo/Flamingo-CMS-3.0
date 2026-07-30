'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type Testimonial = { quote?: string; name?: string; context?: string; rating?: number; sourceLabel?: string };

export function SalonTestimonialsSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Bewertungen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Stimmen';
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const items = asList<Testimonial>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary };

  return <TestimonialsClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; ratingValue: string; ratingCount: string; items: Testimonial[]; ctaPrimary: ButtonValue };

function TestimonialsClassic({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm text-[color:var(--token-muted)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`${item.name || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-5 shadow-md" data-card data-edit-collection="items" data-edit-index={i}>
            <div className="flex gap-1 text-[color:var(--token-eyebrow)]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star className="text-[color:var(--token-rating-star)]" key={si} size={14}  data-edit-collection="rating" data-edit-index={si}/>)}</div>
            {item.quote && <div className="mt-4 text-sm leading-6 text-[color:var(--token-heading)] rt-content" data-edit-rich="quote" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs text-[color:var(--token-muted)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

