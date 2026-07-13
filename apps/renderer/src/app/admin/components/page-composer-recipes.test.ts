import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getSectionTypesForIndustry, type SectionTypeDefinition } from '../pages/[id]/section-types';
import {
  ART_DIRECTIONS,
  buildComposerPlan,
  canOverrideComposerStepCandidate,
  COMPOSER_STAGES,
  COMPOSER_GOALS,
  EXPERIENCE_FAMILIES,
  inferArtDirection,
  inferExperienceFamily,
} from './page-composer-recipes';

const fullCatalog = getSectionTypesForIndustry('tradesman', { hasBooking: true, hasShop: true });

describe('guided page composer recipes', () => {
  it('builds a stable five-stage plan for every goal, experience family and art direction', () => {
    for (const goal of COMPOSER_GOALS) {
      for (const family of EXPERIENCE_FAMILIES) {
        for (const artDirection of ART_DIRECTIONS) {
          const input = { goal: goal.id, family: family.id, artDirection: artDirection.id, sectionTypes: fullCatalog } as const;
          const first = buildComposerPlan(input);
          const second = buildComposerPlan(input);
          assert.equal(first.length, 5, `${goal.id}/${family.id}/${artDirection.id} returned ${first.length} steps`);
          assert.deepEqual(first.map((step) => step.stage), COMPOSER_STAGES.map((stage) => stage.id));
          assert.deepEqual(first, second, `${goal.id}/${family.id}/${artDirection.id} must be deterministic`);
          assert.equal(new Set(first.map((step) => step.type)).size, first.length, `${goal.id}/${family.id}/${artDirection.id} contains duplicate singleton choices`);
        }
      }
    }
  });

  it('does not let catalog order change the stage recommendations', () => {
    const input = { goal: 'portfolio' as const, family: 'transformation' as const, artDirection: 'cinematic' as const };
    const regular = buildComposerPlan({ ...input, sectionTypes: fullCatalog });
    const reversed = buildComposerPlan({ ...input, sectionTypes: [...fullCatalog].reverse() });

    assert.deepEqual(reversed, regular);
  });

  it('uses all five art directions to create distinct silhouettes', () => {
    const silhouettes = ART_DIRECTIONS.map((artDirection) => buildComposerPlan({
      goal: 'enquiries',
      family: 'local',
      artDirection: artDirection.id,
      sectionTypes: fullCatalog,
    }).map((step) => step.type).join('|'));

    assert.equal(new Set(silhouettes).size, ART_DIRECTIONS.length);
    assert.equal(inferArtDirection('local'), 'studio');
    assert.equal(inferArtDirection('hospitality'), 'organic');
  });

  it('makes every displayed alternative deterministically selectable', () => {
    for (const goal of COMPOSER_GOALS) {
      for (const family of EXPERIENCE_FAMILIES) {
        const baseline = buildComposerPlan({ goal: goal.id, family: family.id, sectionTypes: fullCatalog });
        for (const step of baseline) {
          for (const candidate of step.candidates) {
            const swapped = buildComposerPlan({
              goal: goal.id,
              family: family.id,
              sectionTypes: fullCatalog,
              candidateOverrides: { [step.stage]: candidate.type },
            });
            assert.equal(
              swapped.find((item) => item.stage === step.stage)?.type,
              candidate.type,
              `${goal.id}/${family.id}/${step.stage} cannot select ${candidate.type}`,
            );
          }
        }
      }
    }
  });

  it('selects only definitions supplied by the capability-aware catalog', () => {
    const supplied = fullCatalog.filter((section) => ['hero', 'servicesGrid', 'proofWall', 'timeline', 'smartInquiry'].includes(section.type));
    const plan = buildComposerPlan({ goal: 'enquiries', family: 'local', sectionTypes: supplied });
    const suppliedTypes = new Set(supplied.map((section) => section.type));
    assert.ok(plan.length >= 4);
    assert.ok(plan.every((step) => suppliedTypes.has(step.type)));
  });

  it('surfaces a required locked booking capability without bypassing it', () => {
    const supplied: SectionTypeDefinition[] = [
      { type: 'hero', label: 'Hero', description: 'Einstieg' },
      { type: 'resourceBookingShowcase', label: 'Ressourcen', description: 'Angebot', category: 'Booking', locked: true, lockReason: 'Booking-Addon erforderlich', requiresAddon: 'booking' },
      { type: 'proofWall', label: 'Proof', description: 'Belege', category: 'Premium' },
      { type: 'timeline', label: 'Timeline', description: 'Prozess', category: 'Inhalt' },
      { type: 'bookingSlotPicker', label: 'Termine', description: 'Buchung', category: 'Booking', locked: true, lockReason: 'Booking-Addon erforderlich', requiresAddon: 'booking' },
      { type: 'smartInquiry', label: 'Anfrage', description: 'Fallback', category: 'Kontakt' },
    ];
    const plan = buildComposerPlan({ goal: 'bookings', family: 'planning', sectionTypes: supplied });
    const conversion = plan.find((step) => step.stage === 'conversion');
    assert.equal(conversion?.type, 'bookingSlotPicker');
    assert.equal(conversion?.status, 'blocked');
    assert.equal(conversion?.lockReason, 'Booking-Addon erforderlich');
  });

  it('marks existing types as progress and never inserts the same type twice', () => {
    const plan = buildComposerPlan({
      goal: 'trust',
      family: 'expertise',
      sectionTypes: fullCatalog,
      existingSectionTypes: ['hero', 'proofWall'],
    });
    assert.equal(plan.find((step) => step.type === 'hero')?.status, 'existing');
    assert.equal(plan.find((step) => step.type === 'proofWall')?.status, 'existing');
    assert.equal(new Set(plan.map((step) => step.type)).size, plan.length);
  });

  it('recognizes owner heroes and transformation stories as existing semantic intents', () => {
    const fitnessCatalog = getSectionTypesForIndustry('fitness', { hasBooking: true, hasShop: true });
    const plan = buildComposerPlan({
      goal: 'portfolio',
      family: 'transformation',
      sectionTypes: fitnessCatalog,
      existingSectionTypes: ['fitnessHero', 'transformationStories'],
    });
    const opening = plan.find((step) => step.stage === 'opening');
    const story = plan.find((step) => step.stage === 'story');
    assert.deepEqual([opening?.type, opening?.status], ['fitnessHero', 'existing']);
    assert.deepEqual([story?.type, story?.status], ['transformationStories', 'existing']);
    assert.ok(!plan.some((step) => step.type === 'hero' || step.type === 'beforeAfterStoryPro'));
  });

  it('keeps an existing semantic opener when an alternative override is requested', () => {
    const plan = buildComposerPlan({
      goal: 'portfolio',
      family: 'transformation',
      sectionTypes: fullCatalog,
      existingSectionTypes: ['hero'],
      candidateOverrides: { opening: 'cinematicHero' },
    });
    const opening = plan.find((step) => step.stage === 'opening');

    assert.deepEqual([opening?.type, opening?.status], ['hero', 'existing']);
    assert.equal(canOverrideComposerStepCandidate(opening!), false);
    assert.ok(!plan.some((step) => step.type === 'cinematicHero'));
  });

  it('locks alternatives for an existing owner-specific opener', () => {
    const fitnessCatalog = getSectionTypesForIndustry('fitness', { hasBooking: true, hasShop: true });
    const plan = buildComposerPlan({
      goal: 'portfolio',
      family: 'transformation',
      sectionTypes: fitnessCatalog,
      existingSectionTypes: ['fitnessHero'],
      candidateOverrides: { opening: 'glowHero' },
    });
    const opening = plan.find((step) => step.stage === 'opening');

    assert.deepEqual([opening?.type, opening?.status], ['fitnessHero', 'existing']);
    assert.equal(canOverrideComposerStepCandidate(opening!), false);
  });

  it('treats an existing but capability-locked booking section as blocked, not completed', () => {
    const supplied: SectionTypeDefinition[] = [
      { type: 'hero', label: 'Hero', description: 'Einstieg' },
      { type: 'serviceTabs', label: 'Leistungen', description: 'Angebot', category: 'Leistungen' },
      { type: 'proofWall', label: 'Proof', description: 'Belege', category: 'Premium' },
      { type: 'timeline', label: 'Timeline', description: 'Prozess', category: 'Inhalt' },
      { type: 'bookingSlotPicker', label: 'Termine', description: 'Buchung', category: 'Booking', locked: true, lockReason: 'Booking-Addon erforderlich', requiresAddon: 'booking' },
      { type: 'smartInquiry', label: 'Anfrage', description: 'Fallback', category: 'Kontakt' },
    ];
    const plan = buildComposerPlan({
      goal: 'bookings',
      family: 'planning',
      sectionTypes: supplied,
      existingSectionTypes: ['bookingSlotPicker'],
    });
    const conversion = plan.find((step) => step.stage === 'conversion');
    assert.equal(conversion?.type, 'bookingSlotPicker');
    assert.equal(conversion?.status, 'blockedExisting');
    assert.equal(plan.filter((step) => step.type === 'bookingSlotPicker').length, 1);
    assert.ok(plan.filter((step) => step.stage !== 'conversion').every((step) => !step.type.startsWith('booking')));
  });

  it('accepts a valid candidate swap while preserving a unique plan', () => {
    const plan = buildComposerPlan({
      goal: 'enquiries',
      family: 'local',
      sectionTypes: fullCatalog,
      candidateOverrides: { opening: 'editorialHero', story: 'timeline' },
    });
    assert.equal(plan.find((step) => step.stage === 'opening')?.type, 'editorialHero');
    assert.equal(plan.find((step) => step.stage === 'story')?.type, 'timeline');
    assert.equal(new Set(plan.map((step) => step.type)).size, plan.length);
  });

  it('prefers the current-tenant hero over foreign owner-specific hero implementations', () => {
    const supplied: SectionTypeDefinition[] = [
      { type: 'fitnessHero', label: 'Fitness Hero', description: 'Foreign owner hero' },
      { type: 'hero', label: 'Tenant Hero', description: 'Current owner hero' },
      { type: 'servicesGrid', label: 'Leistungen', description: 'Angebot', category: 'Leistungen' },
      { type: 'proofWall', label: 'Proof', description: 'Belege', category: 'Premium' },
      { type: 'timeline', label: 'Timeline', description: 'Story', category: 'Inhalt' },
      { type: 'smartInquiry', label: 'Anfrage', description: 'Kontakt', category: 'Kontakt' },
    ];
    const plan = buildComposerPlan({ goal: 'enquiries', family: 'transformation', sectionTypes: supplied });
    assert.equal(plan.find((step) => step.stage === 'opening')?.type, 'hero');
    assert.ok(!plan.some((step) => step.type === 'fitnessHero'));
  });

  it('falls back safely for an unknown industry', () => {
    assert.equal(inferExperienceFamily('not-a-real-industry'), 'expertise');
    assert.equal(inferExperienceFamily(undefined), 'expertise');
  });
});
