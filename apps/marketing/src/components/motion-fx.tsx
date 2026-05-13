/**
 * Motion-FX library — framer-motion–powered components.
 *
 * Distillat aus dem ui-ux-pro-max-skill (siehe docs/BRANCH-STYLE-GUIDE.md):
 * - Tilt3DCard         (#5 Hyperrealism + #46 Dimensional Layering)
 * - MagneticButton     (#62 Interactive Cursor + spring physics)
 * - StaggerReveal      (#15 Motion-Driven, IO-triggered)
 * - GradientText       (#48 Kinetic Typography, animated background-clip)
 * - HoverGlow          (#62 Cursor effects, soft pink glow that follows mouse)
 * - HardShadowCard     (#38 Neubrutalism + #77 Neo-Brutalism Mobile)
 * - ScrambleText       (#48 Kinetic Typography, character-shuffle on hover)
 *
 * Alle Komponenten respektieren `prefers-reduced-motion`.
 */
import {
  CSSProperties, ReactNode, useEffect, useRef, useState,
} from 'react';
import {
  motion, useMotionValue, useSpring, useTransform,
  AnimatePresence, type MotionStyle,
} from 'framer-motion';

const reduced = () =>
  typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── 3D Tilt Card ───────── */
export function Tilt3DCard({
  children, max = 10, glare = true, className = '', style,
}: {
  children: ReactNode;
  /** max rotation in degrees */
  max?: number;
  glare?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  // Hooks called unconditionally — even if `glare` is false — to keep
  // hook order stable across re-renders.
  const glareBg = useTransform(
    [sx, sy] as any,
    ([gx, gy]: any) =>
      `radial-gradient(circle at ${50 + gx * 100}% ${50 + gy * 100}%, rgba(255,255,255,0.18), transparent 50%)`
  );

  const onMove = (e: React.MouseEvent) => {
    if (reduced()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX, rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
        ...style,
      } as MotionStyle}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{ background: glareBg } as MotionStyle}
        />
      )}
    </motion.div>
  );
}

/* ───────── Magnetic Button (FM spring wrapper)
 * Wraps any child (Link, button, a) in a motion.span that pulls toward
 * the cursor. Children remain clickable / routable.
 */
export function MagneticButton({
  strength = 22, children, className = '', style,
}: {
  strength?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 14, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced()) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: 'inline-block', ...style } as MotionStyle}
      className={className}
    >
      {children}
    </motion.span>
  );
}

/* ───────── Stagger Reveal (FM variants, IO-triggered) ───────── */
export function StaggerReveal({
  children, delay = 0, stagger = 0.08, y = 24, className = '',
}: {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {Array.isArray(children) ? children.map((c, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
          }}
        >{c}</motion.div>
      )) : (
        <motion.div
          variants={{
            hidden: { opacity: 0, y },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
          }}
        >{children}</motion.div>
      )}
    </motion.div>
  );
}

/* ───────── Reveal individual element (no children-loop) ───────── */
export function FadeUp({
  children, delay = 0, y = 24, className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── GradientText (animated mask) ───────── */
export function GradientText({
  children, from = '#F24171', via = '#FFB347', to = '#F24171',
  className = '', as: As = 'span', duration = 6,
}: {
  children: ReactNode;
  from?: string; via?: string; to?: string;
  className?: string;
  as?: any;
  duration?: number;
}) {
  return (
    <As
      className={className}
      style={{
        background: `linear-gradient(90deg, ${from}, ${via}, ${to})`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: reduced() ? 'none' : `gradientFlow ${duration}s ease-in-out infinite`,
      }}
    >
      {children}
      <style>{`@keyframes gradientFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }`}</style>
    </As>
  );
}

/* ───────── HoverGlow (soft pink glow follows mouse inside card) ───────── */
export function HoverGlow({
  children, color = 'rgba(242,65,113,0.18)', size = 280,
  className = '', as: As = 'div', style,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  className?: string;
  as?: any;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000, on: false });
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };
  const onLeave = () => setPos((p) => ({ ...p, on: false }));
  return (
    <As
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.on ? 1 : 0,
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 65%)`,
        }}
      />
      <div className="relative">{children}</div>
    </As>
  );
}

/* ───────── HardShadowCard (Neubrutalism: 4px black offset shadow + bold border) ───────── */
export function HardShadowCard({
  children, rotate = 0, className = '', shadowColor = '#14111a', offset = 6,
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
  shadowColor?: string;
  offset?: number;
}) {
  return (
    <motion.div
      whileHover={reduced() ? undefined : { x: -2, y: -2 }}
      whileTap={reduced() ? undefined : { x: offset, y: offset }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        boxShadow: `${offset}px ${offset}px 0 0 ${shadowColor}`,
        border: `2px solid ${shadowColor}`,
      } as MotionStyle}
    >
      {children}
    </motion.div>
  );
}

/* ───────── ScrambleText (decode-on-hover) ───────── */
const SCRAMBLE_CHARS = '!@#$%&*+=?░▒▓<>/\\|';
export function ScrambleText({
  text, className = '', triggerOnView = false,
}: {
  text: string;
  className?: string;
  triggerOnView?: boolean;
}) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  const run = () => {
    if (reduced()) { setOut(text); return; }
    const len = text.length;
    let frame = 0;
    const dur = 18;
    const id = setInterval(() => {
      frame++;
      let s = '';
      for (let i = 0; i < len; i++) {
        if (i < frame * 0.6) s += text[i];
        else if (text[i] === ' ') s += ' ';
        else s += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setOut(s);
      if (frame >= dur) { clearInterval(id); setOut(text); }
    }, 35);
  };

  useEffect(() => {
    if (!triggerOnView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, triggerOnView]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={triggerOnView ? undefined : run}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {out}
    </span>
  );
}

/* ───────── Animated Number (FM-driven, scroll-triggered) ───────── */
export function AnimatedNumber({
  to, suffix = '', prefix = '', duration = 2, className = '',
}: {
  to: number; suffix?: string; prefix?: string; duration?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) { setN(to); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const ms = duration * 1000;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / ms);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [to, duration]);
  return <span ref={ref} className={className}>{prefix}{n.toLocaleString('de-DE')}{suffix}</span>;
}

/* ───────── Page Transition wrapper (use around route content) ───────── */
export function PageFade({ children, k }: { children: ReactNode; k?: string | number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={k}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
