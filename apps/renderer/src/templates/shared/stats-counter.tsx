'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Stat = { value: number | string; suffix?: string; prefix?: string; label: string };

function isNumericValue(value: number | string) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return (!Number.isNaN(numericValue) && numericValue !== 0) || value === 0 || value === '0';
}

function textParts(value: number | string) {
  return String(value)
    .split(/[·•|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function AnimatedNumber({ value, prefix, suffix, inView }: { value: number | string; prefix?: string; suffix?: string; inView: boolean }) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  const isNumeric = isNumericValue(value);
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
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const stats = (data.stats as Stat[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const gridClass = stats.length === 1
    ? 'max-w-2xl grid-cols-1'
    : stats.length === 2
      ? 'max-w-4xl grid-cols-1 md:grid-cols-2'
      : stats.length === 3
        ? 'max-w-6xl grid-cols-1 md:grid-cols-3'
        : 'max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  if (!stats.length) return null;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[calc(var(--token-card-radius)*1.35)] border border-[var(--token-card-border)] bg-[var(--token-section-bg)] px-5 py-12 text-[color:var(--token-body)] shadow-[0_30px_100px_color-mix(in_srgb,var(--token-shadow)_8%,transparent)] md:px-10 md:py-16 lg:px-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,color-mix(in_srgb,var(--token-accent)_13%,transparent),transparent_34%),linear-gradient(135deg,transparent_45%,color-mix(in_srgb,var(--token-accent)_5%,transparent))]" />
      <div className="relative z-10">
        {(headline || badge) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-10 grid items-end gap-5 border-b border-[var(--token-divider)] pb-8 md:mb-12 md:grid-cols-[minmax(0,1.25fr)_minmax(16rem,.75fr)] md:gap-10">
            <div>
              {badge && <span className="mb-4 inline-flex rounded-full bg-[var(--token-badge-bg)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-[color:var(--token-badge-text)]" data-edit-path="badge">{badge}</span>}
              {headline && <h2 className="max-w-3xl text-3xl font-bold leading-[.98] tracking-[-.04em] text-[color:var(--token-heading)] md:text-4xl lg:text-5xl" data-edit-path="headline">{headline}</h2>}
            </div>
            {subline && <p className="max-w-xl text-base leading-7 text-[color:var(--token-body)] md:justify-self-end md:text-lg" data-edit-path="subline">{plain(subline)}</p>}
          </motion.div>
        )}

        <div className={`mx-auto grid gap-4 md:gap-5 ${gridClass}`}>
          {stats.map((stat, i) => {
            const numeric = isNumericValue(stat.value);
            const parts = numeric ? [] : textParts(stat.value);
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group relative min-h-[12.5rem] overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-[0_18px_55px_color-mix(in_srgb,var(--token-shadow)_7%,transparent)] transition duration-300 hover:-translate-y-1 hover:border-[color:color-mix(in_srgb,var(--token-accent)_45%,var(--token-card-border))] md:p-7"
                data-edit-collection="stats"
                data-edit-index={i}
                data-card
              >
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-[.32] bg-[var(--token-accent)] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-bold tracking-[.18em] text-[color:var(--token-card-muted,var(--token-muted))]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs font-semibold uppercase tracking-[.12em] text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="label">{stat.label}</span>
                </div>
                {numeric ? (
                  <div className="mt-12 text-4xl font-bold leading-none tracking-[-.04em] text-[color:var(--token-stat-value)] md:text-5xl">
                    <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={inView} />
                  </div>
                ) : (
                  <div className="mt-8 flex flex-wrap gap-2.5 text-[color:var(--token-stat-value)]" data-edit-path="value">
                    {parts.map((part, partIndex) => (
                      <span key={`${part}-${partIndex}`} className="rounded-full border border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-section-bg)_62%,transparent)] px-3.5 py-2 text-sm font-bold leading-none">
                        {part}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
