'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImageEffectWrapper, type ImageEffect } from '@/components/ui/image-effects';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function useCountdown(targetDate: string) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const d = Math.max(0, target - now);
      setDiff({ days: Math.floor(d / 86400000), hours: Math.floor((d % 86400000) / 3600000), minutes: Math.floor((d % 3600000) / 60000), seconds: Math.floor((d % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return diff;
}

export function WeddingHeroSection({ data, styleVariant }: Props) {
  const names = (data.names as string) || 'Anna & Max';
  const date = (data.date as string) || '2026-09-12';
  const venue = (data.venue as string) || '';
  const subline = (data.subline as string) || 'Wir heiraten!';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const showCountdown = data.showCountdown !== false;
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1; // -1 = use default style overlay
  const countdown = useCountdown(date);
  const formattedDate = new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  const nameClass = isBold
    ? `text-3xl md:text-6xl lg:text-8xl font-black uppercase tracking-wider break-words ${bgImage ? 'text-[color:var(--token-on-dark-heading,#ffffff)]' : 'text-[color:var(--token-heading,#18181b)]'}`
    : isModern
    ? `text-2xl md:text-5xl lg:text-7xl font-extralight uppercase tracking-[0.2em] break-words ${bgImage ? 'text-[color:var(--token-on-dark-heading,#ffffff)]' : 'text-[color:var(--token-heading,#18181b)]'}`
    : `text-4xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight break-words ${bgImage ? 'text-[color:var(--token-on-dark-heading,#ffffff)]' : 'text-[color:var(--token-heading,#18181b)]'}`;

  const sublineClass = isBold
    ? `text-xs font-bold tracking-[0.4em] uppercase mb-4 ${bgImage ? 'text-[color:var(--token-on-dark-heading,#ffffff)/80]' : 'text-[color:var(--token-on-dark-muted,#3f3f46)]'}`
    : isModern
    ? `text-xs tracking-[0.5em] uppercase mb-8 ${bgImage ? 'text-[color:var(--token-on-dark-heading,#ffffff)/60]' : 'text-[color:var(--token-on-dark-muted,#71717a)]'}`
    : `text-sm tracking-[0.3em] uppercase mb-6 ${bgImage ? 'text-[color:var(--token-on-dark-heading,#ffffff)/70]' : 'text-[color:var(--token-icon,var(--brand-primary,#1a5276))]'}`;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden -mt-[112px] pt-[112px]">
      {bgImage ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image src={bgImage} alt={names} fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority />
            {bgImageMobile && <Image src={bgImageMobile} alt={names} fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority />}
          </ImageEffectWrapper>
          {isBold ? (
            overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          ) : isModern ? (
            overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : <div className="absolute inset-0 bg-[var(--token-section-bg-alt,#000000)/30]" />
          ) : (
            overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : <div className="absolute inset-0 bg-gradient-to-b from-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))/60] via-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))/40] to-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))/60]" />
          )}
        </>
      ) : (
        <div className={`absolute inset-0 ${isBold ? 'bg-[var(--token-section-bg-alt,#000000)]' : isModern ? 'bg-[var(--token-card-bg,#ffffff)]' : 'bg-gradient-to-br from-[var(--token-icon,var(--brand-primary,#1a5276))/5] via-white to-[var(--token-subheading,var(--brand-secondary,#2e86c1))/5]'}`} />
      )}
      <div className={`relative z-10 px-4 py-10 md:px-6 md:py-20 ${isBold ? 'text-left max-w-4xl mx-auto w-full' : 'text-center'}`}>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`${sublineClass} rt-content`} dangerouslySetInnerHTML={{ __html: subline }} />
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={nameClass}>
          {names}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={`mt-6 ${isBold ? 'text-sm font-bold uppercase tracking-widest' : isModern ? 'text-sm tracking-[0.15em] uppercase' : 'text-lg'} ${bgImage ? (isBold ? 'text-[color:var(--token-on-dark-heading,#ffffff)/70]' : 'text-[color:var(--token-on-dark-heading,#ffffff)/80]') : 'text-[color:var(--token-on-dark-muted,#52525b)]'}`}>
          {formattedDate}{venue && ` · ${venue}`}
        </motion.p>
        {showCountdown && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`mt-10 md:mt-14 flex ${isBold ? 'gap-4 md:gap-8' : 'gap-4 md:gap-12 justify-center'} ${bgImage ? 'text-[color:var(--token-on-dark-heading,#ffffff)]' : (isBold ? 'text-[color:var(--token-on-dark-heading,#ffffff)]' : 'text-[color:var(--token-heading,#27272a)]')}`}>
            {[
              { v: countdown.days, l: 'Tage' },
              { v: countdown.hours, l: 'Std' },
              { v: countdown.minutes, l: 'Min' },
              { v: countdown.seconds, l: 'Sek' },
            ].map(({ v, l }) => (
              <div key={l} className={`flex flex-col items-center ${isBold ? 'border-2 border-[color:var(--token-card-border,#ffffff)/20] px-3 py-2 md:px-5 md:py-4' : isModern ? 'border border-[color:var(--token-card-border,#ffffff)/10] px-3 py-2 md:px-6 md:py-4' : ''}`}>
                <span className={`tabular-nums ${isBold ? 'text-2xl md:text-5xl font-black' : isModern ? 'text-2xl md:text-5xl font-extralight' : 'text-2xl md:text-6xl font-light'}`}>{v}</span>
                <span className={`uppercase mt-1 md:mt-2 opacity-70 ${isBold ? 'text-[10px] tracking-[0.3em] font-bold' : isModern ? 'text-[10px] tracking-[0.2em]' : 'text-[10px] md:text-xs tracking-[0.2em]'}`}>{l}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
