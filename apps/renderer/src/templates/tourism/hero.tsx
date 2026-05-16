'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Compass, Mountain, MapPin, CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function TourismHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Destination erleben';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Tourismus';
  const bgImage = (data.bgImage as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const locationLabel = (data.locationLabel as string) || '';
  const seasonLabel = (data.seasonLabel as string) || '';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const props = { headline, subline, badgeText, bgImage, bgColor, bgMode, locationLabel, seasonLabel, trustItems, primaryCta, secondaryCta };

  if (styleVariant === 'modern') return <HeroModern {...props} />;
  if (styleVariant === 'bold') return <HeroBold {...props} />;
  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string; subline: string; badgeText: string; bgImage: string;
  bgColor: string; bgMode: string;
  locationLabel: string; seasonLabel: string; trustItems: string[];
  primaryCta: ButtonValue; secondaryCta: ButtonValue;

  bgPosition?: string;};

/* ─── Classic: panoramic bg, green/lime gradient, mountain SVG, stagger ─── */
function HeroClassic({ headline, subline, badgeText, bgImage, bgColor, bgMode, locationLabel, seasonLabel, trustItems, primaryCta, secondaryCta , bgPosition}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-[#111827]">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <Image src={bgImage} alt="" fill priority className="object-cover" style={{ objectPosition: bgPosition }} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-800/50 to-lime-900/60" />
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      <svg className="absolute bottom-0 left-0 w-full text-[#ffffff]" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,120 L0,80 Q180,20 360,60 Q540,100 720,40 Q900,0 1080,50 Q1260,90 1440,30 L1440,120Z" />
      </svg>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col items-center justify-center px-6 py-12 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4 flex items-center gap-2">
          <Compass className="text-lime-300" size={20} />
          {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-lime-300">{badgeText}</p>}
          <Mountain className="text-lime-300" size={20} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-5xl text-3xl md:text-5xl font-[700] leading-[0.95] text-white sm:text-6xl lg:text-8xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{headline}</motion.h1>
        {subline && <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-7 max-w-2xl text-lg leading-8 text-white/80" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{subline}</motion.p>}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-6 py-3 font-semibold text-green-950">{primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={17} />}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-semibold text-white">{secondaryCta.label}</a>}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-white/80">
          {locationLabel && <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2"><MapPin size={15} />{locationLabel}</span>}
          {seasonLabel && <span className="rounded-full bg-black/25 px-4 py-2">{seasonLabel}</span>}
          {trustItems.map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-4 py-2"><CheckCircle size={14} className="text-lime-300" />{item}</span>)}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Modern: split layout, teal-white, clean/airy ─── */
function HeroModern({ headline, subline, badgeText, bgImage, bgColor, bgMode, locationLabel, seasonLabel, trustItems, primaryCta, secondaryCta , bgPosition}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-white">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-6 py-12 md:py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-widest text-teal-600">{badgeText}</p>}
          <h1 className="mt-5 text-3xl md:text-5xl font-light leading-[0.95] text-gray-900 sm:text-6xl lg:text-7xl">{headline}</h1>
          {subline && <p className="mt-7 max-w-lg text-lg font-light leading-8 text-gray-600">{subline}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-teal-600 bg-teal-600 px-5 py-3 font-semibold text-white">{primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={17} />}</a>}
            {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-black/15 px-5 py-3 font-semibold text-gray-900">{secondaryCta.label}</a>}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-gray-600">
            {locationLabel && <span className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2"><MapPin size={15} />{locationLabel}</span>}
            {seasonLabel && <span className="rounded-full border border-black/10 px-4 py-2">{seasonLabel}</span>}
            {trustItems.map((item) => <span key={item} className="rounded-full border border-black/10 px-4 py-2">{item}</span>)}
          </div>
        </div>
        <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-black/10">
          {(bgMode === 'image' && bgImage) ? (
            <Image src={bgImage} alt="" fill priority className="object-cover" style={{ objectPosition: bgPosition }} sizes="50vw" />
          ) : (bgMode === 'color' && bgColor) ? (
            <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ─── Bold: fullscreen dark, orange diagonal stripe, brutalist ─── */
function HeroBold({ headline, subline, badgeText, bgImage, bgColor, bgMode, locationLabel, seasonLabel, trustItems, primaryCta, secondaryCta , bgPosition}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-gray-950">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <Image src={bgImage} alt="" fill priority className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gray-950/60" />
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      <div className="absolute right-0 top-0 h-full w-1/3 origin-top-right skew-x-[-8deg] bg-orange-500/20" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col justify-center px-6 py-12 md:py-20">
        <div className="flex items-center gap-3">
          <Compass className="text-orange-500" size={28} />
          {badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{badgeText}</p>}
        </div>
        <h1 className="mt-5 max-w-5xl text-3xl md:text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-8xl">{headline}</h1>
        {subline && <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">{subline}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-6 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={17} />}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-white/40 px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(255,255,255,0.15)]">{secondaryCta.label}</a>}
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/70">
          {locationLabel && <span className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-bold uppercase"><MapPin size={15} />{locationLabel}</span>}
          {seasonLabel && <span className="border border-white/20 px-4 py-2 font-bold uppercase">{seasonLabel}</span>}
          {trustItems.map((item) => <span key={item} className="border border-white/20 px-4 py-2 font-bold uppercase">{item}</span>)}
        </div>
      </div>
    </section>
  );
}
