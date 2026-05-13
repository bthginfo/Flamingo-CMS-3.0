'use client';

import { AnimateOnScroll, StaggerOnScroll, fadeUp } from '@/components/animate';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function ProcessStepsSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const steps = (data.steps as { title: string; text: string; icon?: string }[]) || [];
  return (
    <div className="bg-surface rounded-3xl p-8 sm:p-12 lg:p-16">
      <AnimateOnScroll className="text-center mb-14">
        {headline && <h2 className="section-headline">{headline}</h2>}
      </AnimateOnScroll>
      <StaggerOnScroll className="relative max-w-4xl mx-auto">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-primary/40 via-brand-accent/40 to-brand-primary/10 hidden md:block" />
        <div className="space-y-10">
          {steps.map((step, i) => (
            <AnimateOnScroll key={i} variants={fadeUp}>
              <div className="flex gap-6 md:gap-10 items-start group">
                <div className="shrink-0 relative">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                    {step.icon ? (
                      <span className="text-2xl">{step.icon}</span>
                    ) : (
                      <span className="font-display font-bold text-xl text-brand-primary">{String(i + 1).padStart(2, '0')}</span>
                    )}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.text}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </StaggerOnScroll>
    </div>
  );
}
