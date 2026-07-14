'use client';

import { DynamicIcon } from '@/components/ui/icon-map';
import { cn } from '@/lib/utils';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';
import { ConsentGate } from '@/components/consent-gate';
import { CardSurface, PremiumSectionHeader } from '@/templates/shared/section-primitives';
import { safeMapEmbedUrl } from '@/lib/safe-embed-url';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function ContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt';
  const introText = (data.introText as string) || (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Nachricht senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const address = (data.address as string) || '';
  const mapEmbedUrl = safeMapEmbedUrl(data.mapEmbedUrl);
  const showMap = data.showMap !== false && Boolean(mapEmbedUrl);
  const infoCards = (data.infoCards as { icon: string; label: string; value: string }[]) || [
    { icon: 'phone', label: 'Telefon', value: '' },
    { icon: 'mail', label: 'E-Mail', value: '' },
    { icon: 'map-pin', label: 'Standort', value: address },
    { icon: 'clock', label: 'Öffnungszeiten', value: '' },
  ];

  return (
    <div>
      <PremiumSectionHeader eyebrow={badgeText} headline={headline} subline={introText} sublinePath="introText" align="center" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
        {/* Info cards */}
        <div className="lg:col-span-2 space-y-4">
          {infoCards.map((card, i) => (
            <CardSurface
              as="article"
              key={i}
              className="group flex items-center gap-4 p-5"
             data-edit-collection="infoCards" data-edit-index={i}>
              <div className={cn('w-12 h-12 rounded-xl bg-[color-mix(in_srgb,var(--token-icon)_12%,transparent)] flex items-center justify-center text-[color:var(--token-icon)] transition-transform group-hover:scale-110')}>
                <DynamicIcon editPath="icon" name={card.icon} size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-[color:var(--token-muted)] uppercase tracking-wider font-medium" data-edit-path="label">{card.label}</div>
                <div className="text-sm font-semibold text-[color:var(--token-heading)] break-words" data-edit-path="value">{card.value}</div>
              </div>
            </CardSurface>
          ))}
        </div>

        {/* Form */}
        {formEnabled && (
          <div className="lg:col-span-3">
            <DynamicContactForm
              fields={formFields}
              submitLabel={submitLabel}
              className="cms-card space-y-5 p-6 sm:p-8 lg:p-10"
            />
          </div>
        )}
      </div>

      {showMap && (
        <CardSurface className="mt-10 overflow-hidden p-2">
          <ConsentGate provider="Google Maps" className="h-[380px] w-full overflow-hidden rounded-2xl">
            <iframe
              src={mapEmbedUrl}
              className="h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Standort"
            />
          </ConsentGate>
        </CardSurface>
      )}
    </div>
  );
}
