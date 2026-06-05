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
  const bgImage = (data.bgImage as string) || '';
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
  if (styleVariant === 'modern') return <HeroModern {...shared} />;
  if (styleVariant === 'bold') return <HeroBold {...shared} />;
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

  return (
    <div ref={ref} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden -mt-[112px] pt-[112px]">
      {useBgImage ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image data-edit-image="bgImage" src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="100vw" />
            {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="100vw" />}
          </ImageEffectWrapper>
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : <div className="absolute inset-0 bg-gradient-to-r from-[var(--token-section-bg-alt)/90] via-[var(--token-section-bg-alt)/70] to-[var(--token-section-bg-alt)/50]" />}
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
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--token-badge-bg)/8] rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-[var(--token-section-bg-alt)/15] rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />

      <motion.div style={{ opacity, y }} className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-1 flex items-center py-10 md:py-12">
        <div className="w-full md:-mt-10 lg:-mt-14">
        <div className="max-w-4xl space-y-6">
          <TextGenerateEffect words={headline} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[color:var(--token-on-dark-heading)] !leading-[1.02] break-words" duration={0.6} />
          {badgeText && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2.5 bg-[var(--token-card-bg)]/[0.07] backdrop-blur-md border border-[color:var(--token-card-border)]/[0.12] rounded-full px-5 py-2.5 text-sm text-[color:var(--token-on-dark-heading)/90] mt-6">
              <DynamicIcon name={badgeIcon} size={15} className="text-[color:var(--token-eyebrow)]" />
              <span className="font-medium" data-edit-path="badgeText">{badgeText}</span>
              {badgeStarsIcon && (
                <div className="flex -space-x-0.5 ml-2">
                  {[1,2,3,4,5].map(i => <DynamicIcon key={i} name={badgeStarsIcon} size={12} className="fill-[var(--token-eyebrow)] text-[color:var(--token-eyebrow)]" />)}
                </div>
              )}
            </motion.div>
          )}
          {subline && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}
              className="text-lg sm:text-xl text-[color:var(--token-on-dark-heading)/60] leading-relaxed max-w-2xl [&_p]:m-0 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }} className="flex flex-col items-center sm:items-start sm:flex-row gap-4">
            {primaryCta?.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="group relative inline-flex items-center overflow-hidden rounded-full bg-[var(--token-badge-bg)] px-8 py-4 font-semibold text-[color:var(--token-heading)] transition-all duration-300 hover:shadow-glow-accent hover:-translate-y-0.5 text-base sm:w-auto">
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
            className={`inline-flex max-w-full flex-wrap justify-center items-center gap-x-5 gap-y-2 rounded-2xl px-4 py-3 text-sm shadow-sm ${trustStripColor ? 'text-[color:var(--token-on-dark-heading)]' : 'bg-[var(--token-card-bg)]/10 backdrop-blur-md text-[color:var(--token-on-dark-heading)/86] ring-1 ring-[color:var(--token-card-border)]/18'}`}
            style={trustStripColor ? { backgroundColor: trustStripColor } : undefined}
          >
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap" data-edit-collection="trustItems" data-edit-index={i}><CheckCircle size={14} className="text-[color:var(--token-eyebrow)]" />{item}</span>
            ))}
          </div>
        </motion.div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}

