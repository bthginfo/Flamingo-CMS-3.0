import { notFound } from 'next/navigation';
import { getDemoSite, getAllIndustryKeys } from '../../pages';
import { getDemoSiteData, type IndustryKey } from '../../demo-data';
import { DemoPageShell } from '../../demo-page-shell';

export const dynamic = 'force-static';

export function generateStaticParams() {
  const params: { industry: string; slug?: string[] }[] = [];
  for (const key of getAllIndustryKeys()) {
    const site = getDemoSite(key);
    if (!site) continue;
    for (const page of site.pages) {
      params.push({
        industry: key,
        slug: page.slug ? page.slug.split('/') : undefined,
      });
    }
  }
  return params;
}

export default async function DemoPage({ params }: { params: Promise<{ industry: string; slug?: string[] }> }) {
  const { industry, slug } = await params;
  const site = getDemoSite(industry);
  if (!site) return notFound();

  const targetSlug = slug?.join('/') || '';
  const page = site.pages.find(p => p.slug === targetSlug);
  if (!page) return notFound();

  const siteData = getDemoSiteData(industry as IndustryKey);
  const firstIsHero = page.sections[0]?.type === 'hero';

  return (
    <DemoPageShell
      sections={page.sections}
      industry={site.industry}
      industryKey={site.industryKey}
      defaultStyle={site.defaultStyle}
      siteData={siteData}
      darkBg={firstIsHero}
    />
  );
}
