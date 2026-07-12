import { plain } from '@/lib/strip-html';
import { FaqAccordion } from '@/templates/shared/faq-accordion';
import { PremiumSectionHeader } from '@/templates/shared/section-primitives';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FaqSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const subline = (data.subline as string) || '';
  const items = (data.items as { question: string; answer: string }[]) || [];
  const expandFirst = data.expandFirst === true;

  return (
    <div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <PremiumSectionHeader
          eyebrow={badgeText}
          headline={headline}
          subline={plain(subline)}
          richSubline={false}
          className="!mb-0"
        />
      </div>
      <FaqAccordion items={items} defaultOpenFirst={expandFirst} variant="minimal" />
    </div>
  );
}
