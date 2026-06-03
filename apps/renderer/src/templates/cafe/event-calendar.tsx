'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { CalendarDays, Music, Wine } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type CafeEvent = { title: string; date: string; time: string; description?: string; image?: string; category?: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

const CAT_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  music: Music,
  wine: Wine,
  default: CalendarDays,
};

export function CafeEventCalendarSection({ data }: Props) {
  const headline = (data.headline as string) || 'Events';
  const subline = (data.subline as string) || '';
  const events = (data.events as CafeEvent[]) || [];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading,#18181b)]">{headline}</h2>
          {subline && <p className="text-[color:var(--token-on-dark-muted,#52525b)] mt-3">{plain(subline)}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => {
            const Icon = CAT_ICONS[event.category || 'default'] || CAT_ICONS.default;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--token-card-bg,#ffffff)] rounded-xl border border-[color:var(--token-card-border,#f4f4f5)] overflow-hidden hover:shadow-md transition-shadow"
              >
                {event.image && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={event.image} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-amber-700 font-medium mb-2">
                    <Icon size={14} />
                    <span>{event.date}</span>
                    <span className="text-[color:var(--token-on-dark-body,#d4d4d8)]">·</span>
                    <span>{event.time}</span>
                  </div>
                  <h3 className="font-bold text-[color:var(--token-heading,#18181b)]">{event.title}</h3>
                  {event.description && <p className="text-sm text-[color:var(--token-on-dark-muted,#71717a)] mt-1.5">{plain(event.description)}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
