'use client';

import { WordReveal } from '@/components/ui/fx';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CafeHeroSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kaffee, Kuchen & gute Vibes';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const badgeIcon = (data.badgeIcon as string) || '';
  const bgImage = (data.bgImage as string) || (data.backgroundImage as string) || '';
  const bgMode = (data.bgMode as string) || (bgImage ? 'image' : 'color');
  const bgPosition = (data.bgPosition as string) || 'center';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? 0.5;
  const primaryCta = data.primaryCta as { label: string; href: string; icon?: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string; icon?: string } | undefined;
  const openingHint = (data.openingHint as string) || '';
  const trustItems = Array.isArray(data.trustItems) ? (data.trustItems as string[]) : [];
  const trustStripColor = (data.trustStripColor as string) || '';
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative min-h-[85vh] flex items-end overflow-hidden -mt-[112px] pt-[112px]">
      {bgMode === 'image' && bgImage && (
        <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
          <Image data-edit-image="bgImage" src={bgImage} alt="" fill className="object-cover" style={{ objectPosition: bgPosition }} priority sizes="100vw" />
        </ImageEffectWrapper>
      )}
      {overlayColor
        ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
        : <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" style={{ opacity: overlayOpacity }} />}

      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          {badgeText && (
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--token-badge-border)] bg-[var(--token-badge-bg)] px-4 py-1.5 text-sm font-medium text-[color:var(--token-badge-text)] backdrop-blur" data-edit-path="badgeText">
              {badgeIcon && <DynamicIcon name={badgeIcon} size={14} />}{badgeText}
            </span>
          )}
          {openingHint && (
            <span className="mb-4 block text-sm font-medium tracking-wide text-[var(--token-on-dark-body)]" data-edit-path="openingHint">{openingHint}</span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--token-on-dark-heading)] leading-tight" data-edit-path="headline"><WordReveal text={headline} /></h1>
          {subline && (
            <p className="text-lg text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_80%,transparent)] mt-5 leading-relaxed" data-edit-path="subline">
              {plain(subline)}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-8">
            {primaryCta && (
              <a data-edit-link="primaryCta" href={primaryCta.href} className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--token-btn-bg)] hover:brightness-110 text-[color:var(--token-btn-text)] font-semibold rounded-full transition-all hover:-translate-y-0.5" data-edit-path="label">
                {primaryCta.label}{primaryCta.icon && <DynamicIcon editPath="primaryCta.icon" name={primaryCta.icon} size={16} />}
              </a>
            )}
            {secondaryCta && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-7 py-3.5 font-semibold text-[color:var(--token-btn-secondary-text)] backdrop-blur-sm transition-all hover:brightness-110" data-edit-path="label">
                {secondaryCta.label}{secondaryCta.icon && <DynamicIcon editPath="secondaryCta.icon" name={secondaryCta.icon} size={16} />}
              </a>
            )}
          </div>
          {trustItems.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[color:var(--token-on-dark-muted)]">
              {trustItems.map((item, index) => (
                <span key={`${item}-${index}`} className="rounded-full bg-[color:color-mix(in_srgb,#000000_44%,transparent)] px-4 py-2 backdrop-blur" style={trustStripColor ? { backgroundColor: trustStripColor } : undefined} data-edit-path={`trustItems.${index}`}>{item}</span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
