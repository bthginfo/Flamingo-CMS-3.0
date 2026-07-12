import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CONTACT_FORM_FIELDS,
  isHoneypotFilled,
  mergeContactFormFields,
  normalizeContactFormFields,
  validateContactAutoResponse,
  validateContactFormFields,
  validateContactSubmission,
} from './contact-form';

describe('contact form field contract', () => {
  it('repairs legacy configurations and de-duplicates semantic fields', () => {
    const fields = normalizeContactFormFields([
      { name: 'EMAIL', label: 'Mail', type: 'text' },
      { name: 'email', label: 'Doppelt', type: 'email', required: true },
      { name: 'project', label: 'Projekt', type: 'textarea' },
    ]);

    assert.equal(fields.filter(field => field.name === 'email').length, 1);
    assert.deepEqual(fields.find(field => field.name === 'email'), {
      name: 'email', label: 'Mail', type: 'email', required: true,
    });
    assert.equal(fields.filter(field => field.name === 'name').length, 1);
  });

  it('uses the complete default contract when no configuration exists', () => {
    assert.deepEqual(
      normalizeContactFormFields(undefined).map(field => field.name),
      ['name', 'email', 'phone', 'message'],
    );
    assert.deepEqual(
      normalizeContactFormFields([]).map(field => field.name),
      ['name', 'email', 'phone', 'message'],
    );
  });

  it('rejects configurations that can never satisfy the contact API', () => {
    const result = validateContactFormFields([
      { name: 'name', label: 'Name', type: 'text', required: false },
      { name: 'email', label: 'E-Mail', type: 'text', required: true },
      { name: 'EMAIL', label: 'Doppelt', type: 'email', required: true },
    ]);

    assert.equal(result.success, false);
    if (result.success) return;
    assert.match(result.errors.join(' '), /mehrfach/);
    assert.match(result.errors.join(' '), /name/);
    assert.match(result.errors.join(' '), /email/);
  });

  it('accepts the canonical default contract', () => {
    const result = validateContactFormFields(DEFAULT_CONTACT_FORM_FIELDS);
    assert.equal(result.success, true);
  });

  it('keeps server-required fields while allowing section-specific additions', () => {
    const serverFields = [
      ...DEFAULT_CONTACT_FORM_FIELDS.slice(0, 2),
      { name: 'budget', label: 'Budget', type: 'select' as const, required: true, options: ['ab 10.000 €'] },
    ];
    const sectionFields = [
      ...DEFAULT_CONTACT_FORM_FIELDS.slice(0, 2),
      { name: 'timeline', label: 'Zeitraum', type: 'text' as const },
    ];

    const merged = mergeContactFormFields(serverFields, sectionFields);
    assert.deepEqual(merged.map(field => field.name), ['name', 'email', 'budget', 'timeline']);
    assert.equal(merged.find(field => field.name === 'budget')?.required, true);

    const bypassAttempt = validateContactSubmission({
      name: 'Ada',
      email: 'ada@example.com',
      timeline: 'Q4',
    }, merged);
    assert.equal(bypassAttempt.success, false);
    if (!bypassAttempt.success) assert.match(bypassAttempt.error, /Budget/);
  });
});

describe('contact auto response', () => {
  it('requires complete enabled templates and validates notification email', () => {
    assert.equal(validateContactAutoResponse({ enabled: true, subject: '', body: '' }).success, false);
    assert.equal(validateContactAutoResponse({ enabled: false, subject: '', body: '', notificationEmail: 'invalid' }).success, false);
    const valid = validateContactAutoResponse({
      enabled: true,
      subject: 'Danke',
      body: 'Hallo {name}',
      notificationEmail: 'anfragen@example.com',
    });
    assert.equal(valid.success, true);
    if (valid.success) assert.equal(valid.value.notificationEmail, 'anfragen@example.com');
  });
});

describe('contact submission validation', () => {
  const configured = [
    ...DEFAULT_CONTACT_FORM_FIELDS.slice(0, 2),
    { name: 'budget', label: 'Budget', type: 'select' as const, required: true, options: ['5.000–10.000 €', 'ab 10.000 €'] },
    { name: 'details', label: 'Projektdetails', type: 'textarea' as const },
  ];

  it('validates required custom fields and preserves the full labeled payload', () => {
    const result = validateContactSubmission({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      budget: 'ab 10.000 €',
      details: 'Relaunch mit Buchungsflow',
      ignored: 'must not be stored',
      _page: '/kontakt',
      _source: 'priceCalculator',
      _summary: 'Paket: Premium · Summe: 12.400 €',
    }, configured);

    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.values.ignored, undefined);
    assert.deepEqual(result.payload.fields.map(field => field.name), ['name', 'email', 'budget', 'details']);
    assert.equal(result.payload.context?.source, 'priceCalculator');
    assert.equal(result.payload.context?.summary, 'Paket: Premium · Summe: 12.400 €');
    assert.equal(result.page, '/kontakt');
  });

  it('rejects missing required custom values and invalid select values', () => {
    const missing = validateContactSubmission({ name: 'Ada', email: 'ada@example.com' }, configured);
    assert.equal(missing.success, false);
    if (!missing.success) assert.match(missing.error, /Budget/);

    const invalid = validateContactSubmission({ name: 'Ada', email: 'ada@example.com', budget: '1 €' }, configured);
    assert.equal(invalid.success, false);
    if (!invalid.success) assert.match(invalid.error, /Auswahl/);
  });

  it('rejects angle brackets and header characters in public e-mail fields', () => {
    const result = validateContactSubmission({
      name: 'Ada',
      email: 'victim@example.com<attacker>',
      budget: 'ab 10.000 €',
    }, configured);
    assert.equal(result.success, false);
  });

  it('detects the hidden honeypot without treating an empty value as spam', () => {
    assert.equal(isHoneypotFilled({ _website: '' }), false);
    assert.equal(isHoneypotFilled({ _website: 'https://spam.invalid' }), true);
  });
});
