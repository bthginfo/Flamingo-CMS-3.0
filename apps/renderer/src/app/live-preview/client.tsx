'use client';

import { useState, useEffect } from 'react';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import type { SnapshotSection, SnapshotCollection } from '@/lib/snapshot';

interface InitialData {
  industry?: string;
  styleVariant?: string;
  cssVars?: Record<string, string>;
  navItems?: Array<{ label: string; href: string }>;
  navCta?: { label: string; href: string } | null;
  brand?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  footer?: Record<string, unknown>;
  socialLinks?: Record<string, string>;
  fontsUrl?: string | null;
  sections?: SnapshotSection[];
}

export function LivePreviewClient({ initialData }: { initialData: InitialData }) {
  const [sections, setSections] = useState<SnapshotSection[]>(initialData.sections || []);
  const [industry, setIndustry] = useState(initialData.industry || 'tradesman');
  const [styleVariant, setStyleVariant] = useState(initialData.styleVariant || 'classic');
  const [cssVars, setCssVars] = useState<Record<string, string>>(initialData.cssVars || {});
  const [navItems, setNavItems] = useState(initialData.navItems || []);
  const [navCta, setNavCta] = useState(initialData.navCta || undefined);
  const [brand, setBrand] = useState(initialData.brand || {});
  const [contact, setContact] = useState(initialData.contact || {});
  const [footer, setFooter] = useState(initialData.footer || null);
  const [socialLinks, setSocialLinks] = useState(initialData.socialLinks || {});
  const [collections, setCollections] = useState<SnapshotCollection[]>([]);
  const [fontsUrl, setFontsUrl] = useState(initialData.fontsUrl || null);
  const [locale, setLocale] = useState<string | undefined>(undefined);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      // Only accept messages from the same origin (admin tab embedding this
      // iframe). Postmessage from any other window is ignored — protects
      // against malicious sites that try to inject CMS content via iframe.
      if (e.origin !== window.location.origin) return;
      if (!e.data || e.data.type !== 'flamingo-live-preview') return;
      const p = e.data.payload;
      if (p.sections) setSections(p.sections);
      if (p.industry) setIndustry(p.industry);
      if (p.styleVariant) setStyleVariant(p.styleVariant);
      if (p.cssVars) setCssVars(prev => ({ ...prev, ...p.cssVars }));
      if (p.navItems) setNavItems(p.navItems);
      if (p.navCta !== undefined) setNavCta(p.navCta || undefined);
      if (p.brand) setBrand(p.brand);
      if (p.contact) setContact(p.contact);
      if (p.footer) setFooter(p.footer);
      if (p.socialLinks) setSocialLinks(p.socialLinks);
      if (p.collections) setCollections(p.collections);
      if (p.fontsUrl !== undefined) setFontsUrl(p.fontsUrl);
      if (p.locale !== undefined) setLocale(p.locale);
    }
    window.addEventListener('message', handleMessage);
    // Signal readiness to the parent. Targeting the parent's origin would be
    // safest, but the iframe is always rendered same-origin so '*' here is
    // acceptable and matches existing admin embedding.
    window.parent?.postMessage({ type: 'flamingo-live-preview-ready' }, window.location.origin);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const visibleSections = sections.filter(s => s.visible !== false);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

  // Build dynamic style overrides that need !important to beat Tailwind utilities
  const importantOverrides: string[] = [];
  const b = brand as Record<string, string | undefined>;
  if (b.headingColor) importantOverrides.push(`[data-style] main h1, [data-style] main h2, [data-style] main h3, [data-style] main h4, [data-style] main h5, [data-style] main h6 { color: ${b.headingColor} !important; }`);
  if (b.bodyTextColor) importantOverrides.push(`[data-style] main p, [data-style] main li { color: ${b.bodyTextColor} !important; }`);
  if (b.mutedTextColor) importantOverrides.push(`[data-style] main .text-gray-500, [data-style] main .text-slate-500, [data-style] main .text-gray-600 { color: ${b.mutedTextColor} !important; }`);
  if (b.linkColor) importantOverrides.push(`[data-style] main a:not([class*="btn-"]):not([class*="bg-brand"]):not([class*="text-brand"]):not([class*="text-white"]) { color: ${b.linkColor} !important; }`);

  return (
    <div data-style={styleVariant} style={cssVars as React.CSSProperties}>
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
      {importantOverrides.length > 0 && <style dangerouslySetInnerHTML={{ __html: importantOverrides.join('\n') }} />}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-green-600 text-white text-center text-xs py-1 font-medium">
        Live-Vorschau
      </div>
      <div className="pt-6">
        {navItems.length > 0 && (
          <SiteHeader navItems={navItems} brand={brand as never} contact={contact as never} darkBg={firstSectionIsHero} cta={navCta} />
        )}
        <main>
          {visibleSections.length === 0 && (
            <div className="flex items-center justify-center h-[60vh] text-gray-400 text-sm">
              Bearbeite Sektionen im Editor um die Live-Vorschau zu sehen…
            </div>
          )}
          {visibleSections.map((section) => (
            <SectionRenderer key={section.id} section={section} collections={collections} styleVariant={styleVariant} industry={industry} locale={locale} />
          ))}
        </main>
        {footer && (
          <SiteFooter footer={footer as never} brand={brand as never} contact={contact as never} socialLinks={socialLinks as never} />
        )}
      </div>
    </div>
  );
}
