'use client';

import { ArrowRight, Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type LocationItem = {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  mail?: string;
  mapEmbedUrl?: string;
  openingHours?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function hasContent(item: LocationItem) {
  return Boolean(item.name || item.address || item.phone || item.email || item.mail || item.mapEmbedUrl || item.openingHours || item.ctaLabel);
}

function mapsHref(address?: string) {
  if (!address) return '#';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function AdditionalLocationsSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const locations = ((data.locations as LocationItem[]) || []).filter(hasContent);

  if (!locations.length) return null;

  return (
    <section className="overflow-hidden bg-[var(--token-section-bg)] py-16 text-[color:var(--token-body)] md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            {badge && (
              <div className="mb-4 inline-flex rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--token-badge-text)]" data-edit-path="badge">
                {badge}
              </div>
            )}
            {headline && <h2 className="max-w-3xl text-4xl font-black leading-tight text-[color:var(--token-heading)] md:text-6xl" data-edit-path="headline">{headline}</h2>}
          </div>
          {subline && <p className="max-w-2xl text-base leading-8 text-[color:var(--token-subheading)] md:text-lg" data-edit-path="subline">{plain(subline)}</p>}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {locations.map((location, index) => {
            const email = location.email || location.mail || '';
            const routeHref = location.ctaHref || mapsHref(location.address);
            return (
              <article
                key={`$<span data-edit-path="name">{location.name || 'standort'}</span>-${index}`}
                className="group overflow-hidden rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_100px_rgba(15,23,42,0.14)]"
              >
                {location.mapEmbedUrl && (
                  <div className="relative h-56 overflow-hidden bg-slate-200">
                    <iframe
                      title={location.name || `Standort ${index + 1}`}
                      src={location.mapEmbedUrl}
                      className="h-full w-full border-0 grayscale transition duration-500 group-hover:grayscale-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--token-card-badge-bg, var(--token-badge-bg))] text-[color:var(--token-icon)]">
                      <MapPin size={22} />
                    </div>
                    <div>
                      {location.name && <h3 className="text-xl font-black leading-tight text-[color:var(--token-card-heading, var(--token-heading))]" data-edit-path="name">{location.name}</h3>}
                      {location.address && <p className="mt-2 text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="address">{location.address}</p>}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {location.openingHours && (
                      <div className="flex gap-3 text-[color:var(--token-card-body, var(--token-body))]">
                        <Clock size={17} className="mt-0.5 shrink-0 text-[color:var(--token-icon)]" />
                        <span className="whitespace-pre-line leading-6">{location.openingHours}</span>
                      </div>
                    )}
                    {location.phone && (
                      <a href={`tel:$<span data-edit-path="phone">{location.phone}</span>`} className="flex gap-3 text-[color:var(--token-card-body, var(--token-body))] transition hover:text-[color:var(--token-accent)]">
                        <Phone size={17} className="mt-0.5 shrink-0 text-[color:var(--token-icon)]" />
                        <span data-edit-path="phone">{location.phone}</span>
                      </a>
                    )}
                    {email && (
                      <a href={`mailto:$<span data-edit-path="email">{email}</span>`} className="flex gap-3 break-all text-[color:var(--token-card-body, var(--token-body))] transition hover:text-[color:var(--token-accent)]">
                        <Mail size={17} className="mt-0.5 shrink-0 text-[color:var(--token-icon)]" />
                        <span data-edit-path="email">{email}</span>
                      </a>
                    )}
                  </div>

                  {(location.ctaLabel || location.address) && (
                    <a
                      href={routeHref}
                      target={routeHref.startsWith('http') ? '_blank' : undefined}
                      rel={routeHref.startsWith('http') ? 'noreferrer' : undefined}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 text-sm font-bold text-[color:var(--token-btn-text)] transition hover:brightness-110"
                    >
                      <span data-edit-path="ctaLabel">{location.ctaLabel || 'Route öffnen'}</span>
                      {location.ctaLabel ? <ArrowRight size={16} /> : <Navigation size={16} />}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
