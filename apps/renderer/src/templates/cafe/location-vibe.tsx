'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type HoursItem = { day: string; hours: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function LocationVibeSection({ data }: Props) {
  const headline = (data.headline as string) || 'Komm vorbei';
  const address = (data.address as string) || '';
  const description = (data.description as string) || '';
  const hours = (data.hours as HoursItem[]) || [];
  const mapImage = (data.mapImage as string) || '';
  const mapEmbed = (data.mapEmbed as string) || '';
  const vibeText = (data.vibeText as string) || '';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
            {description && <p className="text-[color:var(--token-muted)] mt-4 leading-relaxed" data-edit-path="description">{plain(description)}</p>}
            {vibeText && <p className="text-[var(--token-accent,theme(colors.amber.700))] font-medium mt-3 italic">{plain(vibeText)}</p>}

            {address && (
              <div className="flex items-start gap-3 mt-8">
                <MapPin size={18} className="text-[color:var(--token-icon)] mt-0.5 shrink-0" />
                <p className="text-[color:var(--token-muted)]" data-edit-path="address">{address}</p>
              </div>
            )}

            {hours.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-[color:var(--token-icon)]" />
                  <span className="text-sm font-semibold text-[color:var(--token-heading)]">Öffnungszeiten</span>
                </div>
                <ul className="space-y-1.5">
                  {hours.map((h, i) => (
                    <li key={i} className="flex justify-between text-sm" data-edit-collection="hours" data-edit-index={i}>
                      <span className="text-[color:var(--token-muted)]">{h.day}</span>
                      <span className="font-medium text-[color:var(--token-heading)]">{h.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {(mapEmbed || mapImage) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="rounded-xl overflow-hidden shadow-md aspect-[4/3]"
            >
              {mapEmbed ? (
                <iframe
                  src={mapEmbed}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                />
              ) : (
                <img data-edit-image="mapImage" src={mapImage} alt="Standort" className="w-full h-full object-cover" />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
