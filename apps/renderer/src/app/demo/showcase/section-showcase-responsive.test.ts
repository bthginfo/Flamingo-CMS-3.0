import assert from 'node:assert/strict';
import test from 'node:test';
import { fitPreviewScale, viewportForHostWidth } from './section-showcase-responsive';

test('maps the host width to the intended showcase device', () => {
  assert.equal(viewportForHostWidth(390), 'mobile');
  assert.equal(viewportForHostWidth(639), 'mobile');
  assert.equal(viewportForHostWidth(640), 'tablet');
  assert.equal(viewportForHostWidth(1023), 'tablet');
  assert.equal(viewportForHostWidth(1024), 'desktop');
  assert.equal(viewportForHostWidth(1440), 'desktop');
});

test('fits a simulated canvas without ever upscaling it', () => {
  assert.equal(fitPreviewScale(1280, 1280), 1);
  assert.equal(fitPreviewScale(1600, 1280), 1);
  assert.equal(fitPreviewScale(320, 1280), 0.25);
  assert.equal(fitPreviewScale(390, 780), 0.5);
});

test('keeps a safe deterministic scale until the stage can be measured', () => {
  assert.equal(fitPreviewScale(0, 1280), 1);
  assert.equal(fitPreviewScale(Number.NaN, 1280), 1);
  assert.equal(fitPreviewScale(390, 0), 1);
});
