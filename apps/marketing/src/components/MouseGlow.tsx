import { useEffect, useRef } from 'react';

/**
 * MouseGlow — buttery-smooth mouse-reactive hero backdrop.
 *
 * Why this is fast:
 *  - Zero React re-renders. Mouse position lives in refs.
 *  - One rAF loop lerps two glowing blobs to the cursor.
 *  - Only `transform: translate3d(...)` is updated → GPU-composited, no layout/paint.
 *  - Two soft-blurred radial gradients + a thin animated mesh = depth without cost.
 *
 * Disabled (static fallback) when `prefers-reduced-motion` is set.
 */
export interface MouseGlowProps {
  /** Outer (large, soft) glow color, RGBA recommended. */
  colorA?: string;
  /** Inner (small, sharper) glow color, RGBA recommended. */
  colorB?: string;
  /** Optional className for the wrapper. */
  className?: string;
  /** Default cursor position (percent) before first move. */
  initial?: { x: number; y: number };
}

export function MouseGlow({
  colorA = 'rgba(124, 58, 237, 0.55)',   // violet-600 @ 55%
  colorB = 'rgba(242, 65, 113, 0.65)',   // brand pink @ 65%
  className = '',
  initial = { x: 50, y: 35 },
}: MouseGlowProps) {
  const hostRef  = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const meshRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host  = hostRef.current;
    const blobA = blobARef.current;
    const blobB = blobBRef.current;
    const mesh  = meshRef.current;
    if (!host || !blobA || !blobB) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let rect = host.getBoundingClientRect();
    let targetX = (initial.x / 100) * rect.width;
    let targetY = (initial.y / 100) * rect.height;
    let curAX   = targetX;
    let curAY   = targetY;
    let curBX   = targetX;
    let curBY   = targetY;
    let raf = 0;
    let t   = 0;

    const onMove = (e: PointerEvent) => {
      // window-level mousemove keeps the glow following even when the cursor
      // is over the text; the host's `pointer-events-none` would block onmousemove there.
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };
    const onResize = () => {
      rect = host.getBoundingClientRect();
    };

    const tick = () => {
      // Two different lerp rates → blob A trails (soft, dreamy), blob B leads (snappy).
      curAX += (targetX - curAX) * 0.06;
      curAY += (targetY - curAY) * 0.06;
      curBX += (targetX - curBX) * 0.18;
      curBY += (targetY - curBY) * 0.18;

      // Slight orbital wobble so the hero feels alive even when the cursor is still.
      t += 0.008;
      const wobX = Math.sin(t)       * 12;
      const wobY = Math.cos(t * 0.7) * 12;

      blobA.style.transform = `translate3d(${curAX - 320 + wobX}px, ${curAY - 320 + wobY}px, 0)`;
      blobB.style.transform = `translate3d(${curBX - 140}px, ${curBY - 140}px, 0)`;
      if (mesh) mesh.style.transform = `translate3d(${(targetX - rect.width / 2) * 0.015}px, ${(targetY - rect.height / 2) * 0.015}px, 0)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [initial.x, initial.y]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Static soft mesh — adds depth but never animates (cheap). */}
      <div
        ref={meshRef}
        className="absolute inset-0 will-change-transform"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 25%, rgba(124,58,237,0.28), transparent 70%),' +
            'radial-gradient(50% 45% at 85% 15%, rgba(242,65,113,0.22), transparent 70%),' +
            'radial-gradient(70% 60% at 50% 100%, rgba(34,211,238,0.18), transparent 70%)',
        }}
      />

      {/* Soft trailing glow (transform-only). */}
      <div
        ref={blobARef}
        className="absolute will-change-transform"
        style={{
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: colorA,
          filter: 'blur(80px)',
        }}
      />

      {/* Sharp leading glow (transform-only). */}
      <div
        ref={blobBRef}
        className="absolute will-change-transform mix-blend-screen"
        style={{
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: colorB,
          filter: 'blur(40px)',
        }}
      />

      {/* Vignette + readability layer — keeps text contrast no matter where the glow sits. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
