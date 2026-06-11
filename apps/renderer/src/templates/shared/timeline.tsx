'use client';

import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type TimelineEntry = { year: string; title: string; text: string };

export function TimelineSection({ data }: Props) {
  const badge = typeof data.badge === 'string' ? data.badge : '';
  const headline = typeof data.headline === 'string' ? data.headline : '';
  const subline = typeof data.subline === 'string' ? data.subline : '';
  const entries = (data.entries as TimelineEntry[]) || [];

  if (!entries.length) return null;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="text-center mb-12">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-zinc-200 -translate-x-1/2" />

        {entries.map((entry, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: isLeft ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.4, delay: i * 0.08 }} className={`relative mb-10 md:flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`} data-edit-collection="entries" data-edit-index={i}>
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 top-1 w-3 h-3 rounded-full bg-[var(--token-accent)] border-2 border-[color:var(--token-section-bg,#fff)] shadow -translate-x-1/2 z-10" />

              {/* Content */}
              <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'}`}>
                <span className="inline-block text-xs font-bold text-[color:var(--token-accent)] bg-[color-mix(in_srgb,var(--token-accent)_10%,transparent)] rounded-full px-3 py-0.5 mb-2">{entry.year}</span>
                <h3 className="font-semibold text-[color:var(--token-card-heading,var(--token-heading))] text-base mb-1" data-edit-path="title">{entry.title}</h3>
                <p className="text-sm text-[color:var(--token-card-body,var(--token-body))] leading-relaxed" data-edit-path="text">{plain(entry.text)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
