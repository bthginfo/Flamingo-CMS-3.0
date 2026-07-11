import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const DEMOS = [
  'handwerk', 'hotel', 'restaurant', 'medical', 'salon', 'tourism',
  'wedding', 'photography', 'consulting', 'realestate', 'cafe', 'tattoo',
  'shop', 'retail', 'florist', 'fitness', 'location', 'eishockey',
] as const;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

function demosToAudit(): readonly string[] {
  const requested = (process.env.QA_DEMOS || '').split(',').map(value => value.trim()).filter(Boolean);
  if (!requested.length) return DEMOS;
  const known = new Set<string>(DEMOS);
  const unknown = requested.filter(value => !known.has(value));
  if (unknown.length) throw new Error(`Unknown QA_DEMOS value(s): ${unknown.join(', ')}`);
  return requested;
}

async function main() {
  const baseUrl = (process.env.QA_BASE_URL || 'http://localhost:3002').replace(/\/$/, '');
  const browser = await chromium.launch();
  let total = 0;
  let failedPages = 0;

  try {
    for (const demo of demosToAudit()) {
      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: 'light',
          reducedMotion: 'reduce',
        });
        const page = await context.newPage();
        const response = await page.goto(`${baseUrl}/demo/${demo}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        if (!response?.ok()) {
          console.log(`${demo}/${viewport.name}: HTTP ${response?.status() || 'no response'}`);
          failedPages += 1;
          await context.close();
          continue;
        }
        await page.locator('main').waitFor({ state: 'visible' });
        await page.locator('html[data-flamingo-hydrated="true"]').waitFor({ state: 'attached' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          const step = Math.max(window.innerHeight * 0.8, 400);
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise<void>((resolve) => setTimeout(resolve, 40));
          }
          window.scrollTo(0, 0);
        });
        // Avoid auditing a translucent intermediate frame from an in-view fade.
        await page.waitForTimeout(2_000);
        const result = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
        const nodes = result.violations.flatMap((violation) => violation.nodes);
        total += nodes.length;
        console.log(`${demo}/${viewport.name}: ${nodes.length} contrast node${nodes.length === 1 ? '' : 's'}`);
        for (const node of nodes) {
          const check = node.any.find((entry) => entry.id === 'color-contrast');
          const data = check?.data as { fgColor?: string; bgColor?: string; contrastRatio?: number; expectedContrastRatio?: string } | undefined;
          const selector = node.target.join(' ');
          console.log(`  ${data?.fgColor || '?'} on ${data?.bgColor || '?'} = ${data?.contrastRatio ?? '?'} (need ${data?.expectedContrastRatio || '?'}) :: ${selector}`);
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`total=${total} failedPages=${failedPages}`);
  process.exitCode = total || failedPages ? 1 : 0;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
