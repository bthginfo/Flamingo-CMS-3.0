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
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <p className="text-[color:var(--token-muted)] mt-3" data-edit-path="subline">{plain(subline)}</p>}
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
                className="bg-[var(--token-card-bg)] rounded-xl border border-[color:var(--token-card-border)] overflow-hidden hover:shadow-md transition-shadow"
              >
                {event.image && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image data-edit-image="image" src={event.image} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-[var(--token-accent,theme(colors.amber.700))] font-medium mb-2">
                    <Icon size={14} />
                    <span data-edit-path="date">{event.date}</span>
                    <span className="text-[color:var(--token-body)]">·</span>
                    <span data-edit-path="time">{event.time}</span>
                  </div>
                  <h3 className="font-bold text-[color:var(--token-heading)]" data-edit-path="title">{event.title}</h3>
                  {event.description && <p className="text-sm text-[color:var(--token-muted)] mt-1.5" data-edit-path="description">{plain(event.description)}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
