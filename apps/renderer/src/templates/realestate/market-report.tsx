'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Home, MapPin } from 'lucide-react';
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
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt,#18181b)] text-[color:var(--token-on-dark-heading,#ffffff)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-14">
          <span className="text-amber-500 text-sm font-semibold uppercase tracking-wider">{region}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-lg text-[color:var(--token-on-dark-heading,#ffffff)/70] mt-4 max-w-2xl" data-edit-path="subline">{plain(subline)}</p>}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--token-card-bg,#ffffff)/5] backdrop-blur-sm border border-[color:var(--token-card-border,#ffffff)/10] rounded-xl p-6"
              >
                <Icon size={20} className="text-amber-500 mb-3" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-[color:var(--token-on-dark-heading,#ffffff)/60] mt-1" data-edit-path="label">{stat.label}</p>
                {stat.trend && <span className="text-xs text-emerald-400 mt-2 inline-block">↑ {stat.trend}</span>}
              </motion.div>
            );
          })}
        </div>

        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-[color:var(--token-on-dark-heading,#ffffff)/60] mt-10 max-w-3xl leading-relaxed"
          >
            {plain(description)}
          </motion.p>
        )}
      </div>
    </section>
  );
}
