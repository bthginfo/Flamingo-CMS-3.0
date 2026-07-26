import { WordReveal } from '@/components/ui/fx';
import type { CSSProperties } from 'react';
import { ActionGroup, ActionLink, MediaFrame, PremiumSectionHeader } from './section-primitives';

type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function normalizeLegacySchuktuewCopy(value: string) {
  if (!value) return value;
  return value
    .replace(
      /Alexander Schuktuew ist Fotograf mit Schwerpunkt auf Portraitfotografie\.\s*Er arbeitet für Unternehmen, Editorial und freie Projekte aus dem Raum München und Ingolstadt\./g,
      'Ich fotografiere Unternehmer, Kreative, Persönlichkeiten und dokumentarische Portraits aus dem Raum Ingolstadt und München. Mit Wurzeln im Skateboarding und einem Studium in Fotojournalismus und Dokumentarfotografie setze ich Markenphilosophie in ausdrucksstarkes, stilsicheres Storytelling um.',
    )
    .replace(
      /Alexander verbindet Planung, Shooting, Schnitt und Varianten so, dass Website, Social und Kampagne denselben Look behalten\./g,
      'Ich verbinde Planung, Shooting, Schnitt und Varianten so, dass Website, Social und Kampagne denselben Look behalten.',
    );
}

