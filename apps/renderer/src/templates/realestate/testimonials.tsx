'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Testimonial = { text: string; name: string; role?: string; image?: string; stars?: number };
type LooseItem = Testimonial & { quote?: string; context?: string; rating?: number };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function RealestateTestimonialsSection({ data }: Props) {
  const headline = (data.headline as string) || 'Das sagen unsere Kunden';
  const subline = (data.subline as string) || '';
  // `testimonials` {text,role,stars} is canonical; `items` {quote,context,rating} is the shared-testimonials shape.
  const testimonials = (((data.testimonials as LooseItem[]) || (data.items as LooseItem[]) || []))
    .map((t) => t && ({ ...t, text: t.text ?? t.quote ?? '', role: t.role ?? t.context, stars: t.stars ?? t.rating }));

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-lg text-[color:var(--token-muted)] mt-4" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--token-card-bg)] p-6 rounded-xl border border-[color:var(--token-card-border)] shadow-sm"
             data-edit-collection="testimonials" data-edit-index={i}>
              {t.stars && (
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 text-[var(--token-rating-star)]"  data-edit-collection="stars" data-edit-index={j}/>
                  ))}
                </div>
              )}
              <p className="text-[color:var(--token-muted)] text-sm leading-relaxed italic"><span className="text-[color:var(--token-quote)]">&ldquo;</span><span data-edit-path="text">{plain(t.text)}</span><span className="text-[color:var(--token-quote)]">&rdquo;</span></p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[var(--token-card-border)]">
                {t.image && (
                  <Image data-edit-image="image" src={t.image} alt={t.name} width={36} height={36} className="rounded-full object-cover" />
                )}
                <div>
                  <p className="text-sm font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{t.name}</p>
                  <p className="text-xs text-[color:var(--token-muted)]" data-edit-path="role">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
