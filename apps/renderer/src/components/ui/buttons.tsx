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
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0',
        'bg-gradient-to-r from-brand-primary to-brand-secondary',
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%]" />
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
        'relative inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-display font-semibold text-lg transition-all duration-300',
        'bg-brand-accent text-gray-900 hover:brightness-110 shadow-lg hover:shadow-brand-accent/25',
        className,
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Tag>
  );
}
