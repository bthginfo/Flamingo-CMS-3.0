import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  resolveHydrationSafeReducedMotion,
  getReducedMotionSnapshot,
  subscribeReducedMotion,
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

test('live preference changes notify the same subscription in both directions and clean up', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let reduced = true;
  const listeners = new Set<() => void>();
  const media = {
    get matches() { return reduced; },
    addEventListener: (event: string, listener: () => void) => { assert.equal(event, 'change'); listeners.add(listener); },
    removeEventListener: (event: string, listener: () => void) => { assert.equal(event, 'change'); listeners.delete(listener); },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { matchMedia: (query: string) => { assert.equal(query, '(prefers-reduced-motion: reduce)'); return media; } } });
  try {
    const snapshots: boolean[] = [];
    const unsubscribe = subscribeReducedMotion(() => snapshots.push(getReducedMotionSnapshot()));
    assert.equal(getReducedMotionSnapshot(), true);
    reduced = false;
    listeners.forEach(listener => listener());
    reduced = true;
    listeners.forEach(listener => listener());
    assert.deepEqual(snapshots, [false, true]);
    assert.equal(listeners.size, 1);
    function Probe() { return createElement('span', { 'data-reduce-motion': String(useHydrationSafeReducedMotion()) }); }
    assert.equal(renderToStaticMarkup(createElement(Probe)), '<span data-reduce-motion="false"></span>', 'SSR remains the hydration baseline even when a browser preference exists');
    unsubscribe();
    assert.equal(listeners.size, 0);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
