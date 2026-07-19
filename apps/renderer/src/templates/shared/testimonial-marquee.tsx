'use client';

import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { plain } from '@/lib/strip-html';
import { ResilientImage } from '@/components/ui/resilient-image';
import { getTestimonialMarqueeRowLayout, shouldAnimateTestimonialMarquee } from '@/lib/testimonial-marquee-policy';
import { useHydrationSafeReducedMotion } from '@/lib/use-hydration-safe-reduced-motion';
import {
  getVisibleTestimonialItems,
  type IndexedCollectionItem,
  type TestimonialViewItem,
} from '@/lib/section-collection-view';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function StarRating({ rating }: { rating: number }) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${normalizedRating} von 5 Sternen`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg aria-hidden="true" key={index} className={`h-3.5 w-3.5 ${index < normalizedRating ? 'text-[color:var(--token-rating-star)]' : 'text-[color:var(--token-muted)]'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item, originalIndex, duplicate = false }: { item: TestimonialViewItem; originalIndex: number; duplicate?: boolean }) {
  return (
    <article
      className="cms-testimonial-marquee-card"
      data-edit-collection={duplicate ? undefined : 'items'}
      data-edit-index={duplicate ? undefined : originalIndex}
    >
      {item.quote && <p className="mb-5 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]"><span aria-hidden="true" className="text-[color:var(--token-quote)]">“</span><span data-edit-path={duplicate ? undefined : 'quote'}>{plain(item.quote)}</span><span aria-hidden="true" className="text-[color:var(--token-quote)]">”</span></p>}
      <footer className="mt-auto flex items-center gap-3">
        {item.image && <ResilientImage data-edit-image={duplicate ? undefined : 'image'} src={item.image} alt="" className="h-10 w-10 rounded-full object-cover" />}
        <div className="min-w-0 flex-1">
          {item.name && <div className="truncate text-sm font-semibold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path={duplicate ? undefined : 'name'}>{item.name}</div>}
          {item.role && <div className="truncate text-xs text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path={duplicate ? undefined : 'role'}>{item.role}</div>}
        </div>
        {typeof item.rating === 'number' && <StarRating rating={item.rating} />}
      </footer>
    </article>
  );
}

function MarqueeRow({ items, reverse, speed, paused, rowLabel }: { items: IndexedCollectionItem<TestimonialViewItem>[]; reverse?: boolean; speed: number; paused: boolean; rowLabel: string }) {
  const rowLayout = getTestimonialMarqueeRowLayout(items.length);

  return (
    <div className="cms-testimonial-marquee-rail" role="region" aria-label={rowLabel}>
      <div
        className={`cms-testimonial-marquee-track ${reverse ? 'cms-testimonial-marquee-track--reverse' : ''} ${paused ? 'cms-testimonial-marquee-track--paused' : ''}`}
        style={{
          '--marquee-duration': `${speed}s`,
          '--marquee-card-width': rowLayout.cardWidth,
          '--marquee-gap': `${rowLayout.gapRem}rem`,
        } as React.CSSProperties}
      >
        <div className="cms-testimonial-marquee-copy">
          {items.map(({ item, originalIndex }) => <TestimonialCard key={`original-${originalIndex}-${item.name || 'anonymous'}`} item={item} originalIndex={originalIndex} />)}
        </div>
        <div aria-hidden="true" className="cms-testimonial-marquee-copy cms-testimonial-marquee-copy--duplicate">
          {items.map(({ item, originalIndex }) => <TestimonialCard key={`duplicate-${originalIndex}-${item.name || 'anonymous'}`} item={item} originalIndex={originalIndex} duplicate />)}
        </div>
      </div>
    </div>
  );
}

export function TestimonialMarqueeSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badge = (data.badge as string) || '';
  const items = getVisibleTestimonialItems(data.items);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const reduceMotion = useHydrationSafeReducedMotion();
  const [paused, setPaused] = useState(false);

  if (!items.length) return null;

  const half = Math.ceil(items.length / 2);
  const firstRow = items.slice(0, half);
  const secondRow = items.slice(half);
  const useMarquee = shouldAnimateTestimonialMarquee(items.length);

  return (
    <div ref={ref} className="cms-testimonial-marquee">
      {(headline || badge || subline) && (
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="mx-auto mb-8 max-w-3xl px-1 text-center"
        >
          {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
          {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
        </motion.header>
      )}

      {useMarquee ? (
        <>
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((current) => !current)}
              className="cms-testimonial-marquee-toggle inline-flex min-h-11 items-center gap-2 rounded-[var(--token-button-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] px-3 text-xs font-semibold text-[color:var(--token-card-heading)] shadow-sm transition hover:border-[var(--token-accent)]"
            >
              {paused ? <Play aria-hidden="true" size={14} /> : <Pause aria-hidden="true" size={14} />}
              {paused ? 'Bewertungen abspielen' : 'Bewegung pausieren'}
            </button>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.12 }}
            className="space-y-4"
          >
            <MarqueeRow items={firstRow} speed={40} paused={paused} rowLabel="Kundenstimmen, erste Reihe" />
            <MarqueeRow items={secondRow} reverse speed={45} paused={paused} rowLabel="Kundenstimmen, zweite Reihe" />
          </motion.div>
        </>
      ) : (
        <div className="cms-testimonial-static-grid" role="list" aria-label="Kundenstimmen">
          {items.map(({ item, originalIndex }) => (
            <div key={`static-${originalIndex}-${item.name || 'anonymous'}`} role="listitem">
              <TestimonialCard item={item} originalIndex={originalIndex} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
