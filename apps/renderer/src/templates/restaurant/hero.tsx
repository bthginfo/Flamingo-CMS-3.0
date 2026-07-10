'use client';

import { WordReveal } from '@/components/ui/fx';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function RestaurantHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Restaurant';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const badgeIcon = (data.badgeIcon as string) || 'UtensilsCrossed';
  const badgeStarsIcon = (data.badgeStarsIcon as string) || '';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const trustItems = asList<string>(data.trustItems);
  const trustStripColor = (data.trustStripColor as string) || '';
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1;
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  const props: HeroProps = { headline, subline, badgeText, badgeIcon, badgeStarsIcon, bgImage, bgImageMobile, bgColor, bgMode, trustItems, primaryCta, secondaryCta, bgPosition, bgPositionMobile, overlayColor: overlayColor || undefined, overlayOpacity , imageEffect, imageEffectIntensity, trustStripColor};

  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string;
  subline: string;
  badgeText: string;
  badgeIcon: string;
  badgeStarsIcon: string;
  bgImage: string;
  bgImageMobile?: string;
  bgColor: string;
  bgMode: string;
  trustItems: string[];
  trustStripColor?: string;
  primaryCta: ButtonValue;
  secondaryCta: ButtonValue;
  overlayColor?: string;
  overlayOpacity: number;
  bgPosition?: string;
  bgPositionMobile?: string;
  imageEffect?: ImageEffect;
  imageEffectIntensity?: 'subtle' | 'medium' | 'strong';
};

/* ─── CLASSIC: Fullscreen bg, warm gradient overlay, grain texture, spotlight, staggered fade-in ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, bgImage, bgImageMobile, bgColor, bgMode, trustItems, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity, trustStripColor }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-btn-bg)]" style={{ background: 'var(--token-section-bg, transparent)' }}>
      {/* Background image + overlays */}
      {(bgMode === 'image' && bgImage) ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} sizes="100vw" />
            {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} sizes="100vw" />}
          </ImageEffectWrapper>
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? (<div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity ?? 0.5 }} />) : (<div className="absolute inset-0 bg-black/58" />)}
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      {/* Warm gradient overlay (only if no custom overlay) */}
      {!overlayColor && <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.5))' }} />}
      {/* SVG grain texture */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] bg-repeat" />
      {/* Warm spotlight */}
      <div className="absolute top-1/4 left-1/3 h-[700px] w-[700px] animate-pulse rounded-full bg-[color-mix(in_srgb,var(--token-badge-bg)_45%,transparent)] blur-[150px]" style={{ animationDuration: '6s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badgeText && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[color:color-mix(in_srgb,#ffffff_24%,transparent)] bg-[color:color-mix(in_srgb,#000000_44%,transparent)] px-5 py-2.5 text-sm text-white backdrop-blur-md mb-8">
              <DynamicIcon name={badgeIcon} size={14} className="text-[color:var(--token-eyebrow)]" />
              <span className="font-medium" data-edit-path="badgeText">{badgeText}</span>
              {badgeStarsIcon && (
                <div className="flex -space-x-0.5 ml-1">
                  {[1, 2, 3, 4, 5].map(i => <DynamicIcon key={i} name={badgeStarsIcon} size={11} className="fill-current text-[color:var(--token-eyebrow)]" />)}
                </div>
              )}
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-[700] leading-[0.95] text-[color:var(--token-on-dark-heading)]"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }} data-edit-path="headline"><WordReveal text={headline} /></motion.h1>

          {/* Subline */}
          {subline && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 max-w-2xl mx-auto text-lg leading-8 text-[color:var(--token-on-dark-body)] rt-content"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {primaryCta.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href || '#'}
                className="group inline-flex items-center justify-between sm:justify-center sm:gap-2 rounded-full bg-[var(--token-btn-bg)] px-8 py-4 font-semibold text-[color:var(--token-btn-text)] transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto">
                <span data-edit-path="label">{primaryCta.label}</span>
                {primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={17} className="transition-transform group-hover:translate-x-1" />}
              </a>
            )}
            {secondaryCta.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-8 py-4 text-[color:var(--token-btn-secondary-text)] font-medium transition-all hover:brightness-110 text-sm w-full sm:w-auto">
                <span data-edit-path="label">{secondaryCta.label}</span>
                {secondaryCta.icon && <DynamicIcon editPath="secondaryCta.icon" name={secondaryCta.icon} size={14} />}
              </a>
            )}
          </motion.div>

          {/* Trust items */}
          {trustItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }}
              className={`mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[color:var(--token-on-dark-muted)] ${trustStripColor ? 'rounded-2xl px-4 py-3' : ''}`} style={trustStripColor ? { backgroundColor: trustStripColor } : undefined}>
              {trustItems.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[color:var(--token-check)]" />{item}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

