'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { AlertCircle, ArrowRight, Shield, Stethoscope, Heart, CheckCircle, Cross } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function MedicalHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Praxis';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Medizin';
  const bgImage = (data.bgImage as string) || '';
  const specialtyLabel = (data.specialtyLabel as string) || '';
  const emergencyHint = (data.emergencyHint as string) || '';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const emergencyCta = asButton(data.emergencyCta);
  const secondaryCta = asButton(data.secondaryCta);

  const props = { headline, subline, badgeText, bgImage, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta };

  if (styleVariant === 'modern') return <HeroModern {...props} />;
  if (styleVariant === 'bold') return <HeroBold {...props} />;
  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string; subline: string; badgeText: string; bgImage: string;
  specialtyLabel: string; emergencyHint: string; trustItems: string[];
  primaryCta: ButtonValue; emergencyCta: ButtonValue; secondaryCta: ButtonValue;
};

/* ─── Classic: fullscreen teal gradient, heartbeat SVG, stagger, shield badge ─── */
function HeroClassic({ headline, subline, badgeText, bgImage, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--style-text-primary)]">
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-teal-900/70 via-teal-800/50 to-cyan-900/60" />
        </>
      )}
      <svg className="absolute bottom-0 left-0 w-full text-[var(--style-section-bg)]" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,120 L0,90 Q120,70 240,80 L480,80 L520,30 L560,100 L600,60 L640,80 Q900,90 1080,80 Q1260,70 1440,85 L1440,120Z" />
      </svg>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 flex items-center gap-2">
          <Shield className="text-cyan-300" size={20} />
          {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{badgeText}</p>}
          <Stethoscope className="text-cyan-300" size={20} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-5xl text-5xl font-[var(--style-heading-weight)] leading-[0.95] text-white sm:text-6xl lg:text-8xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{headline}</motion.h1>
        {subline && <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-7 max-w-2xl text-lg leading-8 text-white/80" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{subline}</motion.p>}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-teal-950">{primaryCta.label}<ArrowRight size={17} /></a>}
          {emergencyCta.label && <a href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white"><AlertCircle size={17} />{emergencyCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-semibold text-white">{secondaryCta.label}</a>}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-white/80">
          {specialtyLabel && <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2"><Heart size={15} className="text-cyan-300" />{specialtyLabel}</span>}
          {emergencyHint && <span className="rounded-full bg-red-900/40 px-4 py-2">{emergencyHint}</span>}
          {trustItems.map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-4 py-2"><CheckCircle size={14} className="text-cyan-300" />{item}</span>)}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Modern: split layout, clinical clean, light blue-white ─── */
function HeroModern({ headline, subline, badgeText, bgImage, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[var(--style-section-bg)]">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-widest text-blue-500">{badgeText}</p>}
          <h1 className="mt-5 text-5xl font-light leading-[0.95] text-[var(--style-text-primary)] sm:text-6xl lg:text-7xl">{headline}</h1>
          {subline && <p className="mt-7 max-w-lg text-lg font-light leading-8 text-[var(--style-text-secondary)]">{subline}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-blue-600 bg-blue-600 px-5 py-3 font-semibold text-white">{primaryCta.label}<ArrowRight size={17} /></a>}
            {emergencyCta.label && <a href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-red-600 px-5 py-3 font-semibold text-white"><AlertCircle size={17} />{emergencyCta.label}</a>}
            {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-black/15 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{secondaryCta.label}</a>}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-[var(--style-text-secondary)]">
            {specialtyLabel && <span className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2"><Heart size={15} />{specialtyLabel}</span>}
            {emergencyHint && <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-red-700">{emergencyHint}</span>}
            {trustItems.map((item) => <span key={item} className="rounded-full border border-black/10 px-4 py-2">{item}</span>)}
          </div>
        </div>
        <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-black/10">
          {bgImage && <Image src={bgImage} alt="" fill priority className="object-cover" sizes="50vw" />}
        </div>
      </div>
    </section>
  );
}

/* ─── Bold: fullscreen dark, teal diagonal stripe, brutalist ─── */
function HeroBold({ headline, subline, badgeText, bgImage, specialtyLabel, emergencyHint, trustItems, primaryCta, emergencyCta, secondaryCta }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-gray-950">
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill priority className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gray-950/60" />
        </>
      )}
      <div className="absolute right-0 top-0 h-full w-1/3 origin-top-right skew-x-[-8deg] bg-teal-500/20" aria-hidden="true" />
      <div className="absolute left-10 top-1/4 opacity-10" aria-hidden="true"><Cross size={200} className="text-teal-400" /></div>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col justify-center px-6 py-20">
        <div className="flex items-center gap-3">
          <Shield className="text-teal-400" size={28} />
          {badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400">{badgeText}</p>}
        </div>
        <h1 className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-8xl">{headline}</h1>
        {subline && <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">{subline}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-teal-400 bg-teal-400 px-6 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.teal.700)]">{primaryCta.label}<ArrowRight size={17} /></a>}
          {emergencyCta.label && <a href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-red-500 bg-red-500 px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_theme(colors.red.800)]"><AlertCircle size={17} />{emergencyCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-white/40 px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(255,255,255,0.15)]">{secondaryCta.label}</a>}
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/70">
          {specialtyLabel && <span className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-bold uppercase"><Heart size={15} />{specialtyLabel}</span>}
          {emergencyHint && <span className="border border-red-500/40 px-4 py-2 font-bold uppercase text-red-400">{emergencyHint}</span>}
          {trustItems.map((item) => <span key={item} className="border border-white/20 px-4 py-2 font-bold uppercase">{item}</span>)}
        </div>
      </div>
    </section>
  );
}
