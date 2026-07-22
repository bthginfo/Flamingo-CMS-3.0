import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildAiAgentContract, buildAiAgentPrompt } from './ai-agent-guidance';
import type { SiteProfile } from './content-quality';

describe('AI agent guidance', () => {
  const contract = buildAiAgentContract({
    tenantName: 'Beispiel GmbH',
    industry: 'tradesman',
    allowedSections: [
      { type: 'hero' },
      { type: 'servicesGrid' },
      { type: 'faq' },
      { type: 'ctaBand' },
      { type: 'contact' },
    ],
    existingPages: [{ id: 'page-1', slug: 'startseite', title: 'Startseite' }],
    sectionSchemas: { hero: {}, servicesGrid: {}, faq: {}, ctaBand: {}, contact: {}, hidden: {} },
    hasShop: false,
    hasBooking: true,
  });

  it('emits an ordered, idempotent workflow', () => {
    assert.deepEqual(contract.stateMachine.map(step => step.state), [
      'DISCOVER', 'FOUNDATION', 'CONTENT', 'VERIFY', 'PUBLISH',
    ]);
    assert.deepEqual(contract.agentRunbook.writeOrder.slice(0, 3), ['profile-preflight', 'plan-preflight', 'brand']);
    assert.equal(contract.requestRules.pageEnvelope.upsert, true);
    assert.equal(contract.requestBodies.page.body.upsert, true);
    assert.equal(contract.currentState.bookingEnabled, true);
  });

  it('never recommends a section outside the tenant catalog', () => {
    const allowed = new Set(['hero', 'servicesGrid', 'faq', 'ctaBand', 'contact']);
    const recommended = contract.recommendedPages.flatMap(page => page.sections.map(section => section.type));
    assert.ok(recommended.length > 0);
    assert.ok(recommended.every(type => allowed.has(type)));
    assert.equal(contract.schemaCoverage, 5);
  });

  it('keeps the short prompt focused on deterministic contracts', () => {
    const prompt = buildAiAgentPrompt('Beispiel GmbH', 'tradesman');
    assert.match(prompt, /agentContract\.agentRunbook\.writeOrder/);
    assert.match(prompt, /agentContract\.requestBodies/);
    assert.match(prompt, /agentContract\.stateMachine/);
    assert.match(prompt, /POST \/api\/v1\/content\/validate/);
    assert.match(prompt, /upsert=true/);
    assert.match(prompt, /readyToPublish=true/);
  });

  it('gives weak models a profile, plan and targeted repair contract', () => {
    assert.deepEqual(contract.weakModelWorkflow.steps.map(step => step.state), [
      'PROFILE', 'PLAN', 'WRITE', 'REPAIR', 'PUBLISH',
    ]);
    assert.equal(contract.weakModelWorkflow.siteProfileIntake.schemaVersion, '1.0');
    assert.equal(contract.weakModelWorkflow.pagePlanContract.shape.slug, 'lowercase kebab-case, no leading slash');
    assert.equal(contract.weakModelWorkflow.fieldBudgets.metaTitle.max, 70);
    assert.match(contract.weakModelWorkflow.examples.headline.bad, /Willkommen/);
    assert.deepEqual(contract.weakModelWorkflow.validationContract.preflight.body.mode, 'plan');
    assert.equal(contract.agentRunbook.pageWriting.batchSize, 1);
    assert.deepEqual(contract.agentRunbook.commonFieldAliasesHandledByApi.manualCards, ['cards', 'items', 'services']);
  });

  it('only exposes valid Advanced examples and their asset constraints', () => {
    const advanced = buildAiAgentContract({
      tenantName: 'Studio Beispiel',
      industry: 'tradesman',
      allowedSections: [{ type: 'hero' }, { type: 'xrayReveal' }, { type: 'infiniteCanvas' }],
      existingPages: [],
      sectionSchemas: { hero: {}, xrayReveal: {}, infiniteCanvas: {} },
      hasShop: false,
      hasBooking: false,
    });
    assert.deepEqual(advanced.advancedExperienceGuide.available, ['xrayReveal', 'infiniteCanvas']);
    assert.match(advanced.advancedExperienceGuide.assetRules.xrayReveal, /identical pixel dimensions/);
    assert.equal((advanced.advancedExperienceGuide.examples.infiniteCanvas as { items: unknown[] }).items.length, 10);
    assert.equal(advanced.advancedExperienceGuide.examples.sceneLab, undefined);
  });

  it('uses the vertical sitemap policy instead of universal service/about pages', () => {
    const club = buildAiAgentContract({
      tenantName: 'EHC Beispiel',
      industry: 'verein',
      allowedSections: [
        { type: 'hero' }, { type: 'contact' }, { type: 'legalContent' },
        { type: 'nextMatchHero' }, { type: 'matchSchedule' }, { type: 'leagueTable' },
        { type: 'editorialHero' }, { type: 'statsCounter' }, { type: 'timeline' },
        { type: 'faq' }, { type: 'ctaBand' }, { type: 'ctaSplit' },
      ],
      existingPages: [],
      sectionSchemas: {},
      hasShop: false,
      hasBooking: false,
    });
    const slugs = club.recommendedPages.map(page => page.slug);
    assert.ok(slugs.includes('spielplan'));
    assert.ok(slugs.includes('verein'));
    assert.ok(slugs.includes('impressum'));
    assert.ok(!slugs.includes('leistungen'));
    assert.ok(!slugs.includes('ueber-uns'));
  });

  it('passes a validated persisted profile through verbatim and skips redundant intake', () => {
    const approved: SiteProfile = {
      schemaVersion: '1.0',
      identity: { businessName: 'Werkstatt Nord', locations: [{ city: 'Hamburg' }] },
      audience: { primary: 'Altbau-Eigentümer in Hamburg', needs: ['Klare Kosten', 'Feste Abläufe'], objections: ['Unklare Bauzeit'] },
      goals: { primary: 'Projektanfragen', conversions: ['Kontaktanfrage'] },
      offers: [{ name: 'Badmodernisierung', outcome: 'Bezugsfertiges Bad', ctaLabel: 'Projekt besprechen', ctaHref: '/kontakt' }],
      voice: { attributes: ['ruhig', 'präzise'], avoid: ['Superlative'] },
      facts: { approvedClaims: ['Ein fester Projektleiter'], prohibitedClaims: ['Günstigster Anbieter'], unknowns: ['Gründungsjahr'] },
    };
    const withProfile = buildAiAgentContract({
      tenantName: 'Werkstatt Nord', industry: 'tradesman', allowedSections: [{ type: 'hero' }],
      existingPages: [], sectionSchemas: { hero: {} }, hasShop: false, hasBooking: false,
      approvedSiteProfile: approved,
    });
    assert.deepEqual(withProfile.weakModelWorkflow.approvedSiteProfile, approved);
    assert.equal(withProfile.weakModelWorkflow.profileSource, 'persisted-approved');
    assert.equal(withProfile.weakModelWorkflow.steps[0].skipIntake, true);
    assert.deepEqual(withProfile.weakModelWorkflow.approvedSiteProfile?.facts.unknowns, ['Gründungsjahr']);
    assert.equal(withProfile.weakModelWorkflow.approvedSiteProfile?.identity.legalName, undefined);
  });

  it('does not approve incomplete persisted profiles or fabricate missing facts', () => {
    const incomplete: SiteProfile = {
      schemaVersion: '1.0',
      identity: { businessName: 'Werkstatt Nord', locations: [] },
      audience: { primary: '', needs: [], objections: [] }, goals: { primary: '', conversions: [] }, offers: [],
      voice: { attributes: [], avoid: [] }, facts: { approvedClaims: [], prohibitedClaims: [], unknowns: ['Zielgruppe'] },
    };
    const result = buildAiAgentContract({
      tenantName: 'Werkstatt Nord', industry: 'tradesman', allowedSections: [{ type: 'hero' }],
      existingPages: [], sectionSchemas: {}, hasShop: false, hasBooking: false,
      approvedSiteProfile: incomplete,
    });
    assert.equal(result.weakModelWorkflow.approvedSiteProfile, null);
    assert.equal(result.weakModelWorkflow.profileSource, 'intake-required');
    assert.equal(result.weakModelWorkflow.steps[0].skipIntake, false);
  });
});
