import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSeededBusinessProfile,
  businessProfileFingerprint,
  getBusinessProfileCompleteness,
  isBusinessProfileDirty,
  parseBusinessProfile,
  profilePassesExistingValidation,
} from './business-profile';

function completeProfile() {
  const profile = createSeededBusinessProfile({
    tenantName: 'Werkstatt Nord',
    contact: { address: 'Marktstraße 1, 20357 Hamburg' },
  });
  profile.audience = {
    primary: 'Eigentümerinnen und Eigentümer von Altbauten',
    needs: ['Klare Kosten', 'Verlässliche Planung'],
    objections: ['Unklare Bauzeit'],
  };
  profile.goals = { primary: 'Qualifizierte Projektanfragen', conversions: ['Kontaktanfrage'] };
  profile.offers = [{
    name: 'Badmodernisierung', outcome: 'Ein bezugsfertiges Bad',
    ctaLabel: 'Projekt besprechen', ctaHref: '/kontakt',
  }];
  profile.voice = { attributes: ['präzise', 'ruhig'], avoid: ['Superlative'] };
  return profile;
}

describe('business profile', () => {
  it('seeds only canonical identity/contact facts and leaves editorial claims empty', () => {
    const profile = createSeededBusinessProfile({
      tenantName: 'Fallback GmbH',
      brand: { companyName: 'Werkstatt Nord' },
      contact: { address: 'Marktstraße 1, 20357 Hamburg' },
    });
    assert.equal(profile.identity.businessName, 'Werkstatt Nord');
    assert.equal(profile.identity.locations[0]?.city, 'Hamburg');
    assert.deepEqual(profile.facts.approvedClaims, []);
    assert.deepEqual(profile.offers, []);
  });

  it('normalizes whitespace and rejects malformed or oversized input', () => {
    const profile = completeProfile();
    profile.identity.businessName = '  Werkstatt Nord  ';
    const parsed = parseBusinessProfile(profile);
    assert.equal(parsed.success, true);
    if (parsed.success) assert.equal(parsed.data.identity.businessName, 'Werkstatt Nord');

    assert.equal(parseBusinessProfile({ ...profile, unexpected: true }).success, false);
    assert.equal(parseBusinessProfile({ ...profile, audience: { primary: 'x', needs: 'no', objections: [] } }).success, false);
    assert.equal(parseBusinessProfile({ ...profile, facts: { ...profile.facts, unknowns: ['x'.repeat(70_000)] } }).success, false);

    profile.offers[0].ctaHref = 'javascript:alert(1)';
    assert.equal(parseBusinessProfile(profile).success, false);
  });

  it('shares the existing profile gate for AI readiness', () => {
    const complete = completeProfile();
    assert.equal(profilePassesExistingValidation(complete), true);
    assert.equal(getBusinessProfileCompleteness(complete).score, 100);

    complete.audience.needs = [];
    assert.equal(profilePassesExistingValidation(complete), false);
    assert.ok(getBusinessProfileCompleteness(complete).missing.includes('Mindestens zwei Kundenbedürfnisse'));
  });

  it('updates the saved baseline before applying a normalized save response', () => {
    const profile = completeProfile();
    const initialBaseline = businessProfileFingerprint(profile);
    const edited = { ...profile, identity: { ...profile.identity, businessName: '  Werkstatt Nord  ' } };
    assert.equal(isBusinessProfileDirty(edited, initialBaseline), true);

    const normalized = parseBusinessProfile(edited);
    assert.equal(normalized.success, true);
    if (!normalized.success) return;
    const savedBaseline = businessProfileFingerprint(normalized.data);
    assert.equal(isBusinessProfileDirty(normalized.data, savedBaseline), false);
  });
});
