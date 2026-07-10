'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ShineButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={cn(
        'relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-[var(--token-button-radius)] border border-transparent bg-[var(--token-btn-bg)] px-7 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-[0_8px_24px_var(--token-shadow)] transition-[transform,box-shadow,filter] duration-300 hover:shadow-[0_12px_32px_var(--token-shadow)] motion-safe:hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,color-mix(in_srgb,var(--token-btn-text)_18%,transparent),transparent)] bg-[length:200%_100%] motion-reduce:animate-none" />
      </div>
    </button>
  );
}

export function GlowButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      href={href}
      className={cn(
        'relative inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--token-button-radius)] border border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-7 py-3 font-display text-base font-semibold text-[color:var(--token-btn-secondary-text)] shadow-[0_8px_24px_var(--token-shadow)] transition-[transform,box-shadow,filter] duration-300 hover:brightness-[1.03] hover:shadow-[0_12px_32px_var(--token-shadow)] motion-safe:hover:-translate-y-0.5 active:translate-y-0',
        className,
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Tag>
  );
}
