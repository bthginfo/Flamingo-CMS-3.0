'use client';

import { useId, useRef, useState, useEffect, type KeyboardEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PerspectiveImage } from './perspective-image';
import { PerspectiveLink } from './perspective-link';
import { PerspectiveActionIcon } from './perspective-action-icons';
import { action, copy, imageUrl, perspectiveLinkProps, sourceRows } from './perspective-utils';
import { PERSPECTIVE_TEXT_SCRIM } from './perspective-photo-scrim';

type Item = Record<string, unknown>;

/** Native scroll-snap remains usable before hydration and with JavaScript disabled. */
export function EditorialReelSection({ data }: { data: Record<string, unknown> }) {
  const items = sourceRows<Item>(data.items).filter(({ item }) => copy(item.title) || imageUrl(item.image) || copy(item.text));
  const headline = copy(data.headline);
  const intro = copy(data.intro);
  const cta = action(data.cta);
  const opening = data.layout === 'opening';
  const Title = data.titleAs === 'h1' ? 'h1' : 'h2';
  const ItemTitle = Title === 'h1' ? 'h2' : 'h3';
  const track = useRef<HTMLOListElement>(null);
  const trackId = `reel-${useId().replace(/:/g, '')}`;
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => setMounted(true), []);
  const motion = ['subtle', 'expressive'].includes(copy(data.motion)) ? copy(data.motion) : 'none';

  function goTo(index: number) {
    const list = track.current;
    const slide = list?.children[Math.max(0, Math.min(index, items.length - 1))] as HTMLElement | undefined;
    if (!list || !slide) return;
    const reduced = (mounted && reduceMotion) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left: slide.offsetLeft - (list.firstElementChild as HTMLElement).offsetLeft, behavior: reduced || motion === 'none' ? 'instant' : 'smooth' });
  }

  function onKeyDown(event: KeyboardEvent<HTMLOListElement>) {
    if (event.target !== event.currentTarget) return;
    const target = event.key === 'ArrowRight' ? active + 1 : event.key === 'ArrowLeft' ? active - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : null;
    if (target !== null) { event.preventDefault(); goTo(target); }
  }

  if (!headline && !intro && !items.length && !cta.label) return null;
  return <div className={`editorial-reel bg-[var(--token-section-bg)] ${opening || Title === 'h1' ? 'pt-[var(--opening-header-clearance,0px)]' : ''}`} data-editorial-reel data-reel-layout={opening ? 'opening' : 'showcase'} data-motion={motion}>
    <div className={`mx-auto max-w-[1512px] px-6 sm:px-10 lg:px-16 ${opening ? 'pb-6 pt-6 md:pb-9 md:pt-12' : 'pb-9 pt-16 md:pb-12 md:pt-24'}`}>
      <header className="grid items-end gap-x-14 gap-y-5 lg:grid-cols-[1.6fr_1fr]">
        {headline && <Title data-edit-path="headline" className={`font-display min-w-0 max-w-[15ch] whitespace-pre-line font-semibold tracking-[-.04em] text-[color:var(--token-heading)] [text-wrap:balance] ${opening ? 'text-[clamp(3.05rem,7vw,7rem)] leading-[1.025]' : 'text-[clamp(2.6rem,5.7vw,6rem)] leading-[1.06]'}`}>{headline}</Title>}
        <div className="min-w-0 max-w-[43ch] lg:pb-1">{intro && <p data-edit-path="intro" className="whitespace-pre-line text-[1.075rem] leading-[1.75] text-[color:var(--token-body)] md:text-[1.13rem]">{intro}</p>}<PerspectiveLink cta={cta} className={`${intro ? 'mt-4' : ''} ${opening && items.length ? 'hidden md:inline-flex' : ''}`} /></div>
      </header>
    </div>
    {items.length > 0 && <>
      <ol ref={track} id={trackId} role="region" aria-label="Fotografische Kapitel" aria-roledescription="Karussell" tabIndex={0} onKeyDown={onKeyDown} onScroll={() => {
        const list = track.current;
        if (!list) return;
        const origin = (list.firstElementChild as HTMLElement)?.offsetLeft || 0;
        const distances = Array.from(list.children).map(child => Math.abs((child as HTMLElement).offsetLeft - origin - list.scrollLeft));
        const closest = distances.indexOf(Math.min(...distances));
        if (closest !== active) setActive(closest);
      }} className="editorial-reel-track m-0 flex list-none gap-4 overflow-x-auto px-6 pb-1 sm:gap-6 sm:px-10 lg:gap-7 lg:px-16" data-editorial-reel-track>
        {items.map(({ item, sourceIndex }, index) => {
          const link = action(item.link);
          const image = imageUrl(item.image);
          const itemTitle = copy(item.title);
          return <li key={copy(item.id) || sourceIndex} className="editorial-reel-slide relative shrink-0" data-editorial-reel-slide data-item-id={copy(item.id) || `item-${sourceIndex}`} data-edit-collection="items" data-edit-index={sourceIndex} aria-label={`${index + 1} von ${items.length}`}>
            <article className={`relative isolate flex h-full items-end overflow-hidden bg-[var(--token-section-bg-alt)] ${opening ? 'min-h-[480px] md:min-h-[550px] lg:min-h-[580px]' : 'min-h-[420px] md:min-h-[510px]'}`}>
              {image && <PerspectiveImage src={image} alt={copy(item.imageAlt)} position={copy(item.imagePosition)} mobilePosition={copy(item.imageMobilePosition)} sizes="(max-width:767px) 950px, (min-width:1600px) 1300px, 86vw" priority={opening && index === 0} motion={motion} imageEffect={copy(data.imageEffect)} hoverEffect={copy(data.hoverEffect)} />}
              <div className="relative z-10 grid w-full items-end gap-3 px-6 pb-6 pt-16 sm:px-9 sm:pb-9 md:grid-cols-[1fr_auto] md:gap-10 lg:px-12 lg:pb-11" data-color-context={image ? 'dark' : undefined} data-photo-copy-plane style={image ? { background: PERSPECTIVE_TEXT_SCRIM } : undefined}>
                <div className="min-w-0 max-w-[45ch]">{itemTitle && <ItemTitle data-edit-path="title" className={`font-display max-w-[20ch] whitespace-pre-line text-[clamp(1.8rem,3.3vw,3.5rem)] font-semibold leading-[1.09] tracking-[-.03em] [text-wrap:balance] ${image ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`}>{itemTitle}</ItemTitle>}{copy(item.text) && <p data-edit-path="text" className={`mt-4 max-w-[45ch] whitespace-pre-line text-[1rem] leading-[1.7] md:text-[1.075rem] ${image ? 'text-[color:var(--token-on-dark-body)]' : 'text-[color:var(--token-body)]'}`}>{copy(item.text)}</p>}</div>
                {link.href && link.label && <a href={link.href} {...perspectiveLinkProps(link.href)} data-edit-link="link" className={`group inline-flex min-h-11 items-center gap-3 justify-self-start py-2 text-base font-semibold underline-offset-[.25em] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${image ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-link)]'}`}><PerspectiveActionIcon cta={link} side="prefix" /><span data-edit-path="label">{link.label}</span><PerspectiveActionIcon cta={link} side="suffix" className="transition-transform duration-200 motion-safe:group-hover:translate-x-1" /></a>}
              </div>
            </article>
          </li>;
        })}
      </ol>
      <div className="mx-auto flex max-w-[1512px] items-center justify-between gap-5 px-6 pb-12 pt-5 sm:px-10 md:pb-16 lg:px-16">
        <div className="min-w-0">{opening && <PerspectiveLink cta={cta} className="md:hidden" />}<p aria-live="polite" aria-atomic="true" className={`text-sm leading-6 text-[color:var(--token-muted)] ${opening ? 'sr-only md:not-sr-only' : ''}`}>{copy(items[active]?.item.title)}</p></div>
        {items.length > 1 && <div className="flex shrink-0 gap-2"><button type="button" aria-controls={trackId} aria-label="Vorheriges Kapitel" disabled={active <= 0} onClick={() => goTo(active - 1)} className="reel-control border-[var(--token-divider)]"><ArrowLeft aria-hidden="true" size={21} /></button><button type="button" aria-controls={trackId} aria-label="Nächstes Kapitel" disabled={active >= items.length - 1} onClick={() => goTo(active + 1)} className="reel-control border-[var(--token-divider)]"><ArrowRight aria-hidden="true" size={21} /></button></div>}
      </div>
    </>}
  </div>;
}
