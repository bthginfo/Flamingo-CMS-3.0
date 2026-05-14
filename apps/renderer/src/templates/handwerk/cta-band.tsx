'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CtaBandSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const cta = data.ctaPrimary as { label: string; href: string } | undefined;

  if (styleVariant === 'modern') return <CtaModern headline={headline} subline={subline} badgeText={badgeText} cta={cta} />;
  if (styleVariant === 'bold') return <CtaBold headline={headline} subline={subline} badgeText={badgeText} cta={cta} />;
  return <CtaClassic headline={headline} subline={subline} badgeText={badgeText} cta={cta} />;
}

type CProps = { headline: string; subline: string; badgeText: string; cta?: { label: string; href: string } };

/* ─── CLASSIC: Gradient bg, centered, pill cta, floating orbs ─── */
function CtaClassic({ headline, subline, badgeText, cta }: CProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.98 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-4xl">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110 bg-hero-gradient" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/15 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>
      <div className="relative z-10 text-center text-white px-6 py-20 sm:py-24 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm mb-8">
          <Sparkles size={14} className="text-brand-accent" /><span>{badgeText || 'Jetzt Termin sichern'}</span>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight !leading-[1.1]">{headline}</motion.h2>
        {subline && <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="text-lg sm:text-xl opacity-70 mb-10 max-w-2xl mx-auto">{subline}</motion.p>}
        {cta?.label && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}>
            <a href={cta.href} className="group inline-flex items-center gap-2.5 bg-brand-accent px-8 py-4 rounded-full font-semibold text-gray-900 hover:shadow-glow-accent hover:-translate-y-0.5 transition-all">
              {cta.label}<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── MODERN: Pure text, large font, underline link, white bg ─── */
function CtaModern({ headline, subline, cta }: CProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}
      className="text-center py-24 lg:py-32">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight !leading-[1.1] max-w-4xl mx-auto">
        {headline}
      </h2>
      {subline && <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto">{subline}</p>}
      {cta?.label && (
        <a href={cta.href} className="group inline-flex items-center gap-3 text-gray-900 font-medium text-lg mt-10 border-b-2 border-gray-900 pb-1 hover:border-brand-accent hover:text-brand-accent transition-colors">
          {cta.label}<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      )}
    </motion.div>
  );
}

/* ─── BOLD: Full-width accent block, text left, angular ─── */
function CtaBold({ headline, subline, badgeText, cta }: CProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
      className="bg-brand-dark text-white p-10 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
      <div>
        {badgeText && <span className="inline-block bg-brand-accent text-brand-dark font-bold text-xs uppercase tracking-widest px-3 py-1.5 mb-4">{badgeText}</span>}
        <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tight">{headline}</h2>
        {subline && <p className="text-white/50 mt-3 font-medium max-w-xl">{subline}</p>}
      </div>
      {cta?.label && (
        <a href={cta.href} className="inline-flex items-center gap-3 bg-brand-accent text-brand-dark font-bold uppercase tracking-wider px-8 py-4 text-base hover:translate-x-1 transition-transform shadow-[4px_4px_0_rgba(255,255,255,0.2)] shrink-0">
          {cta.label}<ArrowRight size={18} />
        </a>
      )}
    </motion.div>
  );
}
