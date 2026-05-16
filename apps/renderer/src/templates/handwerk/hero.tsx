'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { Spotlight } from '@/components/ui/spotlight';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import Image from 'next/image';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function HeroSection({ data, styleVariant }: Props) {
  const headline = (data.headline as string) || 'Willkommen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const badgeIcon = (data.badgeIcon as string) || 'Shield';
  const badgeStarsIcon = (data.badgeStarsIcon as string) || 'Star';
  const trustItems = (data.trustItems as string[]) || [];
  const trustStripColor = (data.trustStripColor as string) || '';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const primaryCta = data.primaryCta as { label: string; href: string; icon?: string } | undefined;
  const secondaryCta = data.secondaryCta as { label: string; href: string; icon?: string } | undefined;
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? 0;
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';

  if (styleVariant === 'modern') return <HeroModern headline={headline} subline={subline} badgeText={badgeText} badgeIcon={badgeIcon} badgeStarsIcon={badgeStarsIcon} trustItems={trustItems} bgImage={bgImage} bgImageMobile={bgImageMobile} bgColor={bgColor} bgMode={bgMode} primaryCta={primaryCta} secondaryCta={secondaryCta} overlayColor={overlayColor} overlayOpacity={overlayOpacity} bgPosition={bgPosition} bgPositionMobile={bgPositionMobile} trustStripColor={trustStripColor} />;
  if (styleVariant === 'bold') return <HeroBold headline={headline} subline={subline} badgeText={badgeText} badgeIcon={badgeIcon} badgeStarsIcon={badgeStarsIcon} trustItems={trustItems} bgImage={bgImage} bgImageMobile={bgImageMobile} bgColor={bgColor} bgMode={bgMode} primaryCta={primaryCta} secondaryCta={secondaryCta} overlayColor={overlayColor} overlayOpacity={overlayOpacity} bgPosition={bgPosition} bgPositionMobile={bgPositionMobile} trustStripColor={trustStripColor} />;
  return <HeroClassic headline={headline} subline={subline} badgeText={badgeText} badgeIcon={badgeIcon} badgeStarsIcon={badgeStarsIcon} trustItems={trustItems} bgImage={bgImage} bgImageMobile={bgImageMobile} bgColor={bgColor} bgMode={bgMode} primaryCta={primaryCta} secondaryCta={secondaryCta} overlayColor={overlayColor} overlayOpacity={overlayOpacity} bgPosition={bgPosition} bgPositionMobile={bgPositionMobile} trustStripColor={trustStripColor} />;
}

type HeroProps = {
  headline: string;
  subline: string;
  badgeText: string;
  badgeIcon: string;
  badgeStarsIcon: string;
  trustItems: string[];
  bgImage: string;
  bgImageMobile?: string;
  bgColor: string;
  bgMode: string;
  primaryCta?: { label: string; href: string; icon?: string };
  secondaryCta?: { label: string; href: string; icon?: string };
  overlayColor?: string;
  overlayOpacity?: number;
  bgPosition?: string;
  bgPositionMobile?: string;
  trustStripColor?: string;
};

