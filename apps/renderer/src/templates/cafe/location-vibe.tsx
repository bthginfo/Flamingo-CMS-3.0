'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';

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
    <section ref={ref} className="py-20 md:py-28 bg-stone-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{headline}</h2>
            {description && <p className="text-gray-600 mt-4 leading-relaxed">{description}</p>}
            {vibeText && <p className="text-amber-700 font-medium mt-3 italic">{vibeText}</p>}

            {address && (
              <div className="flex items-start gap-3 mt-8">
                <MapPin size={18} className="text-brand-primary mt-0.5 shrink-0" />
                <p className="text-gray-700">{address}</p>
              </div>
            )}

            {hours.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-brand-primary" />
                  <span className="text-sm font-semibold text-gray-900">Öffnungszeiten</span>
                </div>
                <ul className="space-y-1.5">
                  {hours.map((h, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{h.day}</span>
                      <span className="font-medium text-gray-900">{h.hours}</span>
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
                <img src={mapImage} alt="Standort" className="w-full h-full object-cover" />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
