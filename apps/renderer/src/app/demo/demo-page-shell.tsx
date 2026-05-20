'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getStyleCssVars } from '@/lib/styles';
import { getBrandCssVars } from '@/lib/brand-colors';
import type { SnapshotSection } from '@/lib/snapshot';
import { DemoFab } from './demo-fab';
import type { DemoSiteData } from './demo-data';

interface DemoPageShellProps {
  sections: SnapshotSection[];
  industry: string;
  industryKey: string;
  defaultStyle: string;
  siteData: DemoSiteData;
  darkBg?: boolean;
  children?: React.ReactNode;
}

export function DemoPageShell({ sections, industry, industryKey, defaultStyle, siteData, darkBg = true, children }: DemoPageShellProps) {
  const [style, setStyle] = useState(defaultStyle);
  const searchParams = useSearchParams();
  const embed = searchParams.get('embed') === '1';
  const styleCssVars = getStyleCssVars(industry, style);
  const { navItems, cta, brand, contact, socialLinks, footer } = siteData;
  const brandCssVars = getBrandCssVars(brand);

  return (
    <div data-style={style} style={{ ...styleCssVars, ...brandCssVars } as React.CSSProperties}>
      <SiteHeader navItems={navItems} brand={brand} contact={contact} darkBg={darkBg} cta={cta} />
      <main>
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} styleVariant={style} industry={industry} />
        ))}
        {children}
      </main>
      <SiteFooter footer={footer} brand={brand} contact={contact} socialLinks={socialLinks} />
      {!embed && <DemoFab currentIndustry={industryKey} currentStyle={style} onStyleChange={setStyle} />}
    </div>
  );
}
