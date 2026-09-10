/**
 * Section-local text defaults for templates that still use generic HTML or
 * Tailwind colour classes. The normal rules have zero specificity so a real
 * Tailwind foreground utility (including responsive and interaction variants)
 * wins when it is active. The important rules are a compatibility bridge for
 * the old global `!important` text defaults and only apply when no explicit
 * foreground token or named semantic role is present.
 */

const NON_COLOR_TEXT_TOKEN_SELECTORS = [
  '[class*="text-[var(--token-heading-weight"]',
  '[class*="text-[var(--token-heading-tracking"]',
  '[class*="text-[color:var(--token-heading-weight"]',
  '[class*="text-[color:var(--token-heading-tracking"]',
];

const INLINE_FOREGROUND_SELECTORS = [
  ...['color:var(', 'color: var(', 'color:color-mix(', 'color: color-mix(']
    .flatMap((declaration) => [
      `[style^="${declaration}"]`,
      `[style*=";${declaration}"]`,
      `[style*="; ${declaration}"]`,
    ]),
];

// The `text-[...]` prefix is intentionally scoped to text utilities. A class
// such as `font-[var(--token-heading-weight)]` next to a colour utility must
// not opt the whole element out of the fallback. The suffix exclusions above
// keep the size-only text utilities in the legacy path.
const EXPLICIT_FOREGROUND_SELECTORS = [
  '[class*="text-[var(--token-"]',
  '[class*="text-[color:var(--token-"]',
  '[class*="text-[color:"]',
  ...INLINE_FOREGROUND_SELECTORS,
];

const EXPLICIT_FOREGROUND_GUARD =
  `:not(:is(${EXPLICIT_FOREGROUND_SELECTORS.join(',')}))` +
  `:not(:is(${NON_COLOR_TEXT_TOKEN_SELECTORS.join(',')}))`;

const SEMANTIC_ROLE_SELECTORS = [
  '.section-headline',
  '.section-subline',
  '.section-badge',
  '.cms-eyebrow',
  '.cms-section-title',
  '.cms-section-copy',
];

const notSelectors = (selectors: string[]) => selectors.map((selector) => `:not(${selector})`).join('');
const semanticRoleGuard = `:not(:is(${SEMANTIC_ROLE_SELECTORS.join(',')}))`;

// Keep these exported for source-level integration checks and for consumers
// that need to compose the same legacy guard with a custom text selector.
export const LEGACY_TEXT_COLOR_GUARD =
  ':not([class~="text-white"]):not([class~="text-black"])' +
  EXPLICIT_FOREGROUND_GUARD +
  semanticRoleGuard;

const EXPLICIT_ROLE_GUARD =
  ':not([class~="text-white"]):not([class~="text-black"])' +
  EXPLICIT_FOREGROUND_GUARD;

const CARD_TEXT_GUARD =
  ':not([class~="text-white"]):not([class~="text-black"])' +
  EXPLICIT_FOREGROUND_GUARD +
  ':not(.section-badge)' +
  semanticRoleGuard;

const sectionSelector = (escapedSectionId: string) =>
  `[data-section-id="${escapedSectionId}"][data-style]`;

const where = (escapedSectionId: string, selector: string) =>
  `:where(${sectionSelector(escapedSectionId)} :is(${selector}))`;

const important = (escapedSectionId: string, selector: string) =>
  `${sectionSelector(escapedSectionId)} :is(${selector})`;

const genericTextSelectors = ':is(h1,h2,h3,h4,h5,h6)';
const genericBodySelectors = ':is(p,li):not(.section-badge)';
const genericMutedSelectors = ':is(small,figcaption,[class*="text-muted"],[class*="text-zinc"],[class*="text-gray"])';

