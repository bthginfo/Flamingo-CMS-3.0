'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Testimonial = { text: string; name: string; role: string; image?: string; stars?: number };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function RealestateTestimonialsSection({ data }: Props) {
  const headline = (data.headline as string) || 'Das sagen unsere Kunden';
  const subline = (data.subline as string) || '';
  const testimonials = (data.testimonials as Testimonial[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading,#18181b)]">{headline}</h2>
          {subline && <p className="text-lg text-[color:var(--token-on-dark-muted,#52525b)] mt-4">{plain(subline)}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--token-card-bg,#ffffff)] p-6 rounded-xl border border-[color:var(--token-card-border,#f4f4f5)] shadow-sm"
            >
              {t.stars && (
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              )}
              <p className="text-[color:var(--token-on-dark-muted,#3f3f46)] text-sm leading-relaxed italic">&ldquo;{plain(t.text)}&rdquo;</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-50">
                {t.image && (
                  <Image src={t.image} alt={t.name} width={36} height={36} className="rounded-full object-cover" />
                )}
                <div>
                  <p className="text-sm font-semibold text-[color:var(--token-heading,#18181b)]">{t.name}</p>
                  <p className="text-xs text-[color:var(--token-on-dark-muted,#71717a)]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
