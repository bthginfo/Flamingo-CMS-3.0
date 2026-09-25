import assert from 'node:assert/strict';
import test from 'node:test';
import { diffInstagramPosts, type ExistingInstagramPost } from './sync-diff';
import type { IgMedia } from './graph';

const media = (id: string, updates: Partial<IgMedia> = {}): IgMedia => ({
  id,
  media_type: 'IMAGE',
  media_url: `https://cdn.example/${id}.jpg`,
  permalink: `https://instagram.com/p/${id}`,
  caption: `Caption ${id}`,
  timestamp: '2026-09-01T12:00:00.000Z',
  ...updates,
});

const existing = (post: IgMedia, position: number): ExistingInstagramPost => ({
  igMediaId: post.id,
  mediaType: post.media_type,
  mediaUrl: post.media_url,
  thumbnailUrl: post.thumbnail_url ?? null,
  permalink: post.permalink,
  caption: post.caption ?? null,
  timestamp: new Date(post.timestamp),
  position,
});

test('unchanged media produces no post writes or deletes', () => {
  const posts = [media('a'), media('b')];
  const result = diffInstagramPosts(posts.map(existing), posts);
  assert.deepEqual(result, { upserts: [], removedMediaIds: [] });
});

test('new media is inserted without rewriting unchanged posts', () => {
  const prior = [media('a'), media('b')];
  const result = diffInstagramPosts(prior.map(existing), [...prior, media('c')]);
  assert.deepEqual(result.upserts.map(post => post.igMediaId), ['c']);
  assert.equal(result.upserts[0].position, 2);
  assert.deepEqual(result.removedMediaIds, []);
});

test('caption and media URL changes update only the affected post', () => {
  const prior = [media('a'), media('b')];
  const changed = media('b', { caption: 'Updated caption', media_url: 'https://cdn.example/b-new.jpg' });
  const result = diffInstagramPosts(prior.map(existing), [prior[0], changed]);
  assert.deepEqual(result.upserts.map(post => post.igMediaId), ['b']);
  assert.equal(result.upserts[0].caption, 'Updated caption');
  assert.equal(result.upserts[0].mediaUrl, 'https://cdn.example/b-new.jpg');
  assert.deepEqual(result.removedMediaIds, []);
});

test('feed reordering updates positions while preserving media identities', () => {
  const prior = [media('a'), media('b'), media('c')];
  const result = diffInstagramPosts(prior.map(existing), [prior[2], prior[0], prior[1]]);
  assert.deepEqual(result.upserts.map(post => [post.igMediaId, post.position]), [['c', 0], ['a', 1], ['b', 2]]);
  assert.deepEqual(result.removedMediaIds, []);
});

test('posts outside the fetched feed are removed and an empty feed removes all', () => {
  const prior = [media('a'), media('b'), media('c')];
  const result = diffInstagramPosts(prior.map(existing), [prior[0]]);
  assert.deepEqual(result.upserts, []);
  assert.deepEqual(result.removedMediaIds, ['b', 'c']);
  assert.deepEqual(diffInstagramPosts(prior.map(existing), []).removedMediaIds, ['a', 'b', 'c']);
});
