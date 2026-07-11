import { WordReveal } from '@/components/ui/fx';
import { ActionGroup, ActionLink, MediaFrame, PremiumSectionHeader } from './section-primitives';

type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

/** A calm, editorial hero for brands that prefer confidence over visual noise. */
export function EditorialHeroSection({ data }: Props) {
  const eyebrow = (data.eyebrow as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || (data.subline as string) || '';
  const imagePrimary = (data.imagePrimary as string) || (data.image as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const hint = (data.hint as string) || '';
  if (!headline) return null;

  return (
    <div className="relative isolate overflow-hidden bg-[var(--token-section-bg)] px-5 pb-16 pt-20 sm:px-6 md:pb-24 md:pt-28 lg:pb-28 lg:pt-32">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[42%] border-l border-[var(--token-divider)] bg-[var(--token-section-bg-alt)] lg:block" />
      <div className={`mx-auto grid max-w-7xl items-center gap-12 ${imagePrimary ? 'lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:gap-20' : ''}`}>
        <div className="max-w-3xl">
          <PremiumSectionHeader
            eyebrow={eyebrow}
            headline={<WordReveal text={headline} />}
            subline={text}
            eyebrowPath="eyebrow"
            sublinePath="text"
            size="display"
            titleAs="h1"
            className="!mb-0"
          />
          <ActionGroup className="mt-8">
            <ActionLink action={primaryCta} editKey="primaryCta" />
            <ActionLink action={secondaryCta} editKey="secondaryCta" tone="secondary" showArrow={false} />
          </ActionGroup>
          {hint && <p className="mt-5 max-w-xl text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="hint">{hint}</p>}
        </div>

        {imagePrimary && (
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <MediaFrame className="aspect-[4/5] rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] shadow-[0_24px_70px_var(--token-shadow)]">
              <img data-edit-image="imagePrimary" src={imagePrimary} alt={headline} loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
            </MediaFrame>
            {imageSecondary && (
              <MediaFrame className="absolute -bottom-8 -left-8 hidden aspect-square w-[42%] rounded-[var(--token-card-radius)] border-[6px] border-[var(--token-section-bg)] shadow-[0_18px_48px_var(--token-shadow)] md:block">
                <img data-edit-image="imageSecondary" src={imageSecondary} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </MediaFrame>
            )}
            <div aria-hidden="true" className="absolute -right-5 -top-5 -z-10 h-full w-full rounded-[var(--token-card-radius)] border border-[var(--token-badge-border)] bg-[var(--token-badge-bg)]" />
          </div>
        )}
      </div>
    </div>
  );
}
