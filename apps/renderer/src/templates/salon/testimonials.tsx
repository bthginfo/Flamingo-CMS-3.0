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

  if (styleVariant === 'modern') return <TestimonialsModern {...props} />;
  if (styleVariant === 'bold') return <TestimonialsBold {...props} />;
  return <TestimonialsClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; ratingValue: string; ratingCount: string; items: Testimonial[]; ctaPrimary: ButtonValue };

function TestimonialsClassic({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm text-[color:var(--token-muted,#52525b)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`${item.name}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] p-5 shadow-md" data-edit-collection="items" data-edit-index={i}>
            <div className="flex gap-1 text-[var(--token-eyebrow, var(--brand-accent))]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={14}  data-edit-collection="rating" data-edit-index={si}/>)}</div>
            {item.quote && <div className="mt-4 text-sm leading-6 text-[color:var(--token-heading,#18181b)] rt-content" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-semibold text-[color:var(--token-heading,#18181b)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs text-[color:var(--token-muted,#52525b)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-md" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function TestimonialsModern({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-light text-[color:var(--token-muted,#52525b)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.name}-${i}`} className="border-t border-black/10 pt-6" data-edit-collection="items" data-edit-index={i}>
            <div className="flex gap-1 text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={12}  data-edit-collection="rating" data-edit-index={si}/>)}</div>
            {item.quote && <div className="mt-4 text-sm font-light leading-6 text-[color:var(--token-heading,#18181b)] rt-content" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-light text-[color:var(--token-heading,#18181b)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs font-light text-[color:var(--token-muted,#52525b)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[#111827] px-6 py-3 font-light text-[color:var(--token-heading,#18181b)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}

function TestimonialsBold({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-bold text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-bold uppercase text-[color:var(--token-muted,#52525b)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.name}-${i}`} className="border-2 border-[#111827] bg-[#111] p-5 shadow-[4px_4px_0_var(--token-eyebrow, var(--brand-accent))]" data-edit-collection="items" data-edit-index={i}>
            <div className="flex gap-1 text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={14}  data-edit-collection="rating" data-edit-index={si}/>)}</div>
            {item.quote && <div className="mt-4 text-sm leading-6 text-[color:var(--token-on-dark-heading,#ffffff)] rt-content" dangerouslySetInnerHTML={{ __html: item.quote }} />}
            <p className="mt-4 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)]" data-edit-path="name">{item.name || ''}</p>
            <p className="text-xs text-[color:var(--token-on-dark-heading,#ffffff)/60]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]" data-edit-path="label">{ctaPrimary.label}</a>}
    </div>
  );
}
