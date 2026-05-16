'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Music, Utensils, Heart, Camera } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

const ICONS: Record<string, React.ElementType> = { clock: Clock, mappin: MapPin, music: Music, utensils: Utensils, heart: Heart, camera: Camera };

export function WeddingEventScheduleSection({ data }: Props) {
  const badge = (data.badge as string) || 'Tagesablauf';
  const headline = (data.headline as string) || 'Der schönste Tag';
  const events = (data.events as Array<{ time: string; title: string; description?: string; icon?: string; location?: string }>) || [];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-brand-primary/[0.02]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
        </div>
        <div className="relative">
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-brand-primary/15" />
          <div className="space-y-12">
            {events.map((event, i) => {
              const Icon = ICONS[(event.icon || 'heart').toLowerCase()] || Heart;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`flex items-start gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                    <span className="text-sm font-semibold text-brand-primary">{event.time}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">{event.title}</h3>
                    {event.description && <div className="text-gray-600 mt-1 rt-content" dangerouslySetInnerHTML={{ __html: event.description }} />}
                    {event.location && <p className="text-sm text-gray-500 mt-2 flex items-center gap-1 {i % 2 === 0 ? 'justify-end' : ''}"><MapPin className="w-3 h-3" />{event.location}</p>}
                  </div>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1 md:hidden">
                    <span className="text-sm font-semibold text-brand-primary">{event.time}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">{event.title}</h3>
                    {event.description && <div className="text-gray-600 mt-1 rt-content" dangerouslySetInnerHTML={{ __html: event.description }} />}
                    {event.location && <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</p>}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
