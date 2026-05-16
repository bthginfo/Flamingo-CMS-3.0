'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function SalonHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Salon';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Beauty';
  const bgImage = (data.bgImage as string) || '';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bookingHint = (data.bookingHint as string) || '';
  const ratingText = (data.ratingText as string) || '';

  const props = { headline, subline, badgeText, bgImage, trustItems, primaryCta, secondaryCta, bookingHint, ratingText };

  if (styleVariant === 'modern') return <HeroModern {...props} />;
  if (styleVariant === 'bold') return <HeroBold {...props} />;
  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string; subline: string; badgeText: string; bgImage: string;
  trustItems: string[]; primaryCta: ButtonValue; secondaryCta: ButtonValue;
  bookingHint: string; ratingText: string;
};

/* ─── CLASSIC: Fullscreen bg, organic rose gradient overlay, flowing curves, centered elegant typography ─── */
function HeroClassic({ headline, subline, badgeText, bgImage, trustItems, primaryCta, secondaryCta, bookingHint, ratingText }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {bgImage ? (
        <>
          <Image src={bgImage} alt="" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#6b2148]/85 via-[#8b3a62]/65 to-[#c0528a]/40" />
        </>
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
            <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              <Sparkles size={14} />{badgeText}
            </motion.p>
          )}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="mt-6 text-5xl sm:text-6xl lg:text-8xl font-[700] leading-[0.95] text-white" style={{ textShadow: '0 2px 30px rgba(107,33,72,0.5)' }}>{headline}</motion.h1>
        {subline && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/80">{subline}</motion.p>}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-gray-900 shadow-lg">{primaryCta.label}<ArrowRight size={17} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3 font-semibold text-white">{secondaryCta.label}</a>}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-white/80">
          {bookingHint && <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">{bookingHint}</span>}
          {ratingText && <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">{ratingText}</span>}
          {trustItems.map((item) => <span key={item} className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">{item}</span>)}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── MODERN: Split layout (text left / image right), clean minimalist, dusty-rose accents ─── */
function HeroModern({ headline, subline, badgeText, bgImage, trustItems, primaryCta, secondaryCta, bookingHint, ratingText }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] bg-white">
      {bgImage && <Image src={bgImage} alt="" fill className="object-cover lg:left-1/2 lg:w-1/2" priority sizes="50vw" />}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-8 lg:gap-16 px-6 py-12 md:py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
          <h1 className="mt-6 text-3xl md:text-5xl font-light leading-[1.05] text-gray-900 sm:text-6xl lg:text-7xl">{headline}</h1>
          {subline && <p className="mt-7 max-w-lg text-lg font-light leading-8 text-gray-600">{subline}</p>}
          <div className="mt-3 h-px w-16 bg-brand-accent" />
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 border border-[#111827] px-6 py-3 font-light text-gray-900">{primaryCta.label}<ArrowRight size={16} /></a>}
            {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 px-6 py-3 font-light text-gray-600">{secondaryCta.label}</a>}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-gray-600">
            {bookingHint && <span className="border-b border-brand-accent pb-1">{bookingHint}</span>}
            {ratingText && <span className="border-b border-brand-accent pb-1">{ratingText}</span>}
            {trustItems.map((item) => <span key={item} className="border-b border-brand-accent pb-1">{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── BOLD: Fullscreen dark, hot-pink diagonal stripe, uppercase brutalist ─── */
function HeroBold({ headline, subline, badgeText, bgImage, trustItems, primaryCta, secondaryCta, bookingHint, ratingText }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-[#111]">
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill className="object-cover opacity-30" priority sizes="100vw" />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      {/* Diagonal hot-pink stripe */}
      <div className="absolute inset-0 overflow-hidden"><div className="absolute -right-20 top-[20%] h-24 w-[140%] rotate-[-8deg] bg-brand-accent" /></div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-20">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-brand-accent">{badgeText}</p>}
        <h1 className="mt-5 text-3xl md:text-5xl font-black uppercase leading-[0.95] text-white sm:text-7xl lg:text-9xl">{headline}</h1>
        {subline && <p className="mt-7 max-w-2xl text-lg font-bold uppercase leading-8 text-white/70">{subline}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 bg-brand-accent px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{primaryCta.label}<ArrowRight size={17} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{secondaryCta.label}</a>}
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm font-bold uppercase text-white/60">
          {bookingHint && <span className="bg-white/10 px-4 py-2">{bookingHint}</span>}
          {ratingText && <span className="bg-white/10 px-4 py-2">{ratingText}</span>}
          {trustItems.map((item) => <span key={item} className="bg-white/10 px-4 py-2">{item}</span>)}
        </div>
      </div>
    </section>
  );
}
