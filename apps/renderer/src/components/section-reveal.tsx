'use client';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type SectionRevealProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  disabled?: boolean;
};

export function SectionReveal({ children, className, disabled = false, style, ...props }: SectionRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled]);

  return (
    <section
      ref={ref}
      className={`section-reveal${className ? ` ${className}` : ''}`}
      data-revealed={revealed ? 'true' : 'false'}
      data-reveal-disabled={disabled ? 'true' : undefined}
      style={style as CSSProperties}
      {...props}
    >
      {children}
    </section>
  );
}
