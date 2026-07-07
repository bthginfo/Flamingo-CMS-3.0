'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function HeroSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || 'Willkommen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const badgeIcon = (data.badgeIcon as string) || 'Shield';
  const badgeStarsIcon = (data.badgeStarsIcon as string) || '';
  const trustItems = (data.trustItems as string[]) || [];
  const trustStripColor = (data.trustStripColor as string) || '';
  const bgImage = (data.bgImage as string) || (data.backgroundImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const primaryCta = data.primaryCta as { label: string; href: string; icon?: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string; icon?: string } | undefined;
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1;
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  const shared = { headline, subline, badgeText, badgeIcon, badgeStarsIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, trustStripColor, imageEffect, imageEffectIntensity };
  return <HeroClassic {...shared} />;
}

type HeroProps = {
  headline: string;
  subline: string;
  badgeText: string;
  badgeIcon: string;
  badgeStarsIcon: string;  // empty = no stars shown
  trustItems: string[];
  bgImage: string;
  bgImageMobile?: string;
  bgColor: string;
  bgMode: string;
  primaryCta?: { label: string; href: string; icon?: string };
  secondaryCta?: { label: string; href: string; icon?: string };
  overlayColor?: string;
  overlayOpacity: number;
  bgPosition?: string;
  bgPositionMobile?: string;
  trustStripColor?: string;
  imageEffect?: ImageEffect;
  imageEffectIntensity?: 'subtle' | 'medium' | 'strong';
};

/* ─── CLASSIC: Fullscreen gradient overlay, spotlight, floating orbs, pill buttons ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, trustStripColor, imageEffect, imageEffectIntensity }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [heroH, setHeroH] = useState(800);
  useEffect(() => {
    const measure = () => { if (ref.current) setHeroH(ref.current.offsetHeight); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const fadeStart = Math.max(heroH * 0.4, 200);
  const fadeEnd = Math.max(heroH * 0.9, 500);
  const opacity = useTransform(scrollY, [0, fadeStart, fadeEnd], [1, 1, 0]);
  const y = useTransform(scrollY, [0, fadeEnd], [0, 100]);
  const useBgImage = bgMode === 'image' && bgImage;
  // The headline/subline render in on-dark WHITE, so the image needs a DARK
  // scrim — not the light --token-section-bg-alt veil this used to fall back to
  // (that washed white text out to near-invisible over bright photos). Honour an
  // explicit overlayOpacity, otherwise use a legible default. Left-heavy to match
  // the left-aligned copy.
  const scrimAlpha = overlayOpacity > 0 ? overlayOpacity : 0.65;

  return (
    <div ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden -mt-[112px] pt-[112px]">
      {useBgImage ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image data-edit-image="bgImage" src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority={!bgImageMobile} fetchPriority={bgImageMobile ? 'low' : 'high'} sizes="100vw" />
            {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority fetchPriority="high" sizes="100vw" />}
          </ImageEffectWrapper>
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(10,15,25,${Math.min(0.9, scrimAlpha + 0.05).toFixed(2)}) 0%, rgba(10,15,25,${(scrimAlpha * 0.72).toFixed(2)}) 52%, rgba(10,15,25,${(scrimAlpha * 0.42).toFixed(2)}) 100%)` }} />}
        </>
      ) : bgMode === 'color' && bgColor ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : (
        <>
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0VjZoLTJWMGgtNHY2aC0ydjhoLTJ2LThoLTJWMGgtNHY2aC0ydjhoNFYyaDRWNmgydi04aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        </>
      )}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(46, 134, 193, 0.15)" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[color-mix(in_srgb,var(--token-badge-bg)_8%,transparent)] rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-[color-mix(in_srgb,var(--token-section-bg-alt)_15%,transparent)] rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />

      <motion.div style={{ opacity, y }} className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-1 flex items-center py-10 md:py-12">
        <div className="w-full md:-mt-10 lg:-mt-14">
        <div className="max-w-4xl space-y-6">
          <TextGenerateEffect words={headline} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[color:var(--token-on-dark-heading)] !leading-[1.02] break-words" duration={0.6} />
          {badgeText && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm shadow-sm backdrop-blur-md mt-6"
              style={{
                background: 'var(--token-badge-bg)',
                borderColor: 'var(--token-badge-border)',
                color: 'var(--token-badge-text)',
              }}>
              <DynamicIcon name={badgeIcon} size={15} className="text-[color:var(--token-icon)]" />
              <span className="font-medium" data-edit-path="badgeText">{badgeText}</span>
              {badgeStarsIcon && (
                <div className="flex -space-x-0.5 ml-2">
                  {[1,2,3,4,5].map(i => <DynamicIcon key={i} name={badgeStarsIcon} size={12} className="fill-[var(--token-icon)] text-[color:var(--token-icon)]" />)}
                </div>
              )}
            </motion.div>
          )}
          {subline && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}
              className="text-lg sm:text-xl text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_60%,transparent)] leading-relaxed max-w-2xl [&_p]:m-0 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }} className="flex flex-col items-center sm:items-start sm:flex-row gap-4">
            {primaryCta?.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="group relative inline-flex items-center overflow-hidden rounded-full bg-[var(--token-btn-bg)] px-8 py-4 font-semibold text-[color:var(--token-btn-text)] transition-all duration-300 hover:shadow-glow-accent hover:-translate-y-0.5 text-base sm:w-auto">
                <span className="relative z-10 flex items-center w-full justify-between gap-4 sm:justify-center sm:gap-2.5"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={18} className="transition-transform group-hover:translate-x-1" />}</span>
                <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%]" />
              </a>
            )}
            {secondaryCta?.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="btn-secondary group !rounded-full sm:w-auto flex items-center justify-between gap-4 sm:justify-center sm:gap-2">{secondaryCta.icon && <DynamicIcon editPath="secondaryCta.icon" name={secondaryCta.icon} size={18} />}<span data-edit-path="label">{secondaryCta.label}</span></a>
            )}
          </motion.div>
        </div>
        </div>
      </motion.div>
      {trustItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-10 md:pb-14"
        >
          <div
            className={`inline-flex max-w-full flex-wrap justify-center items-center gap-x-5 gap-y-2 rounded-2xl px-4 py-3 text-sm shadow-sm ${trustStripColor ? 'text-[color:var(--token-on-dark-heading)]' : 'bg-[color-mix(in_srgb,var(--token-card-bg)_10%,transparent)] backdrop-blur-md text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_86%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--token-card-border)_18%,transparent)]'}`}
            style={trustStripColor ? { backgroundColor: trustStripColor } : undefined}
          >
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap" data-edit-collection="trustItems" data-edit-index={i}><CheckCircle size={14} className="text-[color:var(--token-check)]" />{item}</span>
            ))}
          </div>
        </motion.div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[color:var(--token-page-bg)] to-transparent pointer-events-none" />
    </div>
  );
}

