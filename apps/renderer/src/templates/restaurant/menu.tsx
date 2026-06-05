'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Flame, Leaf, Wheat } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';
import { plain } from '@/lib/strip-html';

type MenuItem = {
  name?: string;
  description?: string;
  price?: string;
  image?: string;
  tags?: string[];
  allergens?: string[];
  highlighted?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  spicy?: boolean;
  detailHref?: string;
  detailLabel?: string;
};

type MenuCategory = {
  title?: string;
  description?: string;
  items?: MenuItem[];
};

export function MenuSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Speisekarte';
  const subline = (data.subline as string) || 'Saisonale Gerichte aus frischen Zutaten';
  const badgeText = (data.badgeText as string) || 'Aus der Kueche';
  const introText = (data.introText as string) || '';
  const categories = asList<MenuCategory>(data.categories);
  const footnote = (data.footnote as string) || '';
  const ctaPrimary = asButton(data.ctaPrimary);

  if (styleVariant === 'bold') {
    return <MenuBold headline={headline} subline={plain(subline)} badgeText={badgeText} introText={plain(introText)} categories={categories} footnote={footnote} ctaPrimary={ctaPrimary} />;
  }
  if (styleVariant === 'modern') {
    return <MenuModern headline={headline} subline={plain(subline)} badgeText={badgeText} introText={plain(introText)} categories={categories} footnote={footnote} ctaPrimary={ctaPrimary} />;
  }
  return <MenuClassic headline={headline} subline={plain(subline)} badgeText={badgeText} introText={plain(introText)} categories={categories} footnote={footnote} ctaPrimary={ctaPrimary} />;
}

type MenuViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  introText: string;
  categories: MenuCategory[];
  footnote: string;
  ctaPrimary: { label?: string; href?: string };
};

