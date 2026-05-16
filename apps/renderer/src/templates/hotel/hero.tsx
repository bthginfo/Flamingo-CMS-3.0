'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Star, CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function HotelHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Hotel';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const badgeIcon = (data.badgeIcon as string) || 'Star';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const availabilityHint = (data.availabilityHint as string) || '';
  const ratingText = (data.ratingText as string) || '';

  if (styleVariant === 'modern') return <HeroModern headline={headline} subline={subline} badgeText={badgeText} badgeIcon={badgeIcon} trustItems={trustItems} bgImage={bgImage} bgImageMobile={bgImageMobile} bgColor={bgColor} bgMode={bgMode} primaryCta={primaryCta} secondaryCta={secondaryCta} availabilityHint={availabilityHint} ratingText={ratingText} />;
  if (styleVariant === 'bold') return <HeroBold headline={headline} subline={subline} badgeText={badgeText} badgeIcon={badgeIcon} trustItems={trustItems} bgImage={bgImage} bgImageMobile={bgImageMobile} bgColor={bgColor} bgMode={bgMode} primaryCta={primaryCta} secondaryCta={secondaryCta} availabilityHint={availabilityHint} ratingText={ratingText} />;
  return <HeroClassic headline={headline} subline={subline} badgeText={badgeText} badgeIcon={badgeIcon} trustItems={trustItems} bgImage={bgImage} bgImageMobile={bgImageMobile} bgColor={bgColor} bgMode={bgMode} primaryCta={primaryCta} secondaryCta={secondaryCta} availabilityHint={availabilityHint} ratingText={ratingText} />;
}

type HeroProps = {
  headline: string;
  subline: string;
  badgeText: string;
  badgeIcon: string;
  trustItems: string[];
  bgImage: string;
  bgImageMobile?: string;
  bgColor: string;
  bgMode: string;
  primaryCta: ButtonValue;
  secondaryCta: ButtonValue;
  availabilityHint: string;
  ratingText: string;

  bgPosition?: string;};

