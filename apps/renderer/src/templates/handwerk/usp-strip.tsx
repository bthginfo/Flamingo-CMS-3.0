'use client';

import { AnimateOnScroll, StaggerOnScroll, fadeUp } from '@/components/animate';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function UspStripSection({ data }: Props) {
  const items = (data.items as { icon?: string; title: string; text: string }[]) || [];
  return (
    <div className="-mt-16 relative z-20">
      <StaggerOnScroll className={`grid grid-cols-1 sm:grid-cols-2 ${items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 sm:gap-6`}>
        {items.map((item, i) => (
          <AnimateOnScroll key={i} variants={fadeUp}>
            <div className="card-hover p-6 sm:p-8 text-center group">
              {item.icon && (
                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
              )}
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
            </div>
          </AnimateOnScroll>
        ))}
      </StaggerOnScroll>
    </div>
  );
}
