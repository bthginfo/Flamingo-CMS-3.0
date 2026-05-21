'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';

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
          <Image src={bgImage} alt="" fill className="object-cover" priority sizes="100vw" />
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
            <span className="inline-block text-amber-400 text-sm font-medium mb-4 tracking-wide">{openingHint}</span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {headline}
          </h1>
          {subline && (
            <p className="text-lg text-white/80 mt-5 leading-relaxed">
              {subline}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-8">
            {primaryCta && (
              <a href={primaryCta.href} className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full transition-all">
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a href={secondaryCta.href} className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 backdrop-blur-sm transition-all">
                {secondaryCta.label}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
