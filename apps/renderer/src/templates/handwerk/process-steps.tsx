'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function ProcessStepsSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const steps = (data.steps as { title: string; text: string; icon?: string }[]) || [];
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 rounded-4xl" />
      <div className="relative bg-gradient-to-br from-surface to-white rounded-4xl p-8 sm:p-12 lg:p-20 border border-gray-100/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-badge">
            <span>So funktioniert&apos;s</span>
          </div>
          {headline && <h2 className="section-headline">{headline}</h2>}
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Animated progress line */}
          <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-gray-200 hidden md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-brand-primary via-brand-accent to-brand-secondary rounded-full"
            />
          </div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-8 md:gap-12 items-start group"
              >
                <div className="shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center transition-all duration-500 group-hover:shadow-glow group-hover:scale-110 group-hover:border-brand-primary/20">
                    {step.icon ? (
                      <span className="text-2xl">{step.icon}</span>
                    ) : (
                      <span className="font-display font-bold text-xl bg-gradient-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pt-3">
                  <h3 className="font-display font-semibold text-xl mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
