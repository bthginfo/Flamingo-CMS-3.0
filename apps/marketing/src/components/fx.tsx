import {
  CSSProperties, ReactNode, useEffect, useId, useRef, useState,
  forwardRef, ComponentPropsWithoutRef,
} from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Marquee ──────────────────────────────────────────────────────────
 * Infinite horizontal scroll. Pauses on hover.
 */
export function Marquee({
  children,
  speed = 'normal',
  reverse = false,
  className = '',
}: {
  children: ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`marquee ${className}`}
      data-speed={speed}
      data-direction={reverse ? 'reverse' : 'forward'}
    >
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden>{children}</div>
    </div>
  );
}

/* ─── MagneticButton ───────────────────────────────────────────────────
 * Subtle pull toward cursor when nearby.
 */
type MagneticProps = ComponentPropsWithoutRef<'a'> & {
  strength?: number;
  href: string;
  children: ReactNode;
};
export const MagneticAnchor = forwardRef<HTMLAnchorElement, MagneticProps>(
  ({ strength = 0.25, href, children, className = '', style, ...rest }, _ref) => {
    const local = useRef<HTMLAnchorElement>(null);
    useEffect(() => {
      const el = local.current;
      if (!el) return;
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const reset = () => { el.style.transform = ''; };
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', reset);
      return () => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', reset);
      };
    }, [strength]);
    return (
      <a
        ref={local}
        href={href}
        className={`transition-transform duration-200 will-change-transform ${className}`}
        style={style}
        {...rest}
      >
        {children}
      </a>
    );
  }
);
MagneticAnchor.displayName = 'MagneticAnchor';

/* ─── AnimatedCounter ──────────────────────────────────────────────────
 * Counts up from 0 to target when in view.
 */
export function AnimatedCounter({
  to,
  suffix = '',
  prefix = '',
  duration = 1600,
  className = '',
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { setN(to); return; }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0, rootMargin: '0px 0px 25% 0px' });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [to, duration]);
  return (
    <span ref={ref} className={`num-display ${className}`}>
      {prefix}{n}{suffix}
    </span>
  );
}

/* ─── RotatingWord ─────────────────────────────────────────────────────
 * Cycles through a list of words with a subtle vertical animation.
 */
export function RotatingWord({
  words,
  interval = 2400,
  className = '',
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <span className={`relative inline-block align-baseline ${className}`} style={{ minWidth: '4ch' }}>
      <span
        key={i}
        className="inline-block"
        style={{
          animation: 'wordSwap 600ms cubic-bezier(0.2,0.7,0.2,1)',
        }}
      >
        {words[i]}
      </span>
      <style>{`@keyframes wordSwap { 0%{opacity:0;transform:translateY(0.4em)} 100%{opacity:1;transform:none} }`}</style>
    </span>
  );
}

/* ─── ParallaxImage ────────────────────────────────────────────────────
 * Slow scroll-driven Y-translate.
 */
export function ParallaxImage({
  src, alt = '', className = '', strength = 0.15,
}: { src: string; alt?: string; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const dy = (r.top + r.height / 2 - center) * -strength;
      const img = el.querySelector('img');
      if (img) (img as HTMLImageElement).style.transform = `translate3d(0,${dy}px,0) scale(1.15)`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', update); cancelAnimationFrame(raf); };
  }, [strength]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover will-change-transform" loading="lazy" />
    </div>
  );
}

/* ─── CursorSpotlight ──────────────────────────────────────────────────
 * Mouse-tracked radial gradient inside a container.
 */
export function CursorSpotlight({
  color = 'rgba(242,65,113,0.22)',
  size = 600,
  className = '',
}: { color?: string; size?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const move = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    const leave = () => setPos({ x: -1000, y: -1000 });
    parent.addEventListener('mousemove', move);
    parent.addEventListener('mouseleave', leave);
    return () => { parent.removeEventListener('mousemove', move); parent.removeEventListener('mouseleave', leave); };
  }, []);
  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${className}`}
      style={{
        background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 60%)`,
      }}
    />
  );
}

/* ─── Accordion ────────────────────────────────────────────────────────
 * Animated <details>-style component.
 */
