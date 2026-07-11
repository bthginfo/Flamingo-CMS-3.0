import { Mail, MessageCircle, Phone } from 'lucide-react';
import { plain } from '@/lib/strip-html';
import { FaqAccordion } from './faq-accordion';
import { ActionLink, CardSurface, PremiumSectionHeader } from './section-primitives';

type FaqItem = { question: string; answer: string };
type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function FaqContactSplitSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || 'FAQ';
  const headline = (data.headline as string) || 'Häufige Fragen';
  const subline = (data.subline as string) || '';
  const items = (data.items as FaqItem[]) || [];
  const contactTitle = (data.contactTitle as string) || 'Ihre Frage ist nicht dabei?';
  const contactText = (data.contactText as string) || 'Schreiben Sie uns – wir antworten meist innerhalb eines Werktags.';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const whatsapp = (data.whatsapp as string) || '';
  const cta = (data.cta as Cta) || {};
  if (!items.length) return null;

  return (
    <div>
      <PremiumSectionHeader
        eyebrow={badge}
        headline={headline}
        subline={plain(subline)}
        eyebrowPath="badge"
        richSubline={false}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:items-start">
        <FaqAccordion items={items} variant="cards" />

        <CardSurface as="aside" className="p-6 lg:sticky lg:top-28 sm:p-7">
          <h3 className="text-xl font-bold text-[color:var(--token-card-heading)]" data-edit-path="contactTitle">{contactTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--token-card-body)]" data-edit-path="contactText">{plain(contactText)}</p>
          <div className="mt-5 grid gap-2.5 text-sm">
            {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="cms-contact-link"><Phone aria-hidden="true" size={17} /><span data-edit-path="phone">{phone}</span></a>}
            {email && <a href={`mailto:${email}`} className="cms-contact-link"><Mail aria-hidden="true" size={17} /><span data-edit-path="email">{email}</span></a>}
            {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="cms-contact-link"><MessageCircle aria-hidden="true" size={17} /><span>WhatsApp</span></a>}
          </div>
          {cta.label && <ActionLink action={cta} editKey="cta" className="mt-5 w-full" />}
        </CardSurface>
      </div>
    </div>
  );
}
