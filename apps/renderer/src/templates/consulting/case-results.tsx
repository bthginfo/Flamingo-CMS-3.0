'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type StatItem = { value: number | string; suffix?: string; prefix?: string; label: string; icon?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number | string; suffix?: string; prefix?: string }) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  const isNumeric = !isNaN(numericValue) && (numericValue !== 0 || value === 0 || value === '0');
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView && isNumeric) animate(count, numericValue, { duration: 2, ease: 'easeOut' });
  }, [inView, count, numericValue, isNumeric]);

  if (!isNumeric) {
    return <span ref={ref}>{prefix}<span data-edit-path="value">{String(value)}</span>{suffix}</span>;
  }

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function CaseResultsSection({ data }: Props) {
  const headline = (data.headline as string) || 'Unsere Erfolgsbilanz';
  const subline = (data.subline as string) || '';
  const stats = (data.stats as StatItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl bg-[var(--token-section-bg-alt)] p-10 md:p-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500 rounded-full blur-[80px]" />
      </div>
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          {headline && <h2 className="text-3xl md:text-4xl font-serif font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] mt-3 max-w-xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }} className="text-center" data-edit-collection="stats" data-edit-index={i}>
              {stat.icon && (
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-600/20 flex items-center justify-center text-amber-400">
                  <DynamicIcon editPath="icon" name={stat.icon} size={20} />
                </div>
              )}
              <div className="text-3xl md:text-4xl font-bold text-[color:var(--token-on-dark-heading)]">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-sm text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_50%,transparent)] mt-2" data-edit-path="label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
