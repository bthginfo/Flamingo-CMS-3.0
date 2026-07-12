'use client';

import { useSearchParams } from 'next/navigation';
import { SectionRenderer } from '@/components/section-renderer';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getTenantFontAssets, getTenantThemeCssVars } from '@/lib/tenant-theme';
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

export function DemoPageShell({ sections, industry, industryKey, defaultStyle, siteData, darkBg, children }: DemoPageShellProps) {
  const style = defaultStyle || 'classic';
  const searchParams = useSearchParams();
  const embed = searchParams.get('embed') === '1';
  const { navItems, cta, brand, contact, socialLinks, footer } = siteData;
  const themeCssVars = getTenantThemeCssVars({ industry, style, brand, design: siteData.design });
  const fontAssets = getTenantFontAssets(brand);
  const linkPrefix = `/demo/${industryKey}`;

  // Auto-detect: if first section is a hero with bgImage, nav should be light on dark
  const resolvedDarkBg = darkBg ?? (() => {
    const first = sections[0];
    if (!first) return false;
    const isHeroType = first.type === 'hero' || first.type.endsWith('Hero') || first.type.startsWith('hero');
    if (!isHeroType) return false;
    return !!(first.data?.bgImage);
  })();

  return (
    <>
      <div
        data-style={style}
        data-demo-theme=""
        className="overflow-x-clip"
        style={{
          ...themeCssVars,
          ...(fontAssets.hasBodyFont ? { fontFamily: 'var(--custom-body-font)' } : {}),
        } as React.CSSProperties}
      >
        {fontAssets.googleFontsUrl && <link rel="stylesheet" href={fontAssets.googleFontsUrl} />}
        {fontAssets.fontFaceCss && <style>{fontAssets.fontFaceCss}</style>}
        <SiteHeader navItems={navItems} brand={brand} contact={contact} darkBg={resolvedDarkBg} cta={cta} homeHref={`/demo/${industryKey}`} showTopBar={false} forceDarkNav={resolvedDarkBg} />
        <main>
          {sections.map((section) => (
            <SectionRenderer key={section.id} section={section} styleVariant={style} industry={industry} linkPrefix={linkPrefix} globalFormFields={siteData.formFields} />
          ))}
          {children}
        </main>
        <SiteFooter footer={footer} brand={brand} contact={contact} socialLinks={socialLinks} />
      </div>
      {!embed && <DemoFab currentIndustry={industryKey} />}
    </>
  );
}
