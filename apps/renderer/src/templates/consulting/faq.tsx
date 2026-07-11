import { plain } from '@/lib/strip-html';
import { FaqAccordion } from '@/templates/shared/faq-accordion';
import { PremiumSectionHeader } from '@/templates/shared/section-primitives';

type FaqItem = { question: string; answer: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ConsultingFaqSection({ data }: Props) {
  const headline = (data.headline as string) || 'Häufige Fragen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const items = (data.items as FaqItem[]) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <PremiumSectionHeader eyebrow={badgeText} headline={headline} subline={plain(subline)} align="center" richSubline={false} />
      <FaqAccordion items={items} variant="divided" />
    </div>
  );
}
