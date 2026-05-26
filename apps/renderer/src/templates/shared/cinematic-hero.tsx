'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useRef } from 'react';

type Cta = { label?: string; href?: string };
type Fact = { value: string; label: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CinematicHeroSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const eyebrow = (data.eyebrow as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const image = (data.image as string) || '';
  const videoUrl = (data.videoUrl as string) || '';
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const facts = (data.facts as Fact[]) || [];
  const align = (data.align as string) || 'left';
  const overlay = (data.overlay as string) || 'rgba(0,0,0,0.48)';

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden bg-[var(--style-section-bg,#000)] text-[var(--style-body-color,#fff)]">
      <motion.div className="absolute inset-0" style={{ y: mediaY }}>
        {videoUrl ? (
          <video src={videoUrl} poster={image} autoPlay muted loop playsInline className="h-[110%] w-full object-cover" />
        ) : image ? (
          <img src={image} alt="" className="h-[110%] w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[var(--brand-dark,#09090b)]" />
        )}
        <div className="absolute inset-0" style={{ background: overlay }} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
      </motion.div>

      <motion.div style={{ y: copyY, opacity }} className={`relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:pb-24 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
        {eyebrow && <div className="mb-5 inline-flex rounded-full border border-white/20 bg-[var(--style-badge-bg,rgba(255,255,255,0.10))] px-4 py-2 text-xs font-semibold uppercase text-[var(--style-badge-text,#fff)] backdrop-blur">{eyebrow}</div>}
        {headline && <h1 className="max-w-5xl text-5xl font-black leading-[0.95] text-[var(--style-heading-color,#fff)] md:text-7xl lg:text-8xl">{headline}</h1>}
        {subline && <p className={`mt-6 max-w-2xl text-base leading-8 text-[var(--style-subheading-color,rgba(255,255,255,0.78))] md:text-xl ${align === 'center' ? 'mx-auto' : ''}`}>{subline}</p>}

        <div className="mt-9 flex flex-wrap items-center gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-btn-bg,var(--brand-primary,#fff))] px-6 py-3 text-sm font-bold text-[var(--brand-btn-text,#111)] shadow-xl transition hover:brightness-110">{primaryCta.label}<ArrowRight size={16} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/18"><Play size={15} />{secondaryCta.label}</a>}
        </div>

        {facts.length > 0 && (
          <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur md:grid-cols-4">
            {facts.map((fact, i) => (
              <div key={i} className="bg-black/22 p-4">
                <div className="text-2xl font-black">{fact.value}</div>
                <div className="mt-1 text-xs text-[var(--style-text-muted,rgba(255,255,255,0.62))]">{fact.label}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
