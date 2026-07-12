import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  resolveHydrationSafeReducedMotion,
  useHydrationSafeReducedMotion,
} from './use-hydration-safe-reduced-motion';

test('the hook emits the non-reduced hydration baseline during SSR', () => {
  function ReducedMotionProbe() {
    const reduceMotion = useHydrationSafeReducedMotion();
    return createElement('span', { 'data-reduce-motion': String(reduceMotion) });
  }

  assert.equal(
    renderToStaticMarkup(createElement(ReducedMotionProbe)),
    '<span data-reduce-motion="false"></span>',
  );
});

test('reduced-motion branching stays identical during SSR and the hydration frame', () => {
  assert.equal(resolveHydrationSafeReducedMotion(false, null), false);
  assert.equal(resolveHydrationSafeReducedMotion(false, false), false);
  assert.equal(resolveHydrationSafeReducedMotion(false, true), false);
});

test('the user preference takes effect after mount', () => {
  assert.equal(resolveHydrationSafeReducedMotion(true, false), false);
  assert.equal(resolveHydrationSafeReducedMotion(true, true), true);
});
