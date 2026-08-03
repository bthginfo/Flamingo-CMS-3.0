import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const headerSource = readFileSync(new URL('../components/site-header.tsx', import.meta.url), 'utf8');

function mobileContactSource() {
  const start = headerSource.indexOf('function MobileTopBarContact');
  const end = headerSource.indexOf('\nexport function SiteHeader', start);
  assert.ok(start >= 0 && end > start, 'mobile topbar contact component should be present');
  return headerSource.slice(start, end);
}

test('mobile topbar renders the complete preferred contact as a comfortable tap target', () => {
  const source = mobileContactSource();

  assert.match(source, /const value = email \|\| phone/);
  assert.match(source, /href=\{href\}/);
  assert.match(source, /min-h-10/);
  assert.match(source, /sm:hidden/);
  assert.match(source, /whitespace-normal/);
  assert.match(source, /\[overflow-wrap:anywhere\]/);
  assert.doesNotMatch(source, /truncate|max-w-/);
});

test('mobile topbar hides secondary messaging when a primary contact is available', () => {
  assert.match(headerSource, /\(contact\.email \|\| contact\.phone\) \? 'hidden' : 'flex'/);
  assert.equal(headerSource.match(/<MobileTopBarContact contact=\{contact\} \/>/g)?.length, 2);
});

test('topbar navigation, spacer, and hide motion share the measured wrapped height', () => {
  assert.match(headerSource, /const \[topBarHeight, setTopBarHeight\] = useState\(40\)/);
  assert.match(headerSource, /Math\.max\(40, Math\.ceil\(element\.getBoundingClientRect\(\)\.height\)\)/);
  assert.match(headerSource, /new ResizeObserver\(updateHeight\)/);
  assert.match(headerSource, /const topBarOffset = topBarEnabled \? topBarHeight : 0/);
  assert.match(headerSource, /animate=\{\{ y: topBarHidden \? -topBarOffset : 0/);
  assert.match(headerSource, /style=\{\{ top: scrolled \|\| !topBarEnabled \? 0 : topBarOffset \}\}/);
  assert.match(headerSource, /aria-hidden="true" style=\{\{ height: topBarOffset \}\}/);
  assert.doesNotMatch(headerSource, /topBarHidden \? -40|top-10|<div className="h-10"/);
});
