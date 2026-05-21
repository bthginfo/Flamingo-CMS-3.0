'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Stat = { value: number; suffix?: string; prefix?: string; label: string };

function AnimatedNumber({ value, prefix, suffix, inView }: { value: number; prefix?: string; suffix?: string; inView: boolean }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

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
    <div ref={ref} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-20 px-6 text-white">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="relative z-10">
        {(headline || badge) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-16">
            {badge && <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)] bg-white/10 rounded-full px-4 py-1.5 mb-4">{badge}</span>}
            {headline && <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{headline}</h2>}
            {subline && <p className="mt-3 text-lg text-zinc-400 max-w-xl mx-auto">{subline}</p>}
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="mt-2 text-sm md:text-base text-zinc-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
