'use client';

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
  const glowColor = (data.glowColor as string) || 'rgba(239, 68, 68, 0.12)';

  if (styleVariant === 'modern') return <HeroModern {...{ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect, glowColor }} />;
  if (styleVariant === 'bold') return <HeroBold {...{ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect, glowColor }} />;
  return <HeroClassic {...{ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect, glowColor }} />;
}

type HeroProps = {
  headline: string; subline: string; bgImage: string; bgImageMobile: string;
  overlayOpacity: number; primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string }; badgeText: string; imageEffect: ImageEffect; glowColor: string;
};

function HeroClassic({ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect, glowColor }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg-alt)]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" sizes="100vw" />}
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-[var(--token-section-bg-alt)]" style={{ opacity: overlayOpacity }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full blur-[180px]" style={{ backgroundColor: `var(--token-glow-color, ${glowColor})` }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="max-w-3xl">
          {badgeText && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 backdrop-blur border border-[color:var(--token-card-border)] rounded-full px-4 py-2 text-xs text-[color:var(--token-badge-text)] bg-[var(--token-badge-bg)] mb-6 uppercase tracking-widest" data-edit-path="badgeText">
              {badgeText}
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black leading-[0.9] text-[color:var(--token-on-dark-heading)] uppercase tracking-tight" data-edit-path="headline">
            {headline}
          </motion.h1>
          {subline && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--token-body)]" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4">
            {primaryCta && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center justify-center px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }} data-edit-path="label">
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center justify-center px-8 py-4 border border-[color:color-mix(in_srgb,var(--token-card-border)_30%,transparent)] text-[color:var(--token-on-dark-heading)] font-medium uppercase tracking-wider text-sm hover:border-[color:color-mix(in_srgb,var(--token-card-border)_60%,transparent)] transition-colors" style={{ background: 'var(--token-btn-secondary-bg,transparent)', color: 'var(--token-btn-secondary-text,var(--token-on-dark-heading))', borderColor: 'var(--token-btn-secondary-border,color-mix(in_srgb,var(--token-card-border)_30%,transparent))' }} data-edit-path="label">
                {secondaryCta.label}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroModern({ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg-alt)]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" sizes="100vw" />}
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" style={{ opacity: overlayOpacity }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-20 pt-40">
        {badgeText && <p className="text-xs font-mono uppercase tracking-[0.3em] text-[color:var(--token-badge-text)] mb-4" data-edit-path="badgeText">{badgeText}</p>}
        <h1 className="text-4xl sm:text-6xl font-light text-[color:var(--token-on-dark-heading)] tracking-tight" data-edit-path="headline">{headline}</h1>
        {subline && <p className="mt-4 text-[color:var(--token-body)] max-w-lg" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {primaryCta && <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-sm" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }} data-edit-path="label">{primaryCta.label}</a>}
          {secondaryCta && <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center justify-center px-6 py-3 border border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)] text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_80%,transparent)] text-sm rounded-sm" style={{ background: 'var(--token-btn-secondary-bg,transparent)', color: 'var(--token-btn-secondary-text,color-mix(in_srgb,var(--token-on-dark-heading)_80%,transparent))', borderColor: 'var(--token-btn-secondary-border,color-mix(in_srgb,var(--token-card-border)_20%,transparent))' }} data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
    </section>
  );
}

function HeroBold({ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg-alt)]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" sizes="100vw" />}
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-[var(--token-section-bg-alt)]" style={{ opacity: overlayOpacity }} />
      <div className="relative z-10 text-center px-6">
        {badgeText && <p className="text-sm font-black uppercase tracking-[0.5em] text-[color:var(--token-badge-text)] mb-6" data-edit-path="badgeText">{badgeText}</p>}
        <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-black text-[color:var(--token-on-dark-heading)] uppercase leading-[0.85] drop-shadow-[0_0_40px_rgba(255,0,0,0.15)]" data-edit-path="headline">
          {headline}
        </h1>
        {subline && <p className="mt-6 text-[color:var(--token-body)] text-lg max-w-lg mx-auto" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {primaryCta && <a data-edit-link="primaryCta" href={primaryCta.href} className="px-10 py-4 font-black uppercase tracking-wider text-sm transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)]" style={{ background: 'var(--token-btn-bg)', color: 'var(--token-btn-text)' }} data-edit-path="label">{primaryCta.label}</a>}
          {secondaryCta && <a data-edit-link="secondaryCta" href={secondaryCta.href} className="px-10 py-4 border-2 border-[color:var(--token-card-border)] text-[color:var(--token-on-dark-heading)] font-black uppercase tracking-wider text-sm hover:bg-[var(--token-card-bg)] hover:text-[color:var(--token-heading)] transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.2)]" style={{ background: 'var(--token-btn-secondary-bg,transparent)', color: 'var(--token-btn-secondary-text,var(--token-on-dark-heading))', borderColor: 'var(--token-btn-secondary-border,var(--token-card-border))' }} data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
    </section>
  );
}
