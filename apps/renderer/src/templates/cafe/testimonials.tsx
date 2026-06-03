'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Testimonial = { text: string; name: string; source?: string; stars?: number; image?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CafeTestimonialsSection({ data }: Props) {
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
        <motion.h2 initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-3xl font-bold text-gray-900 text-center mb-12">{headline}</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="bg-stone-50 p-6 rounded-xl">
              {t.stars && (
                <div className="flex gap-0.5 mb-3">{Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-amber-400" />)}</div>
              )}
              <p className="text-gray-700 text-sm leading-relaxed italic">&ldquo;{plain(t.text)}&rdquo;</p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-stone-200">
                {t.image && <Image src={t.image} alt={t.name} width={32} height={32} className="rounded-full object-cover" />}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  {t.source && <p className="text-xs text-gray-500">{t.source}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
