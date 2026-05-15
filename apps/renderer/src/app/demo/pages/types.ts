import type { SnapshotSection } from '@/lib/snapshot';

export interface DemoPage {
  slug: string;
  title: string;
  sections: SnapshotSection[];
}

export interface DemoSite {
  industry: string;        // DB key: 'tradesman', 'hotel', etc.
  industryKey: string;     // URL key: 'handwerk', 'hotel', etc.
  defaultStyle: string;
  pages: DemoPage[];
}

const B = { variant: null, visible: true, container: 'default' as const, spacingTop: 'l' as const, spacingBottom: 'l' as const, anchorId: null };
const HERO = { ...B, container: 'full' as const, spacingTop: 'none' as const, spacingBottom: 'none' as const };

export { B, HERO };
