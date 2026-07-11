import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CORE_REQUIRED_PAGE_RULES, evaluateSitePagePolicy, getSitePagePolicy } from './site-page-policy';

describe('site page policy', () => {
  it('keeps the universal required set minimal', () => {
    assert.deepEqual(CORE_REQUIRED_PAGE_RULES.map(entry => entry.slug), [
      'startseite', 'kontakt', 'impressum', 'datenschutz',
    ]);
    assert.ok(!CORE_REQUIRED_PAGE_RULES.some(entry => entry.slug === 'leistungen' || entry.slug === 'ueber-uns'));
  });

  it('uses club-specific recommendations without making service pages mandatory', () => {
    const policy = getSitePagePolicy({ industry: 'verein' });
    assert.deepEqual(policy.required.map(entry => entry.slug), [
      'startseite', 'kontakt', 'impressum', 'datenschutz',
    ]);
    assert.deepEqual(policy.recommended.map(entry => entry.slug), ['spielplan', 'verein']);

    const evaluated = evaluateSitePagePolicy(
      ['startseite', 'spielplan', 'verein', 'kontakt', 'impressum', 'datenschutz'],
      { industry: 'eishockey' },
    );
    assert.deepEqual(evaluated.missingRequired, []);
    assert.deepEqual(evaluated.missingRecommended, []);
  });

  it('accepts legitimate alternative slugs', () => {
    const evaluated = evaluateSitePagePolicy(
      ['home', 'kontakt', 'impressum', 'datenschutz', 'produkte', 'cart'],
      { industry: 'ecommerce' },
    );
    assert.deepEqual(evaluated.missingRequired, []);
    assert.deepEqual(evaluated.missingRecommended, []);
  });

  it('adds shop recommendations by capability without coupling to an industry renderer', () => {
    const policy = getSitePagePolicy({ industry: 'consulting', capabilities: ['shop'] });
    const slugs = policy.recommended.map(entry => entry.slug);
    assert.ok(slugs.includes('shop'));
    assert.ok(slugs.includes('warenkorb'));
    assert.equal(slugs.filter(slug => slug === 'shop').length, 1);
  });
});
