'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

type Venue = { name: string; image?: string; address?: string; description?: string; mapEmbed?: string; parkingInfo?: string };

export function VenueInfoSection({ data }: Props) {
  const headline = (data.headline as string) || 'Location';
  const subline = (data.subline as string) || '';
  const venues = (data.venues as Venue[]) || [];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif">{headline}</h2>
        {subline && <p className="text-gray-600 mt-3 max-w-xl mx-auto">{subline}</p>}
      </div>

      <div className="space-y-16">
        {venues.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {v.image && (
              <div className={`relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <Image src={v.image} alt={v.name} fill className="object-cover" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-serif font-semibold">{v.name}</h3>
              {v.address && <p className="text-gray-500 mt-2 text-sm">📍 {v.address}</p>}
              {v.description && <p className="text-gray-600 mt-3 leading-relaxed">{v.description}</p>}
              {v.parkingInfo && (
                <p className="text-gray-500 text-sm mt-3 bg-gray-50 rounded-lg px-4 py-2">🅿️ {v.parkingInfo}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
