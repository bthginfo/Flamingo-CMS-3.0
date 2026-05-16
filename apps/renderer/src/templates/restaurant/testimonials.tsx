'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type Testimonial = { quote?: string; name?: string; context?: string; rating?: number; sourceLabel?: string };

export function RestaurantTestimonialsSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Gästestimmen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Bewertungen';
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

function Stars({ count }: { count: number }) {
  return <div className="flex gap-0.5">{Array.from({ length: count || 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>;
}

function TestimonialsClassic({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl text-center mx-auto">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block rounded-full bg-brand-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-accent">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-4 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
        {subline && <div className="mt-4 text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        {(ratingValue || ratingCount) && <p className="mt-3 text-sm text-gray-500">{[ratingValue, ratingCount].filter(Boolean).join(' · ')}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`${item.name}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-black/10 bg-white p-6 shadow-md">
            <div className="text-brand-accent"><Stars count={item.rating || 5} /></div>
            {item.quote && <p className="mt-4 text-sm leading-6 text-gray-900">&ldquo;{item.quote}&rdquo;</p>}
            <div className="mt-4 border-t border-black/10 pt-4">
              <p className="font-semibold text-gray-900">{item.name || ''}</p>
              <p className="text-xs text-gray-500">{[item.context, item.sourceLabel].filter(Boolean).join(' · ')}</p>
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8 text-center"><a href={ctaPrimary.href || '#'} className="inline-flex rounded-full bg-brand-primary px-6 py-3 font-semibold text-white shadow-md">{ctaPrimary.label}</a></div>}
    </div>
  );
}

function TestimonialsModern({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-gray-500">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-gray-900">{headline}</h2>
        <div className="mt-2 h-px w-16 bg-brand-accent" />
        {subline && <div className="mt-6 font-light text-gray-500 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        {(ratingValue || ratingCount) && <p className="mt-3 text-sm font-light text-gray-500">{[ratingValue, ratingCount].filter(Boolean).join(' · ')}</p>}
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.name}-${i}`} className="border-t border-black/10 pt-6">
            <div className="text-brand-accent"><Stars count={item.rating || 5} /></div>
            {item.quote && <p className="mt-4 text-sm font-light leading-7 text-gray-900">&ldquo;{item.quote}&rdquo;</p>}
            <p className="mt-4 font-medium text-gray-900">{item.name || ''}</p>
            <p className="text-xs font-light text-gray-500">{[item.context, item.sourceLabel].filter(Boolean).join(' · ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex border-b-2 border-[#111827] pb-1 font-medium text-gray-900">{ctaPrimary.label}</a>}
    </div>
  );
}

function TestimonialsBold({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div className="bg-[#111827] p-6 text-white sm:p-10">
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-brand-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-gray-900">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase">{headline}</h2>
        <div className="mt-2 h-1.5 w-20 bg-brand-accent" />
        {subline && <div className="mt-4 text-white/70 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        {(ratingValue || ratingCount) && <p className="mt-3 text-sm font-bold text-white/50">{[ratingValue, ratingCount].filter(Boolean).join(' · ')}</p>}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.name}-${i}`} className="border-2 border-white/20 p-6 shadow-[4px_4px_0_rgba(255,255,255,0.15)]">
            <div className="text-brand-accent"><Stars count={item.rating || 5} /></div>
            {item.quote && <p className="mt-4 text-sm leading-6">&ldquo;{item.quote}&rdquo;</p>}
            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="font-black uppercase">{item.name || ''}</p>
              <p className="text-xs text-white/60">{[item.context, item.sourceLabel].filter(Boolean).join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-8"><a href={ctaPrimary.href || '#'} className="inline-flex border-2 border-white bg-white px-6 py-3 font-black uppercase text-gray-900 shadow-[4px_4px_0_rgba(255,255,255,0.3)]">{ctaPrimary.label}</a></div>}
    </div>
  );
}
