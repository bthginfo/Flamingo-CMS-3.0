import assert from 'node:assert/strict';
import test from 'node:test';
import { getSectionPreviewData } from './section-preview-data';
import { INDUSTRY_HERO_EXAMPLES } from './section-industry-hero-examples';
import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DestinationHighlightsSection } from '../templates/tourism/destination-highlights';
import { ExperienceGridSection } from '../templates/tourism/experience-grid';
import { SeasonTeaserSection } from '../templates/tourism/season-teaser';

test('industry examples seed distinct readable heroes with media and usable actions', () => {
  const headlines = new Set();
  for (const industry of Object.keys(INDUSTRY_HERO_EXAMPLES)) {
    const data = getSectionPreviewData('hero', industry);
    assert.ok(typeof data.headline === 'string' && data.headline.length > 5 && data.headline !== 'Willkommen bei uns', industry);
    assert.ok(typeof data.bgImage === 'string' && data.bgImage.startsWith('https://'), industry);
    headlines.add(data.headline);
  }
  assert.equal(headlines.size, Object.keys(INDUSTRY_HERO_EXAMPLES).length);
  assert.deepEqual(getSectionPreviewData('hero', 'handwerk'), getSectionPreviewData('hero', 'tradesman'));
});

test('preview examples use the actual renderer data shapes instead of empty fallback cards and broken links', () => {
  for (const type of ['newsPreview', 'newsGrid']) {
    for (const item of getSectionPreviewData(type).items as Record<string, unknown>[]) assert.ok(item.slug);
  }
  assert.ok(getSectionPreviewData('videoEmbed').videoUrl);
  assert.ok(getSectionPreviewData('legalContent').content);
  assert.ok((getSectionPreviewData('logoMarquee').items as unknown[]).length);
  for (const item of getSectionPreviewData('serviceMenu').categories as Record<string, unknown>[]) {
    assert.ok(item.title && item.text);
    assert.ok((item.services as unknown[]).every(value => typeof value === 'string'));
  }
  for (const item of getSectionPreviewData('packages').packages as Record<string, unknown>[]) assert.ok(item.title && item.priceLabel);
});

test('tourism examples render their descriptions, timing and complete seasonal selection', () => {
  (globalThis as typeof globalThis & { React: typeof React }).React = React;
  for (const [type, component, collection] of [
    ['destinationHighlights', DestinationHighlightsSection, 'items'],
    ['experienceGrid', ExperienceGridSection, 'items'],
    ['seasonTeaser', SeasonTeaserSection, 'seasons'],
  ] as const) {
    const example = getSectionPreviewData(type, 'tourism');
    // This Node render verifies content keys. CDN media is exercised by the
    // production browser audit, which loads the application's Next config.
    const data: Record<string, unknown> = {
      ...example,
      [collection]: (example[collection] as Record<string, unknown>[]).map(item => ({ ...item, image: '/test-placeholder.jpg' })),
    };
    const html = renderToStaticMarkup(createElement(component, { data }));
    for (const item of data[collection] as Record<string, string>[]) {
      assert.ok(html.includes(item.text), `${type}: description must be visible`);
      for (const key of ['durationLabel', 'difficultyLabel', 'periodLabel']) {
        if (item[key]) assert.ok(html.includes(item[key]), `${type}: ${key} must be visible`);
      }
    }
    if (type === 'seasonTeaser') assert.equal((data.seasons as unknown[]).length, 4);
  }
});
