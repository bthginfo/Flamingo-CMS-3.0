'use client';

import Image from 'next/image';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

export function MedicalHeroSection({ data }: SectionProps) {
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
  return (
    <section className="relative min-h-[74vh] overflow-hidden bg-[var(--style-text-primary)] text-white">
      {bgImage && <Image src={bgImage} alt="" fill priority className="object-cover" sizes="100vw" />}
      <div className="absolute inset-0" style={{ background: 'var(--style-hero-overlay)' }} />
      <div className="relative z-10 mx-auto flex min-h-[74vh] max-w-7xl flex-col justify-end px-6 py-16 sm:px-10 lg:px-12">
        <div className="max-w-4xl">{badgeText && <p className="inline-flex rounded-[var(--style-button-radius)] bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest">{badgeText}</p>}<h1 className="mt-6 text-5xl font-[var(--style-heading-weight)] leading-none sm:text-7xl lg:text-8xl">{headline}</h1>{subline && <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">{subline}</p>}<div className="mt-8 flex flex-wrap gap-3">{primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-white px-5 py-3 font-semibold text-[var(--style-text-primary)]">{primaryCta.label}<ArrowRight size={17} /></a>}{emergencyCta.label && <a href={emergencyCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-red-600 px-5 py-3 font-semibold text-white"><AlertCircle size={17} />{emergencyCta.label}</a>}{secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex rounded-[var(--style-button-radius)] border border-white/35 px-5 py-3 font-semibold text-white">{secondaryCta.label}</a>}</div></div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/80">{specialtyLabel && <span className="rounded-full bg-black/25 px-4 py-2">{specialtyLabel}</span>}{emergencyHint && <span className="rounded-full bg-black/25 px-4 py-2">{emergencyHint}</span>}{trustItems.map((item) => <span key={item} className="rounded-full bg-black/25 px-4 py-2">{item}</span>)}</div>
      </div>
    </section>
  );
}
