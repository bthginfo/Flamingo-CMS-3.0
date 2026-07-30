import crypto from 'crypto';

export type CollectionOverviewSection = {
  id?: string;
  type: string;
  definitionKey?: string;
  schemaVersion?: number;
  data?: Record<string, unknown>;
  variant?: string | null;
  visible?: boolean;
  container?: string;
  spacingTop?: string;
  spacingBottom?: string;
  anchorId?: string | null;
  styleOverrides?: Record<string, unknown>;
};

export type CollectionOverviewPageInput = {
  slug: string;
  title: string;
  sections: CollectionOverviewSection[];
};

export type CollectionOverviewResult =
  | { status: 'created'; id: string; slug: string; url: string }
  | { status: 'existing'; id: string; slug: string; url: string }
  | { status: 'skipped'; slug: null; url: null };

export interface CollectionOverviewStore {
  findPageBySlug(tenantId: string, slug: string): Promise<{ id: string; slug: string } | null>;
  insertPage(input: {
    id: string;
    tenantId: string;
    slug: string;
    title: string;
  }): Promise<boolean>;
  insertSections(
    tenantId: string,
    pageId: string,
    sections: CollectionOverviewSection[],
  ): Promise<void>;
  deletePage(tenantId: string, pageId: string): Promise<void>;
}

export function defaultCollectionOverviewPage(
  key: string,
  label: string,
): CollectionOverviewPageInput {
  return {
    slug: key,
    title: label,
    sections: [
      {
        type: 'collectionHero',
        container: 'wide',
        spacingTop: 'l',
        spacingBottom: 'l',
        data: {
          category: 'Übersicht',
          headline: label,
          subline: `Alle Inhalte aus ${label} an einem Ort.`,
        },
      },
      {
        type: 'collectionList',
        container: 'default',
        spacingTop: 'l',
        spacingBottom: 'xl',
        data: {
          headline: label,
          collectionKey: key,
          collectionBasePath: `/c/${key}`,
          sortBy: 'date-desc',
          columns: 3,
          showImage: true,
          showDate: true,
          showExcerpt: true,
          showSortControls: true,
        },
      },
    ],
  };
}

export async function ensureCollectionOverviewPage(input: {
  store: CollectionOverviewStore;
  tenantId: string;
  page: CollectionOverviewPageInput;
  createOverviewPage?: boolean;
}): Promise<CollectionOverviewResult> {
  if (input.createOverviewPage === false) {
    return { status: 'skipped', slug: null, url: null };
  }

  const existing = await input.store.findPageBySlug(input.tenantId, input.page.slug);
  if (existing) {
    return {
      status: 'existing',
      id: existing.id,
      slug: existing.slug,
      url: `/${existing.slug}`,
    };
  }

  const pageId = crypto.randomUUID();
  const inserted = await input.store.insertPage({
    id: pageId,
    tenantId: input.tenantId,
    slug: input.page.slug,
    title: input.page.title,
  });
  if (!inserted) {
    const winner = await input.store.findPageBySlug(input.tenantId, input.page.slug);
    if (!winner) {
      throw new Error(`Overview page "${input.page.slug}" was created concurrently but could not be read.`);
    }
    return {
      status: 'existing',
      id: winner.id,
      slug: winner.slug,
      url: `/${winner.slug}`,
    };
  }

  try {
    await input.store.insertSections(input.tenantId, pageId, input.page.sections);
  } catch (error) {
    await input.store.deletePage(input.tenantId, pageId).catch(() => {});
    throw error;
  }

  return {
    status: 'created',
    id: pageId,
    slug: input.page.slug,
    url: `/${input.page.slug}`,
  };
}
