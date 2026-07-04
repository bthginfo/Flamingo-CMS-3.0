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
  const subline = (data.subline as string) || '';
  // Accept both shapes: {name, context} (canonical) and {author, role} (older data).
  const items = ((data.items as { quote: string; name?: string; author?: string; context?: string; role?: string; rating?: number }[]) || [])
    .map((it) => it && ({ quote: it.quote, name: it.name ?? it.author ?? '', context: it.context ?? it.role, rating: it.rating }));

  return <TestimonialsClassic headline={headline} subline={subline} badgeText={badgeText} ratingValue={ratingValue} ratingCount={ratingCount} items={items} />;
}

type TProps = { headline: string; subline?: string; badgeText: string; ratingValue: string; ratingCount: string; items: { quote: string; name: string; context?: string; rating?: number }[] };

/* ─── CLASSIC: Carousel/infinite scroll, large quote marks, rounded cards ─── */
function TestimonialsClassic({ headline, subline, badgeText, ratingValue, ratingCount, items }: TProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cardItems = items.map(item => ({ quote: item.quote, name: item.name, title: item.context, rating: item.rating }));

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
        <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        {(ratingValue || ratingCount) && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={18} className="fill-[var(--token-accent)] text-[color:var(--token-rating-star)]" />)}</div>
            <span className="ml-2 text-sm font-medium text-[color:var(--token-body)]">{ratingValue && `${ratingValue} / 5`}{ratingCount && ` aus ${ratingCount}+ Bewertungen`}</span>
          </div>
        )}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }}>
        <InfiniteMovingCards items={cardItems} speed="slow" />
      </motion.div>
    </div>
  );
}

