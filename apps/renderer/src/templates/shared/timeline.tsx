'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { plain } from '@/lib/strip-html';
import { useHydrationSafeReducedMotion } from '@/lib/use-hydration-safe-reduced-motion';
import { getVisibleTimelineEntries } from '@/lib/section-collection-view';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TimelineSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const { collectionKey, entries } = getVisibleTimelineEntries(data);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduceMotion = useHydrationSafeReducedMotion();

  if (!entries.length) return null;

  return (
    <div ref={ref}>
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
        className="mx-auto mb-9 max-w-3xl text-center md:mb-11"
      >
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </motion.header>

      <div className="relative mx-auto max-w-5xl">
        <div aria-hidden="true" className="absolute bottom-4 left-5 top-4 w-px bg-[color:color-mix(in_srgb,var(--token-divider)_72%,var(--token-accent))] md:left-1/2" />

        <ol className="relative">
          {entries.map(({ item: entry, originalIndex }, displayIndex) => {
            const isLeft = displayIndex % 2 === 0;
            return (
              <motion.li
                key={`${entry.year || 'step'}-${entry.title || originalIndex}`}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : displayIndex * 0.07 }}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] pb-7 last:pb-0 md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] md:pb-9"
                data-edit-collection={collectionKey}
                data-edit-index={originalIndex}
              >
                <div className="relative col-start-1 row-start-1 flex justify-center md:col-start-2">
                  <span aria-hidden="true" className="mt-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-[var(--token-section-bg)] bg-[var(--token-accent)] shadow-[0_0_0_1px_var(--token-divider)]" />
                </div>

                <article className={`col-start-2 row-start-1 min-w-0 border-t border-[var(--token-divider)] pt-3 ${isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-3 md:text-left'}`}>
                  {entry.year && <time className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--token-accent)]" data-edit-path="year">{entry.year}</time>}
                  {entry.title && <h3 className="mt-1 break-words text-lg font-semibold leading-snug text-[color:var(--token-card-heading,var(--token-heading))] [overflow-wrap:anywhere]" data-edit-path="title">{entry.title}</h3>}
                  {entry.text && <p className={`mt-1.5 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))] ${isLeft ? 'md:ml-auto' : ''} max-w-[38rem]`} data-edit-path="text">{plain(entry.text)}</p>}
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
