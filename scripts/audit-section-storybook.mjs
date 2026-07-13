import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const VIEWPORTS = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 1024, height: 900 },
  wideMobile: { width: 430, height: 900 },
  narrowMobile: { width: 390, height: 844 },
};

const CONTENT_STATES = [
  'minimal',
  'twoPortrait',
  'oddLandscapeExpanded',
  'manyLowQuality',
  'missingMedia',
];

const EXPECTED_STATES_PER_TARGET = Object.keys(VIEWPORTS).length + CONTENT_STATES.length + 5;

function parseOptions(argv) {
  const options = {
    baseUrl: process.env.SECTION_AUDIT_STORYBOOK_URL || 'http://127.0.0.1:6006',
    output: path.resolve('docs/audit/evidence/section-extreme-matrix-summary.json'),
    screenshots: path.resolve(process.env.TEMP || process.env.TMP || '.', 'flamingo-section-extreme-audit', 'screenshots'),
    workers: 4,
    timeout: 15_000,
    limit: null,
    verbose: false,
    axe: false,
    visualOnly: false,
    keyboardOnly: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--base-url') options.baseUrl = argv[++index];
    else if (value === '--output') options.output = path.resolve(argv[++index]);
    else if (value === '--screenshots') options.screenshots = path.resolve(argv[++index]);
    else if (value === '--workers') options.workers = Number(argv[++index]);
    else if (value === '--timeout') options.timeout = Number(argv[++index]);
    else if (value === '--limit') options.limit = Number(argv[++index]);
    else if (value === '--verbose') options.verbose = true;
    else if (value === '--axe') options.axe = true;
    else if (value === '--visual-only') options.visualOnly = true;
    else if (value === '--keyboard-only') options.keyboardOnly = true;
    else if (value === '--help') {
      console.log('node scripts/audit-section-storybook.mjs [--base-url URL] [--output FILE] [--screenshots DIR] [--workers N] [--timeout MS] [--limit N] [--verbose] [--axe] [--visual-only] [--keyboard-only]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }
  if (!Number.isInteger(options.workers) || options.workers < 1 || options.workers > 12) throw new Error('--workers must be 1..12');
  if (options.limit !== null && (!Number.isInteger(options.limit) || options.limit < 1)) throw new Error('--limit must be a positive integer');
  return options;
}

function storyUrl(baseUrl, targetIndex, contentState = 'default') {
  const url = new URL('/iframe.html', baseUrl);
  url.searchParams.set('id', 'section-audit-catalog--default');
  url.searchParams.set('viewMode', 'story');
  if (targetIndex !== undefined && targetIndex !== null) url.searchParams.set('args', `targetIndex:${targetIndex};contentState:${contentState}`);
  return url.toString();
}

async function waitForStory(page, expectedReady, timeout, waitForImages = false) {
  await page.waitForFunction(
    (ready) => document.querySelector('[data-audit-ready]')?.getAttribute('data-audit-ready') === ready,
    expectedReady,
    { timeout },
  );
  await page.evaluate(async (shouldWaitForImages) => {
    await document.fonts?.ready;
    if (!shouldWaitForImages) return;
    const images = Array.from(document.querySelectorAll('[data-audit-ready] img'));
    await Promise.all(images.map((image) => {
      if (image.complete) return Promise.resolve();
      return Promise.race([
        image.decode?.().catch(() => undefined) || Promise.resolve(),
        new Promise((resolve) => setTimeout(resolve, 1_500)),
      ]);
    }));
  }, waitForImages);
}

async function measure(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-audit-ready]');
    if (!root) return { ready: false };
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
    };
    const accessibleName = (element) => {
      const labelledBy = element.getAttribute('aria-labelledby');
      const labelledText = labelledBy
        ? labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').trim()
        : '';
      const explicitLabel = element.id ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent?.trim() : '';
      const wrappedLabel = element.closest('label')?.textContent?.trim();
      return element.getAttribute('aria-label')?.trim()
        || labelledText
        || explicitLabel
        || wrappedLabel
        || element.getAttribute('alt')?.trim()
        || element.getAttribute('title')?.trim()
        || element.getAttribute('placeholder')?.trim()
        || element.textContent?.trim()
        || '';
    };
    const elements = Array.from(root.querySelectorAll('*')).filter(visible);
    const textElements = elements.filter((element) => /^(H[1-6]|P|LI|BLOCKQUOTE|LABEL|TD|TH)$/.test(element.tagName) && element.textContent?.trim());
    const clippedText = textElements.filter((element) => {
      const style = getComputedStyle(element);
      const clips = /(hidden|clip)/.test(`${style.overflow}${style.overflowX}${style.overflowY}`);
      return clips && (element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2);
    });
    const overflowingElements = elements.filter((element) => element.scrollWidth > element.clientWidth + 2 && !/(auto|scroll)/.test(getComputedStyle(element).overflowX));
    const images = Array.from(root.querySelectorAll('img'));
    const headings = Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(visible);
    const headingLevels = headings.map((heading) => Number(heading.tagName.slice(1)));
    let headingJumps = 0;
    for (let index = 1; index < headingLevels.length; index += 1) {
      if (headingLevels[index] > headingLevels[index - 1] + 1) headingJumps += 1;
    }
    const interactive = Array.from(root.querySelectorAll('a[href],button,input,select,textarea,summary,[role="button"],[role="link"],[role="tab"],[tabindex]:not([tabindex="-1"])')).filter(visible);
    const smallTargets = interactive.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    });
    const animations = typeof root.getAnimations === 'function'
      ? root.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running')
      : [];
    const parseColor = (value) => {
      const match = value.match(/^rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);
      if (!match) return null;
      return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: match[4] === undefined ? 1 : Number(match[4]) };
    };
    const luminance = (color) => {
      const channels = [color.r, color.g, color.b].map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const contrastRatio = (left, right) => {
      const first = luminance(left);
      const second = luminance(right);
      return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    };
    const effectiveBackground = (element) => {
      let current = element;
      while (current instanceof HTMLElement) {
        const style = getComputedStyle(current);
        if (style.backgroundImage && style.backgroundImage !== 'none') return null;
        const color = parseColor(style.backgroundColor);
        if (color && color.a >= 0.98) return color;
        current = current.parentElement;
      }
      return parseColor(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
    };
    const contrastResults = textElements.map((element) => {
      const style = getComputedStyle(element);
      const foreground = parseColor(style.color);
      const background = effectiveBackground(element);
      if (!foreground || !background || foreground.a < 0.98) return null;
      const fontSize = Number.parseFloat(style.fontSize);
      const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
      const large = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const ratio = contrastRatio(foreground, background);
      return { ratio, threshold: large ? 3 : 4.5 };
    }).filter(Boolean);
    const rootRect = root.getBoundingClientRect();
    return {
      ready: true,
      bodyOverflowPx: Math.max(0, Math.round(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth)),
      rootWidth: Math.round(rootRect.width),
      rootHeight: Math.round(rootRect.height),
      textLength: root.textContent?.trim().length || 0,
      visibleElements: elements.length,
      overflowElementCount: overflowingElements.length,
      clippedTextCount: clippedText.length,
      brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0).length,
      missingAlt: images.filter((image) => !image.hasAttribute('alt')).length,
      imageCount: images.length,
      headingCount: headings.length,
      headingJumps,
      interactiveCount: interactive.length,
      unnamedInteractive: interactive.filter((element) => !accessibleName(element)).length,
      smallTargets: smallTargets.length,
      runningAnimations: animations.length,
      contrastTested: contrastResults.length,
      contrastFailures: contrastResults.filter((result) => result.ratio + 0.01 < result.threshold).length,
    };
  });
}