const foregroundFallbackRules = (escapedSectionId: string, colors: {
  headingColorVar: string;
  bodyColorVar: string;
  mutedColorVar: string;
  cardHeadingColorVar: string;
  cardBodyColorVar: string;
  cardMutedColorVar: string;
}) => {
  const { headingColorVar, bodyColorVar, mutedColorVar, cardHeadingColorVar, cardBodyColorVar, cardMutedColorVar } = colors;
  return [
    // Zero-specificity defaults let ordinary Tailwind classes, including
    // md:/hover:/active: variants, win when their generated rule is active.
    `${where(escapedSectionId, genericTextSelectors)} { color: ${headingColorVar}; }`,
    `${where(escapedSectionId, genericBodySelectors)} { color: ${bodyColorVar}; }`,
    `${where(escapedSectionId, genericMutedSelectors)} { color: ${mutedColorVar}; }`,
    `${where(escapedSectionId, `[data-card] ${genericTextSelectors}`)} { color: ${cardHeadingColorVar}; }`,
    `${where(escapedSectionId, `[data-card] ${genericBodySelectors}`)} { color: ${cardBodyColorVar}; }`,
    `${where(escapedSectionId, `[data-card] ${genericMutedSelectors}`)} { color: ${cardMutedColorVar}; }`,
    // Compatibility bridge for the existing global !important rules.
    `${important(escapedSectionId, `${genericTextSelectors}${LEGACY_TEXT_COLOR_GUARD}`)} { color: ${headingColorVar} !important; }`,
    `${important(escapedSectionId, `${genericBodySelectors}${LEGACY_TEXT_COLOR_GUARD}`)} { color: ${bodyColorVar} !important; }`,
    `${important(escapedSectionId, `${genericMutedSelectors}${LEGACY_TEXT_COLOR_GUARD}`)} { color: ${mutedColorVar} !important; }`,
    `${important(escapedSectionId, `[data-card] ${genericTextSelectors}${CARD_TEXT_GUARD}`)} { color: ${cardHeadingColorVar} !important; }`,
    `${important(escapedSectionId, `[data-card] ${genericBodySelectors}${CARD_TEXT_GUARD}`)} { color: ${cardBodyColorVar} !important; }`,
    `${important(escapedSectionId, `[data-card] ${genericMutedSelectors}${CARD_TEXT_GUARD}`)} { color: ${cardMutedColorVar} !important; }`,
  ];
};

const semanticRoleRules = (escapedSectionId: string, colors: {
  headingColorVar: string;
  bodyColorVar: string;
  subheadingColorVar: string;
  eyebrowColorVar: string;
}) => {
  const { headingColorVar, bodyColorVar, subheadingColorVar, eyebrowColorVar } = colors;
  return [
    // The zero-specificity rules retain role defaults for responsive-only
    // utilities while allowing the utility itself to win at its breakpoint.
    `${where(escapedSectionId, '.section-headline,.cms-section-title')} { color: ${headingColorVar}; }`,
    `${where(escapedSectionId, '.section-subline')} { color: ${subheadingColorVar}; }`,
    `${where(escapedSectionId, '.cms-section-copy')} { color: ${bodyColorVar}; }`,
    `${where(escapedSectionId, '.cms-eyebrow')} { color: ${eyebrowColorVar}; }`,
    `${important(escapedSectionId, `:is(.section-headline,.cms-section-title)${EXPLICIT_ROLE_GUARD}`)} { color: ${headingColorVar} !important; }`,
    `${important(escapedSectionId, `.section-subline${EXPLICIT_ROLE_GUARD}`)} { color: ${subheadingColorVar} !important; }`,
    `${important(escapedSectionId, `.cms-section-copy${EXPLICIT_ROLE_GUARD}`)} { color: ${bodyColorVar} !important; }`,
    `${important(escapedSectionId, `.cms-eyebrow${EXPLICIT_ROLE_GUARD}`)} { color: ${eyebrowColorVar} !important; }`,
  ];
};

