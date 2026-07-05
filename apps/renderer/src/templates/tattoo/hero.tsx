'use client';

import { WordReveal } from '@/components/ui/fx';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function TattooHeroSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || 'Ink District';
  const subline = (data.subline as string) || '';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? 0.6;
  const primaryCta = data.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string } | undefined;
  const badgeText = (data.badgeText as string) || '';
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';

  return <HeroClassic {...{ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }} />;
}

type HeroProps = {
  headline: string; subline: string; bgImage: string; bgImageMobile: string;
  overlayOpacity: number; primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string }; badgeText: string; imageEffect: ImageEffect;
};

function HeroClassic({ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg-alt)]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" sizes="100vw" />}
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-[var(--token-section-bg-alt)]" style={{ opacity: overlayOpacity }} />
      {/* Neon glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[180px] bg-red-500/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="max-w-3xl">
          {badgeText && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[var(--token-badge-bg)] backdrop-blur border border-[color:var(--token-badge-border)] rounded-full px-4 py-2 text-xs text-[color:var(--token-badge-text)] mb-6 uppercase tracking-widest" data-edit-path="badgeText">
              {badgeText}
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black leading-[0.9] text-[color:var(--token-on-dark-heading)] uppercase tracking-tight" data-edit-path="headline"><WordReveal text={headline} /></motion.h1>
          {subline && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-lg text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4">
            {primaryCta && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center justify-center px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }} data-edit-path="label">
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center justify-center px-8 py-4 border border-[color:var(--token-btn-secondary-border)] text-[color:var(--token-btn-secondary-text)] font-medium uppercase tracking-wider text-sm hover:border-[color:var(--token-btn-secondary-border)] transition-colors" data-edit-path="label">
                {secondaryCta.label}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