async function axeAudit(page) {
  const analysis = await new AxeBuilder({ page }).include('[data-audit-ready]').analyze();
  return {
    violations: analysis.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length,
      help: violation.help,
    })),
    seriousOrCriticalNodes: analysis.violations
      .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      .reduce((total, violation) => total + violation.nodes.length, 0),
  };
}

async function keyboardAudit(page) {
  const selector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[role="button"],[role="link"],[role="tab"],[tabindex]:not([tabindex="-1"])';
  const expected = await page.evaluate((focusSelector) => {
    const root = document.querySelector('[data-audit-ready]');
    if (!root) return [];
    const elements = Array.from(root.querySelectorAll(focusSelector)).filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width <= 0 || rect.height <= 0 || element.tabIndex < 0) return false;
      if (element instanceof HTMLInputElement && element.type === 'radio' && element.name) {
        const group = Array.from(root.querySelectorAll(`input[type="radio"][name="${CSS.escape(element.name)}"]`));
        const tabStop = group.find((radio) => radio.checked) || group[0];
        return element === tabStop;
      }
      return true;
    });
    elements.forEach((element, index) => element.setAttribute('data-audit-focus-index', String(index)));
    return elements.map((element, index) => ({ index, tag: element.tagName, text: element.textContent?.trim().slice(0, 80) || '' }));
  }, selector);

  await page.evaluate(() => {
    document.body.tabIndex = -1;
    document.body.focus();
  });
  const reached = new Set();
  const withoutVisibleIndicator = new Set();
  // Native date/time/select controls can consume several Tab presses inside a
  // single DOM focus target. Give each visible target enough traversal budget
  // before classifying later controls as unreachable.
  const steps = Math.min(expected.length * 4 + 4, 200);
  for (let index = 0; index < steps; index += 1) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      if (!(element instanceof HTMLElement)) return null;
      const focusIndex = element.getAttribute('data-audit-focus-index');
      const style = getComputedStyle(element);
      const hasIndicator = (style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) > 0)
        || (style.boxShadow !== 'none' && style.boxShadow !== '')
        || (style.textDecorationLine && style.textDecorationLine !== 'none');
      return { focusIndex, hasIndicator };
    });
    if (focused?.focusIndex !== null && focused?.focusIndex !== undefined) {
      reached.add(Number(focused.focusIndex));
      if (!focused.hasIndicator) withoutVisibleIndicator.add(Number(focused.focusIndex));
    }
  }

  const activationCandidates = await page.evaluate(() => {
    const root = document.querySelector('[data-audit-ready]');
    if (!root) return [];
    const candidates = Array.from(root.querySelectorAll('button:not([type="submit"]):not([disabled]),summary,[role="button"]:not(a),input[type="range"]'))
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      })
      .slice(0, 5);
    candidates.forEach((element, index) => element.setAttribute('data-audit-activation-index', String(index)));
    return candidates.map((element, index) => ({ index, tag: element.tagName, type: element.getAttribute('type') || '', text: element.textContent?.trim().slice(0, 80) || '' }));
  });
  const activationChecks = [];
  for (const candidate of activationCandidates) {
    const locator = page.locator(`[data-audit-activation-index="${candidate.index}"]`);
    if (!(await locator.count())) continue;
    const before = await locator.evaluate((element) => ({
      expanded: element.getAttribute('aria-expanded'),
      selected: element.getAttribute('aria-selected'),
      pressed: element.getAttribute('aria-pressed'),
      checked: element.getAttribute('aria-checked'),
      state: element.getAttribute('data-state'),
      value: element instanceof HTMLInputElement ? element.value : null,
    }));
    await locator.focus();
    await page.keyboard.press(candidate.type === 'range' ? 'ArrowRight' : 'Enter');
    await page.waitForTimeout(40);
    const after = await locator.evaluate((element) => ({
      expanded: element.getAttribute('aria-expanded'),
      selected: element.getAttribute('aria-selected'),
      pressed: element.getAttribute('aria-pressed'),
      checked: element.getAttribute('aria-checked'),
      state: element.getAttribute('data-state'),
      value: element instanceof HTMLInputElement ? element.value : null,
    })).catch(() => null);
    activationChecks.push({ ...candidate, changed: JSON.stringify(before) !== JSON.stringify(after), before, after });
  }
  return {
    expected: expected.length,
    reached: reached.size,
    unreachable: expected.filter((item) => !reached.has(item.index)),
    withoutVisibleIndicator: expected.filter((item) => withoutVisibleIndicator.has(item.index)),
    activationChecks,
  };
}

