'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Car, Train, Plane, Phone } from 'lucide-react';

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
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body,#a1a1aa)] mb-4" data-edit-path="badge">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading,#18181b)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
          {image && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative w-full aspect-[16/9] mb-12">
              <Image src={image} alt={headline} fill className="object-cover" />
            </motion.div>
          )}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              {description && <div className="text-[color:var(--token-muted,#71717a)] leading-relaxed rt-content" dangerouslySetInnerHTML={{ __html: description }} />}
            </div>
            <div className="space-y-4 border-t border-[color:var(--token-card-border,#e4e4e7)] pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-12">
              {address && <p className="text-[color:var(--token-muted,#52525b)] text-sm" data-edit-path="address">{address}</p>}
              {contact && <p className="text-[color:var(--token-muted,#52525b)] text-sm">{contact}</p>}
              {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-[color:var(--token-heading,#18181b)] border-b border-[color:var(--token-card-border,#18181b)] hover:opacity-70 transition-opacity mt-4">Route planen →</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {image && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[4/3]">
                <Image src={image} alt={headline} fill className="object-cover" />
                <div className="absolute inset-0 border-2 border-[color:var(--token-card-border,#d4d4d8)]" />
              </motion.div>
            )}
            <div className={image ? '' : 'md:col-span-2'}>
              {description && <div className="text-[color:var(--token-muted,#3f3f46)] text-lg leading-relaxed mb-8 rt-content" dangerouslySetInnerHTML={{ __html: description }} />}
              <div className="space-y-4 border-l-4 border-[var(--token-card-border,var(--brand-accent,#f39c12))] pl-6">
                {address && <p className="text-[color:var(--token-muted,#3f3f46)] flex items-center gap-2"><MapPin className="w-4 h-4 text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]" />{address}</p>}
                {contact && <p className="text-[color:var(--token-muted,#3f3f46)] flex items-center gap-2"><Phone className="w-4 h-4 text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))]" />{contact}</p>}
              </div>
              {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"><MapPin className="w-4 h-4" /> Route planen</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg,#ffffff)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {image && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
              <Image src={image} alt={headline} fill className="object-cover" />
            </motion.div>
          )}
          <div className={image ? '' : 'md:col-span-2 max-w-3xl mx-auto text-center'}>
            {description && <div className="text-[color:var(--token-muted,#52525b)] text-lg leading-relaxed mb-8 rt-content" dangerouslySetInnerHTML={{ __html: description }} />}
            <div className="space-y-4">
              {address && <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[color:var(--token-icon,var(--brand-primary,#1a5276))] mt-0.5 shrink-0" /><p className="text-[color:var(--token-muted,#3f3f46)]" data-edit-path="address">{address}</p></div>}
              {contact && <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-[color:var(--token-icon,var(--brand-primary,#1a5276))] mt-0.5 shrink-0" /><p className="text-[color:var(--token-muted,#3f3f46)]">{contact}</p></div>}
            </div>
            {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))] text-[color:var(--token-on-dark-heading,#ffffff)] rounded-full text-sm font-medium hover:bg-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))] transition-colors"><MapPin className="w-4 h-4" /> Route planen</a>}
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
  const accommodations = (rawAccom || []).map(a => ({ name: a.name, description: a.description || (a.distance ? `${a.distance}${a.specialRate ? ' — ' + a.specialRate : ''}` : ''), link: a.link, image: a.image }));
  const dirIcons: Record<string, React.ElementType> = { car: Car, train: Train, plane: Plane };
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body,#a1a1aa)] mb-4" data-edit-path="badge">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading,#18181b)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
          {directions.length > 0 && (
            <div className="space-y-8 mb-16">
              {directions.map((d, i) => {
                const Icon = dirIcons[(d.icon || 'car').toLowerCase()] || Car;
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex gap-6 border-t border-[color:var(--token-card-border,#e4e4e7)] pt-6">
                    <Icon className="w-5 h-5 text-[color:var(--token-body,#a1a1aa)] shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base font-light text-[color:var(--token-heading,#18181b)]" data-edit-path="title">{d.title}</h3>
                      <div className="text-[color:var(--token-muted,#71717a)] text-sm mt-2 rt-content" dangerouslySetInnerHTML={{ __html: d.text }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          {accommodations.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {accommodations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-[color:var(--token-card-border,#e4e4e7)] pt-6" data-edit-collection="accommodations" data-edit-index={i}>
                  {a.image && <div className="relative h-40 mb-4"><Image src={a.image} alt={a.name} fill className="object-cover" /></div>}
                  <h4 className="font-medium text-[color:var(--token-heading,#18181b)]" data-edit-path="name">{a.name}</h4>
                  {a.description && <div className="text-[color:var(--token-muted,#71717a)] text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: a.description }} />}
                  {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--token-heading,#18181b)] border-b border-[color:var(--token-card-border,#18181b)] mt-3 inline-block hover:opacity-70">Details →</a>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-[var(--token-badge-bg,var(--brand-accent,#f39c12))] text-[color:var(--token-heading,#000000)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
          {directions.length > 0 && (
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {directions.map((d, i) => {
                const Icon = dirIcons[(d.icon || 'car').toLowerCase()] || Car;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-2 border-[color:var(--token-card-border,#18181b)] p-6">
                    <Icon className="w-6 h-6 text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))] mb-3" />
                    <h3 className="font-bold text-[color:var(--token-heading,#18181b)] mb-2" data-edit-path="title">{d.title}</h3>
                    <div className="text-[color:var(--token-muted,#52525b)] text-sm rt-content" dangerouslySetInnerHTML={{ __html: d.text }} />
                  </motion.div>
                );
              })}
            </div>
          )}
          {accommodations.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-2 border-[color:var(--token-card-border,#18181b)] overflow-hidden" data-edit-collection="accommodations" data-edit-index={i}>
                  {a.image && <div className="relative h-40"><Image src={a.image} alt={a.name} fill className="object-cover" /></div>}
                  <div className="p-5">
                    <h4 className="font-bold text-[color:var(--token-heading,#18181b)]" data-edit-path="name">{a.name}</h4>
                    {a.description && <div className="text-[color:var(--token-muted,#52525b)] text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: a.description }} />}
                    {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-[color:var(--token-eyebrow,var(--brand-accent,#f39c12))] text-sm font-bold mt-3 inline-block hover:opacity-70">Details →</a>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))]/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {directions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 mb-10 md:mb-16">
            {directions.map((d, i) => {
              const Icon = dirIcons[(d.icon || 'car').toLowerCase()] || Car;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-xl bg-[var(--token-card-bg,#ffffff)] shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" />
                  </div>
                  <h3 className="font-semibold text-[color:var(--token-heading,#18181b)] mb-2" data-edit-path="title">{d.title}</h3>
                  <div className="text-[color:var(--token-muted,#52525b)] text-sm rt-content" dangerouslySetInnerHTML={{ __html: d.text }} />
                </motion.div>
              );
            })}
          </div>
        )}
        {accommodations.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold text-[color:var(--token-heading,#18181b)] text-center mb-8">Unterkünfte</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden bg-[var(--token-card-bg,#ffffff)] shadow-sm border border-[color:var(--token-card-border,#f4f4f5)]" data-edit-collection="accommodations" data-edit-index={i}>
                  {a.image && <div className="relative h-40"><Image src={a.image} alt={a.name} fill className="object-cover" /></div>}
                  <div className="p-5">
                    <h4 className="font-semibold text-[color:var(--token-heading,#18181b)]" data-edit-path="name">{a.name}</h4>
                    {a.description && <div className="text-[color:var(--token-muted,#52525b)] text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: a.description }} />}
                    {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))] text-sm font-medium mt-3 inline-block hover:underline">Mehr erfahren →</a>}
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
