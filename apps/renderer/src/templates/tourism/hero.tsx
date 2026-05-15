'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

export function TourismHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Destination erleben';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Tourismus';
  const bgImage = (data.bgImage as string) || '';
  const locationLabel = (data.locationLabel as string) || '';
  const seasonLabel = (data.seasonLabel as string) || '';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const isModern = styleVariant === 'modern';
  const isBold = styleVariant === 'bold';

  return (
    <section className={`relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] ${isModern ? 'bg-[var(--style-section-bg)]' : 'bg-[var(--style-text-primary)]'}`}>
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill priority className={`object-cover ${isModern ? 'lg:left-1/2 lg:w-1/2' : ''}`} sizes="100vw" />
          {!isModern && <div className="absolute inset-0" style={{ background: 'var(--style-hero-overlay)' }} />}
        </>
      )}
      <div className={`relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-6 py-20 ${isModern ? 'lg:grid-cols-2' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
          {badgeText && <p className={`text-xs font-bold uppercase tracking-widest ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/70'}`}>{badgeText}</p>}
          <h1 className={`mt-5 text-5xl sm:text-6xl lg:text-8xl font-[var(--style-heading-weight)] leading-[0.95] ${isBold ? 'uppercase' : ''} ${isModern ? 'text-[var(--style-text-primary)]' : 'text-white'}`}>{headline}</h1>
          {subline && <p className={`mt-7 max-w-2xl text-lg leading-8 ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/80'}`}>{subline}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta.label && <a href={primaryCta.href || '#'} className={`inline-flex items-center gap-2 rounded-[var(--style-button-radius)] px-5 py-3 font-semibold ${isModern ? 'bg-[var(--style-badge-bg)] text-[var(--style-text-primary)]' : 'bg-white text-[var(--style-text-primary)]'}`}>{primaryCta.label}<ArrowRight size={17} /></a>}
            {secondaryCta.label && <a href={secondaryCta.href || '#'} className={`inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border px-5 py-3 font-semibold ${isModern ? 'border-black/15 text-[var(--style-text-primary)]' : 'border-white/35 text-white'}`}>{secondaryCta.label}</a>}
          </div>
          <div className={`mt-10 flex flex-wrap gap-3 text-sm ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/80'}`}>
            {locationLabel && <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${isModern ? 'bg-[var(--style-badge-bg)]' : 'bg-black/25'}`}><MapPin size={15} />{locationLabel}</span>}
            {seasonLabel && <span className={`rounded-full px-4 py-2 ${isModern ? 'bg-[var(--style-badge-bg)]' : 'bg-black/25'}`}>{seasonLabel}</span>}
            {trustItems.map((item) => <span key={item} className={`rounded-full px-4 py-2 ${isModern ? 'bg-[var(--style-badge-bg)]' : 'bg-black/25'}`}>{item}</span>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
