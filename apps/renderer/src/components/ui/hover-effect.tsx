'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';

export function HoverEffect({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: string | React.ReactNode;
    image?: string;
    imagePosition?: string;
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
                className="absolute inset-0 block h-full w-full rounded-3xl bg-[var(--token-accent,var(--style-accent-color,var(--brand-primary)))]/5"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <div
            className="relative z-20 flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--token-card-border,var(--style-border-color,rgba(0,0,0,0.08)))] bg-[var(--token-card-bg,var(--style-card-bg,#ffffff))] shadow-sm transition-all duration-300 group-hover:border-[var(--token-card-border,var(--style-border-color,rgba(0,0,0,0.16)))] group-hover:shadow-lg"
            data-color-slot="cardBg borderColor"
          >
            {item.link ? (
              <a href={item.link} className="block h-full">
                {item.image ? (
                  <ImageCardContent item={item} />
                ) : (
                  <ContentCardBody item={item} showLink />
                )}
              </a>
            ) : (
              item.image ? <ImageCardContent item={item} /> : <ContentCardBody item={item} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

type HoverItem = {
  title: string;
  description: string;
  icon?: string | React.ReactNode;
  image?: string;
  imagePosition?: string;
  link?: string;
};

function ImageCardContent({ item }: { item: HoverItem }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="block sm:hidden">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={item.image || ''}
            alt={item.title}
            fill
            className="object-cover"
            style={{ objectPosition: item.imagePosition || 'center' }}
            sizes="100vw"
          />
        </div>
        <div className="bg-[var(--token-card-bg,var(--style-card-bg,#ffffff))] p-6 text-left" data-color-slot="cardBg">
          <h4 className="font-display mb-3 text-lg font-semibold text-[var(--token-heading,var(--style-heading-color,var(--style-text-primary,#111827)))]" data-color-slot="headingColor">
            {item.title}
          </h4>
          <p className="text-sm font-medium leading-relaxed text-[var(--token-body,var(--style-body-color,var(--style-text-secondary,#6b7280)))]" data-color-slot="bodyColor">
            {item.description}
          </p>
        </div>
      </div>
      <div className="relative hidden min-h-[220px] w-full overflow-hidden sm:block">
      <Image
        src={item.image || ''}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: item.imagePosition || 'center' }}
        sizes="(max-width: 768px) 100vw, 400px"
      />
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,0,0,0.68),rgba(0,0,0,0.36)_48%,rgba(0,0,0,0.12))] sm:block" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(0,0,0,0.20),transparent_34%,rgba(0,0,0,0.24))] sm:block" />
      <div className="relative z-10 flex min-h-[230px] flex-col justify-start p-6 text-left sm:min-h-[220px]">
        <h4 className="font-display mb-3 text-lg font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]" data-color-slot="headingColor">
          {item.title}
        </h4>
        <p className="max-w-[28rem] text-sm font-medium leading-relaxed text-[color:var(--token-on-dark-body,rgba(255,255,255,0.90))] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" data-color-slot="bodyColor">
          {item.description}
        </p>
      </div>
      </div>
    </div>
  );
}

function ContentCardBody({ item, showLink = false }: { item: HoverItem; showLink?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      {item.icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--token-accent,var(--style-accent-color,var(--brand-primary)))_10%,transparent)] text-[var(--token-icon,var(--style-icon-color,var(--token-accent,var(--style-accent-color,var(--brand-primary)))))] transition-transform duration-300 group-hover:scale-110" data-color-slot="iconColor accentColor">
          {typeof item.icon === 'string' ? <DynamicIcon name={item.icon} size={24} /> : item.icon}
        </div>
      )}
      <h4 className="font-display mb-2 text-lg font-semibold text-[var(--token-heading,var(--style-heading-color,var(--style-text-primary,#111827)))]" data-color-slot="headingColor">
        {item.title}
      </h4>
      <p className="text-sm leading-relaxed text-[var(--token-body,var(--style-body-color,var(--style-text-secondary,#6b7280)))]" data-color-slot="bodyColor">
        {item.description}
      </p>
      {showLink && (
        <span className="mt-4 inline-flex items-center justify-center text-sm font-medium text-[var(--token-accent,var(--style-accent-color,var(--brand-primary)))]" data-color-slot="accentColor">
          Mehr erfahren →
        </span>
      )}
    </div>
  );
}
