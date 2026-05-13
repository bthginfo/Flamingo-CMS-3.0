'use client';

import { cn } from '@/lib/utils';

export function GridBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative w-full bg-white', className)}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(26,82,118,0.05),transparent)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function DotBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function GradientMesh({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-brand-primary/5 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-brand-accent/5 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-r from-brand-secondary/3 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
    </div>
  );
}
