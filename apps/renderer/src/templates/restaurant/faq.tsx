import { asButton, asList, type SectionProps } from './types';
import { FaqAccordion, type FaqAccordionItem } from '@/templates/shared/faq-accordion';
import { ActionGroup, ActionLink, PremiumSectionHeader } from '@/templates/shared/section-primitives';

export function RestaurantFaqSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'Häufige Fragen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'FAQ';
  const items = asList<FaqAccordionItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div className="mx-auto max-w-3xl">
      <PremiumSectionHeader eyebrow={badgeText} headline={headline} subline={subline} align="center" />
      <FaqAccordion items={items} variant="divided" />
      {ctaPrimary.label && <ActionGroup align="center" className="mt-8"><ActionLink action={ctaPrimary} editKey="ctaPrimary" /></ActionGroup>}
    </div>
  );
}
