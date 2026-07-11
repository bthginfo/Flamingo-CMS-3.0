import { plain } from '@/lib/strip-html';
import { FaqAccordion } from '@/templates/shared/faq-accordion';
import { PremiumSectionHeader } from '@/templates/shared/section-primitives';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FaqSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as { question: string; answer: string }[]) || [];
  const expandFirst = data.expandFirst !== false;

  return (
    <div className="mx-auto max-w-4xl">
      <PremiumSectionHeader
        eyebrow={badgeText}
        headline={headline}
        subline={plain(subline)}
        align="center"
        richSubline={false}
      />
      <FaqAccordion items={items} defaultOpenFirst={expandFirst} variant="cards" />
    </div>
  );
}
