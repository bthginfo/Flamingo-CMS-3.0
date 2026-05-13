'use client';

import { AnimateOnScroll, StaggerOnScroll, fadeUp } from '@/components/animate';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function ServicesGridSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const cards = (data.manualCards as { title: string; text?: string; icon?: string }[]) || [];
  return (
    <div>
      <AnimateOnScroll className="text-center mb-12">
        {headline && <h2 className="section-headline">{headline}</h2>}
        {subline && <p className="section-subline">{subline}</p>}
      </AnimateOnScroll>
      <StaggerOnScroll className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <AnimateOnScroll key={i} variants={fadeUp}>
            <div className="card-hover p-8 group">
              {card.icon && (
                <div className="w-14 h-14 rounded-xl bg-brand-primary/5 flex items-center justify-center text-2xl mb-5 transition-colors duration-300 group-hover:bg-brand-primary/10">
                  {card.icon}
                </div>
              )}
              <h3 className="font-display font-semibold text-lg mb-3">{card.title}</h3>
              {card.text && <p className="text-gray-500 text-sm leading-relaxed">{card.text}</p>}
            </div>
          </AnimateOnScroll>
        ))}
      </StaggerOnScroll>
    </div>
  );
}
