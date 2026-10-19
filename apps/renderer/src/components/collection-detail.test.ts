import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CollectionDetail } from './collection-detail';
import type { SnapshotCollection, SnapshotCollectionItem, SnapshotSection } from '@/lib/snapshot';

const section = (id: string, type: string, data: Record<string, unknown> = {}, visible = true): SnapshotSection => ({
  id, type, variant: null, visible, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null, data,
});

function render(sections?: SnapshotSection[]) {
  (globalThis as typeof globalThis & { React: typeof React }).React = React;
  const item: SnapshotCollectionItem = {
    id: 'detail', slug: 'detail', title: 'Detail', priority: 0, createdAt: '', updatedAt: '', data: sections ? { sections } : {},
  };
  const collection: SnapshotCollection = { id: 'projects', key: 'projekte', label: 'Projekte', schema: null, settings: null, items: [item] };
  return renderToStaticMarkup(React.createElement(CollectionDetail, { item, collection, backHrefPrefix: '/tenant', linkPrefix: '/tenant' }));
}

test('real collection wrapper identifies only its first visible content hero despite preceding back navigation', () => {
  for (const layout of ['studio', 'memorial']) {
    const html = render([
      section('hidden-draft', 'richText', {}, false),
      section('opening', 'editorialHero', { layout, headline: 'Opening' }),
      section('body', 'richText', { content: '<p>Body.</p>' }),
      section('later-hero', 'editorialHero', { layout, headline: 'Later' }),
    ]);
    assert.match(html, /<div class="relative" data-collection-content-hero="">/);
    assert.doesNotMatch(html, /data-section-id="hidden-draft"/);
    // These real production siblings precede the first rendered section, so
    // the direct main/first-child assumption must not return.
    assert.ok(html.indexOf('<span>Zurück</span>') < html.indexOf('data-section-id="opening"'));
    assert.equal([...html.matchAll(/data-collection-content-hero=/g)].length, 1);
    assert.match(html, /data-section-id="later-hero"/);
  }
});

test('a later editorial hero and legacy collection heroes do not opt into opening clearance', () => {
  const editorial = section('editorial', 'editorialHero', { layout: 'studio', headline: 'Editorial' });
  assert.doesNotMatch(render([section('body', 'richText', { content: '<p>Body.</p>' }), editorial]), /data-collection-content-hero=/);
  assert.doesNotMatch(render([editorial, section('legacy', 'collectionHero', { headline: 'Legacy' })]), /data-collection-content-hero=/);
  assert.doesNotMatch(render(), /data-collection-content-hero=/);
});

test('floating return control uses the configured button foreground/background pair for text and icon', () => {
  const html = render([section('opening', 'editorialHero', { layout: 'studio', headline: 'Opening' })]);
  const link = html.match(/<a\b[^>]*class="fixed left-4[^>]*>[\s\S]*?<\/a>/)?.[0] || '';
  assert.match(link, /href="\/tenant\/projekte"/);
  assert.ok(link.includes('bg-[var(--token-btn-bg,#fff)]'));
  assert.ok(link.includes('text-[color:var(--token-btn-text,#111827)]'));
  // A card token inside a rounded control's class would also trigger the
  // theme's broad Card selector and repaint its button background.
  assert.doesNotMatch(link, /--token-card-/);
  assert.match(link, /<svg\b[^>]*stroke="currentColor"/);
  assert.match(link, /<span>Zurück<\/span>/);
});
