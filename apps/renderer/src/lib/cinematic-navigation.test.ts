import assert from 'node:assert/strict';
import test from 'node:test';
import { focusAfterCinematicStory } from './cinematic-navigation';

test('skipping a story transfers focus beyond it and respects the motion preference', () => {
  const priorWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const priorElement = Object.getOwnPropertyDescriptor(globalThis, 'HTMLElement');
  const calls: unknown[] = [];
  class Element {
    nextElementSibling: Element | null = null;
    heading: Element | null = null;
    isSection = false;
    bounds = { top: 300, bottom: 600 };
    attributes = new Map<string, string>();
    closest() { return this; }
    matches() { return this.isSection; }
    querySelector() { return this.heading; }
    hasAttribute(key: string) { return this.attributes.has(key); }
    setAttribute(key: string, value: string) { this.attributes.set(key, value); }
    focus(options: unknown) { calls.push({ focus: this, options }); }
    getBoundingClientRect() { return this.bounds; }
  }
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: Element });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { scrollY: 100, scrollTo: (options: unknown) => calls.push(options) } });
  try {
    const story = new Element(), style = new Element(), next = new Element(), heading = new Element();
    heading.bounds = { top: 800, bottom: 850 };
    story.nextElementSibling = style;
    style.nextElementSibling = next;
    next.isSection = true;
    next.heading = heading;
    assert.equal(focusAfterCinematicStory(story as unknown as HTMLElement, true), true);
    assert.equal(heading.attributes.get('tabindex'), '-1');
    assert.deepEqual(calls, [{ focus: heading, options: { preventScroll: true } }, { top: 788, behavior: 'auto' }]);
    calls.length = 0;
    focusAfterCinematicStory(story as unknown as HTMLElement, false);
    assert.deepEqual(calls[1], { top: 788, behavior: 'smooth' });
    // Compact content now begins only 48px after the story. The old 112px
    // heading offset would leave 64px of the skipped story visible.
    story.bounds = { top: 0, bottom: 1000 };
    heading.bounds = { top: 1048, bottom: 1098 };
    calls.length = 0;
    focusAfterCinematicStory(story as unknown as HTMLElement, false);
    assert.deepEqual(calls[1], { top: 1100, behavior: 'smooth' });
    assert.equal(focusAfterCinematicStory(new Element() as unknown as HTMLElement, false), false);
  } finally {
    if (priorWindow) Object.defineProperty(globalThis, 'window', priorWindow); else Reflect.deleteProperty(globalThis, 'window');
    if (priorElement) Object.defineProperty(globalThis, 'HTMLElement', priorElement); else Reflect.deleteProperty(globalThis, 'HTMLElement');
  }
});
