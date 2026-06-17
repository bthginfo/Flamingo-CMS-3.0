'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { Compass, Mountain, MapPin, CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function TourismHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Destination erleben';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Tourismus';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const locationLabel = (data.locationLabel as string) || '';
  const seasonLabel = (data.seasonLabel as string) || '';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1;
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  const props = { headline, subline, badgeText, bgImage, bgImageMobile, bgColor, bgMode, locationLabel, seasonLabel, trustItems, primaryCta, secondaryCta, bgPosition, bgPositionMobile, overlayColor: overlayColor || undefined, overlayOpacity , imageEffect, imageEffectIntensity};

  if (styleVariant === 'modern') return <HeroModern {...props} />;
  if (styleVariant === 'bold') return <HeroBold {...props} />;
  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string; subline: string; badgeText: string; bgImage: string;
  bgImageMobile?: string;
  bgColor: string; bgMode: string;
  locationLabel: string; seasonLabel: string; trustItems: string[];
  primaryCta: ButtonValue; secondaryCta: ButtonValue;
  overlayColor?: string;
  overlayOpacity: number;
  bgPosition?: string;
  bgPositionMobile?: string;
  imageEffect?: ImageEffect;
  imageEffectIntensity?: 'subtle' | 'medium' | 'strong';
};

