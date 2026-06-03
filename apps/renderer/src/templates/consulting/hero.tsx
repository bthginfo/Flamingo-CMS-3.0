'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ConsultingHeroSection({ data }: Props) {
  const headline = (data.headline as string) || 'Ihre Kanzlei für Recht & Beratung';
  const subline = (data.subline as string) || '';
  const bgImage = (data.bgImage as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? 0.7;
  const primaryCta = data.primaryCta as { label: string; href: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string } | undefined;
  const trustItems = (data.trustItems as string[]) || [];
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative min-h-[85vh] flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image src={bgImage} alt="" fill className="object-cover" priority sizes="100vw" />
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-slate-900" style={{ opacity: bgImage ? overlayOpacity : 1 }} />

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 border border-white/10 rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight">
            {headline}
          </h1>
          {subline && (
            <p className="text-lg md:text-xl text-white/80 mt-6 max-w-2xl mx-auto leading-relaxed">
              {plain(subline)}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {primaryCta && (
              <a href={primaryCta.href} className="inline-flex items-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
                <DynamicIcon name="phone" size={18} />
                {primaryCta.label}
              </a>
            )}
            {secondaryCta && (
              <a href={secondaryCta.href} className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
                {secondaryCta.label}
              </a>
            )}
          </div>
          {trustItems.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/20">
              {trustItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                  <DynamicIcon name="check-circle" size={16} className="text-amber-500" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
