'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Car, Train, Plane } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

type TravelSection = { title: string; icon?: string; content: string };
type Hotel = { name: string; image?: string; link?: string; distance?: string; specialRate?: string; stars?: number };

export function TravelInfoSection({ data }: Props) {
  const headline = (data.headline as string) || 'Anreise & Übernachtung';
  const subline = (data.subline as string) || '';
  const sections = (data.sections as TravelSection[]) || [];
  const hotels = (data.hotels as Hotel[]) || [];

  const iconMap: Record<string, React.ReactNode> = {
    car: <Car size={20} />,
    train: <Train size={20} />,
    plane: <Plane size={20} />,
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif">{headline}</h2>
        {subline && <p className="text-gray-600 mt-3 max-w-xl mx-auto">{subline}</p>}
      </div>

      {/* Travel directions */}
      {sections.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500 mb-4">
                {s.icon && iconMap[s.icon] ? iconMap[s.icon] : <Car size={20} />}
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.content}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Hotels */}
      {hotels.length > 0 && (
        <>
          <h3 className="text-2xl font-serif text-center mb-8">Hotelempfehlungen</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {h.image && (
                  <div className="relative aspect-[16/9]">
                    <Image src={h.image} alt={h.name} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold">{h.name}</h4>
                  {h.stars && <p className="text-yellow-500 text-sm">{'★'.repeat(h.stars)}</p>}
                  {h.distance && <p className="text-gray-500 text-xs mt-1">📍 {h.distance} entfernt</p>}
                  {h.specialRate && <p className="text-rose-500 text-xs font-medium mt-1">💝 {h.specialRate}</p>}
                  {h.link && (
                    <a href={h.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm text-rose-500 hover:underline">
                      Buchen →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