export function buildSectionTextColorCss(escapedSectionId: string, colors: {
  headingColorVar: string;
  bodyColorVar: string;
  mutedColorVar: string;
  subheadingColorVar?: string;
  eyebrowColorVar?: string;
  cardHeadingColorVar: string;
  cardBodyColorVar: string;
  cardMutedColorVar: string;
  badgeBgVar: string;
  badgeTextVar: string;
  badgeBorderVar: string;
  darkContextHeadingVar: string;
  darkContextBodyVar: string;
  darkContextMutedVar: string;
}): string {
  const {
    headingColorVar,
    bodyColorVar,
    mutedColorVar,
    subheadingColorVar = bodyColorVar,
    eyebrowColorVar = 'var(--token-eyebrow)',
    cardHeadingColorVar,
    cardBodyColorVar,
    cardMutedColorVar,
    badgeBgVar,
    badgeTextVar,
    badgeBorderVar,
    darkContextHeadingVar,
    darkContextBodyVar,
    darkContextMutedVar,
  } = colors;
  const section = sectionSelector(escapedSectionId);
  const rules = [
    `${section} { --_card-h:${cardHeadingColorVar}; --_card-b:${cardBodyColorVar}; --_card-m:${cardMutedColorVar}; --_on-dark-h:${darkContextHeadingVar}; --_on-dark-b:${darkContextBodyVar}; --_on-dark-m:${darkContextMutedVar}; }`,
    ...foregroundFallbackRules(escapedSectionId, { headingColorVar, bodyColorVar, mutedColorVar, cardHeadingColorVar, cardBodyColorVar, cardMutedColorVar }),
    ...semanticRoleRules(escapedSectionId, { headingColorVar, bodyColorVar, subheadingColorVar, eyebrowColorVar }),
    `${section} .section-badge { color: ${badgeTextVar} !important; background-color: ${badgeBgVar} !important; border-color: ${badgeBorderVar} !important; }`,
    `${section} [data-color-context="dark"], ${section} [data-color-context="dark"] [data-card] { --token-heading:var(--_on-dark-h); --token-on-dark-heading:var(--_on-dark-h); --token-body:var(--_on-dark-b); --token-on-dark-body:var(--_on-dark-b); --token-muted:var(--_on-dark-m); --token-on-dark-muted:var(--_on-dark-m); }`,
    `${where(escapedSectionId, '[data-color-context="dark"] '+genericTextSelectors)} { color: var(--_on-dark-h); }`,
    `${where(escapedSectionId, '[data-color-context="dark"] '+genericBodySelectors)} { color: var(--_on-dark-b); }`,
    `${where(escapedSectionId, '[data-color-context="dark"] '+genericMutedSelectors)} { color: var(--_on-dark-m); }`,
    `${important(escapedSectionId, '[data-color-context="dark"] '+genericTextSelectors+LEGACY_TEXT_COLOR_GUARD)} { color: var(--_on-dark-h) !important; }`,
    `${important(escapedSectionId, '[data-color-context="dark"] '+genericBodySelectors+LEGACY_TEXT_COLOR_GUARD)} { color: var(--_on-dark-b) !important; }`,
    `${important(escapedSectionId, '[data-color-context="dark"] '+genericMutedSelectors+LEGACY_TEXT_COLOR_GUARD)} { color: var(--_on-dark-m) !important; }`,
    // Dark-context priority must outrank generic card defaults while retaining
    // independent explicit semantic roles and foreground utilities.
    `${important(escapedSectionId, '[data-color-context="dark"] [data-card] '+genericTextSelectors+CARD_TEXT_GUARD)} { color: var(--_on-dark-h) !important; }`,
    `${important(escapedSectionId, '[data-color-context="dark"] [data-card] '+genericBodySelectors+CARD_TEXT_GUARD)} { color: var(--_on-dark-b) !important; }`,
    `${important(escapedSectionId, '[data-color-context="dark"] [data-card] '+genericMutedSelectors+CARD_TEXT_GUARD)} { color: var(--_on-dark-m) !important; }`,
  ];
  return `\n${rules.join('\n')}\n`;
}
