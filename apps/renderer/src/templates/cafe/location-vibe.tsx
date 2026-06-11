'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type HoursItem = { day?: string; hours?: string; time?: string; note?: string; closed?: boolean };
type NormalizedHoursItem = { day: string; value: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function textOrFallback(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function normalizeHours(value: unknown): NormalizedHoursItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const entry = item && typeof item === 'object' ? item as HoursItem : {};
      return {
        day: textOrFallback(entry.day),
        value: entry.closed ? 'geschlossen' : textOrFallback(entry.hours || entry.time || entry.note),
      };
    })
    .filter((item) => item.day || item.value);
}

export function LocationVibeSection({ data }: Props) {
  const headline = textOrFallback(data.headline, 'Komm vorbei');
  const address = textOrFallback(data.address);
  const description = textOrFallback(data.description);
  const hours = normalizeHours(data.hours ?? data.openingHours);
  const mapImage = textOrFallback(data.mapImage);
  const mapEmbed = textOrFallback(data.mapEmbed);
  const vibeText = textOrFallback(data.vibeText);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
            {description && <p className="text-[color:var(--token-muted)] mt-4 leading-relaxed" data-edit-path="description">{plain(description)}</p>}
            {vibeText && <p className="text-amber-700 font-medium mt-3 italic">{plain(vibeText)}</p>}

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
                      <span className="font-medium text-[color:var(--token-heading)]">{h.value}</span>
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
