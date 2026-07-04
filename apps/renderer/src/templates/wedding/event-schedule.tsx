'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Music, Utensils, Heart, Camera } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

const ICONS: Record<string, React.ElementType> = { clock: Clock, mappin: MapPin, music: Music, utensils: Utensils, heart: Heart, camera: Camera };

export function WeddingEventScheduleSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Tagesablauf';
  const subline = (data.subline as string) || '';
  const headline = (data.headline as string) || 'Der schönste Tag';
  const events = (data.events as Array<{ time: string; title: string; description?: string; icon?: string; location?: string }>) || [];

  return <ScheduleClassic badge={badge} headline={headline} subline={subline} events={events} />;
}

type Event = { time: string; title: string; description?: string; icon?: string; location?: string };
type P = { badge: string; headline: string; subline?: string; events: Event[] };

function ScheduleClassic({ badge, headline, subline, events }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        {subline && <p className="section-subline max-w-2xl mx-auto" data-edit-path="subline">{subline}</p>}
        </div>
        <div className="relative">
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-[var(--token-divider)]" />
          <div className="space-y-12">
            {events.map((event, i) => {
              const Icon = ICONS[(event.icon || 'heart').toLowerCase()] || Heart;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`flex items-start gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                    <span className="text-sm font-semibold text-[color:var(--token-icon)]" data-edit-path="time">{event.time}</span>
                    <h3 className="text-xl font-semibold text-[color:var(--token-heading)] mt-1" data-edit-path="title">{event.title}</h3>
                    {event.description && <div className="text-[color:var(--token-muted)] mt-1 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: event.description }} />}
                    {event.location && <p className="text-sm text-[color:var(--token-muted)] mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" /><span data-edit-path="location">{event.location}</span></p>}
                  </div>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[var(--token-section-bg-alt)] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[color:var(--token-icon)]" />
                  </div>
                  <div className="flex-1 md:hidden">
                    <span className="text-sm font-semibold text-[color:var(--token-icon)]" data-edit-path="time">{event.time}</span>
                    <h3 className="text-xl font-semibold text-[color:var(--token-heading)] mt-1" data-edit-path="title">{event.title}</h3>
                    {event.description && <div className="text-[color:var(--token-muted)] mt-1 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: event.description }} />}
                    {event.location && <p className="text-sm text-[color:var(--token-muted)] mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" /><span data-edit-path="location">{event.location}</span></p>}
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

