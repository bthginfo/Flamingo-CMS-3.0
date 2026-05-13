'use client';

import { AnimateOnScroll } from '@/components/animate';
import { ArrowRight } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function CtaBandSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const cta = data.ctaPrimary as { label: string; href: string } | undefined;
  return (
    <AnimateOnScroll>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary text-white p-10 sm:p-14 lg:p-20 text-center">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">{headline}</h2>
          {subline && <p className="text-lg sm:text-xl opacity-80 mb-8 max-w-2xl mx-auto">{subline}</p>}
          {cta?.label && (
            <a href={cta.href} className="inline-flex items-center gap-2 bg-brand-accent text-gray-900 font-semibold px-8 py-4 rounded-xl hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-xl text-lg">
              {cta.label}
              <ArrowRight size={20} />
            </a>
          )}
        </div>
      </div>
    </AnimateOnScroll>
  );
}
