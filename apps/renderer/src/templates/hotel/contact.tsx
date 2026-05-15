'use client';

import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type InfoCard = { icon?: string; label?: string; value?: string };

export function HotelContactSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Kontakt';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Anfrage';
  const introText = (data.introText as string) || '';
  const namePlaceholder = (data.namePlaceholder as string) || 'Name';
  const emailPlaceholder = (data.emailPlaceholder as string) || 'E-Mail';
  const messagePlaceholder = (data.messagePlaceholder as string) || 'Nachricht';
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const infoCards = asList<InfoCard>(data.infoCards);
  const contactCta = asButton(data.contactCta);
  const routeCta = asButton(data.routeCta);
  const image = (data.image as string) || '';

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <Header badgeText={badgeText} headline={headline} subline={subline} />
        {introText && <p className="text-[var(--style-text-secondary)]">{introText}</p>}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <DynamicIcon name={card.icon || 'mail'} size={20} />
              <div><p className="text-xs text-[var(--style-text-secondary)]">{card.label || ''}</p><p className="font-semibold text-[var(--style-text-primary)]">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {contactCta.label && <a href={contactCta.href || '#'} className="rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{contactCta.label}</a>}
          {routeCta.label && <a href={routeCta.href || '#'} className="rounded-[var(--style-button-radius)] border border-black/15 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{routeCta.label}</a>}
        </div>
      </div>
      <div className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[var(--style-radius-md)]"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{submitLabel}</button></form>}
      </div>
    </div>
  );
}

function Header({ badgeText, headline, subline }: { badgeText: string; headline: string; subline: string }) {
  return (
    <div className="mb-6 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}
