'use client';

import { AnimateOnScroll, StaggerOnScroll, fadeUp } from '@/components/animate';
import { Star, Quote } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function TestimonialsSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const items = (data.items as { quote: string; name: string; context?: string; rating?: number }[]) || [];
  return (
    <div>
      <AnimateOnScroll className="text-center mb-12">
        {headline && <h2 className="section-headline">{headline}</h2>}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[1,2,3,4,5].map(n => <Star key={n} size={20} className="fill-yellow-400 text-yellow-400" />)}
          <span className="text-gray-500 text-sm ml-2">4.9 / 5 aus {items.length * 28}+ Bewertungen</span>
        </div>
      </AnimateOnScroll>
      <StaggerOnScroll className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <AnimateOnScroll key={i} variants={fadeUp}>
            <div className="card-hover p-8 relative">
              <Quote size={32} className="absolute top-6 right-6 text-brand-primary/10" />
              {item.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, n) => (
                    <Star key={n} size={16} className={n < item.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
              )}
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-display font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.name}</div>
                  {item.context && <div className="text-gray-400 text-xs">{item.context}</div>}
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </StaggerOnScroll>
    </div>
  );
}
