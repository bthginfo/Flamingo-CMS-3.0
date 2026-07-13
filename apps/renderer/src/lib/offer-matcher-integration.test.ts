import assert from 'node:assert/strict';
import test from 'node:test';
import { getSectionTypesForIndustry } from '../app/admin/pages/[id]/section-types';
import { resolveSectionDefinition } from '../templates';
import { SECTION_EDITOR_FIELD_DEFAULTS } from './section-editor-field-defaults';
import { SECTION_PREVIEW_DATA } from './section-preview-data';
import { getPilotSectionContract } from './section-contracts';
import { getFieldsForSection } from './section-color-resolver';
import { normalizeOfferMatcherData } from './offer-matcher';

test('offer matcher is shared across picker, renderer, editor and preview surfaces', () => {
  for (const industry of ['tradesman', 'hotel', 'fitness']) {
    const pickerEntry = getSectionTypesForIndustry(industry).find((section) => section.type === 'offerMatcher');
    assert.equal(pickerEntry?.category, 'Premium');
    assert.equal(pickerEntry?.locked, undefined);
    assert.equal(resolveSectionDefinition({ type: 'offerMatcher', industry })?.owner, 'shared');
  }

  assert.ok(SECTION_EDITOR_FIELD_DEFAULTS.offerMatcher);
  assert.ok(normalizeOfferMatcherData(SECTION_PREVIEW_DATA.offerMatcher));
  assert.equal(getPilotSectionContract('offerMatcher')?.maturity, 'formal');
});

test('offer matcher exposes every visible conversion and interaction color role', () => {
  const fields = getFieldsForSection('offerMatcher');
  for (const field of [
    'sectionBg',
    'sectionBgAlt',
    'cardBg',
    'headingColor',
    'bodyColor',
    'mutedColor',
    'iconColor',
    'accentColor',
    'btnBg',
    'btnText',
    'borderColor',
    'dividerColor',
    'cardHeadingColor',
    'cardBodyColor',
    'cardMutedColor',
    'check',
    'labelColor',
    'priceColor',
    'linkColor',
    'linkHoverColor',
    'shadowColor',
    'cardRadius',
    'buttonRadius',
  ]) {
    assert.ok(fields.includes(field as never), `missing ${field}`);
  }
});
