'use client';

import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';
import { ResilientNextImage } from '@/components/ui/resilient-image';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { PerspectiveLink } from './perspective-link';
import { action, copy, imageUrl, sourceRows, stringRows } from './perspective-utils';

type Topic = { id?: string; title?: string; summary?: string; detail?: string; image?: string; imageAlt?: string; imagePosition?: string; bullets?: string[]; meta?: string[]; cta?: { label?: string; href?: string } };
type Props = { data: Record<string, unknown> };

/** Native disclosure keeps every topic useful before hydration and by keyboard. */
export function TopicExplorerSection({ data }: Props) {
  const instance = useId();
  const rows = sourceRows<Topic>(data.items).filter(({ item }) => copy(item.title).trim());
  const headline = copy(data.headline);
  const intro = copy(data.intro);
  const TopicHeading = headline ? 'h3' : 'h2';
  if (!headline && !intro && !rows.length) return null;
  return <div className={`bg-[var(--token-section-bg)] ${headline ? 'py-16 md:py-24' : 'pb-14 pt-5 md:pb-20 md:pt-8'}`} data-topic-explorer="">
    <div className="mx-auto max-w-[1512px] px-6 sm:px-10 lg:px-16">
      {(headline || intro) && <header className={headline ? 'mb-10 grid items-end gap-6 lg:mb-14 lg:grid-cols-[1.4fr_1fr] lg:gap-24' : 'mb-6'}>
        {headline && <h2 data-edit-path="headline" className="font-display max-w-[17ch] whitespace-pre-line text-[clamp(2.8rem,5.9vw,6.2rem)] font-semibold leading-[1.055] tracking-[-.035em] text-[color:var(--token-heading)] [text-wrap:balance]">{headline}</h2>}
        {intro && <p data-edit-path="intro" className="max-w-[48ch] text-[1.075rem] leading-[1.75] text-[color:var(--token-body)] md:text-lg">{intro}</p>}
      </header>}
      <div className="border-t border-[var(--token-divider)]">
        {rows.map(({ item, sourceIndex }, visibleIndex) => {
          const image = imageUrl(item.image);
          const bullets = stringRows(item.bullets);
          const meta = stringRows(item.meta);
          return <details key={`${item.id || 'topic'}-${sourceIndex}`} name={`topics-${instance}`} open={visibleIndex === 0} className="group/topic border-b border-[var(--token-divider)]" data-edit-collection="items" data-edit-index={sourceIndex} data-topic-id={copy(item.id) || undefined}>
            <summary className="grid min-h-[112px] cursor-pointer list-none grid-cols-[minmax(0,1fr)_28px] items-center gap-x-6 gap-y-2 py-6 outline-offset-4 transition-colors hover:bg-[var(--token-section-bg-alt)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--token-link)] [&::-webkit-details-marker]:hidden md:min-h-[132px] md:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)_32px] md:gap-x-14 md:py-8">
              <TopicHeading className="font-display text-[clamp(1.9rem,3.25vw,3.4rem)] font-semibold leading-[1.14] tracking-[-.025em] text-[color:var(--token-heading)]" data-edit-path="title">{item.title}</TopicHeading>
              {item.summary && <p data-edit-path="summary" className="col-start-1 row-start-2 max-w-[49ch] text-[.96rem] leading-[1.65] text-[color:var(--token-muted)] md:col-start-2 md:row-start-1 md:text-base">{item.summary}</p>}
              <span aria-hidden="true" className="col-start-2 row-start-1 h-7 w-7 text-[color:var(--token-icon)] md:col-start-3"><Plus strokeWidth={1.4} className="topic-closed-indicator h-7 w-7" /><Minus strokeWidth={1.4} className="topic-open-indicator h-7 w-7" /></span>
            </summary>
            <div className={`grid gap-x-16 gap-y-7 pb-9 pt-2 md:pb-12 lg:gap-x-20 ${image ? 'md:grid-cols-[1.12fr_1fr]' : 'md:grid-cols-[.55fr_1fr]'}`}>
              {image ? <figure className="relative m-0 aspect-[7/5] overflow-hidden rounded-[12px] bg-[var(--token-section-bg-alt)] md:aspect-[6/5]"><ResilientNextImage src={image} alt={copy(item.imageAlt)} fill sizes="(min-width:768px) 55vw, 100vw" className="object-cover" style={{ objectPosition: copy(item.imagePosition) || 'center' }} data-edit-image="image" /></figure> : <div aria-hidden="true" className="hidden md:block" />}
              <div className="self-center py-1 md:py-4">
                {item.detail && <div data-edit-rich="detail" className="rt-content max-w-[59ch] text-[1.075rem] leading-[1.8] text-[color:var(--token-body)] [&_p+p]:mt-5 md:text-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(copy(item.detail)) }} />}
                {bullets.length > 0 && <ul className="mt-6 space-y-3 border-t border-[var(--token-divider)] pt-5 text-[.98rem] leading-7 text-[color:var(--token-body)]">{bullets.map(({ value, sourceIndex: bulletIndex }) => <li key={bulletIndex} data-edit-path={`bullets.${bulletIndex}`} className="pl-4 [text-indent:-1rem]"><span aria-hidden="true" className="mr-2.5 inline-block h-[3px] w-[3px] align-middle rounded-full bg-current" />{value}</li>)}</ul>}
                {meta.length > 0 && <ul className="mt-6 space-y-1 text-sm leading-6 text-[color:var(--token-muted)]">{meta.map(({ value, sourceIndex: metaIndex }) => <li key={metaIndex} data-edit-path={`meta.${metaIndex}`}>{value}</li>)}</ul>}
                <PerspectiveLink cta={action(item.cta)} className="mt-6" />
              </div>
            </div>
          </details>;
        })}
      </div>
    </div>
  </div>;
}
