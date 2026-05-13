'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useState } from 'react';

export function HoverEffect({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    link?: string;
  }[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-brand-primary/5 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <div className="rounded-2xl h-full w-full p-6 overflow-hidden bg-white border border-gray-100 shadow-sm group-hover:shadow-lg group-hover:border-gray-200 transition-all duration-300 relative z-20">
            {item.icon && (
              <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center text-brand-primary transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
            )}
            <h4 className="font-display font-semibold text-lg mb-2 text-gray-900">{item.title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            {item.link && (
              <a href={item.link} className="inline-flex items-center text-brand-primary text-sm font-medium mt-4 hover:underline">
                Mehr erfahren →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
