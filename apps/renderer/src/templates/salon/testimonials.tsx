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
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
        {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm text-[var(--style-text-secondary)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`${item.name}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] p-5 shadow-md">
            <div className="flex gap-1 text-[var(--style-badge-text,#c0528a)]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={14} />)}</div>
            {item.quote && <p className="mt-4 text-sm leading-6 text-[var(--style-text-primary)]">{item.quote}</p>}
            <p className="mt-4 font-semibold text-[var(--style-text-primary)]">{item.name || ''}</p>
            <p className="text-xs text-[var(--style-text-secondary)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-full bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a>}
    </div>
  );
}

function TestimonialsModern({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-light text-[var(--style-text-secondary)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.name}-${i}`} className="border-t border-black/10 pt-6">
            <div className="flex gap-1 text-[var(--style-accent)]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={12} />)}</div>
            {item.quote && <p className="mt-4 text-sm font-light leading-6 text-[var(--style-text-primary)]">{item.quote}</p>}
            <p className="mt-4 font-light text-[var(--style-text-primary)]">{item.name || ''}</p>
            <p className="text-xs font-light text-[var(--style-text-secondary)]">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border border-[var(--style-text-primary)] px-6 py-3 font-light text-[var(--style-text-primary)]">{ctaPrimary.label}</a>}
    </div>
  );
}

function TestimonialsBold({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
        {subline && <p className="mt-4 font-bold text-[var(--style-text-secondary)]">{subline}</p>}
      </div>
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-bold uppercase text-[var(--style-text-secondary)]">{ratingValue && <span>{ratingValue}</span>}{ratingCount && <span>{ratingCount}</span>}</div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.name}-${i}`} className="border-2 border-[var(--style-text-primary)] bg-[#111] p-5 shadow-[4px_4px_0_var(--style-accent)]">
            <div className="flex gap-1 text-[var(--style-accent)]">{Array.from({ length: item.rating || 5 }).map((_, si) => <Star key={si} size={14} />)}</div>
            {item.quote && <p className="mt-4 text-sm leading-6 text-white">{item.quote}</p>}
            <p className="mt-4 font-black uppercase text-white">{item.name || ''}</p>
            <p className="text-xs text-white/60">{[item.context, item.sourceLabel].filter(Boolean).join(' / ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex bg-[var(--style-accent)] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{ctaPrimary.label}</a>}
    </div>
  );
}
