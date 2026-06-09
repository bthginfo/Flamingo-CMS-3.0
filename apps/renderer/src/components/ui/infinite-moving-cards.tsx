'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
}: {
  items: { quote: string; name: string; title?: string; rating?: number }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      const speedMap = { fast: '20s', normal: '40s', slow: '80s' };
      containerRef.current.style.setProperty('--animation-duration', speedMap[speed]);
      containerRef.current.style.setProperty(
        '--animation-direction',
        direction === 'left' ? 'forwards' : 'reverse',
      );
      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-6 w-max flex-nowrap',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {items.map((item, idx) => (
          (() => {
            const displayName = typeof item.name === 'string' && item.name.trim() ? item.name.trim() : 'Anonym';
            const avatarInitial = displayName.slice(0, 1).toUpperCase();
            return (
          <li
            key={idx}
            className="relative w-[380px] max-w-full flex-shrink-0 rounded-2xl border border-[var(--style-border-color,rgba(0,0,0,0.08))] bg-[var(--style-card-bg,#ffffff)] px-8 py-7 shadow-sm transition-shadow hover:shadow-md md:w-[420px]"
          >
            {item.rating && (
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={cn('h-4 w-4', i < item.rating! ? 'text-[var(--style-accent-color,#facc15)]' : 'text-[var(--style-text-muted,#e5e7eb)]')} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
            <blockquote className="mb-5 text-[15px] leading-relaxed text-[var(--style-body-color,var(--style-text-secondary,#374151))]">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--style-accent-color,var(--brand-primary))] text-sm font-bold text-[var(--brand-btn-text,#ffffff)]">
                {avatarInitial}
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--style-heading-color,var(--style-text-primary,#111827))]">{displayName}</div>
                {item.title && <div className="text-xs text-[var(--style-text-muted,var(--style-text-secondary,#9ca3af))]">{item.title}</div>}
              </div>
            </div>
          </li>
            );
          })()
        ))}
      </ul>
    </div>
  );
}
