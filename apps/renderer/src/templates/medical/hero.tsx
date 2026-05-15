'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

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
  const isModern = styleVariant === 'modern';
  const isBold = styleVariant === 'bold';

  return (
    <section className={`relative min-h-screen overflow-hidden -mt-[112px] pt-[112px] ${isModern ? 'bg-[var(--style-section-bg)]' : 'bg-[var(--style-text-primary)]'}`}>
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill priority className={`object-cover ${isModern ? 'lg:left-1/2 lg:w-1/2' : ''}`} sizes="100vw" />
          {!isModern && <div className="absolute inset-0 bg-black/40" />}
          {!isModern && <div className="absolute inset-0" style={{ background: 'var(--style-hero-overlay)' }} />}
        </>
      )}
      <div className={`relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-6 py-20 ${isModern ? 'lg:grid-cols-2' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
          {badgeText && <p className={`text-xs font-bold uppercase tracking-widest ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/70'}`}>{badgeText}</p>}
          <h1 className={`mt-5 text-5xl sm:text-6xl lg:text-8xl font-[var(--style-heading-weight)] leading-[0.95] ${isBold ? 'uppercase' : ''} ${isModern ? 'text-[var(--style-text-primary)]' : 'text-white'}`} style={!isModern ? { textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : undefined}>{headline}</h1>
          {subline && <p className={`mt-7 max-w-2xl text-lg leading-8 ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/80'}`} style={!isModern ? { textShadow: '0 2px 20px rgba(0,0,0,0.5)' } : undefined}>{subline}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta.label && <a href={primaryCta.href || '#'} className={`inline-flex items-center gap-2 rounded-[var(--style-button-radius)] px-5 py-3 font-semibold ${isModern ? 'bg-[var(--style-badge-bg)] text-[var(--style-text-primary)]' : 'bg-white text-[var(--style-text-primary)]'}`}>{primaryCta.label}<ArrowRight size={17} /></a>}
            {emergencyCta.label && <a href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-red-600 px-5 py-3 font-semibold text-white"><AlertCircle size={17} />{emergencyCta.label}</a>}
            {secondaryCta.label && <a href={secondaryCta.href || '#'} className={`inline-flex rounded-[var(--style-button-radius)] border px-5 py-3 font-semibold ${isModern ? 'border-black/15 text-[var(--style-text-primary)]' : 'border-white/35 text-white'}`}>{secondaryCta.label}</a>}
          </div>
          <div className={`mt-10 flex flex-wrap gap-3 text-sm ${isModern ? 'text-[var(--style-text-secondary)]' : 'text-white/80'}`}>
            {specialtyLabel && <span className={`rounded-full px-4 py-2 ${isModern ? 'bg-[var(--style-badge-bg)]' : 'bg-black/25'}`}>{specialtyLabel}</span>}
            {emergencyHint && <span className={`rounded-full px-4 py-2 ${isModern ? 'bg-red-50 text-red-700' : 'bg-red-900/40'}`}>{emergencyHint}</span>}
            {trustItems.map((item) => <span key={item} className={`rounded-full px-4 py-2 ${isModern ? 'bg-[var(--style-badge-bg)]' : 'bg-black/25'}`}>{item}</span>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
