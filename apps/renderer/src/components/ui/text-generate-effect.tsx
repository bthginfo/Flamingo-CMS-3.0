'use client';

import { cn } from '@/lib/utils';

type TextTag = 'div' | 'h1' | 'h2';

/**
 * Semantic headline renderer kept under the legacy component name.
 * Copy must be present on the first server render: observer-driven, opacity-0
 * word spans previously left the main hero blank and removed its H1 from HTML.
 */
export function TextGenerateEffect({
  words,
  className,
  as: Tag = 'div',
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  as?: TextTag;
}) {
  return (
    <Tag className={cn('font-display font-bold leading-snug tracking-tight', className)}>
      {words}
    </Tag>
  );
}
