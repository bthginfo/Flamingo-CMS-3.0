'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Stat = { value: number | string; suffix?: string; prefix?: string; label: string };

function AnimatedNumber({ value, prefix, suffix, inView }: { value: number | string; prefix?: string; suffix?: string; inView: boolean }) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  const isNumeric = !isNaN(numericValue) && numericValue !== 0 || value === 0 || value === '0';
  const [display, setDisplay] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!inView || !isNumeric) return;
    if (reduceMotion) { setDisplay(numericValue); return; }
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * numericValue);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, numericValue, isNumeric, reduceMotion]);

  if (!isNumeric) {
    return <span>{prefix}<span data-edit-path="value">{String(value)}</span>{suffix}</span>;
  }

  return (
    <span className="tabular-nums">
      {prefix}{display.toLocaleString('de-DE')}{suffix}
    </span>
  );
}

export function StatsCounterSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badge = (data.badge as string) || '';
  const stats = (data.stats as Stat[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (!stats.length) return null;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-3xl border border-[var(--token-card-border)] bg-[var(--token-section-bg)] px-6 py-14 text-[color:var(--token-body)] shadow-sm md:px-10 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--token-accent)_10%,transparent),transparent_42%)]" />
      <div className="relative z-10">
        {(headline || badge) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mx-auto mb-12 max-w-3xl text-center">
            {badge && <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[color:var(--token-badge-text)] bg-[var(--token-badge-bg)] rounded-full px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>}
            {headline && <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>}
            {subline && <p className="mt-3 text-lg text-[color:var(--token-body)] max-w-xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
          </motion.div>
        )}

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: i * 0.08 }} className="min-h-[140px] rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] px-4 py-7 text-center shadow-[0_18px_50px_color-mix(in_srgb,var(--token-shadow)_6%,transparent)] md:px-5" data-edit-collection="stats" data-edit-index={i}>
              <div className="text-3xl font-bold leading-none text-[color:var(--token-stat-value)] md:text-4xl lg:text-5xl">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="mx-auto mt-4 h-px w-10 bg-[var(--token-divider)]" />
              <div className="mt-4 text-sm font-medium leading-snug text-[color:var(--token-card-body,var(--token-body))] md:text-base" data-edit-path="label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
