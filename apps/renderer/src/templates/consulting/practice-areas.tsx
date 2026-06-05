'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import Link from 'next/link';
import { plain } from '@/lib/strip-html';

type PracticeArea = { title: string; text?: string; icon?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PracticeAreasSection({ data }: Props) {
  const headline = (data.headline as string) || 'Rechtsgebiete';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const areas = (data.areas as PracticeArea[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-16">
        {badgeText && <div className="section-badge"><span data-edit-path="badgeText">{badgeText}</span></div>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area, i) => {
          const card = (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="group relative p-8 rounded-xl border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] hover:border-[var(--token-card-border)/30] hover:shadow-lg transition-all duration-300"
            >
              {area.icon && (
                <div className="w-12 h-12 mb-5 rounded-lg bg-[var(--token-btn-bg)/10] flex items-center justify-center text-[color:var(--token-icon)] group-hover:bg-[var(--token-btn-bg)] group-hover:text-[color:var(--token-on-dark-heading)] transition-colors">
                  <DynamicIcon name={area.icon} size={24} />
                </div>
              )}
              <h3 className="text-lg font-semibold text-[color:var(--token-heading)] mb-2" data-edit-path="title">{area.title}</h3>
              {area.text && <p className="text-[color:var(--token-muted)] text-sm leading-relaxed" data-edit-path="text">{plain(area.text)}</p>}
              {area.href && (
                <span className="inline-flex items-center gap-1 text-[color:var(--token-icon)] text-sm mt-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Mehr erfahren <DynamicIcon name="arrow-right" size={14} />
                </span>
              )}
            </motion.div>
          );
          return area.href ? <Link key={i} href={area.href} className="block">{card}</Link> : <div key={i}>{card}</div>;
        })}
      </div>
    </div>
  );
}
