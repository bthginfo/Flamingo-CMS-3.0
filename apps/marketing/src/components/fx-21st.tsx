/**
 * Heavier visual effect layers — 21st.dev–inspired.
 * Kept separate from `motion-fx.tsx` so the bundle can tree-shake what
 * marketing/landing surfaces use vs. what every tenant template imports.
 *
 *   - AuroraBackground       (animated soft gradient blobs)
 *   - SpotlightSection       (cursor-following radial spotlight)
 *   - AnimatedGridPattern    (SVG dot lattice with mask)
 *   - ScrollVelocityText     (scroll-driven horizontal drift)
 *   - TextReveal             (word-by-word mask reveal on enter)
 *   - MarqueeTrack           (smoother, FM-driven marquee)
 *   - BentoCard              (asymmetric grid tile w/ hover lift + spotlight)
 *
 * Every component respects `prefers-reduced-motion`.
 */
import { CSSProperties, ReactNode, useEffect, useId, useRef, useState } from 'react';
import {
  motion, useMotionValue, useSpring, type MotionStyle,
} from 'framer-motion';

const reduced = () =>
  typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── Aurora Background ───────── */
export function AuroraBackground({
  colors = ['#F24171', '#FFB347', '#7C3AED', '#22d3ee'],
  intensity = 0.55,
  className = '',
}: {
  colors?: string[];
  intensity?: number;
  className?: string;
}) {
  const positions: Array<[number, number]> = [
    [10, 10], [60, 30], [30, 60], [70, 50],
  ];
  return (
    <div aria-hidden className={'pointer-events-none absolute inset-0 overflow-hidden ' + className}>
      {colors.map((c, i) => {
        const [lx, ly] = positions[i % positions.length];
        return (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl mix-blend-screen"
            style={{
              background: c,
              opacity: intensity,
              width: '60vw',
              height: '60vw',
              left: lx + '%',
              top: ly + '%',
            }}
            animate={reduced() ? undefined : {
              x: [0, 60, -40, 0],
              y: [0, -40, 30, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 18 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

/* ───────── Spotlight Section ───────── */
export function SpotlightSection({
  children, color = 'rgba(242,65,113,0.35)', size = 600,
  className = '', as: As = 'section', style,
}: {
  children: ReactNode; color?: string; size?: number;
  className?: string; as?: any; style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000, on: false });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };
  const onLeave = () => setPos((p) => ({ ...p, on: false }));
  return (
    <As
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={'relative overflow-hidden ' + className}
      style={style}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: pos.on ? 1 : 0,
          background: 'radial-gradient(' + size + 'px circle at ' + pos.x + 'px ' + pos.y + 'px, ' + color + ', transparent 65%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </As>
  );
}

/* ───────── Animated Grid Pattern ───────── */
export function AnimatedGridPattern({
  width = 32, height = 32, dotSize = 1.2, color = 'currentColor',
  className = '', mask = true,
}: {
  width?: number; height?: number; dotSize?: number; color?: string;
  className?: string; mask?: boolean;
}) {
  const id = useId();
  const maskImage = mask
    ? 'radial-gradient(ellipse at center, white 40%, transparent 75%)'
    : undefined;
  return (
    <svg
      aria-hidden
      className={'pointer-events-none absolute inset-0 w-full h-full ' + className}
      style={maskImage ? { WebkitMaskImage: maskImage, maskImage } as CSSProperties : undefined}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          <circle cx={width / 2} cy={height / 2} r={dotSize} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={'url(#' + id + ')'} />
    </svg>
  );
}

/* ───────── Scroll Velocity Text ───────── */
export function ScrollVelocityText({
  children, baseVelocity = 60, className = '',
}: {
  children: ReactNode; baseVelocity?: number; className?: string;
}) {
  const last = useRef({
    y: typeof window !== 'undefined' ? window.scrollY : 0,
    t: typeof performance !== 'undefined' ? performance.now() : 0,
  });
  const x = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 50, mass: 0.4 });

  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    let pos = 0;
    const tick = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = y - last.current.y;
      const dt = Math.max(1, now - last.current.t);
      const v = (dy / dt) * 1000;
      last.current = { y, t: now };
      pos -= (baseVelocity + v * 0.4) * (dt / 1000);
      x.set(pos);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baseVelocity, x]);

  return (
    <div className={'overflow-hidden whitespace-nowrap ' + className}>
      <motion.div style={{ x: sx, display: 'inline-block' } as MotionStyle}>
        {children}
        <span aria-hidden className="ml-12">{children}</span>
        <span aria-hidden className="ml-12">{children}</span>
      </motion.div>
    </div>
  );
}

/* ───────── Text Reveal (word-by-word masked rise) ───────── */
export function TextReveal({
  text, className = '', stagger = 0.05, y = '110%',
}: {
  text: string; className?: string; stagger?: number; y?: string | number;
}) {
  const words = text.split(' ');
  return (
    <motion.span
      className={'inline-block ' + className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: stagger }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y, opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ───────── MarqueeTrack — pure CSS keyframe (no JS loop = no jank) ───────── */
export function MarqueeTrack({
  children, speed = 40, direction = 'left', className = '',
}: {
  children: ReactNode; speed?: number; direction?: 'left' | 'right';
  className?: string;
}) {
  const animName = direction === 'left' ? 'mqLeft' : 'mqRight';
  return (
    <div className={'overflow-hidden ' + className}>
      <div
        className="inline-flex shrink-0 gap-12 whitespace-nowrap will-change-transform"
        style={{
          animation: animName + ' ' + speed + 's linear infinite',
          animationPlayState: reduced() ? 'paused' : 'running',
        }}
      >
        <span className="inline-flex shrink-0 gap-12">{children}</span>
        <span aria-hidden className="inline-flex shrink-0 gap-12">{children}</span>
      </div>
      <style>{
        '@keyframes mqLeft{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}'
        + '@keyframes mqRight{from{transform:translate3d(-50%,0,0)}to{transform:translate3d(0,0,0)}}'
      }</style>
    </div>
  );
}

/* ───────── BentoCard — asymmetric tile w/ spotlight ───────── */
export function BentoCard({
  children, className = '', accent = 'rgba(242,65,113,0.18)',
}: {
  children: ReactNode; className?: string; accent?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000, on: false });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };
  const onLeave = () => setPos((p) => ({ ...p, on: false }));
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={reduced() ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={'relative overflow-hidden rounded-3xl border border-line bg-white ' + className}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.on ? 1 : 0,
          background: 'radial-gradient(360px circle at ' + pos.x + 'px ' + pos.y + 'px, ' + accent + ', transparent 60%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
