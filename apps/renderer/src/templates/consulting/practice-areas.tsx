'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import Link from 'next/link';

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
        {badgeText && <div className="section-badge"><span>{badgeText}</span></div>}
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{subline}</p>}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area, i) => {
          const card = (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="group relative p-8 rounded-xl border border-slate-200 bg-white hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {area.icon && (
                <div className="w-12 h-12 mb-5 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <DynamicIcon name={area.icon} size={24} />
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{area.title}</h3>
              {area.text && <p className="text-slate-500 text-sm leading-relaxed">{area.text}</p>}
              {area.href && (
                <span className="inline-flex items-center gap-1 text-brand-primary text-sm mt-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
