'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-6xl font-bold tabular-nums">{value}</span>
      <span className="text-xs md:text-sm uppercase tracking-widest mt-1 opacity-70">{label}</span>
    </div>
  );
}

function useCountdown(targetDate: string) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const d = Math.max(0, target - now);
      setDiff({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000) / 60000),
        seconds: Math.floor((d % 60000) / 1000),
      });
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
  const showCountdown = data.showCountdown !== false;
  const overlayColor = (data.overlayColor as string) || '#000000';
  const overlayOpacity = typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 0.4;

  const countdown = useCountdown(date);
  const formattedDate = new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {bgImage ? (
        <>
          <Image src={bgImage} alt={names} fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-rose-50" />
      )}

      <div className="relative z-10 text-center px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm md:text-base uppercase tracking-[0.3em] mb-6 ${bgImage ? 'text-white/80' : 'text-rose-400'}`}
        >
          {subline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight ${bgImage ? 'text-white' : 'text-gray-900'}`}
        >
          {names}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-lg md:text-xl mt-6 ${bgImage ? 'text-white/80' : 'text-gray-600'}`}
        >
          {formattedDate}{venue && ` · ${venue}`}
        </motion.p>

        {showCountdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`mt-12 flex gap-6 md:gap-10 justify-center ${bgImage ? 'text-white' : 'text-gray-800'}`}
          >
            <CountdownUnit value={countdown.days} label="Tage" />
            <CountdownUnit value={countdown.hours} label="Stunden" />
            <CountdownUnit value={countdown.minutes} label="Minuten" />
            <CountdownUnit value={countdown.seconds} label="Sekunden" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
