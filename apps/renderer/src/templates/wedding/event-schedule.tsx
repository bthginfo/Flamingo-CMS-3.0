'use client';

import { motion } from 'framer-motion';
import { SectionIcon } from '@/components/ui/section-icon';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

type Event = { time: string; title: string; description?: string; icon?: string; location?: string };

export function EventScheduleSection({ data }: Props) {
  const headline = (data.headline as string) || 'Tagesablauf';
  const subline = (data.subline as string) || '';
  const events = (data.events as Event[]) || [];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif">{headline}</h2>
        {subline && <p className="text-gray-600 mt-3 max-w-xl mx-auto">{subline}</p>}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-3 bottom-3 w-px bg-rose-200" />

          <div className="space-y-8">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-6 items-start"
              >
                {/* Dot / Icon */}
                <div className="w-12 h-12 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center shrink-0 z-10">
                  {ev.icon ? (
                    <SectionIcon icon={ev.icon} size={20} className="text-rose-500" />
                  ) : (
                    <span className="text-rose-500 text-xs font-bold">{ev.time}</span>
                  )}
                </div>

                <div className="pt-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-semibold text-rose-500">{ev.time}</span>
                    <h3 className="text-lg font-semibold">{ev.title}</h3>
                  </div>
                  {ev.description && <p className="text-gray-600 mt-1 text-sm">{ev.description}</p>}
                  {ev.location && <p className="text-gray-400 text-xs mt-1">📍 {ev.location}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
