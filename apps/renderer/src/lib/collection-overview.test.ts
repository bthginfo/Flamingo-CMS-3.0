import assert from 'node:assert/strict';
import test from 'node:test';
import {
  defaultCollectionOverviewPage,
  ensureCollectionOverviewPage,
  type CollectionOverviewPageInput,
  type CollectionOverviewStore,
} from './collection-overview';

class MemoryStore implements CollectionOverviewStore {
  pages = new Map<string, { id: string; slug: string; title: string }>();
  sections = new Map<string, CollectionOverviewPageInput['sections']>();

  async findPageBySlug(_tenantId: string, slug: string) {
    return this.pages.get(slug) ?? null;
  }

  async insertPage(input: { id: string; tenantId: string; slug: string; title: string }) {
    if (this.pages.has(input.slug)) return false;
    this.pages.set(input.slug, { id: input.id, slug: input.slug, title: input.title });
    return true;
  }

  async insertSections(
    _tenantId: string,
    pageId: string,
    sections: CollectionOverviewPageInput['sections'],
  ) {
    this.sections.set(pageId, sections);
  }

  async deletePage(_tenantId: string, pageId: string) {
    for (const [slug, page] of this.pages) {
      if (page.id === pageId) this.pages.delete(slug);
    }
    this.sections.delete(pageId);
  }
}

test('builds a complete editable default overview page', () => {
  const page = defaultCollectionOverviewPage('news', 'Aktuelles');
  assert.equal(page.slug, 'news');
  assert.equal(page.title, 'Aktuelles');
  assert.deepEqual(page.sections.map(section => section.type), ['collectionHero', 'collectionList']);
  assert.equal(page.sections[1].data?.collectionKey, 'news');
  assert.equal(page.sections[1].data?.collectionBasePath, '/c/news');
  assert.equal(page.sections[1].data?.showImage, true);
  assert.equal(page.sections[1].data?.showExcerpt, true);
  assert.equal(page.sections[1].data?.showSortControls, true);
});

test('creates a custom overview page with custom slug, title and sections', async () => {
  const store = new MemoryStore();
  const page: CollectionOverviewPageInput = {
    slug: 'aktuelles',
    title: 'Meldungen',
    sections: [{ type: 'newsGrid', data: { collectionKey: 'news' } }],
  };
  const result = await ensureCollectionOverviewPage({ store, tenantId: 'tenant-1', page });

  assert.equal(result.status, 'created');
  assert.equal(result.slug, 'aktuelles');
  assert.equal(store.pages.get('aktuelles')?.title, 'Meldungen');
  assert.deepEqual(store.sections.get(result.id), page.sections);
});

test('supports explicit overview opt-out', async () => {
  const store = new MemoryStore();
  const result = await ensureCollectionOverviewPage({
    store,
    tenantId: 'tenant-1',
    page: defaultCollectionOverviewPage('internal', 'Internal'),
    createOverviewPage: false,
  });

  assert.deepEqual(result, { status: 'skipped', slug: null, url: null });
  assert.equal(store.pages.size, 0);
});

test('repairs a missing overview for an existing collection', async () => {
  const store = new MemoryStore();
  const page = defaultCollectionOverviewPage('projekte', 'Projekte');
  const result = await ensureCollectionOverviewPage({ store, tenantId: 'tenant-1', page });

  assert.equal(result.status, 'created');
  assert.equal(store.pages.has('projekte'), true);
  assert.equal(store.sections.get(result.id)?.[1].data?.collectionKey, 'projekte');
});

test('never overwrites an existing overview page', async () => {
  const store = new MemoryStore();
  store.pages.set('news', { id: 'existing-page', slug: 'news', title: 'Redaktionell kuratiert' });
  store.sections.set('existing-page', [{ type: 'editorialHero', data: { headline: 'Bestehend' } }]);

  const result = await ensureCollectionOverviewPage({
    store,
    tenantId: 'tenant-1',
    page: defaultCollectionOverviewPage('news', 'News'),
  });

  assert.deepEqual(result, {
    status: 'existing',
    id: 'existing-page',
    slug: 'news',
    url: '/news',
  });
  assert.equal(store.pages.get('news')?.title, 'Redaktionell kuratiert');
  assert.deepEqual(store.sections.get('existing-page'), [
    { type: 'editorialHero', data: { headline: 'Bestehend' } },
  ]);
});

test('a concurrent create resolves to the winning overview instead of failing', async () => {
  const store = new MemoryStore();
  const originalInsert = store.insertPage.bind(store);
  store.insertPage = async input => {
    store.pages.set(input.slug, {
      id: 'concurrent-winner',
      slug: input.slug,
      title: 'Parallel erstellt',
    });
    return false;
  };

  const result = await ensureCollectionOverviewPage({
    store,
    tenantId: 'tenant-1',
    page: defaultCollectionOverviewPage('news', 'News'),
  });

  assert.deepEqual(result, {
    status: 'existing',
    id: 'concurrent-winner',
    slug: 'news',
    url: '/news',
  });
  store.insertPage = originalInsert;
});
