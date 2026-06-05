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
export function CollectionHeroSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const bgImage = (data.bgImage as string) || '';
  const category = (data.category as string) || '';
  const date = (data.date as string) || '';
  const overlayColor = (data.overlayColor as string) || '#000000';
  const overlayOpacity = typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 0.5;
  const bgPosition = (data.bgPosition as string) || 'center';
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';

  if (styleVariant === 'minimal') {
    return <CollectionHeroMinimal headline={headline} subline={plain(subline)} category={category} date={date} />;
  }

  return (
    <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
      {/* Background Image */}
      {bgImage ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image src={bgImage} alt={headline} fill className="object-cover" style={{ objectPosition: bgPosition }} priority />
          </ImageEffectWrapper>
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--token-section-bg)] via-[var(--token-card-bg)] to-[var(--token-section-bg)]" />
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
            <span className="inline-block bg-[var(--token-badge-bg)] backdrop-blur-sm text-[var(--token-badge-text)] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider" data-edit-path="category">
              {category}
            </span>
          )}
          {date && (
            <span className="text-[var(--token-on-dark-muted)] text-sm" data-edit-path="date">{date}</span>
          )}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--token-on-dark-heading)] tracking-tight leading-tight break-words" data-edit-path="headline"
        >
          {headline}
        </motion.h1>

        {/* Subline */}
        {subline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-[var(--token-on-dark-body)] max-w-2xl leading-relaxed rt-content"
            dangerouslySetInnerHTML={{ __html: subline }}
          />
        )}
      </div>
    </section>
  );
}

/** Minimal variant — no background image, clean typographic layout */
function CollectionHeroMinimal({ headline, subline, category, date }: { headline: string; subline: string; category: string; date: string }) {
  return (
    <section className="pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          {category && (
            <span className="inline-block bg-[var(--token-badge-bg)] text-[var(--token-badge-text)] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider" data-edit-path="category">
              {category}
            </span>
          )}
          {date && (
            <span className="text-[var(--token-muted)] text-sm" data-edit-path="date">{date}</span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight break-words text-[var(--token-heading)]" data-edit-path="headline"
        >
          {headline}
        </motion.h1>

        {subline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-[var(--token-body)] max-w-2xl leading-relaxed rt-content"
            dangerouslySetInnerHTML={{ __html: subline }}
          />
        )}

        <div className="mt-10 border-b border-[var(--token-card-border)]" />
      </div>
    </section>
  );
}
