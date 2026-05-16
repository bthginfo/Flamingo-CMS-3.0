'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  const names = (data.names as string) || 'Anna & Max';
  const date = (data.date as string) || '2026-09-12';
  const venue = (data.venue as string) || '';
  const subline = (data.subline as string) || 'Wir heiraten!';
  const bgImage = (data.bgImage as string) || '';
  const bgImageMobile = (data.bgImageMobile as string) || '';
  const showCountdown = data.showCountdown !== false;
  const countdown = useCountdown(date);
  const formattedDate = new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden -mt-[112px] pt-[112px]">
      {bgImage ? (
        <>
          <Image src={bgImage} alt={names} fill className={`object-cover${bgImageMobile ? ' hidden md:block' : ''}`} priority />
          {bgImageMobile && <Image src={bgImageMobile} alt={names} fill className="object-cover md:hidden" priority />}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-white to-brand-secondary/5" />
      )}
      <div className="relative z-10 text-center px-6 py-12 md:py-20">
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`text-sm tracking-[0.3em] uppercase mb-6 ${bgImage ? 'text-white/70' : 'text-brand-primary'}`}>
          {subline}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight ${bgImage ? 'text-white' : 'text-gray-900'}`}>
          {names}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={`text-lg mt-6 ${bgImage ? 'text-white/80' : 'text-gray-600'}`}>
          {formattedDate}{venue && ` · ${venue}`}
        </motion.p>
        {showCountdown && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`mt-14 flex gap-8 md:gap-12 justify-center ${bgImage ? 'text-white' : 'text-gray-800'}`}>
            {[
              { v: countdown.days, l: 'Tage' },
              { v: countdown.hours, l: 'Stunden' },
              { v: countdown.minutes, l: 'Minuten' },
              { v: countdown.seconds, l: 'Sekunden' },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-light tabular-nums">{v}</span>
                <span className="text-xs uppercase tracking-[0.2em] mt-2 opacity-70">{l}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