/** A calm, editorial hero for brands that prefer confidence over visual noise. */
export function EditorialHeroSection({ data }: Props) {
  const eyebrow = (data.eyebrow as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const text = normalizeLegacySchuktuewCopy((data.text as string) || (data.subline as string) || '');
  const imagePrimary = (data.imagePrimary as string) || (data.image as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const hint = (data.hint as string) || '';
  const layout = ((data.layout as string) || (data.variant as string) || '').trim();
  const imageFit = ((data.imageFit as string) || '').trim();
  const hideImageOnMobile = data.hideImageOnMobile === true || data.mobileImageMode === 'hidden';
  const isFullBleedImage = layout === 'fullBleedImage';
  const isCampaignBleed = layout === 'campaignBleed';
  const isLandscapeContain = ['contain', 'containWide', 'landscape', 'landscapeContain'].includes(imageFit);
  const campaignCardStyle = {
    '--token-card-heading': '#0f172a',
    '--token-card-body': '#475569',
    '--token-card-muted': '#64748b',
    '--token-heading': 'var(--token-card-heading, #0f172a)',
    '--token-body': 'var(--token-card-body, #475569)',
    '--token-muted': 'var(--token-card-muted, #64748b)',
    '--token-eyebrow': 'var(--token-card-muted, #64748b)',
    color: 'var(--token-card-body, #475569)',
  } as CSSProperties;
  if (!headline) return null;

  if (isFullBleedImage && imagePrimary) {
    return (
      <div className="relative isolate overflow-hidden bg-[var(--token-section-bg)] px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-14 lg:pb-24">
        <div className="mx-auto max-w-[1580px]">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--token-card-border)] bg-white shadow-[0_28px_90px_var(--token-shadow)] md:rounded-[2.4rem]">
            <img
              data-edit-image="imagePrimary"
              src={imagePrimary}
              alt={headline}
              loading="eager"
              fetchPriority="high"
              className="block h-auto w-full object-contain"
            />
          </div>
          <div
            data-card
            data-color-context="light"
            className="relative z-10 mx-auto -mt-10 w-[calc(100%-1.5rem)] max-w-4xl rounded-[1.75rem] border border-[var(--token-card-border)] bg-[var(--token-card-bg,#ffffff)] p-6 shadow-[0_24px_80px_var(--token-shadow)] backdrop-blur sm:p-8 md:-mt-16 md:p-10"
            style={campaignCardStyle}
          >
            <PremiumSectionHeader
              eyebrow={eyebrow}
              headline={<WordReveal text={headline} />}
              subline={text}
              eyebrowPath="eyebrow"
              sublinePath="text"
              size="display"
              titleAs="h1"
              className="!mb-0 [&_.cms-section-title]:max-w-[18ch] [&_.cms-section-title]:break-normal [&_.cms-section-title]:text-[clamp(2.2rem,6vw,5rem)] [&_.cms-section-title]:[hyphens:none] [&_.cms-section-title]:[overflow-wrap:normal] [&_.cms-section-title]:[text-wrap:balance] [&_.cms-section-title]:[word-break:normal]"
            />
            <ActionGroup className="mt-8">
              <ActionLink action={primaryCta} editKey="primaryCta" />
              <ActionLink action={secondaryCta} editKey="secondaryCta" tone="secondary" showArrow={false} />
            </ActionGroup>
            {hint && <p className="mt-5 max-w-xl text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="hint">{hint}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (isCampaignBleed && imagePrimary) {
    return (
      <div className="relative isolate overflow-hidden bg-[var(--token-section-bg)]">
        <div className="mx-auto grid max-w-[1620px] items-center lg:min-h-[620px] lg:grid-cols-[minmax(28rem,0.62fr)_minmax(0,1fr)]">
          <div className="relative z-10 flex items-center px-5 py-14 sm:px-8 md:py-20 lg:px-12 xl:px-16">
            <div
              data-card
              data-color-context="light"
              className="w-full max-w-2xl rounded-[2rem] border border-[var(--token-card-border)] bg-[var(--token-card-bg,#ffffff)] p-6 shadow-[0_24px_80px_var(--token-shadow)] backdrop-blur sm:p-8 lg:p-10"
              style={campaignCardStyle}
            >
              <PremiumSectionHeader
                eyebrow={eyebrow}
                headline={<WordReveal text={headline} />}
                subline={text}
                eyebrowPath="eyebrow"
                sublinePath="text"
                size="display"
                titleAs="h1"
                className="!mb-0 [&_.cms-section-title]:max-w-[22ch] [&_.cms-section-title]:break-normal [&_.cms-section-title]:text-[clamp(2.25rem,4vw,4.45rem)] [&_.cms-section-title]:[hyphens:none] [&_.cms-section-title]:[overflow-wrap:normal] [&_.cms-section-title]:[text-wrap:balance] [&_.cms-section-title]:[word-break:normal]"
              />
              <ActionGroup className="mt-8">
                <ActionLink action={primaryCta} editKey="primaryCta" />
                <ActionLink action={secondaryCta} editKey="secondaryCta" tone="secondary" showArrow={false} />
              </ActionGroup>
              {hint && <p className="mt-5 max-w-xl text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="hint">{hint}</p>}
            </div>
          </div>
          <div className="relative flex min-h-[260px] items-center justify-center bg-[var(--token-section-bg-alt)] px-4 py-8 md:min-h-[380px] lg:min-h-0 lg:px-7 lg:py-12">
            <div className={`relative w-full overflow-hidden rounded-[2rem] border border-[var(--token-card-border)] bg-white shadow-[0_24px_70px_var(--token-shadow)] ${isLandscapeContain ? 'max-w-[1120px] aspect-[16/7]' : 'max-w-[980px]'}`}>
              <img
                data-edit-image="imagePrimary"
                src={imagePrimary}
                alt={headline}
                loading="eager"
                fetchPriority="high"
                className={isLandscapeContain ? 'block h-full w-full object-contain' : 'block aspect-[16/9] h-auto w-full object-cover'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className={`${hideImageOnMobile ? 'hidden md:block ' : ''}relative mx-auto w-full max-w-lg lg:max-w-none`}>
            <MediaFrame className="aspect-[4/5] rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_24px_70px_var(--token-shadow)]">
              <img data-edit-image="imagePrimary" src={imagePrimary} alt={headline} loading="eager" fetchPriority="high" className={`absolute inset-0 h-full w-full ${imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'}`} />
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
