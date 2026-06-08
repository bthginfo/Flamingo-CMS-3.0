'use client';

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { DynamicIcon } from '@/components/ui/icon-map';

type StatItem = { value: number | string; suffix?: string; prefix?: string; label: string; icon?: string };
type Props = { data: Record<string, unknown>; variant?: string | null };

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number | string; suffix?: string; prefix?: string }) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  const isNumeric = !isNaN(numericValue) && (numericValue !== 0 || value === 0 || value === '0');
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView && isNumeric) {
      animate(count, numericValue, { duration: 2, ease: 'easeOut' });
    }
  }, [inView, count, numericValue, isNumeric]);

  if (!isNumeric) {
    return <span ref={ref}>{prefix}<span data-edit-path="value">{String(value)}</span>{suffix}</span>;
  }

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function StatsSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const stats = (data.stats as StatItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      {headline && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="section-headline text-center mb-12" data-edit-path="headline"
        >
          {headline}
        </motion.h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.1 }}
            className="text-center p-6 rounded-2xl bg-[var(--token-card-bg)] border border-[var(--token-card-border)] shadow-sm"
           data-edit-collection="stats" data-edit-index={i}>
            {stat.icon && (
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[color-mix(in_srgb,var(--token-icon)_14%,transparent)] flex items-center justify-center text-[var(--token-icon)]">
                <DynamicIcon editPath="icon" name={stat.icon} size={20} />
              </div>
            )}
            <div className="text-3xl md:text-4xl font-bold text-[var(--token-stat-value)]">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
            </div>
            <div className="text-sm text-[var(--token-body)] mt-1" data-edit-path="label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
