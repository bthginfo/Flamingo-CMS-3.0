import type { SnapshotSection, SnapshotCollection } from '@/lib/snapshot';
import { HeroSection } from '@/templates/handwerk/hero';
import { UspStripSection } from '@/templates/handwerk/usp-strip';
import { ServicesGridSection } from '@/templates/handwerk/services-grid';
import { ProcessStepsSection } from '@/templates/handwerk/process-steps';
import { TestimonialsSection } from '@/templates/handwerk/testimonials';
import { FaqSection } from '@/templates/handwerk/faq';
import { CtaBandSection } from '@/templates/handwerk/cta-band';
import { ContactSection } from '@/templates/handwerk/contact';
import { MapSection } from '@/templates/handwerk/map';
import { ServiceDetailSection } from '@/templates/handwerk/service-detail';
import { PortfolioSection } from '@/templates/handwerk/portfolio';
import { TeamSection } from '@/templates/handwerk/team';
import { CtaLinksSection } from '@/templates/handwerk/cta-links';
import { NewsPreviewSection } from '@/templates/handwerk/news-preview';
import { StatsSection } from '@/templates/handwerk/stats';
import { LogoCloudSection } from '@/templates/handwerk/logo-cloud';
import { GalleryGridSection } from '@/templates/handwerk/gallery-grid';
import { RichTextSection } from '@/templates/handwerk/rich-text';
import { HeaderBannerSection } from '@/templates/handwerk/header-banner';

const SECTION_COMPONENTS: Record<string, React.FC<{ data: Record<string, unknown>; variant?: string | null; styleVariant?: string }>> = {
  hero: HeroSection,
  uspStrip: UspStripSection,
  servicesGrid: ServicesGridSection,
  processSteps: ProcessStepsSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  ctaBand: CtaBandSection,
  contact: ContactSection,
  map: MapSection,
  serviceDetail: ServiceDetailSection,
  portfolio: PortfolioSection,
  team: TeamSection,
  ctaLinks: CtaLinksSection,
  newsPreview: NewsPreviewSection,
  newsGrid: NewsPreviewSection,
  stats: StatsSection,
  logoCloud: LogoCloudSection,
  galleryGrid: GalleryGridSection,
  richText: RichTextSection,
  headerBanner: HeaderBannerSection,
};

const SPACING: Record<string, string> = {
  none: 'py-0',
  s: 'py-6',
  m: 'py-12',
  l: 'py-20',
  xl: 'py-28',
};

const CONTAINER: Record<string, string> = {
  default: 'max-w-7xl mx-auto px-6',
  wide: 'max-w-[1400px] mx-auto px-6',
  narrow: 'max-w-3xl mx-auto px-6',
  full: 'w-full px-6',
};

export function SectionRenderer({ section, collections, styleVariant }: { section: SnapshotSection; collections?: SnapshotCollection[]; styleVariant?: string }) {
  const Component = SECTION_COMPONENTS[section.type];

  // Inject collection items into newsPreview/newsGrid sections
  if ((section.type === 'newsPreview' || section.type === 'newsGrid') && collections) {
    const key = (section.data.collectionKey as string) || 'news';
    const col = collections.find(c => c.key === key);
    if (col) {
      section = {
        ...section,
        data: {
          ...section.data,
          items: col.items.slice(0, 3).map(item => ({
            title: item.title,
            slug: item.slug,
            image: (item.data.image as string) || undefined,
            excerpt: (item.data.excerpt as string) || undefined,
            date: item.createdAt,
          })),
        },
      };
    }
  }
  if (!Component) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm">
        Unbekannter Sektionstyp: {section.type}
      </div>
    );
  }

  // Hero and CTA band are full-bleed — skip spacing/container
  const isFullBleed = section.type === 'hero';

  if (isFullBleed) {
    return (
      <section id={section.anchorId ?? undefined}>
        <Component data={section.data} variant={section.variant} styleVariant={styleVariant} />
      </section>
    );
  }

  const spacingClass = SPACING[section.spacingTop] ?? SPACING.m;
  const spacingBottomClass = SPACING[section.spacingBottom] ?? SPACING.m;
  const containerClass = CONTAINER[section.container] ?? CONTAINER.default;

  return (
    <section id={section.anchorId ?? undefined} className={`${spacingClass} ${spacingBottomClass}`}>
      <div className={containerClass}>
        <Component data={section.data} variant={section.variant} styleVariant={styleVariant} />
      </div>
    </section>
  );
}
