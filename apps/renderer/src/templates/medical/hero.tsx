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
  const trustStripColor = (data.trustStripColor as string) || '';
  const primaryCta = asButton(data.primaryCta);
  const emergencyCta = asButton(data.emergencyCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1;
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  const props = { headline, subline, badgeText, badgeIcon, bgImage, bgImageMobile, bgColor, bgMode, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta, bgPosition, bgPositionMobile, overlayColor: overlayColor || undefined, overlayOpacity , imageEffect, imageEffectIntensity, trustStripColor};

  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string; subline: string; badgeText: string; badgeIcon: string; bgImage: string;
  bgImageMobile?: string;
  bgColor: string; bgMode: string;
  specialtyLabel: string; emergencyHint: string; trustItems: string[];
  trustStripColor?: string;
  primaryCta: ButtonValue; emergencyCta: ButtonValue; secondaryCta: ButtonValue;
  overlayColor?: string;
  overlayOpacity: number;
  bgPosition?: string;
  bgPositionMobile?: string;  imageEffect?: ImageEffect;
  imageEffectIntensity?: 'subtle' | 'medium' | 'strong';
};

/* ─── Classic: fullscreen teal gradient, heartbeat SVG, stagger, shield badge ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, bgImage, bgImageMobile, bgColor, bgMode, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, imageEffect, imageEffectIntensity, trustStripColor }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--token-section-bg)]">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image data-edit-image="bgImage" src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} sizes="100vw" />
            {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} sizes="100vw" />}
          </ImageEffectWrapper>
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? (<div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity ?? 0.6 }} />) : (<div className="absolute inset-0 bg-gradient-to-b from-black/65 via-slate-950/45 to-cyan-950/55" />)}
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      <svg className="absolute bottom-0 left-0 w-full text-[color:var(--token-card-bg)]" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,120 L0,90 Q120,70 240,80 L480,80 L520,30 L560,100 L600,60 L640,80 Q900,90 1080,80 Q1260,70 1440,85 L1440,120Z" />
      </svg>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col items-center justify-center px-6 py-12 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 flex items-center gap-2">
          <DynamicIcon name={badgeIcon} className="text-[color:var(--token-badge-text)]" size={20} />
          {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</p>}
          <Stethoscope className="text-[color:var(--token-badge-text)]" size={20} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-5xl text-3xl md:text-5xl font-[700] leading-[0.95] text-[color:var(--token-heading)] sm:text-6xl lg:text-8xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }} data-edit-path="headline">{headline}</motion.h1>
        {subline && <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-7 max-w-2xl text-lg leading-8 text-[color:var(--token-body)] rt-content" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }} data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span>{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={17} />}</a>}
          {emergencyCta.label && <a data-edit-link="emergencyCta" href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-danger-bg)] px-6 py-3 font-semibold text-[color:var(--token-on-dark-heading)]">{emergencyCta.icon && <DynamicIcon editPath="emergencyCta.icon" name={emergencyCta.icon} size={17} />}<span data-edit-path="label">{emergencyCta.label}</span></a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-btn-secondary-border)] px-6 py-3 font-semibold text-[color:var(--token-btn-secondary-text)]" data-edit-path="label">{secondaryCta.label}</a>}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-[color:var(--token-on-dark-body)]">
          {specialtyLabel && <span className="inline-flex items-center gap-2 rounded-full bg-[var(--token-badge-bg)] px-4 py-2"><Heart size={15} className="text-[color:var(--token-icon)]" />{specialtyLabel}</span>}
          {emergencyHint && <span className="rounded-full bg-red-900/40 px-4 py-2">{emergencyHint}</span>}
          {trustItems.map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--token-badge-bg)] px-4 py-2" style={trustStripColor ? { backgroundColor: trustStripColor } : undefined}><CheckCircle size={14} className="text-[color:var(--token-check)]" />{item}</span>)}
        </motion.div>
      </div>
    </section>
  );
}

