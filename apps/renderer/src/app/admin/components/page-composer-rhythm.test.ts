import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePageRhythm } from './page-composer-rhythm';

describe('page composer rhythm evaluator', () => {
  it('accepts a varied five-stage sequence', () => {
    const result = evaluatePageRhythm([
      { stage: 'opening', type: 'editorialHero' },
      { stage: 'offer', type: 'serviceTabs' },
      { stage: 'proof', type: 'socialProofBar' },
      { stage: 'story', type: 'timeline' },
      { stage: 'conversion', type: 'smartInquiry' },
    ]);

    assert.equal(result.status, 'balanced');
    assert.equal(result.score, 100);
    assert.deepEqual(result.issues, []);
  });

  it('reports missing stages without mutating the supplied sequence', () => {
    const input = [
      { stage: 'opening' as const, type: 'hero' },
      { stage: 'conversion' as const, type: 'contact' },
    ];
    const snapshot = structuredClone(input);
    const result = evaluatePageRhythm(input);

    assert.equal(result.status, 'review');
    assert.equal(result.issues[0]?.id, 'missing-stage');
    assert.deepEqual(result.issues[0]?.stages, ['offer', 'proof', 'story']);
    assert.deepEqual(input, snapshot);
  });

  it('detects a non-deterministic stage order and duplicate section', () => {
    const result = evaluatePageRhythm([
      { stage: 'opening', type: 'hero' },
      { stage: 'proof', type: 'proofWall' },
      { stage: 'offer', type: 'proofWall' },
      { stage: 'story', type: 'timeline' },
      { stage: 'conversion', type: 'contact' },
    ]);

    assert.deepEqual(result.issues.slice(0, 2).map((issue) => issue.id), ['stage-order', 'duplicate-section']);
    assert.ok(result.score < 100);
  });

  it('flags consecutive immersive sections', () => {
    const result = evaluatePageRhythm([
      { stage: 'opening', type: 'cinematicHero' },
      { stage: 'offer', type: 'brandShowroom' },
      { stage: 'proof', type: 'socialProofBar' },
      { stage: 'story', type: 'timeline' },
      { stage: 'conversion', type: 'contact' },
    ]);

    assert.ok(result.issues.some((issue) => issue.id === 'immersive-clash'));
  });

  it('flags three card-driven stages in a row', () => {
    const result = evaluatePageRhythm([
      { stage: 'opening', type: 'hero' },
      { stage: 'offer', type: 'servicesGrid' },
      { stage: 'proof', type: 'proofWall' },
      { stage: 'story', type: 'signatureGrid' },
      { stage: 'conversion', type: 'contact' },
    ]);

    assert.ok(result.issues.some((issue) => issue.id === 'card-run'));
  });
});
