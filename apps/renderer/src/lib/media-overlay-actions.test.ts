import assert from 'node:assert/strict';
import test from 'node:test';
import { getContrastRatio } from './color-engine';
import {
  isMediaOverlaySectionType,
  MEDIA_OVERLAY_ACTION_DEFAULTS,
  resolveMediaOverlaySecondaryAction,
} from './media-overlay-actions';

function assertReadable(text: string, background: string) {
  for (const canvas of ['#000000', '#ffffff']) {
    assert.ok((getContrastRatio(text, background, canvas) || 0) >= 4.5, `${text} on ${background} over ${canvas}`);
  }
}

test('media-overlay secondary action resolves a complete readable default palette', () => {
  const palette = resolveMediaOverlaySecondaryAction({});
  assert.deepEqual(palette, MEDIA_OVERLAY_ACTION_DEFAULTS);
  assertReadable(palette.text, palette.background);
});

test('one-sided media background override repairs text and border atomically', () => {
  const palette = resolveMediaOverlaySecondaryAction({ background: '#ffffff' });
  assert.equal(palette.background, '#ffffff');
  assert.notEqual(palette.text, '#ffffff');
  assertReadable(palette.text, palette.background);
  assert.ok((getContrastRatio(palette.border, palette.background, '#ffffff') || 0) >= 1.5);
});

test('one-sided media text override is repaired against the default translucent surface', () => {
  const palette = resolveMediaOverlaySecondaryAction({ text: '#000000' });
  assert.equal(palette.background, MEDIA_OVERLAY_ACTION_DEFAULTS.background);
  assert.notEqual(palette.text, '#000000');
  assertReadable(palette.text, palette.background);
});

test('an unrecoverably transparent custom pair falls back as one safe unit', () => {
  const palette = resolveMediaOverlaySecondaryAction({
    background: 'transparent',
    text: '#777777',
    border: 'transparent',
  });
  assert.equal(palette.background, MEDIA_OVERLAY_ACTION_DEFAULTS.background);
  assertReadable(palette.text, palette.background);
  assert.notEqual(palette.border, 'transparent');
});

test('all renderer aliases that resolve to media compositions receive the media contract', () => {
  for (const type of [
    'hero',
    'cinematicHero',
    'immersiveCtaBanner',
    'trialSessionCta',
    'availabilityCta',
    'brandShowroom',
    'weddingFloristry',
    'heroConsulting',
  ]) {
    assert.equal(isMediaOverlaySectionType(type), true, type);
  }
  assert.equal(isMediaOverlaySectionType('faq'), false);
});
