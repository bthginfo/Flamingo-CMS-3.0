'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { Stethoscope, Heart, CheckCircle, Cross } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function MedicalHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Praxis';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Medizin';
  const badgeIcon = (data.badgeIcon as string) || 'Shield';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const specialtyLabel = (data.specialtyLabel as string) || '';
  const emergencyHint = (data.emergencyHint as string) || '';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const emergencyCta = asButton(data.emergencyCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1;
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  const props = { headline, subline, badgeText, badgeIcon, bgImage, bgImageMobile, bgColor, bgMode, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta, bgPosition, bgPositionMobile, overlayColor: overlayColor || undefined, overlayOpacity , imageEffect, imageEffectIntensity};

  if (styleVariant === 'modern') return <HeroModern {...props} />;
  if (styleVariant === 'bold') return <HeroBold {...props} />;
  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string; subline: string; badgeText: string; badgeIcon: string; bgImage: string;
  bgImageMobile?: string;
  bgColor: string; bgMode: string;
  specialtyLabel: string; emergencyHint: string; trustItems: string[];
  primaryCta: ButtonValue; emergencyCta: ButtonValue; secondaryCta: ButtonValue;
  overlayColor?: string;
  overlayOpacity: number;
  bgPosition?: string;
  bgPositionMobile?: string;  imageEffect?: ImageEffect;
  imageEffectIntensity?: 'subtle' | 'medium' | 'strong';
};

/* ─── Classic: fullscreen teal gradient, heartbeat SVG, stagger, shield badge ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, bgImage, bgImageMobile, bgColor, bgMode, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg)]">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} sizes="100vw" />
            {bgImageMobile && <Image src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} sizes="100vw" />}
          </ImageEffectWrapper>
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? (<div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity ?? 0.6 }} />) : (<div className="absolute inset-0 bg-gradient-to-b from-black/65 via-slate-950/45 to-cyan-950/55" />)}
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      <svg className="absolute bottom-0 left-0 w-full text-[var(--token-card-bg)]" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,120 L0,90 Q120,70 240,80 L480,80 L520,30 L560,100 L600,60 L640,80 Q900,90 1080,80 Q1260,70 1440,85 L1440,120Z" />
      </svg>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col items-center justify-center px-6 py-12 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 flex items-center gap-2">
          <DynamicIcon name={badgeIcon} className="text-[var(--token-badge-text)]" size={20} />
          {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
          <Stethoscope className="text-[var(--token-badge-text)]" size={20} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-5xl text-3xl md:text-5xl font-[700] leading-[0.95] text-[var(--token-heading)] sm:text-6xl lg:text-8xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }} data-edit-path="headline">{headline}</motion.h1>
        {subline && <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-7 max-w-2xl text-lg leading-8 text-[var(--token-body)] rt-content" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }} dangerouslySetInnerHTML={{ __html: subline }} />}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={17} />}</a>}
          {emergencyCta.label && <a href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-[color:var(--token-on-dark-heading)]">{emergencyCta.icon && <DynamicIcon name={emergencyCta.icon} size={17} />}<span data-edit-path="label">{emergencyCta.label}</span></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-card-border)] px-6 py-3 font-semibold text-[var(--token-heading)]" data-edit-path="label">{secondaryCta.label}</a>}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-[var(--token-on-dark-body)]">
          {specialtyLabel && <span className="inline-flex items-center gap-2 rounded-full bg-[var(--token-badge-bg)] px-4 py-2"><Heart size={15} className="text-[var(--token-icon)]" />{specialtyLabel}</span>}
          {emergencyHint && <span className="rounded-full bg-red-900/40 px-4 py-2">{emergencyHint}</span>}
          {trustItems.map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--token-badge-bg)] px-4 py-2"><CheckCircle size={14} className="text-[var(--token-icon)]" />{item}</span>)}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Modern: split layout, clinical clean, light blue-white ─── */
