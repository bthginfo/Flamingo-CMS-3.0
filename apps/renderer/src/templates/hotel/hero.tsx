'use client';

import { WordReveal } from '@/components/ui/fx';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { Star, CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';
import { plain } from '@/lib/strip-html';

export function HotelHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Hotel';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const badgeIcon = (data.badgeIcon as string) || 'Star';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const trustItems = asList<string>(data.trustItems);
  const trustStripColor = (data.trustStripColor as string) || '';
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const availabilityHint = (data.availabilityHint as string) || '';
  const ratingText = (data.ratingText as string) || '';
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1;
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  const props: HeroProps = { headline, subline: plain(subline), badgeText, badgeIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, availabilityHint, ratingText, bgPosition, bgPositionMobile, overlayColor: overlayColor || undefined, overlayOpacity, imageEffect, imageEffectIntensity, trustStripColor };
  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string;
  subline: string;
  badgeText: string;
  badgeIcon: string;
  trustItems: string[];
  trustStripColor?: string;
  bgImage: string;
  bgImageMobile?: string;
  bgColor: string;
  bgMode: string;
  primaryCta: ButtonValue;
  secondaryCta: ButtonValue;
  availabilityHint: string;
  ratingText: string;
  overlayColor?: string;
  overlayOpacity: number;
  bgPosition?: string;
  bgPositionMobile?: string;
  imageEffect?: ImageEffect;
  imageEffectIntensity?: 'subtle' | 'medium' | 'strong';
};

/* ─── CLASSIC: Fullscreen forest-green/gold gradient, serif feel, gold accents, staggered animations ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, availabilityHint, ratingText, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity, trustStripColor }: HeroProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {(bgMode === 'image' && bgImage) ? (
        <><ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="100vw" />
          {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="100vw" />}
          </ImageEffectWrapper>
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? (
            <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--token-image-overlay) 82%, #07111f) 0%, color-mix(in srgb, var(--token-image-overlay) 58%, transparent) 55%, color-mix(in srgb, var(--token-image-overlay) 36%, transparent) 100%)' }} />
          )}
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1d2e] via-[#1a3550] to-[#0f1d2e]" />
      )}
      {/* grain texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0VjZoLTJWMGgtNHY2aC0ydjhoLTJ2LThoLTJWMGgtNHY2aC0ydjhoNFYyaDRWNmgydi04aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
      {/* scattered stars */}
      <div className="absolute top-1/4 left-[15%] text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_18%,transparent)]"><Star className="text-[color:var(--token-rating-star)]" size={24} /></div>
      <div className="absolute top-[60%] right-[20%] text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_14%,transparent)]"><Star className="text-[color:var(--token-rating-star)]" size={18} /></div>
      <div className="absolute top-[35%] right-[10%] text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_10%,transparent)]"><Star className="text-[color:var(--token-rating-star)]" size={32} /></div>
      {/* border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div style={{ opacity, y }} className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20 text-center">
        {badgeText && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[color:var(--token-divider)] bg-[color:color-mix(in_srgb,#07111f_52%,transparent)] px-5 py-2.5 text-sm text-[color:var(--token-on-dark-heading)] backdrop-blur-md">
            <DynamicIcon name={badgeIcon} size={14} className="text-[color:var(--token-rating-star)]" />
            <span className="font-medium" data-edit-path="badgeText">{badgeText}</span>
          </motion.div>
        )}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-semibold text-[color:var(--token-on-dark-heading)] leading-[0.98]"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.4)' }} data-edit-path="headline"><WordReveal text={headline} /></motion.h1>
        {subline && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-7 max-w-2xl mx-auto text-lg leading-8 text-[color:var(--token-on-dark-body)] rt-content"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            dangerouslySetInnerHTML={{ __html: subline }}
          />
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {primaryCta.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[var(--token-btn-bg)] px-8 py-4 font-semibold text-[color:var(--token-btn-text)] transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto">
              <span className="relative z-10 flex items-center justify-between sm:justify-center sm:gap-2.5 w-full sm:w-auto"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={17} className="transition-transform group-hover:translate-x-1" />}</span>
              <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%]" />
            </a>
          )}
          {secondaryCta.label && (
            <a
              data-edit-link="secondaryCta"
              href={secondaryCta.href || '#'}
              className="inline-flex items-center justify-center rounded-full border px-7 py-4 font-semibold shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--token-image-overlay) 72%, transparent)',
                borderColor: 'var(--token-divider)',
                color: 'var(--token-on-dark-heading)',
              }}
              data-edit-path="label"
            >
              {secondaryCta.label}
            </a>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }}
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-[color:var(--token-on-dark-muted)] ${trustStripColor ? 'rounded-2xl px-4 py-3' : ''}`} style={trustStripColor ? { backgroundColor: trustStripColor } : undefined}>
          {ratingText && <span className="inline-flex items-center gap-2"><Star size={14} className="text-[color:var(--token-rating-star)]" />{ratingText}</span>}
          {availabilityHint && <span className="rounded-full border border-[color:var(--token-badge-border)] bg-[var(--token-badge-bg)] px-3 py-1 text-[color:var(--token-badge-text)]">{availabilityHint}</span>}
          {trustItems.map((item) => (
            <span key={item} className="flex items-center gap-2"><CheckCircle size={14} className="text-[color:var(--token-check)]" />{item}</span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

