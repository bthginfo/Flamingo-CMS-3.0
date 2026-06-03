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
    <section className="overflow-hidden bg-[var(--token-section-bg, var(--style-section-bg,#f8fafc))] py-16 text-[var(--token-body, var(--style-body-color,var(--style-text-primary,#111827)))] md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            {badge && (
              <div className="mb-4 inline-flex rounded-full bg-[var(--token-badge-bg, var(--style-badge-bg,rgba(0,0,0,0.06)))] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--token-badge-text, var(--style-badge-text,var(--token-icon, var(--brand-primary,#111827))))]">
                {badge}
              </div>
            )}
            {headline && <h2 className="max-w-3xl text-4xl font-black leading-tight text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#0f172a)))] md:text-6xl">{headline}</h2>}
          </div>
          {subline && <p className="max-w-2xl text-base leading-8 text-[var(--token-subheading, var(--style-subheading-color,var(--style-text-secondary,#64748b)))] md:text-lg">{plain(subline)}</p>}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {locations.map((location, index) => {
            const email = location.email || location.mail || '';
            const routeHref = location.ctaHref || mapsHref(location.address);
            return (
              <article
                key={`${location.name || 'standort'}-${index}`}
                className="group overflow-hidden rounded-2xl border border-[var(--token-card-border, var(--style-border-color,rgba(15,23,42,0.10)))] bg-[var(--token-card-bg, var(--style-card-bg,#ffffff))] shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_100px_rgba(15,23,42,0.14)]"
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--token-badge-bg, var(--style-badge-bg,rgba(0,0,0,0.06)))] text-[var(--token-icon, var(--style-icon-color,var(--token-icon, var(--brand-primary,#111827))))]">
                      <MapPin size={22} />
                    </div>
                    <div>
                      {location.name && <h3 className="text-xl font-black leading-tight text-[var(--token-heading, var(--style-heading-color,var(--style-text-primary,#0f172a)))]">{location.name}</h3>}
                      {location.address && <p className="mt-2 text-sm leading-6 text-[var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#64748b)))]">{location.address}</p>}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {location.openingHours && (
                      <div className="flex gap-3 text-[var(--token-body, var(--style-body-color,var(--style-text-primary,#111827)))]">
                        <Clock size={17} className="mt-0.5 shrink-0 text-[var(--token-icon, var(--style-icon-color,var(--token-icon, var(--brand-primary,#111827))))]" />
                        <span className="whitespace-pre-line leading-6">{location.openingHours}</span>
                      </div>
                    )}
                    {location.phone && (
                      <a href={`tel:${location.phone}`} className="flex gap-3 text-[var(--token-body, var(--style-body-color,var(--style-text-primary,#111827)))] transition hover:text-[var(--style-accent-color,var(--token-icon, var(--brand-primary,#111827)))]">
                        <Phone size={17} className="mt-0.5 shrink-0 text-[var(--token-icon, var(--style-icon-color,var(--token-icon, var(--brand-primary,#111827))))]" />
                        <span>{location.phone}</span>
                      </a>
                    )}
                    {email && (
                      <a href={`mailto:${email}`} className="flex gap-3 break-all text-[var(--token-body, var(--style-body-color,var(--style-text-primary,#111827)))] transition hover:text-[var(--style-accent-color,var(--token-icon, var(--brand-primary,#111827)))]">
                        <Mail size={17} className="mt-0.5 shrink-0 text-[var(--token-icon, var(--style-icon-color,var(--token-icon, var(--brand-primary,#111827))))]" />
                        <span>{email}</span>
                      </a>
                    )}
                  </div>

                  {(location.ctaLabel || location.address) && (
                    <a
                      href={routeHref}
                      target={routeHref.startsWith('http') ? '_blank' : undefined}
                      rel={routeHref.startsWith('http') ? 'noreferrer' : undefined}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg, var(--brand-btn-bg,var(--token-icon, var(--brand-primary,#111827))))] px-5 py-3 text-sm font-bold text-[var(--token-btn-text, var(--brand-btn-text,#ffffff))] transition hover:brightness-110"
                    >
                      {location.ctaLabel || 'Route öffnen'}
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
