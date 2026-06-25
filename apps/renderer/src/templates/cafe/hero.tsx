'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CafeHeroSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kaffee, Kuchen & gute Vibes';
  const subline = (data.subline as string) || '';
  const bgImage = (data.bgImage as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? 0.5;
  const primaryCta = data.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string } | undefined;
  const openingHint = (data.openingHint as string) || '';
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative min-h-[85vh] flex items-end overflow-hidden -mt-[112px] pt-[112px]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill className="object-cover" priority sizes="100vw" />
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" style={{ opacity: overlayOpacity }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          {openingHint && (
            <span className="inline-block text-[var(--token-accent)] text-sm font-medium mb-4 tracking-wide">{openingHint}</span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--token-on-dark-heading)] leading-tight" data-edit-path="headline">
            {headline}
          </h1>
          {subline && (
            <p className="text-lg text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_80%,transparent)] mt-5 leading-relaxed" data-edit-path="subline">
              {plain(subline)}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-8">
            {primaryCta && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--token-accent)] hover:bg-[var(--token-accent)] text-[color:var(--token-on-dark-heading)] font-semibold rounded-full transition-all" data-edit-path="label">
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center gap-2 px-7 py-3.5 bg-[color-mix(in_srgb,var(--token-card-bg)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--token-card-bg)_20%,transparent)] text-[color:var(--token-btn-secondary-text)] font-semibold rounded-full border border-[color:var(--token-btn-secondary-border)] backdrop-blur-sm transition-all" data-edit-path="label">
                {secondaryCta.label}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
