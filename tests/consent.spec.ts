import { expect, test } from '@playwright/test';

const STORAGE_KEY = 'flamingo_consent';

async function startWithoutConsent(page: import('@playwright/test').Page) {
  await page.addInitScript((key) => {
    const marker = `${key}:test-initialized`;
    if (window.sessionStorage.getItem(marker)) return;
    window.localStorage.removeItem(key);
    window.sessionStorage.setItem(marker, '1');
  }, STORAGE_KEY);
}

test('external maps stay blocked until functional consent and persist afterwards', async ({ page }) => {
  await startWithoutConsent(page);
  await page.goto('/demo/handwerk/kontakt', { waitUntil: 'domcontentloaded' });
  await page.locator('main').waitFor({ state: 'visible' });

  await expect(page.locator('[data-consent-banner]')).toBeVisible();
  await expect(page.locator('[data-consent-state="blocked"][data-consent-category="functional"]')).toBeVisible();
  await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(0);

  await page.getByRole('button', { name: 'Inhalt laden' }).first().click();
  await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(1);
  await expect(page.locator('[data-consent-banner]')).toHaveCount(0);

  const saved = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), STORAGE_KEY);
  expect(saved).toMatchObject({ necessary: true, functional: true, analytics: false, marketing: false, v: 1 });
  expect(saved.ts).toBeGreaterThan(0);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(1);
  await expect(page.locator('[data-consent-banner]')).toHaveCount(0);
});

test('necessary-only choice closes the banner without loading external maps', async ({ page }) => {
  await startWithoutConsent(page);
  await page.goto('/demo/handwerk/kontakt', { waitUntil: 'domcontentloaded' });
  await page.locator('main').waitFor({ state: 'visible' });

  await page.getByRole('button', { name: 'Nur notwendige' }).click();
  await expect(page.locator('[data-consent-banner]')).toHaveCount(0);
  await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(0);

  const saved = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), STORAGE_KEY);
  expect(saved).toMatchObject({ necessary: true, functional: false, analytics: false, marketing: false, v: 1 });
});
