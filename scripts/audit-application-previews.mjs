import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const require = createRequire(import.meta.url);
const { loadTemplateRegistry } = require('./generate-section-color-contracts.cjs');
const registry = loadTemplateRegistry();
// Exercise every distinct renderer implementation, including native industries.
const implementations = new Map();
for (const entry of [...registry.industryTypeComponent, ...registry.sharedTypeComponent]) {
  if (!implementations.has(entry.componentName)) implementations.set(entry.componentName, {
    type: entry.type, industry: entry.industry || 'tradesman', component: entry.componentName,
  });
}
const baseUrl = process.env.QA_BASE_URL || 'http://localhost:3002';
const output = path.resolve(process.env.QA_OUTPUT || 'tmp/application-audit-2026-10-02');
const selected = (process.env.QA_TYPES || '').split(',').filter(Boolean);
const targets = [...implementations.values()].filter(target => !selected.length || selected.includes(target.type));
const workers = Math.max(1, Math.min(4, Number(process.env.QA_WORKERS) || 2));
await fs.mkdir(path.join(output, 'screenshots'), { recursive: true });
const browser = await chromium.launch();
const results = [];
let index = 0;
let reportWrite = Promise.resolve();
try {
  await Promise.all(Array.from({ length: workers }, async () => {
    const context = await browser.newContext({ reducedMotion: 'reduce', colorScheme: 'light' });
    const page = await context.newPage();
    while (index < targets.length) {
      const target = targets[index++];
      for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
        const errors = [];
        const listener = error => errors.push(error.message);
        const caughtErrorListener = message => { if (message.type() === 'error' && message.text().includes('[Section Error]')) errors.push(message.text()); };
        page.on('pageerror', listener);
        page.on('console', caughtErrorListener);
        const result = { ...target, viewport: name, errors, violations: [] };
        try {
          await page.setViewportSize({ width, height });
          const response = await page.goto(`${baseUrl}/section-preview?type=${encodeURIComponent(target.type)}&industry=${target.industry}`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
          result.status = response?.status();
          await page.locator('main').waitFor({ timeout: 15_000 });
          // SSR content exists before hydration. Allow observers to subscribe
          // before scrolling through sections; otherwise entrance fades are
          // only triggered after the sweep has already passed their viewport.
          await page.waitForTimeout(1800);
          await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * .8) {
              scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 250));
            }
            scrollTo(0, 0);
          });
          // Motion entrance fades continue even with reducedMotion on some
          // templates. Measure settled content rather than a transient opacity.
          await page.waitForTimeout(2000);
          Object.assign(result, await page.locator('main').evaluate(root => ({
            textLength: root.innerText.trim().length,
            mediaCount: root.querySelectorAll('img, video, canvas, iframe').length,
            sectionCount: root.querySelectorAll('[data-section-id]').length,
            overflow: document.documentElement.scrollWidth - innerWidth,
            crashed: Boolean(root.querySelector('[data-section-state="error"]')),
          })));
          const axe = await new AxeBuilder({ page }).include('main').withRules(['color-contrast', 'button-name', 'link-name', 'label', 'aria-valid-attr-value', 'aria-required-attr']).analyze();
          result.violations = axe.violations.map(violation => ({ id: violation.id, impact: violation.impact,
            nodes: violation.nodes.map(node => ({ target: node.target, html: node.html, summary: node.failureSummary })) }));
          if (result.violations.length || errors.length || result.overflow > 2 || result.crashed || (result.textLength === 0 && result.mediaCount === 0)) {
            const filename = `${target.type}-${target.industry}-${name}.png`;
            await page.screenshot({ path: path.join(output, 'screenshots', filename), fullPage: true });
            result.screenshot = filename;
          }
        } catch (error) { result.failure = error.message; }
        page.off('pageerror', listener);
        page.off('console', caughtErrorListener);
        results.push(result);
        console.log(`${results.length}/${targets.length * 2} ${target.type}/${target.industry}/${name}: ${result.violations.length} violations, ${errors.length} errors, overflow=${result.overflow}, text=${result.textLength}${result.failure ? ' FAILED' : ''}`);
        reportWrite = reportWrite.then(() => fs.writeFile(path.join(output, 'preview-results.json'), JSON.stringify({ baseUrl, targets: targets.length, results }, null, 2)));
        await reportWrite;
      }
    }
    await context.close();
  }));
} finally { await browser.close(); }
console.log(`Completed ${results.length} preview states for ${targets.length} distinct renderer implementations.`);
const findings = results.filter(result => result.failure || result.status !== 200 || result.errors.length || result.violations.length || result.overflow > 2 || result.crashed || (result.textLength === 0 && result.mediaCount === 0));
console.log(`${findings.length} states need attention.`);
if (findings.length) process.exitCode = 1;
