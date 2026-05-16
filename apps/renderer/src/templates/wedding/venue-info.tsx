'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Car, Train, Plane, Phone } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingVenueInfoSection({ data }: Props) {
  const badge = (data.badge as string) || 'Location';
  const headline = (data.headline as string) || 'Die Location';
  const subline = (data.subline as string) || '';
  const description = (data.description as string) || '';
  const image = (data.image as string) || '';
  const address = (data.address as string) || '';
  const mapUrl = (data.mapUrl as string) || '';
  const contact = (data.contact as string) || '';

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {image && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
              <Image src={image} alt={headline} fill className="object-cover" />
            </motion.div>
          )}
          <div className={image ? '' : 'md:col-span-2 max-w-3xl mx-auto text-center'}>
            {description && <p className="text-gray-600 text-lg leading-relaxed mb-8">{description}</p>}
            <div className="space-y-4">
              {address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-primary mt-0.5 shrink-0" />
                  <p className="text-gray-700">{address}</p>
                </div>
              )}
              {contact && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-primary mt-0.5 shrink-0" />
                  <p className="text-gray-700">{contact}</p>
                </div>
              )}
            </div>
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-dark transition-colors">
                <MapPin className="w-4 h-4" /> Route planen
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WeddingTravelInfoSection({ data }: Props) {
  const badge = (data.badge as string) || 'Anreise';
  const headline = (data.headline as string) || 'Anreise & Unterkunft';
  const subline = (data.subline as string) || '';
  const directions = (data.directions as Array<{ icon?: string; title: string; text: string }>) || [];
  const accommodations = (data.accommodations as Array<{ name: string; description?: string; link?: string; image?: string }>) || [];

  const dirIcons: Record<string, React.ElementType> = { car: Car, train: Train, plane: Plane };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-brand-primary/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {directions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 mb-10 md:mb-16">
            {directions.map((d, i) => {
              const Icon = dirIcons[(d.icon || 'car').toLowerCase()] || Car;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-xl bg-white shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{d.title}</h3>
                  <div className="text-gray-600 text-sm rt-content" dangerouslySetInnerHTML={{ __html: d.text }} />
                </motion.div>
              );
            })}
          </div>
        )}
        {accommodations.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">Unterkünfte</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
                  {a.image && <div className="relative h-40"><Image src={a.image} alt={a.name} fill className="object-cover" /></div>}
                  <div className="p-5">
                    <h4 className="font-semibold text-gray-900">{a.name}</h4>
                    {a.description && <div className="text-gray-600 text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: a.description }} />}
                    {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-brand-primary text-sm font-medium mt-3 inline-block hover:underline">Mehr erfahren →</a>}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
