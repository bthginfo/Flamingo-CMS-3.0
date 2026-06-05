'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FeatureShowcaseSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badge = (data.badge as string) || '';
  const text = (data.text as string) || '';
  const image = (data.image as string) || '';
  const features = (data.features as string[]) || [];
  const ctaLabel = (data.ctaLabel as string) || '';
  const ctaHref = (data.ctaHref as string) || '';
  const reversed = data.reversed === true;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? 'lg:direction-rtl' : ''}`}>
      {/* Image with parallax */}
      <motion.div
        style={{ y: imageY }}
        className={`relative overflow-hidden rounded-2xl aspect-[4/3] lg:aspect-auto lg:h-[500px] ${reversed ? 'lg:order-2 lg:direction-ltr' : ''}`}
      >
        {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover scale-110" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className={reversed ? 'lg:order-1 lg:direction-ltr' : ''}>
        {badge && (
          <motion.span initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }} className="section-badge" data-edit-path="badge">
            {badge}
          </motion.span>
        )}
        {headline && (
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="section-headline mt-3" data-edit-path="headline">
            {headline}
          </motion.h2>
        )}
        {subline && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="section-subline mt-2" data-edit-path="subline">
            {plain(subline)}
          </motion.p>
        )}
        {text && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="mt-5 text-zinc-600 leading-relaxed prose prose-sm" dangerouslySetInnerHTML={{ __html: text }} />
        )}

        {features.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }} className="flex items-center gap-2.5" data-edit-collection="features" data-edit-index={i}>
                <div className="w-5 h-5 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <span className="text-sm text-zinc-700">{feat}</span>
              </motion.div>
            ))}
          </div>
        )}

        {ctaLabel && (
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.5 }} className="mt-8">
            <a href={ctaHref || '#'} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
              <span data-edit-path="ctaLabel">{ctaLabel}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
