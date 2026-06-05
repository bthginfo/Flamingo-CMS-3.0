'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Stat = { value: number | string; suffix?: string; prefix?: string; label: string };

function AnimatedNumber({ value, prefix, suffix, inView }: { value: number | string; prefix?: string; suffix?: string; inView: boolean }) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  const isNumeric = !isNaN(numericValue) && numericValue !== 0 || value === 0 || value === '0';
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView || !isNumeric) return;
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
  }, [inView, numericValue, isNumeric]);

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
    <div ref={ref} className="relative overflow-hidden rounded-2xl bg-[var(--token-section-bg-alt)] py-20 px-6 text-[var(--token-body)]">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[color-mix(in_srgb,var(--token-accent)_20%,transparent)] rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[color-mix(in_srgb,var(--token-accent)_10%,transparent)] rounded-full blur-3xl translate-y-1/2" />

      <div className="relative z-10">
        {(headline || badge) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-16">
            {badge && <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[var(--token-badge-text)] bg-[var(--token-badge-bg)] rounded-full px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>}
            {headline && <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--token-heading)]" data-edit-path="headline">{headline}</h2>}
            {subline && <p className="mt-3 text-lg text-[var(--token-body)] max-w-xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }} className="text-center" data-edit-collection="stats" data-edit-index={i}>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--token-accent)]">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="mt-2 text-sm md:text-base text-[var(--token-body)] font-medium" data-edit-path="label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
