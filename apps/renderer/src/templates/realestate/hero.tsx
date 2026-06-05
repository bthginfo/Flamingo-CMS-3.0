'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function RealestateHeroSection({ data }: Props) {
  const headline = (data.headline as string) || 'Ihr Immobilienmakler mit Weitblick';
  const subline = (data.subline as string) || '';
  const bgImage = (data.bgImage as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? 0.6;
  const primaryCta = data.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string } | undefined;
  const trustItems = (data.trustItems as string[]) || [];
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill className="object-cover" priority sizes="100vw" />
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" style={{ opacity: overlayOpacity }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--token-on-dark-heading)] leading-tight tracking-tight" data-edit-path="headline">
            {headline}
          </h1>
          {subline && (
            <p className="text-lg md:text-xl text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_80%,transparent)] mt-6 leading-relaxed" data-edit-path="subline">
              {plain(subline)}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-10">
            {primaryCta && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-[color:var(--token-on-dark-heading)] font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl" data-edit-path="label">
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center gap-2 px-8 py-4 bg-[color-mix(in_srgb,var(--token-card-bg)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--token-card-bg)_20%,transparent)] text-[color:var(--token-on-dark-heading)] font-semibold rounded-lg border border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)] transition-all backdrop-blur-sm" data-edit-path="label">
                {secondaryCta.label}
              </a>
            )}
          </div>
          {trustItems.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-[color:color-mix(in_srgb,var(--token-card-border)_20%,transparent)]">
              {trustItems.map((item, i) => (
                <span key={i} className="text-sm text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)] font-medium" data-edit-collection="trustItems" data-edit-index={i}>{item}</span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
