import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { composeSeoTitle, dedupeSeoTitle, isGenericSeoTitle } from './seo-title';

describe('SEO title composition', () => {
  it('does not append the same brand twice', () => {
    assert.equal(composeSeoTitle({
      contentTitle: 'Leistungen | Bergmann & Partner',
      titleTemplate: '%s | Bergmann & Partner',
    }), 'Leistungen | Bergmann & Partner');
  });

  it('keeps a title that is exactly the brand only once', () => {
    assert.equal(composeSeoTitle({
      contentTitle: 'Bergmann & Partner',
      titleTemplate: '%s | Bergmann & Partner',
    }), 'Bergmann & Partner');
  });

  it('uses the configured default for generic home titles', () => {
    assert.equal(composeSeoTitle({
      contentTitle: 'Startseite',
      defaultTitle: 'Karwendel Kompass | Mittenwald',
      titleTemplate: '%s | Karwendel Kompass',
    }), 'Karwendel Kompass | Mittenwald');
  });

  it('normalizes repeated segments case-insensitively', () => {
    assert.equal(dedupeSeoTitle('Kontakt | ACME — acme'), 'Kontakt | ACME');
    assert.equal(isGenericSeoTitle('Flamingo CMS'), true);
    assert.equal(isGenericSeoTitle('Zimmer in Seefeld'), false);
  });
});
