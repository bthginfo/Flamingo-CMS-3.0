'use client';

import { WordReveal } from '@/components/ui/fx';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function SalonHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Salon';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Beauty';
  const badgeIcon = (data.badgeIcon as string) || 'Sparkles';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const trustItems = asList<string>(data.trustItems);
  const trustStripColor = (data.trustStripColor as string) || '';
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bookingHint = (data.bookingHint as string) || '';
  const ratingText = (data.ratingText as string) || '';
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1;
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  const props = { headline, subline, badgeText, badgeIcon, bgImage, bgImageMobile, bgColor, bgMode, trustItems, primaryCta, secondaryCta, bookingHint, ratingText, bgPosition, bgPositionMobile, overlayColor: overlayColor || undefined, overlayOpacity , imageEffect, imageEffectIntensity, trustStripColor};

  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string; subline: string; badgeText: string; badgeIcon: string; bgImage: string;
  bgImageMobile?: string;
  bgColor: string; bgMode: string;
  trustItems: string[];
  trustStripColor?: string; primaryCta: ButtonValue; secondaryCta: ButtonValue;
  bookingHint: string; ratingText: string;
  overlayColor?: string; overlayOpacity: number;
  bgPosition?: string;
  bgPositionMobile?: string;  imageEffect?: ImageEffect;
  imageEffectIntensity?: 'subtle' | 'medium' | 'strong';
};

/* ─── CLASSIC: Fullscreen bg, organic rose gradient overlay, flowing curves, centered elegant typography ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, bgImage, bgImageMobile, bgColor, bgMode, trustItems, primaryCta, secondaryCta, bookingHint, ratingText, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity, trustStripColor }: HeroProps) {
  const heroHeading = 'var(--token-on-dark-heading)';
  const heroBody = 'var(--token-on-dark-body)';
  const heroMuted = 'var(--token-on-dark-muted)';
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {(bgMode === 'image' && bgImage) ? (
        <><ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="100vw" />
          {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="100vw" />}
          </ImageEffectWrapper>
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? (<div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity ?? 0.6 }} />) : (<div className="absolute inset-0 bg-gradient-to-br from-[#6b2148]/85 via-[#8b3a62]/65 to-[#c0528a]/40" />)}
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#6b2148] via-[#8b3a62] to-[#c0528a]" />
      )}
      {/* Organic flowing curve */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1440 120" className="w-full text-[#ffffff]" preserveAspectRatio="none"><path fill="currentColor" d="M0,60 C360,120 720,0 1080,80 C1260,100 1380,40 1440,60 L1440,120 L0,120Z" /></svg>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {badgeText && (
            <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="section-badge inline-flex items-center gap-2 rounded-full border border-[color:var(--token-badge-border)] bg-[var(--token-badge-bg)] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)] backdrop-blur-sm">
              <DynamicIcon name={badgeIcon} size={14} /><span data-edit-path="badgeText">{badgeText}</span>
            </motion.p>
          )}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="mt-6 text-5xl sm:text-6xl lg:text-8xl font-[700] leading-[0.95]" style={{ color: heroHeading, textShadow: '0 2px 30px rgba(107,33,72,0.5)' }} data-edit-path="headline"><WordReveal text={headline} /></motion.h1>
        {subline && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="mx-auto mt-7 max-w-2xl text-lg leading-8 rt-content" style={{ color: heroBody }} data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-7 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-lg"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={17} />}</a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3 font-semibold backdrop-blur-sm" style={{ background: 'var(--token-btn-secondary-bg)', color: 'var(--token-btn-secondary-text)' }} data-edit-path="label">{secondaryCta.label}</a>}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
          {bookingHint && <span className="rounded-full border border-white/15 bg-white/15 px-4 py-2 backdrop-blur-sm" style={{ color: heroMuted }}>{bookingHint}</span>}
          {ratingText && <span className="rounded-full border border-white/15 bg-white/15 px-4 py-2 backdrop-blur-sm" style={{ color: heroMuted }}>{ratingText}</span>}
          {trustItems.map((item) => <span key={item} className="rounded-full border border-white/15 bg-white/15 px-4 py-2 backdrop-blur-sm" style={{ color: heroMuted, ...(trustStripColor ? { backgroundColor: trustStripColor } : {}) }}>{item}</span>)}
        </motion.div>
      </div>
    </section>
  );
}

