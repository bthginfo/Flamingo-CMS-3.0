'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export type ImageEffect = 'none' | 'parallax' | 'kenBurns' | 'mouseGlow';

type Props = {
  effect?: ImageEffect;
  intensity?: 'subtle' | 'medium' | 'strong';
  children: ReactNode;
  className?: string;
};

/**
 * Wraps image content and applies a visual effect.
 * All effects are purely visual overlays / transforms.
 * IMPORTANT: className is typically "absolute inset-0" — effects must preserve this.
 */
export function ImageEffectWrapper({ effect = 'none', intensity = 'medium', children, className = '' }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Keep the server and hydration trees identical. Motion is disabled only
  // after mount, inside the same effect wrapper.
  const reduceMotion = mounted && Boolean(prefersReducedMotion);
  if (!effect || effect === 'none') return <div className={className}>{children}</div>;

  switch (effect) {
    case 'parallax':
      return <ParallaxEffect intensity={intensity} className={className} reduceMotion={reduceMotion}>{children}</ParallaxEffect>;
    case 'kenBurns':
      return <KenBurnsEffect intensity={intensity} className={className} reduceMotion={reduceMotion}>{children}</KenBurnsEffect>;
    case 'mouseGlow':
      // Mouse glow disabled — fallback to plain render
      return <div className={className}>{children}</div>;
    default:
      return <div className={className}>{children}</div>;
  }
}

// ─── Parallax ──────────────────────────────────────────────────────
function ParallaxEffect({ intensity, className, children, reduceMotion }: Omit<Props, 'effect'> & { reduceMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const range = intensity === 'subtle' ? 30 : intensity === 'strong' ? 80 : 50;
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}px`, `${range}px`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={reduceMotion ? undefined : { y }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}

// ─── Ken Burns (slow zoom in/out loop) ─────────────────────────────
function KenBurnsEffect({ intensity, className, children, reduceMotion }: Omit<Props, 'effect'> & { reduceMotion: boolean }) {
  const scale = intensity === 'subtle' ? '1.05' : intensity === 'strong' ? '1.15' : '1.1';
  const duration = intensity === 'subtle' ? '25s' : intensity === 'strong' ? '15s' : '20s';

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 ${reduceMotion ? '' : 'animate-kenBurns'}`}
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
      if (rect.width === 0 || rect.height === 0) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
        setPos({ x, y });
        setActive(true);
      } else {
        setActive(false);
      }
    }
    function handleLeave() { setActive(false); }

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const opacity = intensity === 'subtle' ? 0.15 : intensity === 'strong' ? 0.4 : 0.25;
  const size = intensity === 'subtle' ? '40%' : intensity === 'strong' ? '70%' : '55%';

  return (
    <div ref={ref} className={`${className} relative`}>
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
