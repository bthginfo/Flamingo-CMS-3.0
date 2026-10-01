import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { normalizeBlogListLimit, restoreBlogDates } from './blog';

test('cached blog timestamps retain the Date API required by JSON-LD', () => {
  const original = { createdAt: new Date('2026-09-25T10:00:00Z'), updatedAt: new Date('2026-09-26T10:00:00Z'), publishedAt: new Date('2026-09-27T10:00:00Z') };
  const decoded = JSON.parse(JSON.stringify(original)) as typeof original;
  const restored = restoreBlogDates(decoded);
  assert.equal(restored.publishedAt.toISOString(), original.publishedAt.toISOString());
  assert.equal(restored.createdAt.getTime(), original.createdAt.getTime());
  assert.equal(restored.updatedAt.getTime(), original.updatedAt.getTime());
  assert.equal(restoreBlogDates({ ...decoded, publishedAt: null }).publishedAt, null);
});

test('blog list limits are safe SQL limits and equivalent values share a cache key', () => {
  assert.equal(normalizeBlogListLimit(), undefined);
  assert.equal(normalizeBlogListLimit(3), 3);
  assert.equal(normalizeBlogListLimit(3.8), 3);
  assert.equal(normalizeBlogListLimit(-1), 0);
  assert.throws(() => normalizeBlogListLimit(NaN), RangeError);
  assert.throws(() => normalizeBlogListLimit(Infinity), RangeError);
});

test('public blog cache excludes article bodies from listing queries and CRM mutations invalidate it', () => {
  const source = readFileSync(new URL('./blog.ts', import.meta.url), 'utf8');
  assert.match(source, /content: _content, \.\.\.summaryColumns/);
  assert.match(source, /query.limit\(rowLimit\)/);
  assert.match(source, /eq\(crmBlogPosts.status, 'published'\)/);
  assert.match(source, /tags: \[PUBLIC_BLOG_CACHE_TAG\]/);
  const actions = readFileSync(new URL('../app/crm/blog/actions.ts', import.meta.url), 'utf8');
  assert.match(actions, /revalidateTag\(PUBLIC_BLOG_CACHE_TAG\)/);
});
