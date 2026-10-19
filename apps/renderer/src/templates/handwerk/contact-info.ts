export type ContactInfoCard = {
  icon: string;
  label: string;
  value: string;
  href?: string;
};

export function contactInfoHref(card: ContactInfoCard): string | undefined {
  if (card.href && /^(tel:|mailto:|https:\/\/)/i.test(card.href)) return card.href;
  if (/mail/i.test(card.icon) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(card.value)) return `mailto:${card.value}`;
  if (/phone|telefon/i.test(`${card.icon} ${card.label}`)) {
    const number = card.value.replace(/\(0\)/g, '').replace(/[^+\d]/g, '');
    if (number) return `tel:${number}`;
  }
  return undefined;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Keep the modern info-card model, but continue to render content stored in
 * the long-supported phone/email/address/hours fields. Empty values must not
 * create blank cards on published pages.
 */
export function resolveContactInfoCards(data: Record<string, unknown>): ContactInfoCard[] {
  const configured = Array.isArray(data.infoCards)
    ? data.infoCards
        .map((item): ContactInfoCard | null => {
          if (!item || typeof item !== 'object') return null;
          const card = item as Record<string, unknown>;
          const value = text(card.value);
          if (!value) return null;
          return {
            icon: text(card.icon) || 'info',
            label: text(card.label),
            value,
            ...(text(card.href) ? { href: text(card.href) } : {}),
          };
        })
        .filter((item): item is ContactInfoCard => item !== null)
    : [];

  if (configured.length > 0) return configured;

  const fallback: ContactInfoCard[] = [
    { icon: 'phone', label: text(data.phoneLabel) || 'Telefon', value: text(data.phone) },
    { icon: 'mail', label: text(data.emailLabel) || 'E-Mail', value: text(data.email) },
    { icon: 'map-pin', label: text(data.addressLabel) || 'Standort', value: text(data.address) },
    {
      icon: 'clock',
      label: text(data.hoursLabel) || 'Öffnungszeiten',
      value: text(data.hours) || text(data.openingHours),
    },
  ];

  return fallback.filter((card) => card.value.length > 0);
}
