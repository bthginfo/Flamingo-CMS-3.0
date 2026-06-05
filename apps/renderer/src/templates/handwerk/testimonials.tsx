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
        <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {(ratingValue || ratingCount) && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={18} className="fill-[var(--token-accent)] text-[var(--token-accent)]" />)}</div>
            <span className="ml-2 text-sm font-medium text-[var(--token-body)]">{ratingValue && `${ratingValue} / 5`}{ratingCount && ` aus ${ratingCount}+ Bewertungen`}</span>
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
        <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-wide text-[var(--token-muted)]">
          <span className="h-px w-8 bg-[var(--token-card-border)]" /><span data-edit-path="badgeText">{badgeText}</span>
        </div>
        {headline && <h2 className="text-4xl font-light tracking-tight text-[var(--token-heading)] md:text-5xl lg:text-3xl" data-edit-path="headline">{headline}</h2>}
        {(ratingValue || ratingCount) && (
          <p className="mt-4 text-sm text-[var(--token-muted)]">{ratingValue && `${ratingValue}/5`}{ratingCount && ` · ${ratingCount}+ Bewertungen`}</p>
        )}
      </motion.div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="break-inside-avoid rounded-lg border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-8"
           data-edit-collection="items" data-edit-index={i}>
            <p className="leading-relaxed text-[var(--token-body)] italic">&ldquo;<span data-edit-path="quote">{plain(item.quote)}</span>&rdquo;</p>
            <div className="mt-6 border-t border-[var(--token-card-border)] pt-4">
              <p className="text-sm font-medium text-[var(--token-heading)]" data-edit-path="name">{item.name}</p>
              {item.context && <p className="mt-0.5 text-xs text-[var(--token-muted)]">{item.context}</p>}
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
        <span className="mb-4 inline-block bg-[var(--token-badge-bg)] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</span>
        {headline && <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--token-heading)] lg:text-4xl" data-edit-path="headline">{headline}</h2>}
        {(ratingValue || ratingCount) && (
          <div className="flex items-center gap-2 mt-4">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={16} className="fill-[var(--token-accent)] text-[var(--token-accent)]" />)}</div>
            <span className="text-sm font-bold text-[var(--token-body)]">{ratingValue}/5</span>
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
            className="w-[320px] shrink-0 snap-start border-3 border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-[4px_4px_0_var(--token-body)]"
           data-edit-collection="items" data-edit-index={i}>
            <Quote size={24} className="mb-3 text-[var(--token-accent)]" />
            <div className="rt-content font-medium leading-relaxed text-[var(--token-body)]" dangerouslySetInnerHTML={{ __html: item.quote }} />
            <div className="mt-4 border-t-2 border-[var(--token-card-border)] pt-3">
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--token-heading)]" data-edit-path="name">{item.name}</p>
              {item.context && <p className="mt-0.5 text-xs text-[var(--token-muted)]">{item.context}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
