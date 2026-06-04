'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useRef } from 'react';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { plain } from '@/lib/strip-html';

type Cta = { label?: string; href?: string };
type Fact = { value: string; label: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CinematicHeroSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageEffect = (data.imageEffect as ImageEffect) || 'parallax';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';
  const parallaxRange = imageEffect === 'parallax'
    ? (imageEffectIntensity === 'subtle' ? '8%' : imageEffectIntensity === 'strong' ? '24%' : '16%')
    : '0%';
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', parallaxRange]);
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
  const heroText = 'var(--token-on-dark-heading, var(--style-heading-color, #ffffff))';
  const heroBody = 'var(--token-on-dark-body, var(--style-body-color, rgba(255,255,255,0.82)))';
  const heroMuted = 'var(--token-on-dark-muted, var(--style-text-muted, rgba(255,255,255,0.68)))';

  const mediaContent = (
    <>
      {videoUrl ? (
        <video src={videoUrl} poster={image} autoPlay muted loop playsInline className="h-[110%] w-full object-cover" />
      ) : image ? (
        <img src={image} alt="" className="h-[110%] w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-[var(--token-section-bg,var(--style-section-bg,var(--brand-dark,#09090b)))]" />
      )}
      <div className="absolute inset-0" style={{ background: overlay }} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
    </>
  );

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-[var(--token-section-bg,var(--style-section-bg,#000))]" style={{ color: heroBody }}>
      {imageEffect === 'kenBurns' ? (
        <ImageEffectWrapper effect="kenBurns" intensity={imageEffectIntensity} className="absolute inset-0">
          {mediaContent}
        </ImageEffectWrapper>
      ) : (
        <motion.div className="absolute inset-0" style={{ y: mediaY }}>
          {mediaContent}
        </motion.div>
      )}

      <motion.div style={{ y: copyY, opacity }} className={`relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:pb-24 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
        {eyebrow && <div className="mb-5 inline-flex rounded-full border border-[var(--token-badge-border,var(--style-badge-border,rgba(255,255,255,0.20)))] bg-[var(--token-badge-bg,var(--style-badge-bg,rgba(255,255,255,0.14)))] px-4 py-2 text-xs font-semibold uppercase text-[var(--token-badge-text,var(--style-badge-text,#fff))] backdrop-blur">{eyebrow}</div>}
        {headline && <h1 className="max-w-5xl text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl" style={{ color: heroText }}>{headline}</h1>}
        {subline && <p className={`mt-6 max-w-2xl text-base leading-8 md:text-xl ${align === 'center' ? 'mx-auto' : ''}`} style={{ color: heroBody }}>{plain(subline)}</p>}

        <div className="mt-9 flex flex-wrap items-center gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg,var(--brand-btn-bg,var(--style-accent-color,#fff)))] px-6 py-3 text-sm font-bold text-[var(--token-btn-text,var(--brand-btn-text,#111))] shadow-xl transition hover:brightness-110">{primaryCta.label}<ArrowRight size={16} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--style-border-color,rgba(255,255,255,0.32))] bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/15" style={{ color: heroText }}><Play size={15} />{secondaryCta.label}</a>}
        </div>

        {facts.length > 0 && (
          <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {facts.map((fact, i) => (
              <div key={i} className="rounded-2xl border border-white/22 bg-transparent p-4 backdrop-blur-sm md:p-5">
                <div className="text-2xl font-black" style={{ color: heroText }}>{fact.value}</div>
                <div className="mt-1 text-xs" style={{ color: heroMuted }}>{fact.label}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
