'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function TestimonialsSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const badgeText = (data.badgeText as string) || 'Kundenstimmen';
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const items = (data.items as { quote: string; name: string; context?: string; rating?: number }[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const cardItems = items.map(item => ({
    quote: item.quote,
    name: item.name,
    title: item.context,
    rating: item.rating,
  }));

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="section-badge">
          <span>{badgeText}</span>
        </div>
        {headline && <h2 className="section-headline">{headline}</h2>}
        {(ratingValue || ratingCount) && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(n => <Star key={n} size={18} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="text-slate-500 text-sm ml-2 font-medium">{ratingValue && `${ratingValue} / 5`}{ratingCount && ` aus ${ratingCount}+ Bewertungen`}</span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <InfiniteMovingCards items={cardItems} speed="slow" />
      </motion.div>
    </div>
  );
}
