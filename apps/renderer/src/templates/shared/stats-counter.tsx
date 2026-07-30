'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { plain } from '@/lib/strip-html';
import { resolveStatsCounterLayout, splitStatTextValue } from './stats-counter-utils';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Stat = { value: number | string; suffix?: string; prefix?: string; label: string };

function isNumericValue(value: number | string) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return (!Number.isNaN(numericValue) && numericValue !== 0) || value === 0 || value === '0';
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
    <span className="tabular-nums" data-edit-path="value">
      {prefix}{display.toLocaleString('de-DE')}{suffix}
    </span>
  );
}

function ProjectDossier({
  badge,
  headline,
  subline,
  stats,
  inView,
}: {
  badge: string;
  headline: string;
  subline: string;
  stats: Stat[];
  inView: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.46;
  const columnStyle = {
    '--dossier-columns': Math.min(stats.length, 4),
  } as CSSProperties;

  return (
    <section className="relative overflow-hidden rounded-[calc(var(--token-card-radius)*1.1)] border border-[var(--token-card-border)] bg-[var(--token-section-bg)] px-5 py-8 text-[color:var(--token-body)] shadow-[0_30px_100px_color-mix(in_srgb,var(--token-shadow)_8%,transparent)] sm:px-7 md:px-10 md:py-10 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,color-mix(in_srgb,var(--token-accent)_8%,transparent),transparent_32%),radial-gradient(circle_at_90%_0%,color-mix(in_srgb,var(--token-card-bg)_75%,transparent),transparent_38%)]" />

      <motion.header
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration }}
        className="relative z-10 grid gap-5 border-b border-[var(--token-divider)] pb-7 md:grid-cols-[minmax(0,1.3fr)_minmax(17rem,.7fr)] md:items-end md:gap-12 md:pb-9"
      >
        <div>
          {badge && (
            <span
              className="mb-4 inline-flex border-l-2 border-[var(--token-accent)] pl-3 text-[11px] font-bold uppercase tracking-[.24em] text-[color:var(--token-card-muted,var(--token-muted))]"
              data-edit-path="badge"
            >
              {badge}
            </span>
          )}
          {headline && (
            <h2
              className="max-w-3xl text-3xl font-bold leading-[1.02] tracking-[-.035em] text-[color:var(--token-heading)] sm:text-4xl lg:text-5xl"
              data-edit-path="headline"
            >
              {headline}
            </h2>
          )}
        </div>
        {subline && (
          <p
            className="max-w-xl text-base leading-7 text-[color:var(--token-body)] md:justify-self-end md:text-lg"
            data-edit-path="subline"
          >
            {plain(subline)}
          </p>
        )}
      </motion.header>

      <dl
        className="relative z-10 mt-7 border-y border-[var(--token-divider)] md:mt-9 md:grid md:grid-cols-[repeat(var(--dossier-columns),minmax(0,1fr))]"
        style={columnStyle}
      >
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: reduceMotion ? 0 : 0.72, ease: 'easeOut' }}
          className="absolute inset-x-0 top-0 hidden h-[2px] origin-left bg-[var(--token-accent)] md:block"
        />
        {stats.map((stat, i) => {
          const numeric = isNumericValue(stat.value);
          const parts = numeric ? [] : splitStatTextValue(stat.value);
          return (
            <motion.div
              key={`${stat.label}-${i}`}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration, delay: reduceMotion ? 0 : 0.08 + i * 0.07 }}
              className="group relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-b border-[var(--token-divider)] py-6 last:border-b-0 md:block md:border-b-0 md:border-r md:px-6 md:py-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              data-edit-collection="stats"
              data-edit-index={i}
              data-card
            >
              <div className="relative z-10 flex min-h-full flex-col items-center md:mb-8 md:block">
                <span className="relative z-10 inline-grid min-h-7 min-w-8 place-items-center rounded-full bg-[var(--token-section-bg)] px-1 text-[10px] font-bold tabular-nums tracking-[.16em] text-[color:var(--token-card-muted,var(--token-muted))]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="relative z-10 mt-2 size-2 rounded-full border-2 border-[var(--token-section-bg)] bg-[var(--token-accent)] shadow-[0_0_0_1px_var(--token-accent)] md:absolute md:-top-[2.03rem] md:left-0 md:mt-0" />
                {i < stats.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[-1.55rem] top-10 w-px bg-[color:color-mix(in_srgb,var(--token-accent)_72%,var(--token-divider))] md:hidden"
                  />
                )}
              </div>

              <div className="min-w-0">
                <dt
                  className="text-[10px] font-bold uppercase tracking-[.22em] text-[color:var(--token-card-muted,var(--token-muted))]"
                  data-edit-path="label"
                >
                  {stat.label}
                </dt>
                <dd className="mt-3">
                  {numeric ? (
                    <span className="text-3xl font-bold leading-none tracking-[-.035em] text-[color:var(--token-stat-value)] md:text-4xl">
                      <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={inView} />
                    </span>
                  ) : (
                    <span className="flex flex-wrap gap-x-2 gap-y-2" data-edit-path="value">
                      {parts.map((part, partIndex) => (
                        <span
                          key={`${part}-${partIndex}`}
                          className="inline-flex min-h-8 items-center rounded-[calc(var(--token-card-radius)*.35)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] px-2.5 py-1.5 text-sm font-semibold leading-5 text-[color:var(--token-stat-value)] transition-colors duration-200 group-hover:border-[color:color-mix(in_srgb,var(--token-accent)_45%,var(--token-card-border))] sm:text-base"
                        >
                          {part}
                        </span>
                      ))}
                    </span>
                  )}
                </dd>
              </div>
            </motion.div>
          );
        })}
      </dl>

      <div className="relative z-10 mt-5 flex items-center justify-between gap-5">
        <span className="text-[10px] font-bold uppercase tracking-[.22em] text-[color:var(--token-card-muted,var(--token-muted))]">
          Projekt-Dossier
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[var(--token-divider)]" />
        <span className="text-[10px] font-bold tabular-nums tracking-[.18em] text-[color:var(--token-card-muted,var(--token-muted))]">
          {String(stats.length).padStart(2, '0')} FAKTEN
        </span>
      </div>
    </section>
  );
}

export function StatsCounterSection({ data, variant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const stats = (data.stats as Stat[]) || [];
  const layout = resolveStatsCounterLayout(data, variant);
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

  if (layout === 'projectDossier') {
    return (
      <div ref={ref}>
        <ProjectDossier badge={badge} headline={headline} subline={subline} stats={stats} inView={inView} />
      </div>
    );
  }

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
            const parts = numeric ? [] : splitStatTextValue(stat.value);
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