/* ─── MODERN: Split layout, text left / image right, generous whitespace, understated ─── */
function HeroModern({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, trustStripColor, imageEffect, imageEffectIntensity }: HeroProps) {
  return (
    <div className="relative min-h-[100svh] flex items-center -mt-[112px] pt-[112px] bg-[var(--token-card-bg)]">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-12 md:py-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          {badgeText && (
            <div className="flex items-center gap-3 text-sm text-[color:var(--token-body)] mb-8 tracking-wide uppercase">
              <span className="w-8 h-px bg-gray-300" /><span data-edit-path="badgeText">{badgeText}</span>
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-[color:var(--token-heading)] !leading-[1.1] tracking-tight break-words" data-edit-path="headline">
            {headline}
          </h1>
          {subline && <div className="text-lg text-[color:var(--token-body)] leading-relaxed mt-8 max-w-lg [&_p]:inline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
          <div className="flex flex-col sm:flex-row items-start gap-6 mt-12">
            {primaryCta?.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="group inline-flex items-center justify-between sm:justify-center sm:gap-3 w-full sm:w-auto text-[color:var(--token-heading)] font-medium text-base border-b-2 border-[color:var(--token-card-border)] pb-1 hover:border-[var(--token-card-border)] hover:text-[color:var(--token-eyebrow)] transition-colors">
                <span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={16} className="transition-transform group-hover:translate-x-1" />}
              </a>
            )}
            {secondaryCta?.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--token-card-border)] px-7 py-3 text-[color:var(--token-muted)] hover:text-[color:var(--token-muted)] hover:border-[color:var(--token-card-border)] transition-colors text-sm w-full sm:w-auto">
                <Phone size={14} /><span data-edit-path="label">{secondaryCta.label}</span>
              </a>
            )}
          </div>
          {trustItems.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-16 text-xs text-[color:var(--token-body)] uppercase tracking-wider">
              {trustItems.map((item, i) => <span key={i} data-edit-collection="trustItems" data-edit-index={i}>{item}</span>)}
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {(bgMode === 'image' && bgImage) ? (
            <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="relative aspect-[4/5] rounded-[0.5rem] overflow-hidden">
              <Image data-edit-image="bgImage" src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="50vw" />
              {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="50vw" />}
              {overlayColor && overlayOpacity ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : null}
            </ImageEffectWrapper>
          ) : (bgMode === 'color' && bgColor) ? (
            <div className="aspect-[4/5] rounded-[0.5rem]" style={{ backgroundColor: bgColor }} />
          ) : (
            <div className="aspect-[4/5] rounded-[0.5rem] bg-gradient-to-br from-gray-50 to-gray-100 border border-[color:var(--token-card-border)]" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── BOLD: Full-width dark block, diagonal accent stripe, sharp edges, uppercase ─── */
function HeroBold({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, trustStripColor, imageEffect, imageEffectIntensity }: HeroProps) {
  const useBgImage = bgMode === 'image' && bgImage;
  return (
    <div className="relative min-h-[100svh] flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg-alt)]" style={bgMode === 'color' && bgColor ? { backgroundColor: bgColor } : undefined}>
      {useBgImage && (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image data-edit-image="bgImage" src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="100vw" />
            {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="100vw" />}
          </ImageEffectWrapper>
          <div className="absolute inset-0 bg-[var(--token-section-bg-alt)/80]" />
          {overlayColor && overlayOpacity ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : null}
        </>
      )}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--token-badge-bg)/10] skew-x-[-12deg] translate-x-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20">
        <div className="max-w-5xl">
          {badgeText && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
              className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] font-bold text-xs uppercase tracking-widest px-4 py-2 mb-8" data-edit-path="badgeText">
              {badgeText}
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black text-[color:var(--token-on-dark-heading)] uppercase !leading-[0.9] tracking-tight break-words" data-edit-path="headline">
            {headline}
          </motion.h1>
          {subline && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-[color:var(--token-on-dark-heading)/50] mt-8 max-w-2xl font-medium rt-content" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-12">
            {primaryCta?.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center justify-between sm:justify-center sm:gap-3 w-full sm:w-auto bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] font-bold uppercase tracking-wider px-8 py-4 text-base hover:translate-x-1 transition-transform shadow-[4px_4px_0_rgba(255,255,255,0.2)]">
                <span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={18} />}
              </a>
            )}
            {secondaryCta?.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center gap-2 border-2 border-[color:var(--token-card-border)/30] text-[color:var(--token-on-dark-heading)] font-bold uppercase tracking-wider px-8 py-4 text-base hover:border-[color:var(--token-card-border)] transition-colors">
                <Phone size={16} /><span data-edit-path="label">{secondaryCta.label}</span>
              </a>
            )}
          </motion.div>
          {trustItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-6 mt-16 text-sm text-[color:var(--token-on-dark-heading)/40] font-bold uppercase tracking-wider">
              {trustItems.map((item, i) => (
                <span key={i} className="flex items-center gap-2" data-edit-collection="trustItems" data-edit-index={i}><span className="w-2 h-2 bg-[var(--token-badge-bg)]" />{item}</span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
