import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildAiAgentContract, buildAiAgentPrompt } from './ai-agent-guidance';

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
    assert.equal(contract.requestRules.pageEnvelope.upsert, true);
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
});