/* ─── CLASSIC: Fullscreen forest-green/gold gradient, serif feel, gold accents, staggered animations ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, availabilityHint, ratingText , bgPosition}: HeroProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <Image src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPosition }} priority sizes="100vw" />}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f1d2e]/90 via-[#0f1d2e]/70 to-[#1a3550]/60" />
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1d2e] via-[#1a3550] to-[#0f1d2e]" />
      )}
      {/* grain texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0VjZoLTJWMGgtNHY2aC0ydjhoLTJ2LThoLTJWMGgtNHY2aC0ydjhoNFYyaDRWNmgydi04aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
      {/* scattered stars */}
      <div className="absolute top-1/4 left-[15%] text-white/15"><Star size={24} /></div>
      <div className="absolute top-[60%] right-[20%] text-white/10"><Star size={18} /></div>
      <div className="absolute top-[35%] right-[10%] text-white/8"><Star size={32} /></div>
      {/* border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div style={{ opacity, y }} className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20 text-center">
        {badgeText && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 text-sm text-white/80 mb-6">
            <DynamicIcon name={badgeIcon} size={14} className="fill-white text-white" />
            <span className="font-medium">{badgeText}</span>
          </motion.div>
        )}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-semibold text-white leading-[0.98]"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.4)' }}>
          {headline}
        </motion.h1>
        {subline && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-7 max-w-2xl mx-auto text-lg leading-8 text-white/70"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            {subline}
          </motion.p>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {primaryCta.label && (
              <a href={primaryCta.href || '#'} className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-[#0f1d2e] transition-all hover:shadow-lg hover:-translate-y-0.5">
              <span className="relative z-10 flex items-center gap-2.5">{primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={17} className="transition-transform group-hover:translate-x-1" />}</span>
              <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%]" />
            </a>
          )}
          {secondaryCta.label && (
            <a href={secondaryCta.href || '#'} className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-semibold text-white hover:border-white/60 transition-colors">
              {secondaryCta.label}
            </a>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
          {ratingText && <span className="inline-flex items-center gap-2"><Star size={14} className="text-white/70" />{ratingText}</span>}
          {availabilityHint && <span className="border border-white/15 px-3 py-1 rounded-full">{availabilityHint}</span>}
          {trustItems.map((item) => (
            <span key={item} className="flex items-center gap-2"><CheckCircle size={14} className="text-white/60" />{item}</span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── MODERN: Split layout, minimalist, generous whitespace ─── */
function HeroModern({ headline, subline, badgeText, badgeIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, availabilityHint, ratingText , bgPosition}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center -mt-[112px] pt-[112px] bg-white">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-12 md:py-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          {badgeText && (
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 tracking-wide uppercase">
              <span className="w-8 h-px bg-gray-300" />{badgeText}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 !leading-[1.1] tracking-tight">
            {headline}
          </h1>
          {subline && <div className="text-lg text-gray-400 leading-relaxed mt-8 max-w-lg rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
          <div className="flex flex-col sm:flex-row items-start gap-6 mt-12">
            {primaryCta.label && (
              <a href={primaryCta.href || '#'} className="group inline-flex items-center gap-3 text-gray-900 font-medium text-base border-b-2 border-gray-900 pb-1 hover:border-amber-500 hover:text-amber-600 transition-colors">
                {primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={16} className="transition-transform group-hover:translate-x-1" />}
              </a>
            )}
            {secondaryCta.label && (
              <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm">
                {secondaryCta.label}
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-16 text-xs text-gray-400 uppercase tracking-wider">
            {ratingText && <span className="inline-flex items-center gap-1.5"><Star size={12} />{ratingText}</span>}
            {availabilityHint && <span>{availabilityHint}</span>}
            {trustItems.map((item, i) => <span key={i}>{item}</span>)}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {(bgMode === 'image' && bgImage) ? (
            <div className="relative aspect-[4/5] rounded-[0.5rem] overflow-hidden">
              <Image src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="50vw" />
              {bgImageMobile && <Image src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPosition }} priority sizes="50vw" />}
            </div>
          ) : (bgMode === 'color' && bgColor) ? (
            <div className="aspect-[4/5] rounded-[0.5rem] overflow-hidden" style={{ backgroundColor: bgColor }} />
          ) : (
            <div className="aspect-[4/5] rounded-[0.5rem] bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100" />
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── BOLD: Dark bg, diagonal gold stripe, uppercase, brutalist buttons ─── */
function HeroBold({ headline, subline, badgeText, badgeIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, availabilityHint, ratingText , bgPosition}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-gray-950">
      {(bgMode === 'image' && bgImage) ? (
        <>
          <Image src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPosition }} priority sizes="100vw" />}
          <div className="absolute inset-0 bg-gray-950/80" />
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      {/* diagonal accent stripe */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-12deg] translate-x-20" />
      {/* thick accent lines */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-white" />
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20">
        <div className="max-w-5xl">
          {badgeText && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
              className="inline-block bg-white text-gray-950 font-bold text-xs uppercase tracking-widest px-4 py-2 mb-8">
              {badgeText}
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black text-white uppercase !leading-[0.9] tracking-tight">
            {headline}
          </motion.h1>
          {subline && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-white/50 mt-8 max-w-2xl font-medium rt-content" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-12">
            {primaryCta.label && (
              <a href={primaryCta.href || '#'} className="inline-flex items-center gap-3 bg-white text-gray-950 font-bold uppercase tracking-wider px-8 py-4 text-base hover:translate-x-1 transition-transform shadow-[4px_4px_0_rgba(255,255,255,0.2)]">
                {primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={18} />}
              </a>
            )}
            {secondaryCta.label && (
              <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold uppercase tracking-wider px-8 py-4 text-base hover:border-white transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.1)]">
                {secondaryCta.label}
              </a>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-6 mt-16 text-sm text-white/40 font-bold uppercase tracking-wider">
            {ratingText && <span className="flex items-center gap-2"><Star size={14} className="text-white/70" />{ratingText}</span>}
            {availabilityHint && <span className="flex items-center gap-2"><span className="w-2 h-2 bg-white" />{availabilityHint}</span>}
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-2"><span className="w-2 h-2 bg-white" />{item}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

