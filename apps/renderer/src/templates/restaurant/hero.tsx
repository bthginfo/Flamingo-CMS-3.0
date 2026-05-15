'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

export function RestaurantHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Restaurant';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const bgImage = (data.bgImage as string) || '';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  return (
    <section className={`relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] ${isModern ? 'bg-white' : 'bg-[var(--style-text-primary)]'}`}>
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill priority className={`object-cover ${isModern ? 'opacity-100 lg:left-1/2 lg:w-1/2' : ''}`} sizes="100vw" />
          {!isModern && <div className="absolute inset-0 bg-black/40" />}
          {!isModern && <div className="absolute inset-0" style={{ background: 'var(--style-hero-overlay)' }} />}
        </>
      )}
      <div className={`relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-6 py-20 ${isModern ? 'lg:grid-cols-2' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className={isModern ? 'max-w-2xl' : 'max-w-4xl'}>
          {badgeText && <p className={`text-xs font-bold uppercase tracking-widest ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/70'}`}>{badgeText}</p>}
          <h1 className={`mt-5 text-5xl sm:text-6xl lg:text-8xl font-[var(--style-heading-weight)] leading-[0.95] ${isBold ? 'uppercase' : ''} ${isModern ? 'text-[var(--style-text-primary)]' : 'text-white'}`} style={!isModern ? { textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : undefined}>
            {headline}
          </h1>
          {subline && <p className={`mt-7 max-w-2xl text-lg leading-8 ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/72'}`} style={!isModern ? { textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : undefined}>{subline}</p>}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center justify-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-badge-bg)] px-6 py-3 font-semibold text-[var(--style-text-primary)]">{primaryCta.label}<ArrowRight size={17} /></a>}
            {secondaryCta.label && <a href={secondaryCta.href || '#'} className={`inline-flex items-center justify-center rounded-[var(--style-button-radius)] border px-6 py-3 font-semibold ${isModern ? 'border-black/15 text-[var(--style-text-primary)]' : 'border-white/25 text-white'}`}>{secondaryCta.label}</a>}
          </div>
          {trustItems.length > 0 && (
            <div className={`mt-10 flex flex-wrap gap-3 text-sm ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/60'}`}>
              {trustItems.map((item) => <span key={item} className="border border-current/20 px-3 py-1">{item}</span>)}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

