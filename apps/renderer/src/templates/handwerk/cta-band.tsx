'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function CtaBandSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const cta = data.ctaPrimary as { label: string; href: string } | undefined;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-4xl"
    >
      {/* Animated gradient background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 scale-110 bg-hero-gradient"
      />

      {/* Gradient mesh orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/15 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-secondary/10 rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 text-center text-white px-6 py-20 sm:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm mb-8"
        >
          <Sparkles size={14} className="text-brand-accent" />
          <span>{badgeText || 'Jetzt Termin sichern'}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight !leading-[1.1]"
        >
          {headline}
        </motion.h2>

        {subline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl opacity-70 mb-10 max-w-2xl mx-auto"
          >
            {subline}
          </motion.p>
        )}

        {cta?.label && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a
              href={cta.href}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-brand-accent px-10 py-5 font-semibold text-gray-900 transition-all duration-300 hover:shadow-glow-accent hover:-translate-y-0.5 text-lg"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                {cta.label}
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%]" />
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
