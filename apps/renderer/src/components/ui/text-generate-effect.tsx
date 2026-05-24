'use client';

import { useEffect } from 'react';
import { motion, stagger, useAnimate, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const wordsArray = words.split(' ');

  useEffect(() => {
    if (isInView) {
      animate(
        'span',
        { opacity: 1, filter: filter ? 'blur(0px)' : 'none' },
        { duration, delay: stagger(0.08) },
      );
    }
  }, [isInView, animate, duration, filter, words]);

  return (
    <div className={cn('font-display font-bold', className)}>
      <div className="mt-2">
        <div className="leading-snug tracking-tight" ref={scope}>
          {wordsArray.map((word, idx) => (
            <motion.span
              key={word + idx}
              className="opacity-0 inline-block mr-[0.25em]"
              style={{ filter: filter ? 'blur(10px)' : 'none' }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
