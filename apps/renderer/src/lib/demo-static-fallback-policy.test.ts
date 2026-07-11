import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEMO_UNAVAILABLE_METADATA,
  getDemoStaticFallbackPolicy,
} from './demo-static-fallback-policy';

describe('demo static fallback policy', () => {
  it('defaults to disabled outside production', () => {
    assert.deepEqual(getDemoStaticFallbackPolicy({ NODE_ENV: 'development' }), {
      enabled: false,
      reason: 'not-opted-in',
    });
    assert.deepEqual(getDemoStaticFallbackPolicy({ NODE_ENV: 'test' }), {
      enabled: false,
      reason: 'not-opted-in',
    });
  });

  it('only accepts the exact explicit opt-in value', () => {
    assert.deepEqual(
      getDemoStaticFallbackPolicy({
        NODE_ENV: 'development',
        DEMO_STATIC_FALLBACK: '1',
      }),
      { enabled: true, reason: 'explicit-development-opt-in' },
    );

    for (const value of ['0', 'true', 'yes', ' 1', '1 ']) {
      assert.equal(
        getDemoStaticFallbackPolicy({
          NODE_ENV: 'development',
          DEMO_STATIC_FALLBACK: value,
        }).enabled,
        false,
      );
    }
  });

  it('never enables legacy fixtures in production, even when opted in', () => {
    assert.deepEqual(
      getDemoStaticFallbackPolicy({
        NODE_ENV: 'production',
        DEMO_STATIC_FALLBACK: '1',
      }),
      { enabled: false, reason: 'blocked-in-production' },
    );
  });

  it('marks unavailable demo metadata as non-indexable', () => {
    assert.deepEqual(DEMO_UNAVAILABLE_METADATA.robots, {
      index: false,
      follow: false,
    });
    assert.equal('description' in DEMO_UNAVAILABLE_METADATA, false);
  });
});
