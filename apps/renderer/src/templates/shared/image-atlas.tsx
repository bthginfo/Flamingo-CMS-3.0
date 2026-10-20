import { PerspectiveImage } from './perspective-image';
import { PerspectiveLink } from './perspective-link';
import { PerspectiveActionIcon } from './perspective-action-icons';
import { action, copy, imageUrl, perspectiveLinkProps, sourceRows } from './perspective-utils';
import { PERSPECTIVE_TEXT_SCRIM } from './perspective-photo-scrim';

export function ImageAtlasSection({ data }: { data: Record<string, unknown> }) {
  const headline = copy(data.headline);
  const intro = copy(data.intro);
  const items = sourceRows<Record<string, unknown>>(data.items).filter(({ item }) => copy(item.title) || copy(item.text) || imageUrl(item.image));
  const cta = action(data.cta);
  const Title = data.titleAs === 'h1' ? 'h1' : 'h2';
  const ItemTitle = Title === 'h1' ? 'h2' : 'h3';
  const motion = ['subtle', 'expressive'].includes(copy(data.motion)) ? copy(data.motion) : 'none';
  if (!headline && !intro && !items.length && !cta.label) return null;
  return <div className="image-atlas bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]" data-image-atlas data-motion={motion}>
    <div className="mx-auto max-w-[1512px] px-6 pb-16 pt-8 sm:px-10 md:pb-24 md:pt-12 lg:px-16">
      {(headline || intro) && <header className="mb-8 grid items-end gap-x-16 gap-y-6 md:mb-12 lg:grid-cols-[1.4fr_1fr]">{headline && <Title data-edit-path="headline" className="font-display min-w-0 max-w-[16ch] whitespace-pre-line text-[clamp(2.6rem,7.5vw,7rem)] font-semibold leading-[1.035] tracking-[-.04em] text-[color:var(--token-heading)] [text-wrap:balance]">{headline}</Title>}{intro && <p data-edit-path="intro" className="min-w-0 max-w-[45ch] whitespace-pre-line text-[1.075rem] leading-[1.75] text-[color:var(--token-body)] md:text-[1.13rem] lg:pb-1">{intro}</p>}</header>}
      {items.length > 0 && <div className="image-atlas-grid" data-atlas-count={items.length}>{items.map(({ item, sourceIndex }) => {
        const image = imageUrl(item.image);
        const link = action(item.link);
        const className = `image-atlas-tile group relative isolate flex min-w-0 items-end overflow-hidden bg-[var(--token-section-bg-alt)] ${link.href ? 'focus-visible:z-10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[var(--token-link)]' : ''}`;
        const content = <>
          {image && <PerspectiveImage src={image} alt={copy(item.imageAlt)} position={copy(item.imagePosition)} mobilePosition={copy(item.imageMobilePosition)} sizes="(max-width:639px) 720px, (max-width:1023px) 65vw, 68vw" priority={data.titleAs === 'h1' && sourceIndex < 2} motion={motion} hoverEffect={copy(data.hoverEffect)} />}
          <div className={`relative z-10 w-full min-w-0 px-6 pb-6 pt-16 sm:px-7 sm:pb-8 lg:px-9 lg:pb-9 ${image ? 'text-[color:var(--token-on-dark-body)]' : 'text-[color:var(--token-body)]'}`} data-color-context={image ? 'dark' : undefined} data-photo-copy-plane style={image ? { background: PERSPECTIVE_TEXT_SCRIM } : undefined}>
            {copy(item.title) && <ItemTitle data-edit-path="title" className={`font-display max-w-[20ch] text-[clamp(1.65rem,2.9vw,3rem)] font-semibold leading-[1.13] tracking-[-.025em] [text-wrap:balance] ${image ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`}>{copy(item.title)}</ItemTitle>}
            {copy(item.text) && <p data-edit-path="text" className="mt-3 max-w-[43ch] whitespace-pre-line text-[.975rem] leading-[1.65] md:text-base">{copy(item.text)}</p>}
            {link.href && <span data-edit-link="link" className={`mt-5 inline-flex min-h-11 items-center gap-3 py-2 text-sm font-semibold underline-offset-4 group-hover:underline ${image ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-link)]'}`}><PerspectiveActionIcon cta={link} side="prefix" />{link.label && <span data-edit-path="label">{link.label}</span>}<PerspectiveActionIcon cta={link} side="suffix" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1" /></span>}
          </div>
        </>;
        const attributes = { 'data-image-atlas-item': '', 'data-item-id': copy(item.id) || `item-${sourceIndex}`, 'data-edit-collection': 'items', 'data-edit-index': sourceIndex };
        return link.href ? <a key={copy(item.id) || sourceIndex} href={link.href} {...perspectiveLinkProps(link.href)} {...attributes} className={className}>{content}</a> : <article key={copy(item.id) || sourceIndex} {...attributes} className={className}>{content}</article>;
      })}</div>}
      <PerspectiveLink cta={cta} className={items.length ? 'mt-9' : ''} />
    </div>
  </div>;
}
