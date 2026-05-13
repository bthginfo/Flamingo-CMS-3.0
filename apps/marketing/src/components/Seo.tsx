import { useEffect } from 'react';
import type { SiteContent, TemplateKey, PageId } from '@/lib/types';

const DEFAULT_OG = '/og-image.svg';

export type SeoProps = {
  title: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
  keywords?: string;
  /** When provided, additional JSON-LD entries are injected (LocalBusiness/Restaurant/etc.). */
  content?: SiteContent;
  template?: TemplateKey;
  /** Optional active page id — picks up overrides from content.pageSeo[page]. */
  page?: PageId;
};

export function useSeo({
  title,
  description,
  image,
  noindex = false,
  canonical,
  keywords,
  content,
  template,
  page,
}: SeoProps) {
  useEffect(() => {
    const override = page && (content as any)?.pageSeo?.[page];
    const globalSeo = (content as any)?.seo as
      | { title?: string; description?: string; ogImage?: string; keywords?: string; canonical?: string; locale?: string }
      | undefined;

    const effectiveTitle = override?.title || globalSeo?.title || title;
    const effectiveDescription = override?.description || description || globalSeo?.description || '';
    const effectiveKeywords = override?.keywords || keywords || globalSeo?.keywords || '';
    const brandLogo = content?.brand?.logoUrl || '';
    const brandName = content?.brand?.name || 'FlamingoMedia';
    const brandTagline = content?.brand?.tagline || '';
    const brandPrimary = content?.brand?.primaryColor || '#0f172a';
    const dynamicOg = buildDynamicOgUrl(brandName, brandTagline, brandPrimary);
    const effectiveImage = override?.ogImage || image || globalSeo?.ogImage || dynamicOg || brandLogo || DEFAULT_OG;
    const effectiveNoindex = !!override?.noindex || noindex;

    const fullTitle = effectiveTitle.includes(brandName) || effectiveTitle.includes('FlamingoMedia')
      ? effectiveTitle
      : `${effectiveTitle} · ${brandName}`;
    document.title = fullTitle;

    setMeta('name', 'description', effectiveDescription);
    setMeta('name', 'keywords', effectiveKeywords);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', effectiveDescription);
    setMeta('property', 'og:image', toAbsolute(effectiveImage));
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', window.location.href);
    setMeta('property', 'og:locale', globalSeo?.locale || 'de_AT');
    setMeta('property', 'og:site_name', brandName);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', effectiveDescription);
    setMeta('name', 'twitter:image', toAbsolute(effectiveImage));
    setMeta('name', 'robots', effectiveNoindex
      ? 'noindex,nofollow'
      : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1');
    setMeta('name', 'googlebot', effectiveNoindex ? 'noindex,nofollow' : 'index,follow');

    setLink('canonical', canonical || globalSeo?.canonical || stripQuery(window.location.href));

    // Favicon: prefer brand logo if uploaded, otherwise leave existing default in index.html.
    if (brandLogo) {
      setLink('icon', brandLogo);
      setLink('apple-touch-icon', brandLogo);
    }

    setJsonLd('bth-jsonld-page', buildJsonLd(content, template, fullTitle, effectiveDescription));
  }, [title, description, image, noindex, canonical, keywords, content, template, page]);
}

function stripQuery(href: string) {
  try { const u = new URL(href); u.search = ''; u.hash = ''; return u.href; } catch { return href; }
}
function toAbsolute(url: string): string {
  try { return new URL(url, window.location.origin).href; } catch { return url; }
}

/**
 * Build a URL pointing at the dynamic OG-image API endpoint.
 * The endpoint renders a branded SVG (1200×630) with the tenant's
 * name, tagline and primary color – ideal fallback when no
 * upload is provided.
 */
function buildDynamicOgUrl(name: string, tagline: string, color: string): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams();
  if (name) params.set('name', name.slice(0, 80));
  if (tagline) params.set('tagline', tagline.slice(0, 120));
  if (color) params.set('color', color);
  return `/api/og?${params.toString()}`;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  const sel = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!value) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id: string, payload: unknown) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[type="application/ld+json"][data-id="${id}"]`);
  if (!payload) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-id', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
}

function buildJsonLd(content: SiteContent | undefined, template: TemplateKey | undefined, title: string, description: string) {
  if (!content) return null;
  const url = window.location.href;
  const brand = content.brand;
  const c = content.contact;
  const sameAs: string[] = [];
  if (content.social?.instagram) sameAs.push(`https://www.instagram.com/${content.social.instagram}`);
  if (content.social?.facebook) sameAs.push(`https://www.facebook.com/${content.social.facebook}`);

  const cityParts = (c.city || '').trim().split(/\s+/);
  const postalCode = cityParts[0]?.match(/^\d{4,5}$/) ? cityParts[0] : undefined;
  const locality = postalCode ? cityParts.slice(1).join(' ') : c.city || undefined;
  const country = postalCode && postalCode.length === 4 ? 'AT' : 'DE';

  const address = {
    '@type': 'PostalAddress',
    streetAddress: c.address || undefined,
    addressLocality: locality,
    postalCode,
    addressCountry: country,
  };

  const openingHours = (c.hours || []).map((h) => `${h.day}: ${h.time}`);
  const businessType = (() => {
    switch (template) {
      case 'restaurant': return 'Restaurant';
      case 'salon': return 'BeautySalon';
      case 'tradesman': return 'HomeAndConstructionBusiness';
      case 'consulting': return 'ProfessionalService';
      case 'medical': return 'MedicalBusiness';
      case 'fitness': return 'HealthClub';
      default: return 'LocalBusiness';
    }
  })();

  const localBusiness: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': businessType,
    name: brand?.name,
    description: description || (content as any)?.about?.body?.slice?.(0, 200) || undefined,
    url,
    telephone: c.phone || undefined,
    email: c.email || undefined,
    address,
    image: content.hero?.imageUrl || (content as any)?.seo?.ogImage || (content as any)?.brand?.logoUrl || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    openingHoursSpecification: openingHours.length ? openingHours : undefined,
  };
  const customPriceRange = (content as any)?.seo?.priceRange?.trim?.();
  if (customPriceRange) (localBusiness as any).priceRange = customPriceRange;
  if (template === 'restaurant') {
    const customCuisine = (content as any)?.seo?.cuisine?.trim?.();
    if (customCuisine) (localBusiness as any).servesCuisine = customCuisine;
  }

  const services = (content.services || []).slice(0, 12).map((s) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: s.title, description: s.description },
    price: (s.price || '').replace(/[^\d.,]/g, '').replace(',', '.') || undefined,
    priceCurrency: 'EUR',
  }));
  if (services.length) (localBusiness as any).makesOffer = services;

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: window.location.origin,
    name: brand?.name,
    inLanguage: 'de',
    publisher: { '@type': 'Organization', name: brand?.name },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: window.location.origin + '/' },
      { '@type': 'ListItem', position: 2, name: title, item: stripQuery(url) },
    ],
  };

  return [localBusiness, webSite, breadcrumb];
}

export default function Seo(props: SeoProps) {
  useSeo(props);
  return null;
}
