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

export function WeddingHeroSection({ data }: Props) {
  const names = (data.coupleName as string) || (data.names as string) || (data.headline as string) || 'Anna & Max';
  const date = (data.date as string) || '2026-09-12';
  const venue = (data.venue as string) || '';
  const subline = (data.tagline as string) || (data.subline as string) || 'Wir heiraten!';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const bgPosition = (data.bgPosition as string) || 'center';
  const bgPositionMobile = (data.bgPositionMobile as string) || 'center';
  const showCountdown = data.showCountdown !== false;
  const imageEffect = (data.imageEffect as ImageEffect) || 'none';
  const imageEffectIntensity = (data.imageEffectIntensity as 'subtle' | 'medium' | 'strong') || 'medium';
  const overlayColor = (data.overlayColor as string) || '';
  const overlayOpacity = (data.overlayOpacity as number) ?? -1; // -1 = use default style overlay
  const overlayScrim = overlayOpacity > 0 ? overlayOpacity : 0.5;
  const countdown = useCountdown(date);
  const formattedDate = new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  const nameClass = `text-4xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight break-words ${bgImage ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`;
  const sublineClass = `text-sm tracking-[0.3em] uppercase mb-6 ${bgImage ? 'text-[color:var(--token-on-dark-body)] opacity-85' : 'text-[color:var(--token-icon)]'}`;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden -mt-[112px] pt-[112px]">
      {bgImage ? (
        <>
          <ImageEffectWrapper effect={imageEffect} intensity={imageEffectIntensity} className="absolute inset-0">
            <Image data-edit-image="bgImage" src={bgImage} alt={names} fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} style={{ objectPosition: bgPosition }} priority />
            {bgImageMobile && <Image data-edit-image="bgImageMobile" src={bgImageMobile} alt={names} fill className="object-cover md:hidden" style={{ objectPosition: bgPositionMobile || bgPosition }} priority />}
          </ImageEffectWrapper>
          {/* Names/date render on-dark WHITE — needs a DARK scrim, not the light
              --token-section-bg-alt veil that washed the text out. Soft, even
              darkening keeps the romantic look while staying legible. */}
          {overlayOpacity === 0 ? null : overlayColor && overlayOpacity > 0 ? <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} /> : <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(20,14,12,${(overlayScrim * 0.9).toFixed(2)}) 0%, rgba(20,14,12,${(overlayScrim * 0.55).toFixed(2)}) 45%, rgba(20,14,12,${(overlayScrim * 0.85).toFixed(2)}) 100%)` }} />}
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--token-icon)_5%,transparent)] via-white to-[color-mix(in_srgb,var(--token-subheading)_5%,transparent)]" />
      )}
      <div className="relative z-10 px-4 py-10 md:px-6 md:py-20 text-center">
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`${sublineClass} rt-content`} data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={nameClass}>
          {names}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={`mt-6 text-lg ${bgImage ? 'text-[color:var(--token-on-dark-body)] opacity-90' : 'text-[color:var(--token-muted)]'}`}>
          {formattedDate}{venue && <> · <span data-edit-path="venue">{venue}</span></>}
        </motion.p>
        {showCountdown && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`mt-10 md:mt-14 flex gap-4 md:gap-12 justify-center ${bgImage ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`}>
            {[
              { v: countdown.days, l: 'Tage' },
              { v: countdown.hours, l: 'Std' },
              { v: countdown.minutes, l: 'Min' },
              { v: countdown.seconds, l: 'Sek' },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center">
                <span className="tabular-nums text-2xl md:text-6xl font-light">{v}</span>
                <span className="uppercase mt-1 md:mt-2 opacity-70 text-[10px] md:text-xs tracking-[0.2em]">{l}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
