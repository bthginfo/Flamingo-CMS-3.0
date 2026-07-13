import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { groupContentHealthIssues, normalizeStoredContentAudit, presentContentHealthIssue, scanExplicitDateFreshness, scanSpecialOpeningDateFreshness, type ContentHealthIssue } from './content-health';

describe('content health', () => {
  it('finds past explicit dates but never guesses dates from prose or unrelated keys', () => {
    const issues = scanExplicitDateFreshness({
      eventDate: '2026-02-01',
      nested: { validUntil: '2026-03-01T12:00:00Z', createdAt: '2020-01-01', text: 'Angebot bis 1. Mai 2020' },
      future: { publishedUntil: '2027-01-01' },
    }, { baseLocation: 'pages[startseite].sections[2].data', today: '2026-07-13' });
    assert.deepEqual(issues.map(issue => issue.location), [
      'pages[startseite].sections[2].data.eventDate',
      'pages[startseite].sections[2].data.nested.validUntil',
    ]);
    assert.ok(issues.every(issue => issue.severity === 'warning'));
  });

  it('scans date only for special opening rows', () => {
    const issues = scanSpecialOpeningDateFreshness([
      { type: 'regular', date: '2020-01-01' },
      { type: 'special', date: '2026-01-01' },
      { type: 'special', date: '2027-01-01' },
    ], '2026-07-13');
    assert.equal(issues.length, 1);
    assert.equal(issues[0].location, 'openingHours[1].date');
  });

  it('groups hundreds of issues by deterministic edit target', () => {
    const issues: ContentHealthIssue[] = [
      { source: 'content', severity: 'error', message: 'Headline fehlt', location: 'pages[startseite].sections[1]' },
      { source: 'color', severity: 'warning', message: 'Kontrast', location: 'startseite → sections[1]' },
      { source: 'freshness', severity: 'warning', message: 'Datum abgelaufen', location: 'collections[events].items[sommerfest].data.eventDate' },
      { source: 'content', severity: 'warning', message: 'Profil', location: 'siteProfile.audience.primary' },
    ];
    const groups = groupContentHealthIssues(issues, {
      pages: [{ id: 'page-1', slug: 'startseite', title: 'Startseite' }],
      collectionItems: [{ id: 'item-1', collectionKey: 'events', slug: 'sommerfest', title: 'Sommerfest' }],
    });
    assert.equal(groups[0].href, '/admin/pages/page-1');
    assert.equal(groups[0].issues.length, 2);
    assert.ok(groups.some(group => group.href === '/admin/collections/events/item-1'));
    assert.ok(groups.some(group => group.href === '/admin/business-profile'));
  });

  it('preserves freshness from the GET audit through the Content Health report normalizer', () => {
    const validateSource = readFileSync(new URL('../app/api/v1/content/validate/route.ts', import.meta.url), 'utf8');
    const reportSource = readFileSync(new URL('../app/admin/content-health/actions.ts', import.meta.url), 'utf8');
    assert.match(validateSource, /contentIssues\.push\(\.\.\.scanExplicitDateFreshness/);
    assert.match(validateSource, /contentIssues\.push\(\.\.\.scanSpecialOpeningDateFreshness/);
    assert.match(reportSource, /runStoredContentAudit\(/);
    assert.match(reportSource, /normalizeStoredContentAudit\(await response\.json\(\)\)/);

    const audit = normalizeStoredContentAudit({
      readyToPublish: true,
      summary: { contentWarnings: 1 },
      contentIssues: [{
        source: 'freshness', severity: 'warning', code: 'freshness.expired_date',
        location: 'pages[startseite].sections[0].data.validUntil', message: 'Datum abgelaufen',
      }],
      colorIssues: [],
    });
    assert.equal(audit.issues[0]?.source, 'freshness');
    assert.equal(audit.freshnessWarnings, 1);
    assert.equal(audit.readyToPublish, true);
  });

  it('turns technical validator output into short German tasks', () => {
    assert.deepEqual(presentContentHealthIssue({
      source: 'content', severity: 'warning', code: 'budget.too_short',
      location: 'pages[startseite].sections[1].data.headline',
      message: 'headline has 9 characters; recommended minimum is 12.',
    }), {
      title: 'Überschrift ist noch sehr kurz',
      action: 'Ergänzen Sie einen hilfreichen, konkreten Kontext für Ihre Besucher.',
    });
    assert.equal(presentContentHealthIssue({
      source: 'color', severity: 'warning', code: 'LOW_CONTRAST', message: 'WCAG 2.1 ratio 2.1',
    }).title, 'Text ist schwer lesbar');
  });
});
