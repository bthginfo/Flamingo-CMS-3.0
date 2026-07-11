'use client';

// Premium FX primitives (Aceternity/MagicUI style) — framer-motion + CSS only,
// no additional dependencies. All colour comes from the token system.

import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

/** Animated count-up that starts when scrolled into view.
 * Non-numeric values render as-is (e.g. "seit 2011"). */
export function NumberTicker({ value, duration = 1.6, className }: { value: number | string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const numeric = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  const isNumeric = Number.isFinite(numeric) && String(value).trim() !== '';
  const decimals = isNumeric ? (String(value).split(/[.,]/)[1]?.length ?? 0) : 0;
  const formattedValue = isNumeric ? numeric.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : String(value);

  useEffect(() => {
    if (!isNumeric || !ref.current) return;
    const el = ref.current;
    if (reduceMotion) {
      el.textContent = formattedValue;
      return;
    }
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (numeric * eased).toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, isNumeric, numeric, decimals, duration, reduceMotion, formattedValue]);

  return <span ref={ref} className={`tabular-nums ${className || ''}`}>{isNumeric ? (0).toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : value}</span>;
}

/** Travelling light beam around a card's border. Parent needs `relative` and
 * `overflow-hidden` with a border-radius; the beam reads --token-accent. */
export function BorderBeam({ duration = 7, size = 120 }: { duration?: number; size?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <div
        className="absolute aspect-square animate-fx-beam"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: 'linear-gradient(to left, var(--token-accent), transparent)',
          animationDuration: `${duration}s`,
        }}
      />
    </div>
  );
}

/** 3D tilt following the cursor; settles back on leave. Wrap a single card. */
export function TiltCard({ children, className, max = 10 }: { children: React.ReactNode; className?: string; max?: number }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  return (
    <motion.div
      className={className}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      onMouseMove={reduceMotion ? undefined : (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={reduceMotion ? undefined : () => { x.set(0.5); y.set(0.5); }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word headline reveal on scroll into view. */
export function WordReveal({ text, className, as: Tag = 'span', delay = 0 }: { text: string; className?: string; as?: 'span' | 'h1' | 'h2'; delay?: number }) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: '0.25em' }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.42, delay: delay + i * 0.045, ease: [0.2, 0.65, 0.3, 0.9] }}
        >
          {word}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  );
}
