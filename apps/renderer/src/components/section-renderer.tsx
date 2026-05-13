import type { SnapshotSection } from '@/lib/snapshot';
import { HeroSection } from '@/templates/handwerk/hero';
import { UspStripSection } from '@/templates/handwerk/usp-strip';
import { ServicesGridSection } from '@/templates/handwerk/services-grid';
import { ProcessStepsSection } from '@/templates/handwerk/process-steps';
import { TestimonialsSection } from '@/templates/handwerk/testimonials';
import { FaqSection } from '@/templates/handwerk/faq';
import { CtaBandSection } from '@/templates/handwerk/cta-band';
import { ContactSection } from '@/templates/handwerk/contact';
import { MapSection } from '@/templates/handwerk/map';

const SECTION_COMPONENTS: Record<string, React.FC<{ data: Record<string, unknown>; variant?: string | null }>> = {
  hero: HeroSection,
  uspStrip: UspStripSection,
  servicesGrid: ServicesGridSection,
  processSteps: ProcessStepsSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  ctaBand: CtaBandSection,
  contact: ContactSection,
  map: MapSection,
};

const SPACING: Record<string, string> = {
  none: 'py-0',
  s: 'py-6',
  m: 'py-12',
  l: 'py-20',
  xl: 'py-28',
};

const CONTAINER: Record<string, string> = {
  default: 'max-w-6xl mx-auto px-4',
  wide: 'max-w-7xl mx-auto px-4',
  narrow: 'max-w-3xl mx-auto px-4',
  full: 'w-full',
};

export function SectionRenderer({ section }: { section: SnapshotSection }) {
  const Component = SECTION_COMPONENTS[section.type];
  if (!Component) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm">
        Unbekannter Sektionstyp: {section.type}
      </div>
    );
  }

  const spacingClass = SPACING[section.spacingTop] ?? SPACING.m;
  const spacingBottomClass = SPACING[section.spacingBottom] ?? SPACING.m;
  const containerClass = CONTAINER[section.container] ?? CONTAINER.default;

  return (
    <section id={section.anchorId ?? undefined} className={`${spacingClass} ${spacingBottomClass}`}>
      <div className={containerClass}>
        <Component data={section.data} variant={section.variant} />
      </div>
    </section>
  );
}
