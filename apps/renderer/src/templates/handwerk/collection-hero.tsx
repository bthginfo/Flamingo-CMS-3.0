'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';
import { plain } from '@/lib/strip-html';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

/**
 * CollectionHero — Blog/Article-style hero for collection detail pages.
 * Supports: headline, subline, bgImage, category, date, overlayColor, overlayOpacity
 */
type Cta = { label?: string; href?: string };

export function CollectionHeroSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const bgImage = (data.bgImage as string) || (data.backgroundImage as string) || '';
  const primaryCta = (data.primaryCta as Cta) || undefined;
  const secondaryCta = (data.secondaryCta as Cta) || undefined;
  const category = (data.category as string) || '';
  const date = (data.date as string) || '';
  const overlayColor = (data.overlayColor as string) || '#000000';
  const overlayOpacity = typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 0.5;
  const bgPosition = (data.bgPosition as string) || 'center';
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  return (
    <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
      {/* Background Image */}
      {bgImage ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image data-edit-image="bgImage" src={bgImage} alt={headline} fill className="object-cover" style={{ objectPosition: bgPosition }} priority />
          </ImageEffectWrapper>
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,15,25,0.96),rgba(10,15,25,0.88))]" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 w-full">
        {/* Category badge + Date */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-4"
        >
          {category && (
            <span className="inline-block bg-[var(--token-badge-bg)] backdrop-blur-sm text-[color:var(--token-badge-text)] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider" data-edit-path="category">
              {category}
            </span>
          )}
          {date && (
            <span className="text-[color:var(--token-on-dark-muted)] text-sm" data-edit-path="date">{date}</span>
          )}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--token-on-dark-heading)] tracking-tight leading-tight break-words" data-edit-path="headline"
        >
          {headline}
        </motion.h1>

        {/* Subline */}
        {subline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-[color:var(--token-on-dark-body)] max-w-2xl leading-relaxed rt-content"
            dangerouslySetInnerHTML={{ __html: subline }}
          />
        )}

        {(primaryCta?.label || secondaryCta?.label) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            {primaryCta?.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-7 py-3.5 font-semibold text-[color:var(--token-btn-text)] transition-all hover:-translate-y-0.5 hover:brightness-110">
                <span data-edit-path="label">{primaryCta.label}</span>
              </a>
            )}
            {secondaryCta?.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-7 py-3.5 font-semibold text-[color:var(--token-btn-secondary-text)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:brightness-110">
                <span data-edit-path="label">{secondaryCta.label}</span>
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

