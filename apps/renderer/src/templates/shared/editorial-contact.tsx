'use client';

import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { safeContentUrl } from '@/lib/safe-content-url';
import { safeMapEmbedUrl } from '@/lib/safe-embed-url';
import { ConsentGate } from '@/components/consent-gate';
import { contactInfoHref, resolveContactInfoCards, type ContactInfoCard } from '../handwerk/contact-info';
import { copy, sourceRows } from './perspective-utils';

type Props = { data: Record<string, unknown> };

/** An opt-in open contact layout; the established form and delivery path stay shared. */
export function EditorialContactSection({ data }: Props) {
  const Heading = data.titleAs === 'h1' ? 'h1' : 'h2';
  const headline = copy(data.headline);
  const intro = copy(data.introText) || copy(data.subline);
  const configured = sourceRows<ContactInfoCard>(data.infoCards).filter(({ item }) => copy(item.value).trim());
  const rows = configured.length ? configured : resolveContactInfoCards(data).map((item, sourceIndex) => ({ item, sourceIndex }));
  const immediate = rows.filter(({ item }) => /^(tel:|mailto:)/i.test(contactInfoHref(item) || '') || /phone|telefon|mail/i.test(`${item.icon} ${item.label}`));
  const additional = rows.filter(row => !immediate.includes(row));
  const map = safeMapEmbedUrl(data.mapEmbedUrl);
  const info = (entries: typeof rows) => entries.length > 0 && <dl className="space-y-3">{entries.map(({ item, sourceIndex }) => {
    const href = safeContentUrl(contactInfoHref(item) || '');
    const fallbackField = /mail/i.test(item.icon) ? 'email' : /phone|telefon/i.test(item.icon) ? 'phone' : /clock/i.test(item.icon) ? 'hours' : 'address';
    return <div key={sourceIndex} data-edit-collection={configured.length ? 'infoCards' : undefined} data-edit-index={configured.length ? sourceIndex : undefined} className="grid grid-cols-[.32fr_1fr] items-baseline gap-x-4 gap-y-1">
      <dt className="text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path={configured.length ? 'label' : `${fallbackField}Label`}>{item.label}</dt>
      <dd className="min-w-0 whitespace-pre-line text-[1.075rem] leading-[1.65] text-[color:var(--token-body)]">{href ? <a href={href} className="inline-block min-h-10 break-words py-1 font-medium text-[color:var(--token-link)] underline-offset-4 hover:text-[color:var(--token-link-hover)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current" data-edit-path={configured.length ? 'value' : fallbackField}>{item.value}</a> : <span data-edit-path={configured.length ? 'value' : fallbackField}>{item.value}</span>}</dd>
    </div>;
  })}</dl>;

  return <div data-contact-layout="editorial" className="bg-[var(--token-section-bg)] pt-[var(--opening-header-clearance,0px)]"><div className="mx-auto max-w-[1512px] px-6 pb-14 pt-10 sm:px-10 md:pb-20 md:pt-14 lg:px-16">
    {(headline || intro) && <header className="mb-7 max-w-[1100px] md:mb-10">
      {headline && <Heading data-edit-path="headline" className={`font-display max-w-[20ch] font-semibold leading-[1.05] tracking-[-.035em] text-[color:var(--token-heading)] ${data.titleAs === 'h1' ? 'text-[clamp(3.1rem,6.7vw,6.8rem)]' : 'text-[clamp(2.5rem,5vw,5.2rem)]'}`}>{headline}</Heading>}
      {intro && <div data-edit-rich="introText" className="rt-content mt-5 max-w-[66ch] text-[1.075rem] leading-[1.75] text-[color:var(--token-body)]" dangerouslySetInnerHTML={{ __html: sanitizeHtml(intro) }} />}
    </header>}
    <div className="grid gap-x-20 gap-y-6 lg:grid-cols-[.85fr_1.15fr] lg:gap-y-8 xl:gap-x-28">
      <div className="lg:col-start-1 lg:row-start-1">{info(immediate)}</div>
      {data.formEnabled !== false && <div className="border-t border-[var(--token-divider)] pt-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-6"><DynamicContactForm fields={data.formFields as FormFieldDef[] | undefined} submitLabel={copy(data.submitLabel) || 'Nachricht senden'} privacyHref={safeContentUrl(copy(data.privacyHref)) || undefined} className="space-y-6" inputClassName="rounded-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-link)]" /></div>}
      {additional.length > 0 && <div className="border-t border-[var(--token-divider)] pt-5 lg:col-start-1 lg:row-start-2">{info(additional)}</div>}
    </div>
    {data.showMap !== false && map && <div className="mt-10 overflow-hidden rounded-[12px]"><ConsentGate provider="Google Maps" className="h-[320px] w-full"><iframe src={map} title="Standort" className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></ConsentGate></div>}
  </div></div>;
}
