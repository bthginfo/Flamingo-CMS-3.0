'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Music, Utensils, Heart, Camera } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

const ICONS: Record<string, React.ElementType> = { clock: Clock, mappin: MapPin, music: Music, utensils: Utensils, heart: Heart, camera: Camera };

export function WeddingEventScheduleSection({ data, styleVariant }: Props) {
  const badge = typeof data.badge === 'string' ? data.badge : 'Tagesablauf';
  const headline = typeof data.headline === 'string' ? data.headline : 'Der schönste Tag';
  const events = (data.events as Array<{ time: string; title: string; description?: string; icon?: string; location?: string }>) || [];

  if (styleVariant === 'modern') return <ScheduleModern badge={badge} headline={headline} events={events} />;
  if (styleVariant === 'bold') return <ScheduleBold badge={badge} headline={headline} events={events} />;
  return <ScheduleClassic badge={badge} headline={headline} events={events} />;
}

type Event = { time: string; title: string; description?: string; icon?: string; location?: string };
type P = { badge: string; headline: string; events: Event[] };

function ScheduleClassic({ badge, headline, events }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[color-mix(in_srgb,var(--token-btn-bg)_2%,transparent)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
        </div>
        <div className="relative">
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-[color-mix(in_srgb,var(--token-btn-bg)_15%,transparent)]" />
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
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[color-mix(in_srgb,var(--token-btn-bg)_10%,transparent)] flex items-center justify-center shrink-0">
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

function ScheduleModern({ badge, headline, events }: P) {
  return (
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
        <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-20 break-words" data-edit-path="headline">{headline}</h2>
        <div className="space-y-0">
          {events.map((event, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] border-t border-[color:var(--token-card-border)] py-8" data-edit-collection="events" data-edit-index={i}>
              <span className="text-sm font-light text-[color:var(--token-body)] pt-1" data-edit-path="time">{event.time}</span>
              <div>
                <h3 className="text-lg font-light text-[color:var(--token-heading)]" data-edit-path="title">{event.title}</h3>
                {event.description && <div className="text-[color:var(--token-muted)] text-sm mt-2 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: event.description }} />}
                {event.location && <p className="text-xs text-[color:var(--token-body)] mt-2 uppercase tracking-wider" data-edit-path="location">{event.location}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScheduleBold({ badge, headline, events }: P) {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-16 break-words" data-edit-path="headline">{headline}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event, i) => {
            const Icon = ICONS[(event.icon || 'heart').toLowerCase()] || Heart;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="border-2 border-[color:var(--token-card-border)] p-6 hover:border-[color-mix(in_srgb,var(--token-card-border)_50%,transparent)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-5 h-5 text-[color:var(--token-eyebrow)]" />
                  <span className="text-[color:var(--token-eyebrow)] font-bold text-sm" data-edit-path="time">{event.time}</span>
                </div>
                <h3 className="text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{event.title}</h3>
                {event.description && <div className="text-[color:var(--token-muted)] text-sm mt-2 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: event.description }} />}
                {event.location && <p className="text-xs text-[color:var(--token-body)] mt-3 uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3" /><span data-edit-path="location">{event.location}</span></p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