export function Accordion({
  items,
  className = '',
}: {
  items: { q: string; a: ReactNode }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={className}>
      {items.map((it, i) => (
        <div key={i} className="border-b border-line">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left py-6 flex items-center justify-between gap-6 group"
          >
            <span className="font-display text-2xl md:text-3xl pr-8 transition-transform group-hover:translate-x-1">
              {it.q}
            </span>
            <span
              className={`text-2xl text-muted transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}
              aria-hidden
            >+</span>
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="pb-6 text-lg leading-relaxed text-muted max-w-2xl">{it.a}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── ScrollProgressBar ────────────────────────────────────────────────
 * Thin bar at top of page showing scroll progress.
 */
export function ScrollProgress({ color = 'var(--accent-color)' }: { color?: string }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setW(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[2px] transition-[width] duration-100"
      style={{ width: `${w}%`, background: color }}
    />
  );
}

/* ─── TickerStat ───────────────────────────────────────────────────────
 * A clean stat card for hero / about sections.
 */
export function TickerStat({
  number, suffix, label, className = '',
}: { number: number | string; suffix?: string; label: string; className?: string }) {
  return (
    <div className={className}>
      <p className="num-display text-5xl md:text-6xl leading-none">
        {typeof number === 'number'
          ? <AnimatedCounter to={number} suffix={suffix} />
          : <>{number}{suffix || ''}</>
        }
      </p>
      <p className="mt-3 text-sm uppercase tracking-widest text-muted">{label}</p>
    </div>
  );
}

/* ─── BentoCard ─────────────────────────────────────────────────────────
 * Bento-grid card with subtle hover effect.
 */
export function BentoCard({
  title, description, children, className = '', accent = false,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative rounded-3xl p-7 md:p-9 overflow-hidden hover-lift transition-colors ${
        accent
          ? 'bg-brand text-white'
          : 'bg-white border border-line'
      } ${className}`}
    >
      <div className="relative z-10">
        {title && <h3 className="font-display text-2xl md:text-3xl">{title}</h3>}
        {description && <p className={`mt-3 text-sm md:text-base leading-relaxed ${accent ? 'text-white/70' : 'text-muted'}`}>{description}</p>}
        {children}
      </div>
    </div>
  );
}

/* ─── SplitText ─────────────────────────────────────────────────────────
 * Splits a string into per-word animated spans (for hero headlines).
 */
export function SplitText({ children, className = '' }: { children: string; className?: string }) {
  const id = useId();
  const words = children.split(/(\s+)/);
  return (
    <span className={`word-reveal ${className}`}>
      {words.map((w, i) => {
        if (!w.trim()) return <span key={`${id}-s-${i}`}>{w}</span>;
        return (
          <span key={`${id}-w-${i}`} className="word" style={{ animationDelay: `${i * 60}ms` } as CSSProperties}>
            {w}
          </span>
        );
      })}
    </span>
  );
}

/* ─── useReveal: scroll-reveal helper ─────────────────────────────────── */
export function useReveal() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const SEL = '.reveal:not(.is-visible), .reveal-fast:not(.is-visible), .reveal-stagger:not(.is-visible)';

    const REVEAL_RE = /(^|\s)(reveal|reveal-fast|reveal-stagger)(\s|$)/;
    const hasRevealNode = (mutations: MutationRecord[]) => {
      for (const m of mutations) {
        for (const n of Array.from(m.addedNodes)) {
          if (n.nodeType !== 1) continue;
          const el = n as Element;
          if (REVEAL_RE.test(el.className) || el.querySelector?.('.reveal, .reveal-fast, .reveal-stagger')) {
            return true;
          }
        }
      }
      return false;
    };

    if (reduced) {
      const apply = () =>
        document.querySelectorAll(SEL).forEach((el) => el.classList.add('is-visible'));
      apply();
      const mo = new MutationObserver((mutations) => {
        if (hasRevealNode(mutations)) apply();
      });
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );

    // Observe each not-yet-visible reveal element.
    // If it's already at or above the viewport (e.g. user scrolled past, then
    // React re-mounted the section), reveal it immediately — IO would never fire
    // for it because it's not going to intersect from below.
    const observeAll = () => {
      const vh = window.innerHeight;
      document.querySelectorAll(SEL).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.88) {
          // Already in or above viewport — show right away.
          el.classList.add('is-visible');
        } else {
          io.observe(el);
        }
      });
    };
    observeAll();

    // Re-scan only when a reveal node is actually added (style/route/content swap).
    let scheduled = false;
    const mo = new MutationObserver((mutations) => {
      if (scheduled || !hasRevealNode(mutations)) return;
      scheduled = true;
      // Coalesce; let React finish committing before we measure.
      requestAnimationFrame(() => {
        scheduled = false;
        observeAll();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/* ─── Smooth-scroll-driven custom cursor ring (desktop only) ─────────── */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const ring = ringRef.current;
    if (!ring) return;
    let x = -100, y = -100, tx = -100, ty = -100;
    let raf = 0;
    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const enterLink = () => ring.classList.add('cursor-hover');
    const leaveLink = () => ring.classList.remove('cursor-hover');
    const linkEls: Element[] = [];
    document.querySelectorAll('a, button, [role=button]').forEach((el) => {
      linkEls.push(el);
      el.addEventListener('mouseenter', enterLink);
      el.addEventListener('mouseleave', leaveLink);
    });
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
      linkEls.forEach((el) => {
        el.removeEventListener('mouseenter', enterLink);
        el.removeEventListener('mouseleave', leaveLink);
      });
    };
  }, []);
  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 36, height: 36,
          border: '1px solid rgba(11,11,16,0.6)',
          borderRadius: '50%',
          marginLeft: -18, marginTop: -18,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          transition: 'width 200ms ease, height 200ms ease, background 200ms ease',
        }}
      />
      <style>{`
        @media (pointer: coarse) { .cursor-ring { display:none } }
        body:has(.cursor-ring) * { cursor: none !important; }
        body:has(.cursor-ring) input, body:has(.cursor-ring) textarea, body:has(.cursor-ring) select { cursor: text !important; }
        .cursor-ring.cursor-hover {
          width: 56px !important; height: 56px !important;
          margin-left: -28px !important; margin-top: -28px !important;
          background: rgba(255,255,255,0.95) !important;
        }
      `}</style>
    </>
  );
}
