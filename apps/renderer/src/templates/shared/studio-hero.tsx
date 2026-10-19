import { sanitizeHtml } from '@/lib/sanitize-html';
import { ActionGroup, ActionLink } from './section-primitives';

type Props = { data: Record<string, unknown>; memorial?: boolean };
type Cta = { label?: string; href?: string };

/** An editable typographic stage; the photograph and reading field keep their own space. */
export function StudioHero({ data, memorial = false }: Props) {
  const headline = String(data.headline || '');
  const text = String(data.text || data.subline || '');
  const image = String(data.imagePrimary || data.image || '');
  const imageAlt = String(data.imageAlt || '');
  const position = String(data.imagePrimaryPosition || data.imagePosition || 'center');
  const compact = data.compact === true;
  const hint = String(data.hint || '');
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const hasActions = Boolean(String(primaryCta.label || '').trim() || String(secondaryCta.label || '').trim());
  const actions = hasActions ? <ActionGroup className="mt-7 gap-3 [&_.cms-button]:w-auto"><ActionLink action={primaryCta} editKey="primaryCta" /><ActionLink action={secondaryCta} editKey="secondaryCta" tone="secondary" showArrow={false} className="border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] text-[color:var(--token-btn-secondary-text)]" /></ActionGroup> : null;
  const copy = <>{text && <div className="rt-content max-w-[48ch] text-base leading-[1.8] text-[color:var(--token-body)] md:text-lg" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />}{actions}{hint && <p className="mt-8 max-w-[46ch] border-t border-[var(--token-divider)] pt-5 text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="hint">{hint}</p>}</>;

  if (memorial) return <div className="bg-[var(--token-section-bg)] px-6 pb-7 pt-[calc(var(--opening-header-clearance,0px)+1.75rem)] sm:px-10 md:pb-12 md:pt-[calc(var(--opening-header-clearance,0px)+3rem)] lg:px-14">
    <div className={`mx-auto grid max-w-[1440px] items-center gap-9 lg:gap-16 ${image ? 'lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]' : ''}`}>
      {image && <figure className={`m-0 aspect-[16/10] overflow-hidden bg-[var(--token-section-bg-alt)] p-3 md:p-5 ${compact ? 'max-h-[440px]' : 'max-h-[580px]'}`}><img src={image} alt={imageAlt} data-edit-image="imagePrimary" loading="eager" fetchPriority="high" className="block h-full w-full object-contain" style={{ objectPosition: position }} /></figure>}
      <div className={image ? '' : 'max-w-5xl'}><h1 className={`font-display max-w-[15ch] whitespace-pre-line font-medium leading-[1.03] tracking-[-0.025em] text-[color:var(--token-heading)] [text-wrap:balance] ${compact ? 'text-[clamp(2.6rem,5vw,4.6rem)]' : 'text-[clamp(3rem,5.6vw,5.6rem)]'}`} data-edit-path="headline">{headline}</h1><div className="mt-7">{copy}</div></div>
    </div>
  </div>;

  return <div className="studio-stage overflow-hidden bg-[var(--token-section-bg)] px-6 pb-8 pt-[calc(var(--opening-header-clearance,0px)+2.5rem)] sm:px-10 md:pb-12 md:pt-[calc(var(--opening-header-clearance,0px)+4rem)] lg:px-14">
    <div className="mx-auto max-w-[1440px]">
      <h1 className={`studio-stage-title relative z-10 max-w-[19ch] whitespace-pre-line font-display font-semibold leading-[0.96] tracking-[-0.04em] text-[color:var(--token-heading)] [text-wrap:balance] ${compact ? 'text-[clamp(2.8rem,6.2vw,5.6rem)]' : 'text-[clamp(3.6rem,8vw,6rem)]'}`} data-edit-path="headline">{headline}</h1>
      <div className={`mt-9 grid gap-9 lg:grid-cols-12 lg:gap-8 ${compact ? 'lg:mt-10' : 'lg:mt-12'}`}>
        <div className={`max-w-xl ${image ? compact ? 'lg:col-span-5' : 'lg:col-span-4 lg:pt-12' : 'lg:col-span-8'}`}>{copy}</div>
        {image && <figure className={`studio-stage-image relative m-0 overflow-hidden ${compact ? 'lg:col-span-7 lg:-mt-6' : 'lg:col-span-8 lg:-mt-14'}`}>
          <img data-edit-image="imagePrimary" src={image} alt={imageAlt} loading="eager" fetchPriority="high" className={`block w-full ${compact ? 'aspect-[16/9]' : 'aspect-[4/3] md:aspect-[16/10]'} ${data.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`} style={{ objectPosition: position }} />
        </figure>}
      </div>
    </div>
  </div>;
}
