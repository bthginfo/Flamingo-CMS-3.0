import { ActionGroup, ActionLink } from './section-primitives';
import { ResilientNextImage } from '@/components/ui/resilient-image';
import { sanitizeHtml } from '@/lib/sanitize-html';

type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown> };

/** Photographic editorial openings. Every surface and field uses the shared CMS contract. */
export function EditionHero({ data }: Props) {
  const layout = String(data.layout || 'edition');
  const portrait = layout === 'portrait';
  const journal = layout === 'journal';
  const image = String(data.imagePrimary || data.image || '');
  const headline = String(data.headline || '');
  const text = String(data.text || data.subline || '');
  const hint = String(data.hint || '');
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const contacts = Array.isArray(data.contactRows) ? data.contactRows as { label?: string; value?: string; href?: string }[] : [];
  const photo = image ? <figure className={`relative m-0 overflow-hidden bg-[var(--token-section-bg-alt)] ${portrait ? 'aspect-[5/4] lg:aspect-auto lg:min-h-[680px]' : journal ? 'h-[330px] md:h-[470px] lg:h-[510px]' : 'h-[420px] sm:h-[510px] lg:h-full lg:min-h-[740px]'}`}>
    <ResilientNextImage src={image} alt={String(data.imageAlt || '')} fill priority sizes={portrait ? '(min-width: 1024px) 48vw, 100vw' : '(min-width: 1024px) 74vw, 100vw'} className={data.imageFit === 'contain' ? 'object-contain' : 'object-cover'} style={{ objectPosition: String(data.imagePrimaryPosition || data.imagePosition || 'center') }} data-edit-image="imagePrimary" />
  </figure> : null;
  const copy = <>
    <h1 className={`font-display font-medium leading-[1.02] tracking-[-.035em] text-[color:var(--token-heading)] [text-wrap:balance] ${portrait ? 'max-w-[16ch] text-[clamp(2.7rem,4.8vw,5.5rem)]' : journal ? 'max-w-[20ch] text-[clamp(2.8rem,5.8vw,6rem)]' : 'max-w-[13ch] text-[clamp(2.75rem,5.4vw,5.8rem)]'}`} data-edit-path="headline">{headline}</h1>
    {text && <div className={`rt-content mt-5 text-base leading-7 text-[color:var(--token-body)] md:mt-7 md:text-lg md:leading-8 ${portrait ? 'max-w-[46ch]' : 'max-w-[43ch]'}`} data-edit-rich="text" dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />}
    {(primaryCta.label || secondaryCta.label) && <ActionGroup className="mt-6 gap-3 md:mt-8"><ActionLink action={primaryCta} editKey="primaryCta" /><ActionLink action={secondaryCta} editKey="secondaryCta" tone="secondary" showArrow={false} /></ActionGroup>}
    {hint && <p className="mt-6 max-w-[50ch] text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="hint">{hint}</p>}
  </>;

  if (journal) return <section className="bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]">
    <div className="mx-auto max-w-[1600px] px-5 pb-8 pt-10 sm:px-10 md:pb-12 md:pt-16 lg:px-16"><div className="grid items-end gap-8 lg:grid-cols-[1.25fr_.75fr] lg:gap-20"><div>{copy}</div>{contacts.length > 0 && <dl className="border-t border-[var(--token-divider)] pt-5">{contacts.map((item, index) => <div key={index} className="grid grid-cols-[.8fr_1.2fr] gap-4 border-b border-[var(--token-divider)] py-4" data-edit-collection="contactRows" data-edit-index={index}><dt className="text-sm text-[color:var(--token-muted)]" data-edit-path="label">{item.label}</dt><dd className="text-sm leading-6 text-[color:var(--token-body)]">{item.href ? <a className="underline decoration-[var(--token-divider)] underline-offset-4 hover:text-[color:var(--token-link-hover)]" href={item.href} data-edit-link="href"><span data-edit-path="value">{item.value}</span></a> : <span data-edit-path="value">{item.value}</span>}</dd></div>)}</dl>}</div></div>
    {photo}
  </section>;

  if (portrait) return <section className="bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]"><div className="mx-auto grid max-w-[1600px] lg:grid-cols-[.95fr_1.05fr]">{photo}<div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 lg:py-20">{copy}{contacts.length > 0 && <dl className="mt-9 border-t border-[var(--token-divider)] pt-3">{contacts.map((item, index) => <div key={index} className="grid gap-1 py-3 sm:grid-cols-[.8fr_1.2fr]" data-edit-collection="contactRows" data-edit-index={index}><dt className="text-sm text-[color:var(--token-muted)]" data-edit-path="label">{item.label}</dt><dd className="text-sm leading-6 text-[color:var(--token-body)]">{item.href ? <a href={item.href} data-edit-link="href" className="underline underline-offset-4 hover:text-[color:var(--token-link-hover)]"><span data-edit-path="value">{item.value}</span></a> : <span data-edit-path="value">{item.value}</span>}</dd></div>)}</dl>}</div></div></section>;

  return <section className="overflow-hidden bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]"><div className="relative mx-auto grid max-w-[1600px] lg:min-h-[740px] lg:grid-cols-[.48fr_.52fr]">
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-[74%]">{photo}</div>
    <div className="relative z-10 -mt-10 px-5 pb-8 sm:px-10 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex lg:items-center lg:py-16 lg:pl-14 lg:pr-0"><div className="bg-[var(--token-section-bg)] px-5 py-7 sm:px-8 sm:py-9 lg:-mr-16 lg:px-10 lg:py-12">{copy}</div></div>
  </div></section>;
}
