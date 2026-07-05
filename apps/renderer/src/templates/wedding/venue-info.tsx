'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Car, Train, Plane, Phone, Star } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingVenueInfoSection({ data, styleVariant }: Props) {
  const venues = (data.venues as Array<Record<string, string>>) || [];
  const firstVenue = venues[0] || {};
  const badge = (data.badge as string) || 'Location';
  const headline = (data.headline as string) || 'Die Location';
  const subline = (data.subline as string) || '';
  const description = (data.description as string) || firstVenue.description || '';
  const image = (data.image as string) || firstVenue.image || '';
  const address = (data.address as string) || firstVenue.address || '';
  const mapUrl = (data.mapUrl as string) || '';
  const contact = (data.contact as string) || '';

  // Multi-venue form: every venue gets its own card (name, image, description,
  // address, parking). The single-venue layout below stays for older data.
  if (venues.length > 1) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="section-badge" data-edit-path="badge">{badge}</span>
            <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
            {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {venues.map((venue, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="overflow-hidden rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-lg"
                data-edit-collection="venues" data-edit-index={i}
              >
                {venue.image && (
                  <div className="relative aspect-[3/2]">
                    <Image data-edit-image="image" src={venue.image} alt={venue.name || headline} fill className="object-cover" />
                  </div>
                )}
                <div className="p-7">
                  {venue.name && <h3 className="text-xl font-semibold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="name">{venue.name}</h3>}
                  {venue.description && <p className="mt-3 leading-relaxed text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="description">{venue.description}</p>}
                  <div className="mt-5 space-y-2.5 border-t border-[var(--token-card-border)] pt-5 text-sm">
                    {venue.address && <p className="flex items-start gap-2.5 text-[color:var(--token-card-muted,var(--token-muted))]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--token-icon)]" /><span data-edit-path="address">{venue.address}</span></p>}
                    {venue.parkingInfo && <p className="flex items-start gap-2.5 text-[color:var(--token-card-muted,var(--token-muted))]"><Car className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--token-icon)]" /><span data-edit-path="parkingInfo">{venue.parkingInfo}</span></p>}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {image && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
              <Image data-edit-image="image" src={image} alt={headline} fill className="object-cover" />
            </motion.div>
          )}
          <div className={image ? '' : 'md:col-span-2 max-w-3xl mx-auto text-center'}>
            {description && <div className="text-[color:var(--token-muted)] text-lg leading-relaxed mb-8 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: description }} />}
            <div className="space-y-4">
              {address && <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[color:var(--token-icon)] mt-0.5 shrink-0" /><p className="text-[color:var(--token-muted)]" data-edit-path="address">{address}</p></div>}
              {contact && <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-[color:var(--token-icon)] mt-0.5 shrink-0" /><p className="text-[color:var(--token-muted)]">{contact}</p></div>}
            </div>
            {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] rounded-full text-sm font-medium hover:bg-[var(--token-section-bg-alt)] transition-colors"><MapPin className="w-4 h-4" /> Route planen</a>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WeddingTravelInfoSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Anreise';
  const headline = (data.headline as string) || 'Anreise & Unterkunft';
  const subline = (data.subline as string) || '';
  const rawDirections = (data.directions || data.sections) as Array<Record<string, string>> | undefined;
  const directions = (rawDirections || []).map(d => ({ icon: d.icon, title: d.title, text: d.text || d.content || '' }));
  const rawAccom = (data.accommodations || data.hotels) as Array<Record<string, string>> | undefined;
  const accommodations = (rawAccom || []).map(a => ({ name: a.name, description: a.description || (a.distance ? `${a.distance}${a.specialRate ? ' — ' + a.specialRate : ''}` : ''), link: a.link, image: a.image, stars: Number(a.stars) || 0 }));
  const dirIcons: Record<string, React.ElementType> = { car: Car, train: Train, plane: Plane };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {directions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 mb-10 md:mb-16">
            {directions.map((d, i) => {
              const Icon = dirIcons[(d.icon || 'car').toLowerCase()] || Car;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-xl bg-[var(--token-card-bg)] shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--token-badge-bg)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[color:var(--token-icon)]" />
                  </div>
                  <h3 className="font-semibold text-[color:var(--token-heading)] mb-2" data-edit-path="title">{d.title}</h3>
                  <div className="text-[color:var(--token-muted)] text-sm rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: d.text }} />
                </motion.div>
              );
            })}
          </div>
        )}
        {accommodations.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold text-[color:var(--token-heading)] text-center mb-8">Unterkünfte</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden bg-[var(--token-card-bg)] shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl border border-[color:var(--token-card-border)]" data-edit-collection="accommodations" data-edit-index={i}>
                  {a.image && <div className="relative h-40"><Image data-edit-image="image" src={a.image} alt={a.name} fill className="object-cover" /></div>}
                  <div className="p-5">
                    <h4 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="name">{a.name}</h4>
                    {a.description && <div className="text-[color:var(--token-muted)] text-sm mt-1 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: a.description }} />}
                    {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-[color:var(--token-icon)] text-sm font-medium mt-3 inline-block hover:underline">Mehr erfahren →</a>}
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
