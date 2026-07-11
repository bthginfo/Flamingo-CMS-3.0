import { Check } from 'lucide-react';
import { plain } from '@/lib/strip-html';
import { ActionGroup, ActionLink, CardSurface, MediaFrame, PremiumSectionHeader } from './section-primitives';

type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CtaSplitSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || (data.subline as string) || '';
  const image = (data.image as string) || '';
  const checklist = (data.checklist as string[]) || [];
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const note = (data.note as string) || '';
  const reversed = data.reversed === true;
  if (!headline) return null;

  return (
    <CardSurface className="overflow-hidden">
      <div className={`grid lg:grid-cols-2 ${reversed ? 'lg:[direction:rtl]' : ''}`}>
        <div className="flex flex-col justify-center p-6 [direction:ltr] sm:p-8 md:p-12 lg:p-14">
          <PremiumSectionHeader
            eyebrow={badge}
            headline={headline}
            subline={text}
            eyebrowPath="badge"
            sublinePath="text"
            size="compact"
            className="!mb-0"
          />
          {checklist.length > 0 && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {checklist.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm leading-6 text-[color:var(--token-card-body)]" data-edit-collection="checklist" data-edit-index={index}>
                  <Check aria-hidden="true" size={17} className="mt-1 shrink-0 text-[color:var(--token-check)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          <ActionGroup className="mt-8">
            <ActionLink action={primaryCta} editKey="primaryCta" />
            <ActionLink action={secondaryCta} editKey="secondaryCta" tone="secondary" showArrow={false} />
          </ActionGroup>
          {note && <p className="mt-4 text-xs leading-5 text-[color:var(--token-card-muted)]" data-edit-path="note">{plain(note)}</p>}
        </div>
        {image && (
          <MediaFrame className="min-h-[19rem] [direction:ltr] lg:min-h-[30rem]">
            <img data-edit-image="image" src={image} alt={headline} className="absolute inset-0 h-full w-full object-cover" />
          </MediaFrame>
        )}
      </div>
    </CardSurface>
  );
}
