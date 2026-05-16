'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

export function RestaurantHeroSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Restaurant';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const badgeIcon = (data.badgeIcon as string) || 'UtensilsCrossed';
  const badgeStarsIcon = (data.badgeStarsIcon as string) || 'Star';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgColor = (data.bgColor as string) || '';
  const bgMode = (data.bgMode as string) || 'image';
  const trustItems = asList<string>(data.trustItems);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';

  const props: HeroProps = { headline, subline, badgeText, badgeIcon, badgeStarsIcon, bgImage, bgImageMobile, bgColor, bgMode, trustItems, primaryCta, secondaryCta, bgPosition, bgPositionMobile };

  if (styleVariant === 'modern') return <HeroModern {...props} />;
  if (styleVariant === 'bold') return <HeroBold {...props} />;
  return <HeroClassic {...props} />;
}

type HeroProps = {
  headline: string;
  subline: string;
  badgeText: string;
  badgeIcon: string;
  badgeStarsIcon: string;
  bgImage: string;
  bgImageMobile?: string;
  bgColor: string;
  bgMode: string;
  trustItems: string[];
  primaryCta: ButtonValue;
  secondaryCta: ButtonValue;

  bgPosition?: string;
  bgPositionMobile?: string;};

/* ─── CLASSIC: Fullscreen bg, warm gradient overlay, grain texture, spotlight, staggered fade-in ─── */
function HeroClassic({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, bgImage, bgImageMobile, bgColor, bgMode, trustItems, primaryCta, secondaryCta , bgPosition, bgPositionMobile}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-[#111827]">
      {/* Background image + overlays */}
      {(bgMode === 'image' && bgImage) ? (
        <>
          <Image src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} sizes="100vw" />}
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}
      {/* Warm terra-cotta gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.5))' }} />
      {/* SVG grain texture */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] bg-repeat" />
      {/* Warm spotlight */}
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full blur-[150px] bg-brand-primary/10 animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badgeText && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-full px-5 py-2.5 text-sm text-white/90 mb-8">
              <DynamicIcon name={badgeIcon} size={14} className="text-brand-accent" />
              <span className="font-medium">{badgeText}</span>
              {badgeStarsIcon && (
                <div className="flex -space-x-0.5 ml-1">
                  {[1, 2, 3, 4, 5].map(i => <DynamicIcon key={i} name={badgeStarsIcon} size={11} className="fill-brand-accent text-brand-accent" />)}
                </div>
              )}
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-[700] leading-[0.95] text-white"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
            {headline}
          </motion.h1>

          {/* Subline */}
          {subline && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 max-w-2xl mx-auto text-lg leading-8 text-white/70 rt-content"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {primaryCta.label && (
              <a href={primaryCta.href || '#'}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-8 py-4 font-semibold text-gray-900 transition-all hover:shadow-lg hover:-translate-y-0.5">
                {primaryCta.label}
                {primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={17} className="transition-transform group-hover:translate-x-1" />}
              </a>
            )}
            {secondaryCta.label && (
              <a href={secondaryCta.href || '#'}
                className="inline-flex items-center justify-center gap-2 text-white/80 font-medium hover:text-white transition-colors text-sm">
                {secondaryCta.label}
                {secondaryCta.icon && <DynamicIcon name={secondaryCta.icon} size={14} />}
              </a>
            )}
          </motion.div>

          {/* Trust items */}
          {trustItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/50">
              {trustItems.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-accent/70" />{item}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── MODERN: Split layout, text left / image right, minimalist, generous whitespace ─── */
function HeroModern({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, bgImage, bgImageMobile, bgColor, bgMode, trustItems, primaryCta, secondaryCta , bgPosition, bgPositionMobile}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center -mt-[112px] pt-[112px] bg-white">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-12 md:py-20">
        {/* Text side */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          {badgeText && (
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 tracking-wide uppercase">
              <span className="w-8 h-px bg-gray-300" />{badgeText}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 !leading-[1.1] tracking-tight">
            {headline}
          </h1>
          {subline && (
            <div className="text-lg text-gray-500 leading-relaxed mt-8 max-w-lg rt-content" dangerouslySetInnerHTML={{ __html: subline }} />
          )}
          <div className="flex flex-col sm:flex-row items-start gap-6 mt-12">
            {primaryCta.label && (
              <a href={primaryCta.href || '#'}
                className="group inline-flex items-center gap-3 text-gray-900 font-medium text-base border-b-2 border-gray-900 pb-1 hover:border-brand-accent hover:text-brand-accent transition-colors">
                {primaryCta.label}
                {primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={16} className="transition-transform group-hover:translate-x-1" />}
              </a>
            )}
            {secondaryCta.label && (
              <a href={secondaryCta.href || '#'}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-600 transition-colors text-sm">
                {secondaryCta.label}
              </a>
            )}
          </div>
          {trustItems.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-16 text-xs text-gray-500 uppercase tracking-wider">
              {trustItems.map((item) => <span key={item}>{item}</span>)}
            </div>
          )}
        </motion.div>

        {/* Image side */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {(bgMode === 'image' && bgImage) ? (
            <div className="relative aspect-[4/5] rounded-[0.5rem] overflow-hidden">
              <Image src={bgImage} alt="" fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority sizes="50vw" />
              {bgImageMobile && <Image src={bgImageMobile} alt="" fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority sizes="50vw" />}
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

/* ─── BOLD: Fullscreen dark bg, diagonal accent stripe, brutalist buttons, uppercase ─── */
function HeroBold({ headline, subline, badgeText, badgeIcon, badgeStarsIcon, bgImage, bgImageMobile, bgColor, bgMode, trustItems, primaryCta, secondaryCta , bgPosition, bgPositionMobile}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px] bg-[#111827]">
      {/* Background image + dark overlay */}
      {(bgMode === 'image' && bgImage) ? (
        <>
          <Image src={bgImage} alt="" fill priority className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} sizes="100vw" />
          {bgImageMobile && <Image src={bgImageMobile} alt="" fill priority className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} sizes="100vw" />}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-[#111827]/75" />
        </>
      ) : (bgMode === 'color' && bgColor) ? (
        <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      ) : null}

      {/* Diagonal accent stripe */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/10 skew-x-[-12deg] translate-x-20" />
      {/* Thick accent line */}
      <div className="absolute top-[112px] left-0 w-full h-1.5 bg-brand-accent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12 md:py-20">
        <div className="max-w-5xl">
          {/* Badge as solid rectangle */}
          {badgeText && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
              className="inline-block bg-brand-accent text-gray-900 font-bold text-xs uppercase tracking-widest px-4 py-2 mb-8">
              {badgeText}
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black text-white uppercase !leading-[0.9] tracking-tight"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}>
            {headline}
          </motion.h1>

          {/* Subline */}
          {subline && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-white/50 mt-8 max-w-2xl font-medium rt-content"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}

          {/* Brutalist CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-12">
            {primaryCta.label && (
              <a href={primaryCta.href || '#'}
                className="inline-flex items-center gap-3 bg-brand-accent text-gray-900 font-bold uppercase tracking-wider px-8 py-4 text-base hover:translate-x-1 transition-transform shadow-[4px_4px_0_rgba(255,255,255,0.2)]">
                {primaryCta.label}{primaryCta.icon && <DynamicIcon name={primaryCta.icon} size={18} />}
              </a>
            )}
            {secondaryCta.label && (
              <a href={secondaryCta.href || '#'}
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold uppercase tracking-wider px-8 py-4 text-base hover:border-white transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.1)]">
                {secondaryCta.label}
              </a>
            )}
          </motion.div>

          {/* Trust items */}
          {trustItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-6 mt-16 text-sm text-white/40 font-bold uppercase tracking-wider">
              {trustItems.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-accent" />{item}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

