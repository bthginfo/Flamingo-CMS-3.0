import { sanitizeHtml } from '@/lib/sanitize-html';
import { PerspectiveLink } from './perspective-link';
import { PerspectiveImage } from './perspective-image';
import { PerspectiveActionIcon } from './perspective-action-icons';
import { action, copy, imageUrl, perspectiveLinkProps } from './perspective-utils';

type Props = { data: Record<string, unknown> };

export function PhotoChapterSection({ data }: Props) {
  const layout = ['feature', 'immersive', 'diptych', 'spread'].includes(copy(data.layout)) ? copy(data.layout) : 'feature';
  const headline = copy(data.headline);
  const text = copy(data.text);
  const caption = copy(data.caption);
  const cta = action(data.cta);
  const primary = imageUrl(data.image);
  const secondary = imageUrl(data.secondaryImage);
  if (!headline && !text && !primary && !secondary && !caption && !cta.label) return null;
  const photo = (isSecondary: boolean, className: string, sizes: string) => {
    const src = isSecondary ? secondary : primary;
    if (!src) return null;
    return <figure className={`relative m-0 overflow-hidden bg-[var(--token-section-bg-alt)] ${className}`}><PerspectiveImage src={src} alt={copy(isSecondary ? data.secondaryImageAlt : data.imageAlt)} sizes={sizes} position={copy(isSecondary ? data.secondaryImagePosition : data.imagePosition)} mobilePosition={copy(isSecondary ? data.secondaryImageMobilePosition : data.imageMobilePosition)} editKey={isSecondary ? 'secondaryImage' : 'image'} motion={copy(data.motion)} imageEffect={copy(data.imageEffect)} hoverEffect={copy(data.hoverEffect)} /></figure>;
  };
  const copyBlock = <>
    {text && <div className="rt-content max-w-[59ch] text-[1.075rem] leading-[1.8] text-[color:var(--token-body)] [&_p+p]:mt-5 md:text-[1.13rem]" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />}
    <PerspectiveLink cta={cta} className={text ? 'mt-5' : ''} />
  </>;
  const title = headline && <h2 data-edit-path="headline" className="font-display max-w-[20ch] whitespace-pre-line text-[clamp(2.7rem,5.6vw,6.2rem)] font-semibold leading-[1.06] tracking-[-.035em] text-[color:var(--token-heading)] [text-wrap:balance]">{headline}</h2>;
  const credit = caption && <p data-edit-path="caption" className="mt-3 max-w-[76ch] text-xs leading-5 text-[color:var(--token-muted)]">{caption}</p>;

  if (layout === 'immersive') return <div className="bg-[var(--token-section-bg)] py-12 md:py-20" data-photo-layout={layout}>
    <div className="relative isolate mx-auto flex min-h-[660px] max-w-[1800px] items-end overflow-hidden md:min-h-[740px]" data-color-context="dark">
      {primary && <figure className="absolute inset-0 m-0 bg-[var(--token-section-bg-alt)]"><PerspectiveImage src={primary} alt={copy(data.imageAlt)} sizes="(max-width:767px) 1200px, 100vw" position={copy(data.imagePosition)} mobilePosition={copy(data.imageMobilePosition)} motion={copy(data.motion)} imageEffect={copy(data.imageEffect)} hoverEffect={copy(data.hoverEffect)} /></figure>}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(90deg,var(--token-image-overlay),color-mix(in srgb,var(--token-image-overlay) 78%,transparent) 40%,transparent 100%),linear-gradient(0deg,var(--token-image-overlay),transparent)' }} />
      <div className="relative mx-auto w-full max-w-[1512px] px-6 py-12 sm:px-10 md:py-16 lg:px-16">
        {headline && <h2 data-edit-path="headline" className="font-display max-w-[16ch] whitespace-pre-line text-[clamp(2.8rem,6.2vw,6.6rem)] font-semibold leading-[1.04] tracking-[-.035em] text-[color:var(--token-on-dark-heading)] [text-wrap:balance]">{headline}</h2>}
        {text && <div data-edit-rich="text" className="rt-content mt-7 max-w-[48ch] text-[1.075rem] leading-[1.8] text-[color:var(--token-on-dark-body)] [&_p+p]:mt-5 md:text-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />}
        {cta.label && cta.href && <a href={cta.href} {...perspectiveLinkProps(cta.href)} data-edit-link="cta" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-[var(--token-button-radius,8px)] bg-[var(--token-btn-bg)] px-6 py-3 text-base font-semibold text-[color:var(--token-btn-text)] transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"><PerspectiveActionIcon cta={cta} side="prefix" /><span data-edit-path="label">{cta.label}</span><PerspectiveActionIcon cta={cta} side="suffix" /></a>}
        {caption && <p data-edit-path="caption" className="mt-10 max-w-[70ch] text-xs leading-5 text-[color:var(--token-on-dark-muted)]">{caption}</p>}
      </div>
    </div>
  </div>;

  if (layout === 'spread') return <div className="photo-spread overflow-hidden bg-[var(--token-section-bg)] py-16 md:py-24" data-photo-layout={layout}>
    <div className="mx-auto grid max-w-[1512px] items-start gap-x-14 gap-y-8 px-6 sm:px-10 md:gap-y-12 lg:grid-cols-12 lg:px-16">
      <div className="min-w-0 lg:col-span-5 lg:pt-8">{title}</div>
      {primary && <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2">{photo(false, 'aspect-[6/5] md:aspect-[5/4] lg:aspect-[6/7]', '(min-width:1024px) 60vw, 100vw')}{credit}</div>}
      <div className={`max-w-[60ch] ${primary ? 'lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:pb-8' : 'lg:col-span-7'}`}>{copyBlock}{!primary && credit}</div>
      {secondary && <div className="ml-auto w-[78%] md:w-[65%] lg:col-span-6 lg:col-start-2 lg:-mt-28 lg:ml-0 lg:w-full">{photo(true, 'aspect-[5/4] border-[10px] border-[var(--token-section-bg)] md:border-[16px]', '(min-width:1024px) 48vw, 78vw')}</div>}
    </div>
  </div>;

  if (layout === 'diptych') return <div className="bg-[var(--token-section-bg)] py-16 md:py-24" data-photo-layout={layout}>
    <div className="mx-auto max-w-[1512px] px-6 sm:px-10 lg:px-16">
      <div className="grid items-end gap-x-20 gap-y-7 lg:grid-cols-[1.25fr_1fr]">{title}<div className="lg:pb-1">{copyBlock}</div></div>
      {(primary || secondary) && <div className={`mt-10 grid items-start gap-5 md:mt-14 md:gap-7 ${primary && secondary ? 'grid-cols-[1.18fr_.82fr]' : ''}`}>
        {photo(false, secondary ? 'aspect-[4/5] rounded-[14px] md:aspect-[5/4]' : 'aspect-[16/9] rounded-[14px]', '(min-width:768px) 59vw, 60vw')}
        {photo(true, 'mt-16 aspect-[3/5] rounded-[14px] md:mt-24 md:aspect-[4/5]', '(min-width:768px) 40vw, 40vw')}
      </div>}{credit}
    </div>
  </div>;

  return <div className="bg-[var(--token-section-bg)] py-16 md:py-24" data-photo-layout={layout}><div className="mx-auto max-w-[1512px] px-6 sm:px-10 lg:px-16">
    <div className="max-w-[1060px]">{title}</div>
    <div className="mt-9 grid gap-x-12 gap-y-8 md:mt-12 lg:grid-cols-12 lg:gap-x-16">
      {primary && <div className="lg:col-span-8">{photo(false, 'aspect-[6/5] rounded-[14px] md:aspect-[7/5]', '(min-width:1024px) 68vw, 100vw')}{credit}</div>}
      <div className={`max-w-[65ch] ${primary ? 'self-end pb-2 lg:col-span-4 lg:pb-7' : 'lg:col-span-9'}`}>{copyBlock}{!primary && credit}</div>
    </div>
    {secondary && <div className="mt-8 ml-auto max-w-[620px] md:mt-12">{photo(true, 'aspect-[5/3] rounded-[14px]', '(min-width:1024px) 45vw, 100vw')}</div>}
  </div></div>;
}
