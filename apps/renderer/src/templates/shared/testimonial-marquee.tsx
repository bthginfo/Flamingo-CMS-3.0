'use client';

import { useRef } from 'react';
import { plain } from '@/lib/strip-html';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type MarqueeItem = { quote: string; name: string; role?: string; image?: string; rating?: number };

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400' : 'text-zinc-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function MarqueeRow({ items, reverse, speed = 30 }: { items: MarqueeItem[]; reverse?: boolean; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden group">
      <div
        className={`flex gap-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-[320px] md:w-[380px] rounded-xl bg-white border border-zinc-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
            <p className="text-sm text-zinc-700 leading-relaxed mb-4 line-clamp-4">&ldquo;{plain(item.quote)}&rdquo;</p>
            <div className="flex items-center gap-3">
              {item.image && <img src={item.image} alt={item.name} className="w-9 h-9 rounded-full object-cover" />}
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-900 truncate">{item.name}</div>
                {item.role && <div className="text-xs text-zinc-500 truncate">{item.role}</div>}
              </div>
              {item.rating && <div className="ml-auto"><StarRating rating={item.rating} /></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialMarqueeSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const badge = (data.badge as string) || '';
  const items = (data.items as MarqueeItem[]) || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  if (!items.length) return null;

  const half = Math.ceil(items.length / 2);
  const row1 = items.slice(0, half);
  const row2 = items.slice(half);

  return (
    <div ref={ref} className="overflow-hidden -mx-6 md:-mx-12 lg:-mx-20">
      {(headline || badge) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-10 px-6">
          {badge && <span className="section-badge">{badge}</span>}
          {headline && <h2 className="section-headline">{headline}</h2>}
          {subline && <p className="section-subline max-w-2xl mx-auto">{subline}</p>}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-4">
        <MarqueeRow items={row1} speed={40} />
        {row2.length > 0 && <MarqueeRow items={row2} reverse speed={45} />}
      </motion.div>

      <style jsx global>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-reverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .animate-marquee { animation: marquee linear infinite; }
        .animate-marquee-reverse { animation: marquee-reverse linear infinite; }
      `}</style>
    </div>
  );
}