/* ─── Classic: panoramic bg, green/lime gradient, mountain SVG, stagger ─── */
function HeroClassic({ headline, subline, badgeText, bgImage, bgImageMobile, bgColor, bgMode, locationLabel, seasonLabel, trustItems, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg)]">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} sizes="100vw" />
            {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} sizes="100vw" />}
          </ImageEffectWrapper>
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? (<div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity ?? 0.6 }} />) : (<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-emerald-950/35 to-black/45" />)}
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      <svg className="absolute bottom-0 left-0 w-full text-[color:var(--token-section-bg-alt)]" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,120 L0,80 Q180,20 360,60 Q540,100 720,40 Q900,0 1080,50 Q1260,90 1440,30 L1440,120Z" />
      </svg>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col items-center justify-center px-6 py-12 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--token-card-border)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--token-on-dark-heading)_12%,transparent)] px-4 py-2 backdrop-blur-md">
          <Compass className="text-[color:var(--token-on-dark-heading)]" size={20} />
          {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-on-dark-heading)]" data-edit-path="badgeText">{badgeText}</p>}
          <Mountain className="text-[color:var(--token-on-dark-heading)]" size={20} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-5xl text-3xl md:text-5xl font-[700] leading-[0.95] text-[color:var(--token-on-dark-heading)] sm:text-6xl lg:text-8xl" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.62)' }} data-edit-path="headline">{headline}</motion.h1>
        {subline && <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-7 max-w-2xl text-lg leading-8 text-[color:var(--token-on-dark-body)] rt-content" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.55)' }} data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta.label && (
            <a data-edit-link="primaryCta"
              href={primaryCta.href || '#'}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-xl transition hover:brightness-110"
              style={{
                backgroundColor: 'var(--token-btn-bg)',
                color: 'var(--token-btn-text)',
              }}
            >
              <span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={17} />}
            </a>
          )}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--token-btn-secondary-border,var(--token-card-border))] bg-[var(--token-btn-secondary-bg,transparent)] px-6 py-3 font-semibold text-[color:var(--token-btn-secondary-text,var(--token-on-dark-heading,var(--token-heading)))] backdrop-blur" data-edit-path="label">{secondaryCta.label}</a>}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-[color:var(--token-on-dark-muted)]">
          {locationLabel && <span className="inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--token-on-dark-heading)_12%,transparent)] px-4 py-2 backdrop-blur"><MapPin size={15} />{locationLabel}</span>}
          {seasonLabel && <span className="rounded-full bg-[color:color-mix(in_srgb,var(--token-on-dark-heading)_12%,transparent)] px-4 py-2 backdrop-blur">{seasonLabel}</span>}
          {trustItems.map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-[color:color-mix(in_srgb,var(--token-on-dark-heading)_12%,transparent)] px-4 py-2 backdrop-blur"><CheckCircle size={14} className="text-[color:var(--token-on-dark-heading)]" />{item}</span>)}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Modern: split layout, teal-white, clean/airy ─── */
function HeroModern({ headline, subline, badgeText, bgImage, bgImageMobile, bgColor, bgMode, locationLabel, seasonLabel, trustItems, primaryCta, secondaryCta , bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg)]">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-6 py-12 md:py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
          <h1 className="mt-5 text-3xl md:text-5xl font-light leading-[0.95] text-[color:var(--token-heading)] sm:text-6xl lg:text-7xl" data-edit-path="headline">{headline}</h1>
          {subline && <div className="mt-7 max-w-lg text-lg font-light leading-8 text-[color:var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={17} />}</a>}
            {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-secondary-border,var(--token-card-border))] px-5 py-3 font-semibold text-[color:var(--token-btn-secondary-text,var(--token-on-dark-heading,var(--token-heading)))]" data-edit-path="label">{secondaryCta.label}</a>}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-[color:var(--token-body)]">
            {locationLabel && <span className="inline-flex items-center gap-2 rounded-full border border-[var(--token-card-border)] px-4 py-2"><MapPin size={15} />{locationLabel}</span>}
            {seasonLabel && <span className="rounded-full border border-[var(--token-card-border)] px-4 py-2">{seasonLabel}</span>}
            {trustItems.map((item) => <span key={item} className="rounded-full border border-[var(--token-card-border)] px-4 py-2">{item}</span>)}
          </div>
        </div>
        <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-[var(--token-card-border)]">
          {(bgMode === 'image' && bgImage) ? (
            <>
              <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} sizes="50vw" />
              {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} sizes="50vw" />}
            </>
          ) : (bgMode === 'color' && bgColor) ? (
            <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ─── Bold: fullscreen dark, orange diagonal stripe, brutalist ─── */
function HeroBold({ headline, subline, badgeText, bgImage, bgImageMobile, bgColor, bgMode, locationLabel, seasonLabel, trustItems, primaryCta, secondaryCta , bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg)]">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover opacity-40${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover opacity-40 md:hidden" sizes="100vw" />}
          <div className="absolute inset-0 bg-[var(--token-section-bg)] opacity-60" />
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      <div className="absolute right-0 top-0 h-full w-1/3 origin-top-right skew-x-[-8deg] bg-[var(--token-accent)] opacity-20" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col justify-center px-6 py-12 md:py-20">
        <div className="flex items-center gap-3">
          <Compass className="text-[color:var(--token-icon)]" size={28} />
          {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
        </div>
        <h1 className="mt-5 max-w-5xl text-3xl md:text-5xl font-black uppercase leading-[0.95] text-[color:var(--token-heading)] sm:text-6xl lg:text-8xl" data-edit-path="headline">{headline}</h1>
        {subline && <div className="mt-7 max-w-2xl text-lg leading-8 text-[color:var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-6 py-3 font-black uppercase text-[color:var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={17} />}</a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-secondary-border,var(--token-card-border))] px-6 py-3 font-black uppercase text-[color:var(--token-btn-secondary-text,var(--token-on-dark-heading,var(--token-heading)))]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm text-[color:var(--token-body)]">
          {locationLabel && <span className="inline-flex items-center gap-2 border border-[var(--token-card-border)] px-4 py-2 font-bold uppercase"><MapPin size={15} />{locationLabel}</span>}
          {seasonLabel && <span className="border border-[var(--token-card-border)] px-4 py-2 font-bold uppercase">{seasonLabel}</span>}
          {trustItems.map((item) => <span key={item} className="border border-[var(--token-card-border)] px-4 py-2 font-bold uppercase">{item}</span>)}
        </div>
      </div>
    </section>
  );
}
