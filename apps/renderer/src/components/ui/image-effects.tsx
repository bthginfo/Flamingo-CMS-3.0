'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export type ImageEffect = 'none' | 'parallax' | 'kenBurns' | 'mouseGlow' | 'blurOnScroll' | 'grain';

type Props = {
  effect?: ImageEffect;
  intensity?: 'subtle' | 'medium' | 'strong';
  children: ReactNode;
  className?: string;
};

/**
 * Wraps image content and applies a visual effect.
 * All effects are purely visual overlays / transforms.
 */
export function ImageEffectWrapper({ effect = 'none', intensity = 'medium', children, className = '' }: Props) {
  if (!effect || effect === 'none') return <div className={className}>{children}</div>;

  switch (effect) {
    case 'parallax':
      return <ParallaxEffect intensity={intensity} className={className}>{children}</ParallaxEffect>;
    case 'kenBurns':
      return <KenBurnsEffect intensity={intensity} className={className}>{children}</KenBurnsEffect>;
    case 'mouseGlow':
      return <MouseGlowEffect intensity={intensity} className={className}>{children}</MouseGlowEffect>;
    case 'blurOnScroll':
      return <BlurOnScrollEffect intensity={intensity} className={className}>{children}</BlurOnScrollEffect>;
    case 'grain':
      return <GrainEffect intensity={intensity} className={className}>{children}</GrainEffect>;
    default:
      return <div className={className}>{children}</div>;
  }
}

// ─── Parallax ──────────────────────────────────────────────────────
function ParallaxEffect({ intensity, className, children }: Omit<Props, 'effect'>) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const range = intensity === 'subtle' ? 30 : intensity === 'strong' ? 80 : 50;
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}px`, `${range}px`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

// ─── Ken Burns (slow zoom in/out loop) ─────────────────────────────
function KenBurnsEffect({ intensity, className, children }: Omit<Props, 'effect'>) {
  const scale = intensity === 'subtle' ? '1.05' : intensity === 'strong' ? '1.15' : '1.1';
  const duration = intensity === 'subtle' ? '25s' : intensity === 'strong' ? '15s' : '20s';

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="w-full h-full animate-kenBurns"
        style={{ '--kb-scale': scale, '--kb-duration': duration } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Mouse Glow (radial light following cursor) ────────────────────
function MouseGlowEffect({ intensity, className, children }: Omit<Props, 'effect'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
      setActive(true);
    }
    function handleLeave() { setActive(false); }
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => { el.removeEventListener('mousemove', handleMove); el.removeEventListener('mouseleave', handleLeave); };
  }, []);

  const opacity = intensity === 'subtle' ? 0.15 : intensity === 'strong' ? 0.4 : 0.25;
  const size = intensity === 'subtle' ? '40%' : intensity === 'strong' ? '70%' : '55%';

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(circle ${size} at ${pos.x}% ${pos.y}%, rgba(255,255,255,${opacity}), transparent)`,
        }}
      />
    </div>
  );
}

// ─── Blur on Scroll ────────────────────────────────────────────────
function BlurOnScrollEffect({ intensity, className, children }: Omit<Props, 'effect'>) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const maxBlur = intensity === 'subtle' ? 4 : intensity === 'strong' ? 12 : 8;
  const blur = useTransform(scrollYProgress, [0, 1], [0, maxBlur]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ filter: blur.get() > 0 ? `blur(${blur}px)` : undefined }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

// ─── Grain / Film Overlay ──────────────────────────────────────────
function GrainEffect({ intensity, className, children }: Omit<Props, 'effect'>) {
  const opacity = intensity === 'subtle' ? 0.03 : intensity === 'strong' ? 0.08 : 0.05;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className="pointer-events-none absolute inset-0 z-10 animate-grain"
        style={{ opacity, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />
    </div>
  );
}