async function openState(page, target, contentState, options, errors, { viewport = VIEWPORTS.desktop, reducedMotion = 'no-preference', waitForImages = false } = {}) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion });
  errors.page.length = 0;
  errors.console.length = 0;
  const expectedReady = `${target.definitionKey}|${contentState}`;
  const url = storyUrl(options.baseUrl, target.targetIndex, contentState);
  let hardFailure = null;
  let status = null;
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: options.timeout });
    status = response?.status() ?? null;
    await waitForStory(page, expectedReady, options.timeout, waitForImages);
  } catch (error) {
    hardFailure = error instanceof Error ? error.message : String(error);
  }
  return {
    url,
    status,
    hardFailure,
    pageErrors: [...errors.page],
    consoleErrors: [...errors.console],
    metrics: hardFailure ? { ready: false } : await measure(page),
  };
}

function compactErrors(values) {
  return [...new Set(values.map((value) => String(value).slice(0, 500)))].slice(0, 12);
}

function aggregate(results, targets, expectedStatesPerTarget = EXPECTED_STATES_PER_TARGET) {
  const states = results.flatMap((result) => Object.values(result.states));
  const measured = states.filter((state) => state?.metrics?.ready);
  const axe = states.map((state) => state?.axe).filter(Boolean);
  return {
    registeredDefinitions: 553,
    canonicalTypes: new Set(targets.map((target) => target.type)).size,
    meaningfulRendererVariants: targets.length,
    expectedStates: targets.length * expectedStatesPerTarget,
    recordedStates: states.length,
    hardFailures: states.filter((state) => state?.hardFailure).length,
    statesWithPageErrors: states.filter((state) => state?.pageErrors?.length).length,
    statesWithConsoleErrors: states.filter((state) => state?.consoleErrors?.length).length,
    statesWithBodyOverflow: measured.filter((state) => state.metrics.bodyOverflowPx > 0).length,
    statesWithClippedText: measured.filter((state) => state.metrics.clippedTextCount > 0).length,
    statesWithBrokenImages: measured.filter((state) => state.metrics.brokenImages > 0).length,
    statesWithUnnamedInteractive: measured.filter((state) => state.metrics.unnamedInteractive > 0).length,
    statesWithContrastFailures: measured.filter((state) => state.metrics.contrastFailures > 0).length,
    reducedMotionVariantsWithRunningAnimations: results.filter((result) => result.states.reducedMotion?.metrics?.runningAnimations > 0).length,
    zoomVariantsWithBodyOverflow: results.filter((result) => result.states.zoom200?.metrics?.bodyOverflowPx > 0).length,
    keyboardVariantsWithUnreachableControls: results.filter((result) => result.states.keyboard?.keyboard?.unreachable?.length > 0).length,
    keyboardVariantsWithoutVisibleFocusIndicator: results.filter((result) => result.states.keyboard?.keyboard?.withoutVisibleIndicator?.length > 0).length,
    axeAuditedStates: axe.length,
    seriousOrCriticalAxeNodes: axe.length ? axe.reduce((total, item) => total + item.seriousOrCriticalNodes, 0) : null,
  };
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  await fs.mkdir(path.dirname(options.output), { recursive: true });
  await fs.mkdir(options.screenshots, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const bootstrap = await browser.newPage({ viewport: VIEWPORTS.desktop });
  await bootstrap.goto(storyUrl(options.baseUrl), { waitUntil: 'domcontentloaded', timeout: options.timeout });
  await bootstrap.waitForSelector('[data-audit-ready]', { timeout: options.timeout });
  const allTargets = (await bootstrap.evaluate(() => window.__FLAMINGO_SECTION_AUDIT_TARGETS__ || []))
    .map((target, targetIndex) => ({ ...target, targetIndex }));
  await bootstrap.close();
  if (allTargets.length !== 271) throw new Error(`Expected 271 meaningful renderer variants, got ${allTargets.length}`);
  const targets = options.limit === null ? allTargets : allTargets.slice(0, options.limit);

  const queue = [...targets.entries()];
  const results = [];
  let completed = 0;
  let checkpoint = Promise.resolve();
  const startedAt = Date.now();

  const writeCheckpoint = () => {
    checkpoint = checkpoint.then(async () => {
      const ordered = [...results].sort((left, right) => left.index - right.index);
      const payload = {
        generatedAt: new Date().toISOString(),
        status: 'running',
        coverage: { completedTargets: ordered.length, totalTargets: targets.length },
        targets: ordered,
      };
      await fs.writeFile(`${options.output}.checkpoint`, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    });
    return checkpoint;
  };

  async function worker(workerIndex) {
    const context = await browser.newContext({ viewport: VIEWPORTS.desktop, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
    const page = await context.newPage();
    const errors = { page: [], console: [] };
    page.on('pageerror', (error) => errors.page.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.console.push(message.text());
    });

    while (queue.length) {
      const entry = queue.shift();
      if (!entry) break;
      const [index, target] = entry;
      const states = {};
      const targetStartedAt = Date.now();
      if (options.verbose) console.log(`[section-audit] start ${index + 1}/${targets.length} ${target.definitionKey}`);
      if (options.visualOnly) {
        states.desktop = await openState(page, target, 'default', options, errors, { viewport: VIEWPORTS.desktop, waitForImages: true });
        states.desktop.pageErrors = compactErrors(states.desktop.pageErrors);
        states.desktop.consoleErrors = compactErrors(states.desktop.consoleErrors);
        if (!states.desktop.hardFailure) {
          await page.evaluate(async () => {
            const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
            const maximum = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
            for (let y = 0; y <= maximum; y += 650) {
              window.scrollTo(0, y);
              await sleep(80);
            }
            window.scrollTo(0, maximum);
            await sleep(250);
            window.scrollTo(0, 0);
            await sleep(450);
          });
          states.desktop.metrics = await measure(page);
          const filename = `${String(index + 1).padStart(3, '0')}-${target.type}-${target.owner}.png`.replace(/[^a-zA-Z0-9._-]/g, '-');
          await page.screenshot({ path: path.join(options.screenshots, filename), fullPage: false });
        }
        results.push({ index, ...target, states });
        completed += 1;
        if (completed % 10 === 0 || completed === targets.length) {
          const elapsed = Math.round((Date.now() - startedAt) / 1000);
          console.log(`[section-audit-visual] ${completed}/${targets.length} variants, ${elapsed}s, worker ${workerIndex}`);
          await writeCheckpoint();
        }
        continue;
      }
      if (options.keyboardOnly) {
        states.keyboard = await openState(page, target, 'default', options, errors, { viewport: VIEWPORTS.desktop });
        states.keyboard.pageErrors = compactErrors(states.keyboard.pageErrors);
        states.keyboard.consoleErrors = compactErrors(states.keyboard.consoleErrors);
        if (!states.keyboard.hardFailure) states.keyboard.keyboard = await keyboardAudit(page);
        results.push({ index, ...target, states });
        completed += 1;
        if (completed % 10 === 0 || completed === targets.length) {
          const elapsed = Math.round((Date.now() - startedAt) / 1000);
          console.log(`[section-audit-keyboard] ${completed}/${targets.length} variants, ${elapsed}s, worker ${workerIndex}`);
          await writeCheckpoint();
        }
        continue;
      }
      for (const [name, viewport] of Object.entries(VIEWPORTS)) {
        states[name] = await openState(page, target, 'default', options, errors, { viewport, waitForImages: name === 'desktop' });
        states[name].pageErrors = compactErrors(states[name].pageErrors);
        states[name].consoleErrors = compactErrors(states[name].consoleErrors);
        if (name === 'desktop' && !states[name].hardFailure) {
          if (options.axe) states[name].axe = await axeAudit(page).catch((error) => ({ error: String(error), violations: [], seriousOrCriticalNodes: 0 }));
          const filename = `${String(index + 1).padStart(3, '0')}-${target.type}-${target.owner}.png`.replace(/[^a-zA-Z0-9._-]/g, '-');
          await page.screenshot({ path: path.join(options.screenshots, filename), fullPage: false });
        }
      }
      if (options.verbose) console.log(`[section-audit] ${target.definitionKey} viewports ${Math.round((Date.now() - targetStartedAt) / 1000)}s`);

      for (const contentState of CONTENT_STATES) {
        states[contentState] = await openState(page, target, contentState, options, errors);
        states[contentState].pageErrors = compactErrors(states[contentState].pageErrors);
        states[contentState].consoleErrors = compactErrors(states[contentState].consoleErrors);
      }
      if (options.verbose) console.log(`[section-audit] ${target.definitionKey} content ${Math.round((Date.now() - targetStartedAt) / 1000)}s`);

      for (const theme of ['light', 'dark']) {
        states[theme] = await openState(page, target, theme, options, errors);
        states[theme].pageErrors = compactErrors(states[theme].pageErrors);
        states[theme].consoleErrors = compactErrors(states[theme].consoleErrors);
        if (options.axe && !states[theme].hardFailure) {
          states[theme].axe = await axeAudit(page).catch((error) => ({ error: String(error), violations: [], seriousOrCriticalNodes: 0 }));
        }
      }
      if (options.verbose) console.log(`[section-audit] ${target.definitionKey} themes ${Math.round((Date.now() - targetStartedAt) / 1000)}s`);

      states.reducedMotion = await openState(page, target, 'default', options, errors, { reducedMotion: 'reduce' });
      states.reducedMotion.pageErrors = compactErrors(states.reducedMotion.pageErrors);
      states.reducedMotion.consoleErrors = compactErrors(states.reducedMotion.consoleErrors);
      if (options.verbose) console.log(`[section-audit] ${target.definitionKey} motion ${Math.round((Date.now() - targetStartedAt) / 1000)}s`);

      states.zoom200 = await openState(page, target, 'default', options, errors);
      if (!states.zoom200.hardFailure) {
        await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
        await page.waitForTimeout(50);
        states.zoom200.metrics = await measure(page);
        states.zoom200.approximation = 'CSS zoom: 2; browser reflow proxy, not native browser chrome zoom';
        await page.evaluate(() => { document.documentElement.style.zoom = ''; });
      }
      states.zoom200.pageErrors = compactErrors(states.zoom200.pageErrors);
      states.zoom200.consoleErrors = compactErrors(states.zoom200.consoleErrors);
      if (options.verbose) console.log(`[section-audit] ${target.definitionKey} zoom ${Math.round((Date.now() - targetStartedAt) / 1000)}s`);

      states.keyboard = await openState(page, target, 'default', options, errors);
      if (!states.keyboard.hardFailure) states.keyboard.keyboard = await keyboardAudit(page);
      states.keyboard.pageErrors = compactErrors(states.keyboard.pageErrors);
      states.keyboard.consoleErrors = compactErrors(states.keyboard.consoleErrors);
      if (options.verbose) console.log(`[section-audit] ${target.definitionKey} keyboard ${Math.round((Date.now() - targetStartedAt) / 1000)}s`);

      results.push({ index, ...target, states });
      completed += 1;
      if (completed % 10 === 0 || completed === targets.length) {
        const elapsed = Math.round((Date.now() - startedAt) / 1000);
        console.log(`[section-audit] ${completed}/${targets.length} variants, ${elapsed}s, worker ${workerIndex}`);
        await writeCheckpoint();
      }
    }
    await context.close();
  }

  try {
    await Promise.all(Array.from({ length: options.workers }, (_, index) => worker(index + 1)));
    await checkpoint;
    const ordered = [...results].sort((left, right) => left.index - right.index).map(({ index: _index, ...result }) => result);
    const payload = {
      generatedAt: new Date().toISOString(),
      source: 'Storybook audit-only harness + Playwright; production-route hydration remains covered by section-runtime-matrix-summary.json',
      story: 'apps/renderer/src/stories/section-audit.stories.tsx',
      runner: 'scripts/audit-section-storybook.mjs',
      baseUrl: options.baseUrl,
      durationSeconds: Math.round((Date.now() - startedAt) / 1000),
      viewports: VIEWPORTS,
      requirements: {
        normalContent: 'default',
        minimalAndMissingOptional: 'minimal + 1 item',
        maximumRealisticAndManyItems: 'manyLowQuality + 9 items + expanded copy',
        longHeadingLongWordMultipleParagraphsTranslated: 'oddLandscapeExpanded and manyLowQuality',
        missingMedia: 'missingMedia',
        portraitMediaAndTwoItems: 'twoPortrait',
        landscapeMediaAndOddItems: 'oddLandscapeExpanded',
        lowQualityMedia: 'manyLowQuality with 1px intrinsic GIF',
        keyboard: 'full Tab sequence up to 200 controls + first five non-submit control activations',
        reducedMotion: 'prefers-reduced-motion: reduce',
        highZoom: 'CSS zoom 2 reflow proxy',
        lightDark: 'explicit semantic light/dark token palettes',
      },
      coverage: aggregate(ordered, targets, options.visualOnly || options.keyboardOnly ? 1 : EXPECTED_STATES_PER_TARGET),
      targets: ordered,
    };
    await fs.writeFile(options.output, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    await fs.rm(`${options.output}.checkpoint`, { force: true });
    console.log(JSON.stringify(payload.coverage, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
