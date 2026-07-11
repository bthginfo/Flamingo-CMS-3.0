'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isNumeric) return;
    if (reduceMotion) { count.set(numericValue); return; }
    if (inView) animate(count, numericValue, { duration: 2, ease: 'easeOut' });
  }, [inView, count, numericValue, isNumeric, reduceMotion]);

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
    <div ref={ref} data-color-context="dark" className="relative overflow-hidden rounded-2xl bg-[var(--token-section-bg-alt)] p-10 md:p-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[color:color-mix(in_srgb,var(--token-accent)_45%,#000)] blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[color:color-mix(in_srgb,var(--token-accent)_45%,#000)] blur-[80px]" />
      </div>
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          {headline && <h2 className="text-3xl md:text-4xl font-serif font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mx-auto mt-3 max-w-xl text-[color:var(--token-on-dark-body)]" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }} className="text-center" data-edit-collection="stats" data-edit-index={i}>
              {stat.icon && (
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--token-image-overlay)] text-[var(--token-on-dark-heading)] ring-1 ring-[var(--token-badge-border)]">
                  <DynamicIcon editPath="icon" name={stat.icon} size={20} />
                </div>
              )}
              <div className="text-3xl md:text-4xl font-bold text-[color:var(--token-on-dark-heading)]">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="mt-2 text-sm text-[color:var(--token-on-dark-body)]" data-edit-path="label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