/* ─── CLASSIC: Fullscreen gradient overlay, spotlight, floating orbs, pill buttons ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, trustStripColor }: HeroProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);
  const useBgImage = bgMode === 'image' && bgImage;

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px]">
      {useBgImage ? (
        <>
          <Image src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="100vw" />}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-brand-dark/50" />
          {overlayColor && overlayOpacity ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : null}
        </>
      ) : bgMode === 'color' && bgColor ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : (
        <>
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0VjZoLTJWMGgtNHY2aC0ydjhoLTJ2LThoLTJWMGgtNHY2aC0ydjhoNFYyaDRWNmgydi04aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        </>
      )}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(46, 134, 193, 0.15)" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-accent/8 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-brand-secondary/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />

      <motion.div style={{ opacity, y }} className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20 lg:py-0 lg:pt-12 pb-40">
        <div className="max-w-4xl">
          <TextGenerateEffect words={headline} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white !leading-[1.02]" duration={0.6} />
          {badgeText && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-md border border-white/[0.12] rounded-full px-5 py-2.5 text-sm text-white/90 mt-6">
              <DynamicIcon name={badgeIcon} size={15} className="text-brand-accent" />
              <span className="font-medium">{badgeText}</span>
              {badgeStarsIcon && (
                <div className="flex -space-x-0.5 ml-2">
                  {[1,2,3,4,5].map(i => <DynamicIcon key={i} name={badgeStarsIcon} size={12} className="fill-brand-accent text-brand-accent" />)}
                </div>
              )}
            </motion.div>
          )}
          {subline && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}
              className="text-lg sm:text-xl text-white/60 leading-relaxed mb-12 max-w-2xl mt-8 [&_p]:m-0 rt-content" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }} className="flex flex-col items-center sm:items-start sm:flex-row gap-4 mb-6">
            {primaryCta?.label && (
              <a href={primaryCta.href} className="group relative inline-flex items-center overflow-hidden rounded-full bg-brand-accent px-8 py-4 font-semibold text-gray-900 transition-all duration-300 hover:shadow-glow-accent hover:-translate-y-0.5 text-base sm:w-auto">
                <span className="relative z-10 flex items-center w-full justify-between gap-4 sm:justify-center sm:gap-2.5">{primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={18} className="transition-transform group-hover:translate-x-1" />}</span>
                <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%]" />
              </a>
            )}
            {secondaryCta?.label && (
              <a href={secondaryCta.href} className="btn-secondary group !rounded-full sm:w-auto flex items-center justify-between gap-4 sm:justify-center sm:gap-2">{secondaryCta.icon && <DynamicIcon name={secondaryCta.icon} size={18} />}{secondaryCta.label}</a>
            )}
          </motion.div>
        </div>
      </motion.div>
      {trustItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.3 }}
          className="absolute bottom-0 left-0 right-0 z-20"
          style={trustStripColor ? { backgroundColor: trustStripColor } : undefined}
        >
          <div className={`flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-sm px-6 py-3 ${trustStripColor ? 'text-white' : 'bg-black/30 backdrop-blur-sm text-white/80'}`}>
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-accent/80" />{item}</span>
            ))}
          </div>
        </motion.div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent -z-0" />
    </div>
  );
}

/* ─── MODERN: Split layout, text left / image right, generous whitespace, understated ─── */
function HeroModern({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, trustStripColor }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center -mt-[112px] pt-[112px] bg-white">
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
          {subline && <div className="text-lg text-gray-400 leading-relaxed mt-8 max-w-lg [&_p]:inline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
          <div className="flex flex-col sm:flex-row items-start gap-6 mt-12">
            {primaryCta?.label && (
              <a href={primaryCta.href} className="group inline-flex items-center justify-between sm:justify-center sm:gap-3 w-full sm:w-auto text-gray-900 font-medium text-base border-b-2 border-gray-900 pb-1 hover:border-brand-accent hover:text-brand-accent transition-colors">
                {primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={16} className="transition-transform group-hover:translate-x-1" />}
              </a>
            )}
            {secondaryCta?.label && (
              <a href={secondaryCta.href} className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm">
                <Phone size={14} />{secondaryCta.label}
              </a>
            )}
          </div>
          {trustItems.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-16 text-xs text-gray-400 uppercase tracking-wider">
              {trustItems.map((item, i) => <span key={i}>{item}</span>)}
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {(bgMode === 'image' && bgImage) ? (
            <div className="relative aspect-[4/5] rounded-[0.5rem] overflow-hidden">
              <Image src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="50vw" />
              {bgImageMobile && <Image src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="50vw" />}
              {overlayColor && overlayOpacity ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : null}
            </div>
          ) : (bgMode === 'color' && bgColor) ? (
            <div className="aspect-[4/5] rounded-[0.5rem]" style={{ backgroundColor: bgColor }} />
          ) : (
            <div className="aspect-[4/5] rounded-[0.5rem] bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── BOLD: Full-width dark block, diagonal accent stripe, sharp edges, uppercase ─── */
function HeroBold({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, trustItems, bgImage, bgImageMobile, bgColor, bgMode, primaryCta, secondaryCta, overlayColor, overlayOpacity, bgPosition, bgPositionMobile, trustStripColor }: HeroProps) {
  const useBgImage = bgMode === 'image' && bgImage;
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-brand-dark" style={bgMode === 'color' && bgColor ? { backgroundColor: bgColor } : undefined}>
      {useBgImage && (
        <>
          <Image src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="100vw" />}
          <div className="absolute inset-0 bg-brand-dark/80" />
          {overlayColor && overlayOpacity ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : null}
        </>
      )}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/10 skew-x-[-12deg] translate-x-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20">
        <div className="max-w-5xl">
          {badgeText && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
              className="inline-block bg-brand-accent text-brand-dark font-bold text-xs uppercase tracking-widest px-4 py-2 mb-8">
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
            {primaryCta?.label && (
              <a href={primaryCta.href} className="inline-flex items-center justify-between sm:justify-center sm:gap-3 w-full sm:w-auto bg-brand-accent text-brand-dark font-bold uppercase tracking-wider px-8 py-4 text-base hover:translate-x-1 transition-transform shadow-[4px_4px_0_rgba(255,255,255,0.2)]">
                {primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={18} />}
              </a>
            )}
            {secondaryCta?.label && (
              <a href={secondaryCta.href} className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold uppercase tracking-wider px-8 py-4 text-base hover:border-white transition-colors">
                <Phone size={16} />{secondaryCta.label}
              </a>
            )}
          </motion.div>
          {trustItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-6 mt-16 text-sm text-white/40 font-bold uppercase tracking-wider">
              {trustItems.map((item, i) => (
                <span key={i} className="flex items-center gap-2"><span className="w-2 h-2 bg-brand-accent" />{item}</span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
