import { IconRows as KitIconRows } from '../shared/industry-kit';

export type { HeaderData } from '../shared/industry-kit';
export { SectionHeader, CtaButton, ImageCard, baseHeader, asButton, asList } from '../shared/industry-kit';

export function IconRows({ items }: { items: unknown }) {
  return <KitIconRows items={items} iconFallback="map-pin" />;
}
