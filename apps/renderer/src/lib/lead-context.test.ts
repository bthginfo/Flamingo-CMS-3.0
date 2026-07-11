import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildLeadContextHref, parseLeadContext, resolveLeadContext } from './lead-context';

describe('lead context hand-off', () => {
  it('adds a calculator summary to an internal anchor without losing its hash', () => {
    const href = buildLeadContextHref('#kontakt', {
      source: 'priceCalculator',
      summary: 'Premium · 12.400 €',
    });
    assert.match(href, /^\?lead_source=priceCalculator&lead_summary=/);
    assert.match(href, /#kontakt$/);
    assert.deepEqual(parseLeadContext(href.slice(0, href.indexOf('#'))), {
      source: 'priceCalculator',
      summary: 'Premium · 12.400 €',
    });
  });

  it('preserves existing query parameters and never decorates external links', () => {
    const href = buildLeadContextHref('/kontakt?campaign=sommer#formular', {
      source: 'consultationBooking',
      summary: 'Beratung: Strategie',
    });
    assert.match(href, /^\/kontakt\?campaign=sommer&lead_source=/);
    assert.equal(buildLeadContextHref('https://example.com/book', {
      source: 'consultationBooking',
      summary: 'Beratung: Strategie',
    }), 'https://example.com/book');
  });

  it('falls back to a valid session value when query context is absent', () => {
    assert.deepEqual(parseLeadContext('', JSON.stringify({
      source: 'priceCalculator',
      summary: 'Website · 4.500 €',
    })), {
      source: 'priceCalculator',
      summary: 'Website · 4.500 €',
    });
    assert.equal(parseLeadContext('', '{broken'), null);
  });

  it('prefers direct section context and falls back when it is null', () => {
    const stored = { source: 'priceCalculator', summary: 'Gespeicherte Auswahl' };
    const direct = { source: 'smartInquiry', summary: 'Ziel: Neue Website' };

    assert.deepEqual(resolveLeadContext(direct, stored), direct);
    assert.deepEqual(resolveLeadContext(null, stored), stored);
  });
});
