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
  const heroHeading = 'var(--token-on-dark-heading)';
  const heroBody = 'var(--token-on-dark-body)';
  const heroMuted = 'var(--token-on-dark-muted)';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative min-h-[82vh] flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {bgImage && (
        <ImageEffectWrapper effect={imageEffect} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill className="object-cover" priority sizes="100vw" />
        </ImageEffectWrapper>
      )}
      <div className="absolute inset-0 bg-[var(--token-section-bg-alt)]" style={{ opacity: bgImage ? overlayOpacity : 1 }} />

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[color:color-mix(in_srgb,var(--token-on-dark-heading)_10%,transparent)] to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 border border-[color:color-mix(in_srgb,var(--token-card-border)_10%,transparent)] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight" style={{ color: heroHeading }} data-edit-path="headline">
            {headline}
          </h1>
          {subline && (
            <p className="text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed" style={{ color: heroBody }} data-edit-path="subline">
              {plain(subline)}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {primaryCta && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-7 py-3.5 font-semibold text-[color:var(--token-btn-text)] shadow-lg transition-all hover:brightness-110">
                <DynamicIcon name="phone" size={18} />
                <span data-edit-path="label">{primaryCta.label}</span>
              </a>
            )}
            {secondaryCta && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur transition-all hover:bg-white/15" style={{ background: 'var(--token-btn-secondary-bg,var(--token-badge-bg))', color: 'var(--token-btn-secondary-text,var(--token-badge-text,var(--token-on-dark-heading)))', borderColor: 'var(--token-btn-secondary-border,rgba(255,255,255,0.3))' }} data-edit-path="label">
                {secondaryCta.label}
              </a>
            )}
          </div>
          {trustItems.length > 0 && (
            <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
              {trustItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium" style={{ color: heroMuted }} data-edit-collection="trustItems" data-edit-index={i}>
                  <DynamicIcon name="check-circle" size={16} className="text-[color:var(--token-accent)]" />
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
