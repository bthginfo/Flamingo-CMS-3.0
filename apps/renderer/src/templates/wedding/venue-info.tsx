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
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
          {image && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative w-full aspect-[16/9] mb-12">
              <Image data-edit-image="image" src={image} alt={headline} fill className="object-cover" />
            </motion.div>
          )}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              {description && <div className="text-[color:var(--token-muted)] leading-relaxed rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: description }} />}
            </div>
            <div className="space-y-4 border-t border-[color:var(--token-card-border)] pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-12">
              {address && <p className="text-[color:var(--token-muted)] text-sm" data-edit-path="address">{address}</p>}
              {contact && <p className="text-[color:var(--token-muted)] text-sm">{contact}</p>}
              {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-[color:var(--token-heading)] border-b border-[color:var(--token-card-border)] hover:opacity-70 transition-opacity mt-4">Route planen →</a>}
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
          <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {image && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[4/3]">
                <Image data-edit-image="image" src={image} alt={headline} fill className="object-cover" />
                <div className="absolute inset-0 border-2 border-[color:var(--token-card-border)]" />
              </motion.div>
            )}
            <div className={image ? '' : 'md:col-span-2'}>
              {description && <div className="text-[color:var(--token-muted)] text-lg leading-relaxed mb-8 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: description }} />}
              <div className="space-y-4 border-l-4 border-[var(--token-card-border)] pl-6">
                {address && <p className="text-[color:var(--token-muted)] flex items-center gap-2"><MapPin className="w-4 h-4 text-[color:var(--token-eyebrow)]" /><span data-edit-path="address">{address}</span></p>}
                {contact && <p className="text-[color:var(--token-muted)] flex items-center gap-2"><Phone className="w-4 h-4 text-[color:var(--token-eyebrow)]" />{contact}</p>}
              </div>
              {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"><MapPin className="w-4 h-4" /> Route planen</a>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-card-bg)]">
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
  const accommodations = (rawAccom || []).map(a => ({ name: a.name, description: a.description || (a.distance ? `${a.distance}${a.specialRate ? ' — ' + a.specialRate : ''}` : ''), link: a.link, image: a.image }));
  const dirIcons: Record<string, React.ElementType> = { car: Car, train: Train, plane: Plane };
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
          {directions.length > 0 && (
            <div className="space-y-8 mb-16">
              {directions.map((d, i) => {
                const Icon = dirIcons[(d.icon || 'car').toLowerCase()] || Car;
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex gap-6 border-t border-[color:var(--token-card-border)] pt-6">
                    <Icon className="w-5 h-5 text-[color:var(--token-body)] shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base font-light text-[color:var(--token-heading)]" data-edit-path="title">{d.title}</h3>
                      <div className="text-[color:var(--token-muted)] text-sm mt-2 rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: d.text }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          {accommodations.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {accommodations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-t border-[color:var(--token-card-border)] pt-6" data-edit-collection="accommodations" data-edit-index={i}>
                  {a.image && <div className="relative h-40 mb-4"><Image data-edit-image="image" src={a.image} alt={a.name} fill className="object-cover" /></div>}
                  <h4 className="font-medium text-[color:var(--token-heading)]" data-edit-path="name">{a.name}</h4>
                  {a.description && <div className="text-[color:var(--token-muted)] text-sm mt-1 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: a.description }} />}
                  {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--token-heading)] border-b border-[color:var(--token-card-border)] mt-3 inline-block hover:opacity-70">Details →</a>}
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
          <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
          {directions.length > 0 && (
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {directions.map((d, i) => {
                const Icon = dirIcons[(d.icon || 'car').toLowerCase()] || Car;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-2 border-[color:var(--token-card-border)] p-6">
                    <Icon className="w-6 h-6 text-[color:var(--token-eyebrow)] mb-3" />
                    <h3 className="font-bold text-[color:var(--token-heading)] mb-2" data-edit-path="title">{d.title}</h3>
                    <div className="text-[color:var(--token-muted)] text-sm rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: d.text }} />
                  </motion.div>
                );
              })}
            </div>
          )}
          {accommodations.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodations.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-2 border-[color:var(--token-card-border)] overflow-hidden" data-edit-collection="accommodations" data-edit-index={i}>
                  {a.image && <div className="relative h-40"><Image data-edit-image="image" src={a.image} alt={a.name} fill className="object-cover" /></div>}
                  <div className="p-5">
                    <h4 className="font-bold text-[color:var(--token-heading)]" data-edit-path="name">{a.name}</h4>
                    {a.description && <div className="text-[color:var(--token-muted)] text-sm mt-1 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: a.description }} />}
                    {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-[color:var(--token-eyebrow)] text-sm font-bold mt-3 inline-block hover:opacity-70">Details →</a>}
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
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-xl bg-[var(--token-card-bg)] shadow-sm">
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
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden bg-[var(--token-card-bg)] shadow-sm border border-[color:var(--token-card-border)]" data-edit-collection="accommodations" data-edit-index={i}>
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
