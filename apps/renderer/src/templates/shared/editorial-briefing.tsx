import { sanitizeHtml } from '@/lib/sanitize-html';
import { PerspectiveLink } from './perspective-link';
import { action, copy, sourceRows, stringRows } from './perspective-utils';

type Group = { title?: string; text?: string; items?: string[] };
type Stage = { title?: string; text?: string };
type Props = { data: Record<string, unknown> };

export function EditorialBriefingSection({ data }: Props) {
  const layout = ['columns', 'sequence', 'dossier'].includes(copy(data.layout)) ? copy(data.layout) : 'columns';
  const headline = copy(data.headline);
  const intro = copy(data.intro);
  const note = copy(data.note);
  const groups = sourceRows<Group>(data.groups);
  const stages = sourceRows<Stage>(data.stages);
  const cta = action(data.cta);
  const GroupHeading = headline ? 'h3' : 'h2';
  const sectionSpacing = headline || intro ? 'py-16 md:py-24' : 'pb-14 pt-5 md:pb-20 md:pt-8';
  const list = (items: unknown) => {
    const rows = stringRows(items);
    return rows.length ? <ul className="mt-5 space-y-3 text-base leading-[1.75] text-[color:var(--token-body)]">{rows.map(({ value, sourceIndex }) => <li key={sourceIndex} data-edit-path={`items.${sourceIndex}`} className="border-t border-[var(--token-divider)] pt-3">{value}</li>)}</ul> : null;
  };
  const groupBody = (item: Group) => <>
    {item.title && <GroupHeading data-edit-path="title" className="font-display max-w-[26ch] text-[clamp(1.65rem,2.55vw,2.7rem)] font-semibold leading-[1.18] tracking-[-.025em] text-[color:var(--token-heading)]">{item.title}</GroupHeading>}
    {item.text && <div data-edit-rich="text" className="rt-content mt-5 max-w-[67ch] text-[1.075rem] leading-[1.85] text-[color:var(--token-body)] [&_p+p]:mt-5" dangerouslySetInnerHTML={{ __html: sanitizeHtml(copy(item.text)) }} />}
    {list(item.items)}
  </>;
  const header = (dossier = false) => headline || intro ? <header className={dossier ? '' : 'mb-12 grid items-end gap-7 lg:mb-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24'}>
    {headline && <h2 data-edit-path="headline" className={`font-display max-w-[19ch] whitespace-pre-line font-semibold leading-[1.07] tracking-[-.035em] text-[color:var(--token-heading)] [text-wrap:balance] ${dossier ? 'text-[clamp(2.5rem,4.4vw,4.8rem)]' : 'text-[clamp(2.7rem,5.5vw,6rem)]'}`}>{headline}</h2>}
    {intro && <p data-edit-path="intro" className={`max-w-[53ch] text-[1.1rem] leading-[1.8] text-[color:var(--token-body)] ${dossier ? 'mt-6' : ''}`}>{intro}</p>}
  </header> : null;
  const closing = (className = '') => note || (cta.label && cta.href) ? <div className={`border-t border-[var(--token-divider)] pt-6 ${className}`}>{note && <p data-edit-path="note" className="max-w-[68ch] text-sm leading-7 text-[color:var(--token-muted)]">{note}</p>}<PerspectiveLink cta={cta} className={note ? 'mt-3' : ''} /></div> : null;
  if (!headline && !intro && !groups.length && !stages.length && !note && !cta.label) return null;

  if (layout === 'dossier') return <div className={`bg-[var(--token-section-bg)] ${sectionSpacing}`} data-briefing-layout={layout}><div className="mx-auto grid max-w-[1512px] gap-x-20 gap-y-12 px-6 sm:px-10 lg:grid-cols-[.85fr_1.35fr] lg:px-16 xl:gap-x-28">
    <div>{header(true)}{closing('mt-9')}</div>
    <div className="space-y-10 md:space-y-12">{groups.map(({ item, sourceIndex }) => <article key={sourceIndex} className="border-t border-[var(--token-divider)] pt-7 first:border-t-0 first:pt-0" data-edit-collection="groups" data-edit-index={sourceIndex}>{groupBody(item)}</article>)}
      {stages.length > 0 && <ol className="space-y-6">{stages.map(({ item, sourceIndex }) => <li key={sourceIndex} data-edit-collection="stages" data-edit-index={sourceIndex} className="border-t border-[var(--token-divider)] pt-5"><GroupHeading data-edit-path="title" className="text-xl font-semibold text-[color:var(--token-heading)]">{item.title}</GroupHeading>{item.text && <p data-edit-path="text" className="mt-2 max-w-[64ch] text-base leading-8 text-[color:var(--token-body)]">{item.text}</p>}</li>)}</ol>}
    </div>
  </div></div>;

  if (layout === 'sequence') return <div className={`bg-[var(--token-section-bg)] ${sectionSpacing}`} data-briefing-layout={layout}><div className="mx-auto max-w-[1512px] px-6 sm:px-10 lg:px-16">{header()}
    {stages.length > 0 && <ol className="border-t border-[var(--token-divider)]">{stages.map(({ item, sourceIndex }, visibleIndex) => <li key={sourceIndex} data-edit-collection="stages" data-edit-index={sourceIndex} className="grid gap-x-8 gap-y-3 border-b border-[var(--token-divider)] py-7 md:grid-cols-[3rem_minmax(0,.85fr)_minmax(0,1.25fr)] md:py-9 lg:gap-x-14"><span aria-hidden="true" className="font-display text-2xl font-medium tabular-nums text-[color:var(--token-muted)]">{String(visibleIndex + 1).padStart(2, '0')}</span><GroupHeading data-edit-path="title" className="font-display text-[clamp(1.75rem,3vw,3rem)] font-semibold leading-[1.15] tracking-[-.025em] text-[color:var(--token-heading)]">{item.title}</GroupHeading>{item.text && <p data-edit-path="text" className="max-w-[64ch] text-[1.075rem] leading-[1.85] text-[color:var(--token-body)]">{item.text}</p>}</li>)}</ol>}
    {groups.length > 0 && <div className="mt-12 grid gap-x-20 gap-y-9 md:grid-cols-2">{groups.map(({ item, sourceIndex }) => <article key={sourceIndex} data-edit-collection="groups" data-edit-index={sourceIndex} className="border-t border-[var(--token-divider)] pt-6">{groupBody(item)}</article>)}</div>}{closing('mt-10')}
  </div></div>;

  return <div className={`bg-[var(--token-section-bg)] ${sectionSpacing}`} data-briefing-layout={layout}><div className="mx-auto max-w-[1512px] px-6 sm:px-10 lg:px-16">{header()}
    <div className="grid gap-x-20 gap-y-10 md:grid-cols-2 lg:gap-x-28">{groups.map(({ item, sourceIndex }, visibleIndex) => <article key={sourceIndex} data-edit-collection="groups" data-edit-index={sourceIndex} className={`border-t border-[var(--token-divider)] pt-7 ${groups.length % 2 === 1 && visibleIndex === groups.length - 1 ? 'md:col-span-2 md:ml-[calc(50%+2.5rem)] lg:ml-[calc(50%+3.5rem)]' : ''}`}>{groupBody(item)}</article>)}</div>
    {stages.length > 0 && <ol className="mt-12 border-t border-[var(--token-divider)]">{stages.map(({ item, sourceIndex }) => <li key={sourceIndex} data-edit-collection="stages" data-edit-index={sourceIndex} className="grid gap-4 border-b border-[var(--token-divider)] py-6 md:grid-cols-[1fr_1.5fr]"><GroupHeading data-edit-path="title" className="text-xl font-semibold text-[color:var(--token-heading)]">{item.title}</GroupHeading>{item.text && <p data-edit-path="text" className="max-w-[65ch] text-base leading-8 text-[color:var(--token-body)]">{item.text}</p>}</li>)}</ol>}{closing('mt-10')}
  </div></div>;
}
