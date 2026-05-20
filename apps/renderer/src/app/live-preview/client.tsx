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
}

export function LivePreviewClient({ initialData }: { initialData: InitialData }) {
  const [sections, setSections] = useState<SnapshotSection[]>([]);
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

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== 'flamingo-live-preview') return;
      const p = e.data.payload;
      if (p.sections) setSections(p.sections);
      if (p.industry) setIndustry(p.industry);
      if (p.styleVariant) setStyleVariant(p.styleVariant);
      if (p.cssVars) setCssVars(p.cssVars);
      if (p.navItems) setNavItems(p.navItems);
      if (p.navCta !== undefined) setNavCta(p.navCta || undefined);
      if (p.brand) setBrand(p.brand);
      if (p.contact) setContact(p.contact);
      if (p.footer) setFooter(p.footer);
      if (p.socialLinks) setSocialLinks(p.socialLinks);
      if (p.collections) setCollections(p.collections);
      if (p.fontsUrl !== undefined) setFontsUrl(p.fontsUrl);
    }
    window.addEventListener('message', handleMessage);
    window.parent?.postMessage({ type: 'flamingo-live-preview-ready' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const visibleSections = sections.filter(s => s.visible !== false);
  const firstSectionIsHero = visibleSections[0]?.type === 'hero';

  return (
    <div data-style={styleVariant} style={cssVars as React.CSSProperties}>
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
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
            <SectionRenderer key={section.id} section={section} collections={collections} styleVariant={styleVariant} industry={industry} />
          ))}
        </main>
        {footer && (
          <SiteFooter footer={footer as never} brand={brand as never} contact={contact as never} socialLinks={socialLinks as never} />
        )}
      </div>
    </div>
  );
}
