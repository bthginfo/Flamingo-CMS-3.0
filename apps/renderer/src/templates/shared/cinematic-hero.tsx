'use client';

import { WordReveal } from '@/components/ui/fx';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { plain } from '@/lib/strip-html';
import { ResilientImage } from '@/components/ui/resilient-image';

type Cta = { label?: string; href?: string };
type Fact = { value: string; label: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CinematicHeroSection({ data }: Props) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const video = videoRef.current;
    if (!mounted || !video) return;
    if (prefersReducedMotion) {
      video.pause();
      return;
    }
    void video.play().catch(() => {
      // Browser autoplay policy may still reject playback; the poster remains.
    });
  }, [mounted, prefersReducedMotion]);
  const reduceMotion = mounted && Boolean(prefersReducedMotion);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const requestedImageEffect = (data.imageEffect as ImageEffect) || 'parallax';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';
  const parallaxRange = requestedImageEffect === 'parallax'
    ? (imageEffectIntensity === 'subtle' ? '8%' : imageEffectIntensity === 'strong' ? '24%' : '16%')
    : '0%';
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', parallaxRange]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['-7%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const eyebrow = (data.eyebrow as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const image = (data.image as string) || (data.bgImage as string) || (data.backgroundImage as string) || '';
  const videoUrl = (data.videoUrl as string) || '';
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const facts = (data.facts as Fact[]) || [];
  // trustItems (plain strings) render as fact labels when no facts are given.
  const trustItems = Array.isArray(data.trustItems) ? (data.trustItems as string[]).map((t) => ({ value: '', label: t })) : [];
  const factItems = facts.length ? facts : trustItems;
  const trustStripColor = (data.trustStripColor as string) || '';
  const align = (data.align as string) || 'left';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 0.48;
  const hexToRgba = (hex: string, a: number) => {
    const m = hex.trim().match(/^#([0-9a-f]{6})$/i);
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };
  const overlay = (data.overlay as string) || (overlayColor ? hexToRgba(overlayColor, overlayOpacity) : 'rgba(0,0,0,0.48)');
  const heroText = 'var(--token-on-dark-heading)';
  const heroBody = 'var(--token-on-dark-body)';
  const heroMuted = 'var(--token-on-dark-muted)';

  const mediaContent = (
    <>
      {videoUrl ? (
        <video ref={videoRef} src={videoUrl} poster={image} autoPlay={false} muted loop playsInline className="h-[110%] w-full object-cover" />
      ) : image ? (
        <ResilientImage data-edit-image="image" src={image} alt="" className="h-[110%] w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-[var(--token-section-bg)]" />
      )}
      <div className="absolute inset-0" style={{ background: overlay }} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
    </>
  );

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-[var(--token-section-bg)]" style={{ color: heroBody }}>
      {requestedImageEffect === 'kenBurns' ? (
        <ImageEffectWrapper effect="kenBurns" intensity={imageEffectIntensity} className="absolute inset-0">
          {mediaContent}
        </ImageEffectWrapper>
      ) : (
        <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { y: mediaY }}>
          {mediaContent}
        </motion.div>
      )}

      <motion.div style={reduceMotion ? undefined : { y: copyY, opacity }} className={`relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-14 pt-28 sm:px-6 md:pb-16 md:pt-32 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
        {eyebrow && <div className="section-badge mb-5 backdrop-blur" data-color-role="badge" data-edit-path="eyebrow">{eyebrow}</div>}
        {headline && <h1 className="max-w-5xl break-words text-[clamp(2.75rem,11vw,5rem)] font-black leading-[0.96] tracking-[-0.035em] [overflow-wrap:anywhere] md:text-7xl lg:text-8xl" style={{ color: heroText }} data-edit-path="headline"><WordReveal text={headline} /></h1>}
        {subline && <p className={`mt-6 max-w-2xl text-base leading-8 md:text-xl ${align === 'center' ? 'mx-auto' : ''}`} style={{ color: heroBody }} data-edit-path="subline">{plain(subline)}</p>}

        <div className="mt-9 flex w-full flex-wrap items-center gap-3 sm:w-auto">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-6 py-3 text-center text-sm font-bold text-[color:var(--token-btn-text)] shadow-xl transition hover:brightness-110 sm:w-auto"><span data-edit-path="label">{primaryCta.label}</span><ArrowRight size={16} /></a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--token-button-radius)] border border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-6 py-3 text-center text-sm font-bold text-[color:var(--token-btn-secondary-text)] shadow-sm backdrop-blur transition hover:brightness-110 sm:w-auto"><Play size={15} /><span data-edit-path="label">{secondaryCta.label}</span></a>}
        </div>

        {factItems.length > 0 && (
          <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-4">
            {factItems.map((fact, i) => (
              <div key={i} className="rounded-2xl border border-[color:var(--token-card-border)] p-4 md:p-5" style={{ backgroundColor: trustStripColor || 'transparent' }} data-card data-edit-collection="facts" data-edit-index={i}>
                <div className="text-2xl font-black" style={{ color: heroText }} data-edit-path="value">{fact.value}</div>
                <div className="mt-1 text-xs" style={{ color: heroMuted }} data-edit-path="label">{fact.label}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
