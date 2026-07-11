import { expect, test } from '@playwright/test';

const VISUAL_DEMOS = [
  'handwerk',
  'hotel',
  'restaurant',
  'medical',
  'wedding',
  'consulting',
  'realestate',
  'shop',
  'fitness',
  'location',
  'eishockey',
] as const;

test.skip(process.env.VISUAL_REGRESSION !== '1', 'Set VISUAL_REGRESSION=1 to run pixel baselines.');

for (const demo of VISUAL_DEMOS) {
  test(`${demo}: visual baseline`, async ({ page }) => {
    await page.goto(`/demo/${demo}`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page).toHaveScreenshot(`${demo}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