function HeroModern({ headline, subline, badgeText, badgeIcon, bgImage, bgImageMobile, bgColor, bgMode, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta , bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg)]">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-6 py-12 md:py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
          <h1 className="mt-5 text-3xl md:text-5xl font-light leading-[0.95] text-[var(--token-heading)] sm:text-6xl lg:text-7xl" data-edit-path="headline">{headline}</h1>
          {subline && <div className="mt-7 max-w-lg text-lg font-light leading-8 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={17} />}</a>}
            {emergencyCta.label && <a href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)]">{emergencyCta.icon && <DynamicIcon name={emergencyCta.icon} size={17} />}<span data-edit-path="label">{emergencyCta.label}</span></a>}
            {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-card-border)] px-5 py-3 font-semibold text-[var(--token-heading)]" data-edit-path="label">{secondaryCta.label}</a>}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-[var(--token-body)]">
            {specialtyLabel && <span className="inline-flex items-center gap-2 rounded-full border border-[var(--token-card-border)] px-4 py-2"><Heart size={15} />{specialtyLabel}</span>}
            {emergencyHint && <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-red-700">{emergencyHint}</span>}
            {trustItems.map((item) => <span key={item} className="rounded-full border border-[var(--token-card-border)] px-4 py-2">{item}</span>)}
          </div>
        </div>
        <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)]">
          {(bgMode === 'image' && bgImage) ? (
            <>
              <Image src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} sizes="50vw" />
              {bgImageMobile && <Image src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} sizes="50vw" />}
            </>
          ) : (bgMode === 'color' && bgColor) ? (
            <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ─── Bold: fullscreen dark, teal diagonal stripe, brutalist ─── */
function HeroBold({ headline, subline, badgeText, badgeIcon, bgImage, bgImageMobile, bgColor, bgMode, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta , bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg)]">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <Image src={bgImage} alt="" fill priority className={`object-cover opacity-40${bgImageMobile ? ' hidden md:block' : ''}`} sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill priority className="object-cover opacity-40 md:hidden" sizes="100vw" />}
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--token-section-bg)_60%,transparent)]" />
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      <div className="absolute right-0 top-0 h-full w-1/3 origin-top-right skew-x-[-8deg] bg-[color-mix(in_srgb,var(--token-accent)_20%,transparent)]" aria-hidden="true" />
      <div className="absolute left-10 top-1/4 opacity-10" aria-hidden="true"><Cross size={200} className="text-[var(--token-icon)]" /></div>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col justify-center px-6 py-12 md:py-20">
        <div className="flex items-center gap-3">
          <DynamicIcon name={badgeIcon} className="text-[var(--token-badge-text)]" size={28} />
          {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
        </div>
        <h1 className="mt-5 max-w-5xl text-3xl md:text-5xl font-black uppercase leading-[0.95] text-[var(--token-heading)] sm:text-6xl lg:text-8xl" data-edit-path="headline">{headline}</h1>
        {subline && <div className="mt-7 max-w-2xl text-lg leading-8 text-[var(--token-body)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-6 py-3 font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={17} />}</a>}
          {emergencyCta.label && <a href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-red-500 bg-red-500 px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_theme(colors.red.800)]">{emergencyCta.icon && <DynamicIcon name={emergencyCta.icon} size={17} />}<span data-edit-path="label">{emergencyCta.label}</span></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-card-border)] px-6 py-3 font-black uppercase text-[var(--token-heading)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm text-[var(--token-body)]">
          {specialtyLabel && <span className="inline-flex items-center gap-2 border border-[color:var(--token-card-border)/20] px-4 py-2 font-bold uppercase"><Heart size={15} />{specialtyLabel}</span>}
          {emergencyHint && <span className="border border-red-500/40 px-4 py-2 font-bold uppercase text-red-400">{emergencyHint}</span>}
          {trustItems.map((item) => <span key={item} className="border border-[var(--token-card-border)] px-4 py-2 font-bold uppercase">{item}</span>)}
        </div>
      </div>
    </section>
  );
}
