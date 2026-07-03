'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Testimonial = { text: string; name: string; source?: string; stars?: number; image?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CafeTestimonialsSection({ data }: Props) {
  const subline = (data.subline as string) || '';
  const headline = (data.headline as string) || 'Was unsere Gäste sagen';
  // Support both 'testimonials' array and 'items' array (AI sometimes uses 'items' with quote/rating/context)
  const rawTestimonials = (data.testimonials as Testimonial[]) || [];
  const rawItems = (data.items as { name?: string; quote?: string; text?: string; rating?: number; stars?: number; context?: string; source?: string; image?: string }[]) || [];
  const testimonials: Testimonial[] = rawTestimonials.length > 0
    ? rawTestimonials
    : rawItems.map(item => ({ text: item.quote || item.text || '', name: item.name || '', stars: item.stars || item.rating, source: item.context || item.source, image: item.image }));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2 initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-3xl font-bold text-[color:var(--token-heading)] text-center mb-12" data-edit-path="headline">{headline}</motion.h2>
        {subline && <p className="text-center text-[color:var(--token-body)] mt-3 max-w-xl mx-auto" data-edit-path="subline">{subline}</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="bg-[var(--token-section-bg-alt)] p-6 rounded-xl" data-edit-collection="testimonials" data-edit-index={i}>
              {t.stars && (
                <div className="flex gap-0.5 mb-3">{Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-[var(--token-rating-star)]"  data-edit-collection="stars" data-edit-index={j}/>)}</div>
              )}
              <p className="text-[color:var(--token-muted)] text-sm leading-relaxed italic"><span className="text-[color:var(--token-quote)]">&ldquo;</span><span data-edit-path="text">{plain(t.text)}</span><span className="text-[color:var(--token-quote)]">&rdquo;</span></p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[color:var(--token-card-border)]">
                {t.image && <Image data-edit-image="image" src={t.image} alt={t.name} width={32} height={32} className="rounded-full object-cover" />}
                <div>
                  <p className="text-sm font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{t.name}</p>
                  {t.source && <p className="text-xs text-[color:var(--token-muted)]">{t.source}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
