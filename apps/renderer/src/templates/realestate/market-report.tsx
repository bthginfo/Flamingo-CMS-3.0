'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Home, MapPin, TrendingUp } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Stat = { label: string; value: string; trend?: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function MarketReportSection({ data }: Props) {
  const headline = (data.headline as string) || 'Marktbericht';
  const subline = (data.subline as string) || '';
  const region = (data.region as string) || '';
  const stats = (data.stats as Stat[]) || [];
  const description = (data.description as string) || '';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const icons = [TrendingUp, Home, MapPin, TrendingUp, Home];

  return (
    <section ref={ref} className="bg-[var(--token-section-bg-alt)] py-20 text-[color:var(--token-body)] md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-14">
          {region && (
            <span className="inline-flex rounded-full border border-[color:var(--token-badge-border)] bg-[var(--token-badge-bg)] px-3 py-1 text-sm font-semibold uppercase tracking-wider text-[color:var(--token-badge-text)]">
              {region}
            </span>
          )}
          <h2 className="mt-2 text-3xl font-bold text-[color:var(--token-heading)] md:text-4xl" data-edit-path="headline">
            {headline}
          </h2>
          {subline && (
            <p className="mt-4 max-w-2xl text-lg text-[color:var(--token-muted)]" data-edit-path="subline">
              {plain(subline)}
            </p>
          )}
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl shadow-black/5"
              >
                <Icon size={20} className="mb-3 text-[color:var(--token-icon)]" />
                <p className="text-3xl font-bold text-[color:var(--token-stat-value)]" data-edit-path="value">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="label">
                  {stat.label}
                </p>
                {stat.trend && (
                  <span className="mt-3 inline-block rounded-full bg-[var(--token-card-badge-bg)] px-2.5 py-1 text-xs font-semibold text-[color:var(--token-card-badge-text)]">
                    {stat.trend}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-10 max-w-3xl leading-relaxed text-[color:var(--token-body)]"
            data-edit-path="description"
          >
            {plain(description)}
          </motion.p>
        )}
      </div>
    </section>
  );
}
