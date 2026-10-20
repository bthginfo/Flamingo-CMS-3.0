import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { ResilientNextImage } from '@/components/ui/resilient-image';
import { action, copy, imageUrl, stringRows } from './perspective-utils';

type Props = { data: Record<string, unknown> };

/** Five distinct openings, sharing the same editable photographic/content contract. */
export function PerspectiveHeroSection({ data }: Props) {
  const layout = ['panorama', 'statement', 'portrait', 'journal', 'compact'].includes(copy(data.layout)) ? copy(data.layout) : 'panorama';
  const image = imageUrl(data.image);
  const headline = copy(data.headline);
  const text = copy(data.text);
  const eyebrow = copy(data.eyebrow);
  const caption = copy(data.caption);
  const meta = stringRows(data.meta);
  const primary = action(data.primaryCta);
  const secondary = action(data.secondaryCta);
  const dark = layout === 'panorama';
  if (!headline && !text && !image) return null;

  const actions = (primary.label && primary.href) || (secondary.label && secondary.href) ? <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 md:mt-9">
    {primary.label && primary.href && <a href={primary.href} data-edit-link="primaryCta" className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--token-button-radius,8px)] bg-[var(--token-btn-bg)] px-6 py-3.5 text-base font-semibold text-[color:var(--token-btn-text)] transition-[filter,transform] duration-200 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current active:translate-y-px"><span data-edit-path="label">{primary.label}</span><ArrowRight aria-hidden="true" size={18} className="transition-transform motion-safe:group-hover:translate-x-1" /></a>}
    {secondary.label && secondary.href && <a href={secondary.href} data-edit-link="secondaryCta" className="group inline-flex min-h-12 items-center gap-2 rounded-[var(--token-button-radius,8px)] border border-[var(--token-btn-secondary-border)] bg-[var(--token-btn-secondary-bg)] px-5 py-3 text-base font-semibold text-[color:var(--token-btn-secondary-text)] underline-offset-4 transition-[filter] hover:brightness-110 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"><span data-edit-path="label">{secondary.label}</span><ArrowUpRight aria-hidden="true" size={18} /></a>}
  </div> : null;
  const facts = meta.length ? <ul className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm leading-6 ${dark ? 'text-[color:var(--token-on-dark-muted)]' : 'text-[color:var(--token-muted)]'}`}>{meta.map(({ value, sourceIndex }) => <li key={sourceIndex} data-edit-path={`meta.${sourceIndex}`}>{value}</li>)}</ul> : null;
  const title = <>
    {eyebrow && <p data-edit-path="eyebrow" className="mb-6 text-[.84rem] font-semibold leading-6 tracking-[.025em] text-[color:var(--token-eyebrow)] md:mb-8">{eyebrow}</p>}
    <h1 data-edit-path="headline" className={`font-display whitespace-pre-line font-semibold leading-[1.015] tracking-[-.04em] [text-wrap:balance] ${dark ? 'max-w-[18ch] text-[clamp(3.2rem,7.7vw,8.25rem)] text-[color:var(--token-on-dark-heading)]' : layout === 'portrait' ? 'max-w-[13ch] text-[clamp(3.2rem,6.4vw,7rem)] text-[color:var(--token-heading)]' : layout === 'compact' ? 'max-w-[21ch] text-[clamp(3.1rem,6.2vw,6.5rem)] text-[color:var(--token-heading)]' : 'max-w-[21ch] text-[clamp(3.3rem,7.6vw,8.25rem)] text-[color:var(--token-heading)]'}`}>{headline}</h1>
    {text && <p data-edit-path="text" className={`mt-6 max-w-[49ch] whitespace-pre-line text-[1.075rem] leading-[1.7] md:mt-8 md:text-[1.18rem] ${dark ? 'text-[color:var(--token-on-dark-body)]' : 'text-[color:var(--token-body)]'}`}>{text}</p>}
    {actions}
  </>;
  const photo = (classes: string, sizes: string, contain = false) => image ? <figure className={`${classes.includes('absolute') ? '' : 'relative'} m-0 overflow-hidden bg-[var(--token-section-bg-alt)] ${classes}`}><ResilientNextImage src={image} alt={copy(data.imageAlt)} fill priority sizes={sizes} className={contain ? 'object-contain' : 'object-cover'} style={{ objectPosition: copy(data.imagePosition) || 'center', '--perspective-mobile-focal': copy(data.imageMobilePosition) || copy(data.imagePosition) || 'center' } as CSSProperties} data-edit-image="image" /></figure> : null;
  const imageCaption = caption ? <p data-edit-path="caption" className="mx-auto mt-3 w-full max-w-[1512px] px-6 text-xs leading-5 text-[color:var(--token-muted)] sm:px-10 lg:px-16">{caption}</p> : null;

  if (layout === 'panorama') return <div className="bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]" data-perspective-layout={layout}>
    <div className="relative isolate flex min-h-[680px] items-end overflow-hidden md:min-h-[min(780px,calc(100svh-72px))]" data-color-context="dark">
      {/* A 16:9 image covering the 680px mobile stage paints a 1209px-wide plane. */}
      {photo('absolute inset-0', '(max-width: 767px) 1210px, 100vw')}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg,var(--token-image-overlay) 0%,color-mix(in srgb,var(--token-image-overlay) 88%,transparent) 24%,color-mix(in srgb,var(--token-image-overlay) 24%,transparent) 58%,transparent 82%),linear-gradient(0deg,var(--token-image-overlay),transparent 72%)' }} />
      <div className="relative mx-auto w-full max-w-[1512px] px-6 pb-12 pt-24 sm:px-10 md:pb-14 md:pt-20 lg:px-16 lg:pb-16">{title}{facts}{caption && <p data-edit-path="caption" className="mt-8 max-w-[70ch] text-xs leading-5 text-[color:var(--token-on-dark-muted)]">{caption}</p>}</div>
    </div>
  </div>;

  if (layout === 'statement') return <div className="bg-[var(--token-section-bg)] pb-5 pt-[var(--opening-header-clearance,0px)]" data-perspective-layout={layout}>
    <div className="mx-auto max-w-[1512px] px-6 pb-12 pt-14 sm:px-10 md:pb-16 md:pt-20 lg:px-16"><div className="grid items-end gap-x-20 gap-y-7 lg:grid-cols-[1.55fr_1fr]"><div>{eyebrow && <p data-edit-path="eyebrow" className="mb-6 text-sm font-semibold text-[color:var(--token-eyebrow)]">{eyebrow}</p>}<h1 data-edit-path="headline" className="font-display max-w-[17ch] whitespace-pre-line text-[clamp(3.3rem,7.8vw,8.25rem)] font-semibold leading-[1.015] tracking-[-.04em] text-[color:var(--token-heading)] [text-wrap:balance]">{headline}</h1></div><div>{text && <p data-edit-path="text" className="max-w-[45ch] whitespace-pre-line text-[1.1rem] leading-[1.7] text-[color:var(--token-body)]">{text}</p>}{actions}{facts}</div></div></div>
    {photo('h-[310px] sm:h-[430px] lg:h-[470px]', '100vw')}{imageCaption}
  </div>;

  if (layout === 'portrait') return <div className="bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]" data-perspective-layout={layout}>
    <div className="mx-auto grid max-w-[1512px] items-center gap-8 px-6 pb-14 pt-12 sm:px-10 lg:grid-cols-[1.08fr_1fr] lg:gap-20 lg:px-16 lg:pb-20 lg:pt-16">
      <div className="order-2 py-4 lg:order-1">{title}{facts}{caption && <p data-edit-path="caption" className="mt-7 max-w-[50ch] text-sm leading-6 text-[color:var(--token-muted)]">{caption}</p>}</div>
      {photo('order-1 aspect-[6/5] w-full rounded-[14px] lg:order-2 lg:aspect-[4/5] lg:max-h-[700px]', '(min-width:1024px) 46vw, 100vw')}
    </div>
  </div>;

  if (layout === 'journal') return <div className="overflow-hidden bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]" data-perspective-layout={layout}>
    <div className="mx-auto grid max-w-[1512px] gap-x-16 gap-y-9 px-6 pb-14 pt-12 sm:px-10 lg:grid-cols-[1.12fr_.88fr] lg:px-16 lg:pb-20 lg:pt-20">
      <div className="lg:col-span-2 lg:max-w-[1120px]">{eyebrow && <p data-edit-path="eyebrow" className="mb-7 text-sm font-semibold text-[color:var(--token-eyebrow)]">{eyebrow}</p>}<h1 data-edit-path="headline" className="font-display max-w-[19ch] whitespace-pre-line text-[clamp(3.3rem,7.7vw,8.25rem)] font-semibold leading-[1.015] tracking-[-.04em] text-[color:var(--token-heading)] [text-wrap:balance]">{headline}</h1></div>
      {photo('aspect-[6/5] min-w-0 rounded-[14px] lg:aspect-[7/5]', '(min-width:1024px) 58vw, 100vw')}
      <div className="self-end pb-2 lg:pb-7">{text && <p data-edit-path="text" className="max-w-[43ch] whitespace-pre-line text-[1.15rem] leading-[1.75] text-[color:var(--token-body)] md:text-[1.25rem]">{text}</p>}{actions}{facts}{caption && <p data-edit-path="caption" className="mt-8 max-w-[50ch] border-t border-[var(--token-divider)] pt-4 text-xs leading-5 text-[color:var(--token-muted)]">{caption}</p>}</div>
    </div>
  </div>;

  return <div className="bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]" data-perspective-layout={layout}><div className="mx-auto max-w-[1512px] px-6 pb-6 pt-10 sm:px-10 md:pb-9 md:pt-14 lg:px-16">{title}{facts}</div>{image && <>{photo('h-[260px] md:h-[360px]', '100vw')}{imageCaption}</>}</div>;
}
