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

  if (styleVariant === 'modern') return <HeroModern {...{ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }} />;
  if (styleVariant === 'bold') return <HeroBold {...{ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }} />;
  return <HeroClassic {...{ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }} />;
}

type HeroProps = {
  headline: string; subline: string; bgImage: string; bgImageMobile: string;
  overlayOpacity: number; primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string }; badgeText: string; imageEffect: ImageEffect;
};

function HeroClassic({ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg-alt,#000000)]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" sizes="100vw" />}
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-[var(--token-section-bg-alt,#000000)]" style={{ opacity: overlayOpacity }} />
      {/* Neon glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[180px] bg-red-500/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="max-w-3xl">
          {badgeText && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[var(--token-card-bg,#ffffff)/5] backdrop-blur border border-[color:var(--token-card-border,#ffffff)/10] rounded-full px-4 py-2 text-xs text-[color:var(--token-on-dark-heading,#ffffff)/70] mb-6 uppercase tracking-widest">
              {badgeText}
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black leading-[0.9] text-[color:var(--token-on-dark-heading,#ffffff)] uppercase tracking-tight" data-edit-path="headline">
            {headline}
          </motion.h1>
          {subline && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-lg text-[color:var(--token-on-dark-heading,#ffffff)/60] max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4">
            {primaryCta && (
              <a href={primaryCta.href} className="inline-flex items-center justify-center px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors" style={{ background: 'var(--token-btn-bg, var(--brand-btn-bg, white))', color: 'var(--token-btn-text, var(--brand-btn-text, black))' }} data-edit-path="label">
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a href={secondaryCta.href} className="inline-flex items-center justify-center px-8 py-4 border border-[color:var(--token-card-border,#ffffff)/30] text-[color:var(--token-on-dark-heading,#ffffff)] font-medium uppercase tracking-wider text-sm hover:border-[color:var(--token-card-border,#ffffff)/60] transition-colors" data-edit-path="label">
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
    <section className="relative min-h-[90vh] flex items-end overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg-alt,#09090b)]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" sizes="100vw" />}
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" style={{ opacity: overlayOpacity }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-20 pt-40">
        {badgeText && <p className="text-xs font-mono uppercase tracking-[0.3em] text-[color:var(--token-on-dark-heading,#ffffff)/40] mb-4" data-edit-path="badgeText">{badgeText}</p>}
        <h1 className="text-4xl sm:text-6xl font-light text-[color:var(--token-on-dark-heading,#ffffff)] tracking-tight" data-edit-path="headline">{headline}</h1>
        {subline && <p className="mt-4 text-[color:var(--token-on-dark-heading,#ffffff)/50] max-w-lg" dangerouslySetInnerHTML={{ __html: subline }} />}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {primaryCta && <a href={primaryCta.href} className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-sm" style={{ background: 'var(--token-btn-bg, var(--brand-btn-bg, white))', color: 'var(--token-btn-text, var(--brand-btn-text, black))' }} data-edit-path="label">{primaryCta.label}</a>}
          {secondaryCta && <a href={secondaryCta.href} className="inline-flex items-center justify-center px-6 py-3 border border-[color:var(--token-card-border,#ffffff)/20] text-[color:var(--token-on-dark-heading,#ffffff)/80] text-sm rounded-sm" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
    </section>
  );
}

function HeroBold({ headline, subline, bgImage, bgImageMobile, overlayOpacity, primaryCta, secondaryCta, badgeText, imageEffect }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg-alt,#000000)]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" sizes="100vw" />}
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-[var(--token-section-bg-alt,#000000)]" style={{ opacity: overlayOpacity }} />
      <div className="relative z-10 text-center px-6">
        {badgeText && <p className="text-sm font-black uppercase tracking-[0.5em] text-red-500 mb-6" data-edit-path="badgeText">{badgeText}</p>}
        <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-black text-[color:var(--token-on-dark-heading,#ffffff)] uppercase leading-[0.85] drop-shadow-[0_0_40px_rgba(255,0,0,0.15)]" data-edit-path="headline">
          {headline}
        </h1>
        {subline && <p className="mt-6 text-[color:var(--token-on-dark-heading,#ffffff)/50] text-lg max-w-lg mx-auto" dangerouslySetInnerHTML={{ __html: subline }} />}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {primaryCta && <a href={primaryCta.href} className="px-10 py-4 font-black uppercase tracking-wider text-sm transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)]" style={{ background: 'var(--token-btn-bg, var(--brand-btn-bg, #dc2626))', color: 'var(--token-btn-text, var(--brand-btn-text, white))' }} data-edit-path="label">{primaryCta.label}</a>}
          {secondaryCta && <a href={secondaryCta.href} className="px-10 py-4 border-2 border-[color:var(--token-card-border,#ffffff)] text-[color:var(--token-on-dark-heading,#ffffff)] font-black uppercase tracking-wider text-sm hover:bg-[var(--token-card-bg,#ffffff)] hover:text-[color:var(--token-heading,#000000)] transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.2)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
    </section>
  );
}
