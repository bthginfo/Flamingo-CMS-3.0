'use client';

import { useRef } from 'react';
import { plain } from '@/lib/strip-html';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TestimonialsSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const badgeText = (data.badgeText as string) || 'Kundenstimmen';
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const items = (data.items as { quote: string; name: string; context?: string; rating?: number }[]) || [];

  if (styleVariant === 'modern') return <TestimonialsModern headline={headline} badgeText={badgeText} ratingValue={ratingValue} ratingCount={ratingCount} items={items} />;
  if (styleVariant === 'bold') return <TestimonialsBold headline={headline} badgeText={badgeText} ratingValue={ratingValue} ratingCount={ratingCount} items={items} />;
  return <TestimonialsClassic headline={headline} badgeText={badgeText} ratingValue={ratingValue} ratingCount={ratingCount} items={items} />;
}

type TProps = { headline: string; badgeText: string; ratingValue: string; ratingCount: string; items: { quote: string; name: string; context?: string; rating?: number }[] };

/* ─── CLASSIC: Carousel/infinite scroll, large quote marks, rounded cards ─── */
function TestimonialsClassic({ headline, badgeText, ratingValue, ratingCount, items }: TProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cardItems = items.map(item => ({ quote: item.quote, name: item.name, title: item.context, rating: item.rating }));

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
        <div className="section-badge"><span>{badgeText}</span></div>
        {headline && <h2 className="section-headline">{headline}</h2>}
        {(ratingValue || ratingCount) && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={18} className="fill-yellow-400 text-yellow-400" />)}</div>
            <span className="text-slate-500 text-sm ml-2 font-medium">{ratingValue && `${ratingValue} / 5`}{ratingCount && ` aus ${ratingCount}+ Bewertungen`}</span>
          </div>
        )}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }}>
        <InfiniteMovingCards items={cardItems} speed="slow" />
      </motion.div>
    </div>
  );
}

/* ─── MODERN: Masonry-style grid, minimal quote styling, clean typography ─── */
function TestimonialsModern({ headline, badgeText, ratingValue, ratingCount, items }: TProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-10 md:mb-16">
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-4 tracking-wide uppercase">
          <span className="w-8 h-px bg-gray-300" />{badgeText}
        </div>
        {headline && <h2 className="text-4xl lg:text-3xl md:text-5xl font-light text-gray-900 tracking-tight">{headline}</h2>}
        {(ratingValue || ratingCount) && (
          <p className="text-sm text-gray-400 mt-4">{ratingValue && `${ratingValue}/5`}{ratingCount && ` · ${ratingCount}+ Bewertungen`}</p>
        )}
      </motion.div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="break-inside-avoid p-8 border border-gray-100 rounded-lg bg-white"
          >
            <p className="text-gray-600 leading-relaxed italic">&ldquo;{plain(item.quote)}&rdquo;</p>
            <div className="mt-6 pt-4 border-t border-gray-50">
              <p className="font-medium text-sm text-gray-900">{item.name}</p>
              {item.context && <p className="text-xs text-gray-400 mt-0.5">{item.context}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── BOLD: Horizontal scroll cards, thick borders, accent highlights, bold quote ─── */
function TestimonialsBold({ headline, badgeText, ratingValue, ratingCount, items }: TProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-10">
        <span className="inline-block bg-brand-accent text-brand-dark font-bold text-xs uppercase tracking-widest px-3 py-1.5 mb-4">{badgeText}</span>
        {headline && <h2 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight">{headline}</h2>}
        {(ratingValue || ratingCount) && (
          <div className="flex items-center gap-2 mt-4">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={16} className="fill-brand-accent text-brand-accent" />)}</div>
            <span className="font-bold text-sm text-gray-700">{ratingValue}/5</span>
          </div>
        )}
      </motion.div>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="snap-start shrink-0 w-[320px] p-6 border-3 border-gray-900 bg-white shadow-[4px_4px_0_#0d2137]"
          >
            <Quote size={24} className="text-brand-accent mb-3" />
            <div className="text-gray-800 font-medium leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: item.quote }} />
            <div className="mt-4 pt-3 border-t-2 border-gray-900">
              <p className="font-bold text-sm uppercase tracking-wide">{item.name}</p>
              {item.context && <p className="text-xs text-gray-500 mt-0.5">{item.context}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