function MenuClassic(props: MenuViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-black/10 bg-[var(--token-card-bg,#ffffff)] shadow-sm overflow-hidden">
      <MenuHeader {...props} align="center" />
      <div className="divide-y divide-black/10">
        {props.categories.map((category, index) => (
          <MenuCategoryBlock key={`${category.title}-${index}`} category={category} layout="classic"  data-edit-collection="categories" data-edit-index={index}/>
        ))}
      </div>
      <MenuFooter {...props} />
    </motion.div>
  );
}

function MenuModern(props: MenuViewProps) {
  return (
    <div className="space-y-12">
      <MenuHeader {...props} align="left" />
      <div className="grid gap-8 lg:grid-cols-2">
        {props.categories.map((category, index) => (
          <MenuCategoryBlock key={`${category.title}-${index}`} category={category} layout="modern"  data-edit-collection="categories" data-edit-index={index}/>
        ))}
      </div>
      <MenuFooter {...props} />
    </div>
  );
}

function MenuBold(props: MenuViewProps) {
  return (
    <div className="bg-[#111827] text-[color:var(--token-on-dark-heading,#ffffff)] p-6 sm:p-10 shadow-sm">
      <MenuHeader {...props} align="left" inverted />
      <div className="grid gap-5">
        {props.categories.map((category, index) => (
          <MenuCategoryBlock key={`${category.title}-${index}`} category={category} layout="bold"  data-edit-collection="categories" data-edit-index={index}/>
        ))}
      </div>
      <MenuFooter {...props} inverted />
    </div>
  );
}

function MenuHeader({ headline, subline, badgeText, introText, align, inverted }: MenuViewProps & { align: 'left' | 'center'; inverted?: boolean }) {
  return (
    <div className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl p-6 sm:p-10`}>
      {badgeText && <p className={`text-xs font-bold uppercase tracking-widest ${inverted ? 'text-[var(--token-eyebrow, var(--brand-accent))]' : 'text-[color:var(--token-muted,#52525b)]'}`}>{badgeText}</p>}
      <h2 className={`mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] ${inverted ? 'text-[color:var(--token-on-dark-heading,#ffffff)]' : 'text-[color:var(--token-heading,#18181b)]'}`} data-edit-path="headline">{headline}</h2>
      {subline && <div className={`mt-4 text-base sm:text-lg ${inverted ? 'text-[color:var(--token-on-dark-heading,#ffffff)/70]' : 'text-[color:var(--token-muted,#52525b)]'} rt-content`} dangerouslySetInnerHTML={{ __html: subline }} />}
      {introText && <div className={`mt-5 leading-7 ${inverted ? 'text-[color:var(--token-on-dark-heading,#ffffff)/65]' : 'text-[color:var(--token-muted,#52525b)]'} rt-content`} dangerouslySetInnerHTML={{ __html: introText }} />}
    </div>
  );
}

function MenuCategoryBlock({ category, layout }: { category: MenuCategory; layout: 'classic' | 'modern' | 'bold' }) {
  const items = asList<MenuItem>(category.items);
  return (
    <div className={`${layout === 'classic' ? 'p-6 sm:p-10' : layout === 'bold' ? 'border-2 border-[color:var(--token-card-border,#ffffff)/20] p-5' : 'border border-black/10 p-6'}`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${layout === 'bold' ? 'text-[color:var(--token-on-dark-heading,#ffffff)] uppercase' : 'text-[color:var(--token-heading,#18181b)]'}`}>{category.title || ''}</h3>
        {category.description && <div className={`mt-2 text-sm ${layout === 'bold' ? 'text-[color:var(--token-on-dark-heading,#ffffff)/60]' : 'text-[color:var(--token-muted,#52525b)]'}`} dangerouslySetInnerHTML={{ __html: category.description }} />}
      </div>
      <div className="space-y-5">
        {items.map((item, index) => (
          <article key={`${item.name}-${index}`} className={`grid gap-4 ${item.image ? 'sm:grid-cols-[96px_1fr]' : ''} ${item.highlighted ? 'bg-[var(--token-section-bg-alt,#fafafa)] p-4' : ''}`} data-edit-collection="items" data-edit-index={index}>
            {item.image && (
              <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                <Image src={item.image} alt={item.name || ''} fill className="object-cover" sizes="96px" />
              </div>
            )}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h4 className={`font-semibold ${layout === 'bold' ? 'text-[color:var(--token-on-dark-heading,#ffffff)]' : 'text-[color:var(--token-heading,#18181b)]'}`}>{item.name || ''}</h4>
                {item.price && <p className={`shrink-0 font-bold ${layout === 'bold' ? 'text-[var(--token-eyebrow, var(--brand-accent))]' : 'text-[color:var(--token-heading,#18181b)]'}`} data-edit-path="price">{item.price}</p>}
              </div>
              {item.description && <div className={`mt-1 text-sm leading-6 ${layout === 'bold' ? 'text-[color:var(--token-on-dark-heading,#ffffff)/60]' : 'text-[color:var(--token-muted,#52525b)]'}`} dangerouslySetInnerHTML={{ __html: item.description }} />}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                {asList<string>(item.tags).map((tag) => <Badge key={tag} icon={item.spicy ? <Flame size={12} /> : item.vegetarian || item.vegan ? <Leaf size={12} /> : null} label={tag} />)}
                {asList<string>(item.allergens).map((allergen) => <Badge key={allergen} icon={<Wheat size={12} />} label={allergen} />)}
                {item.detailHref && item.detailLabel && <a href={item.detailHref} className="inline-flex items-center gap-1 font-medium underline underline-offset-4">{item.detailLabel} <ArrowRight size={12} /></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-current/20 px-2 py-1 opacity-80">{icon}{label}</span>;
}

function MenuFooter({ footnote, ctaPrimary, inverted }: MenuViewProps & { inverted?: boolean }) {
  if (!footnote && !ctaPrimary.label) return null;
  return (
    <div className={`flex flex-col gap-4 p-6 sm:p-10 sm:flex-row sm:items-center sm:justify-between ${inverted ? 'text-[color:var(--token-on-dark-heading,#ffffff)/70]' : 'text-[color:var(--token-muted,#52525b)]'}`}>
      {footnote && <p className="text-sm">{footnote}</p>}
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 font-semibold text-[color:var(--token-heading,#18181b)] bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] px-5 py-3 rounded-lg">{ctaPrimary.label}<ArrowRight size={16} /></a>}
    </div>
  );
}
