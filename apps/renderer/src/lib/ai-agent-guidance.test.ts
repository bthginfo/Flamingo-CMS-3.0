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
    assert.match(prompt, /upsert=true/);
    assert.match(prompt, /readyToPublish=true/);
  });
});
