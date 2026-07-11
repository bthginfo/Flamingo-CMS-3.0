import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const DEMOS = [
  'handwerk',
  'hotel',
  'restaurant',
  'medical',
  'salon',
  'tourism',
  'wedding',
  'photography',
  'consulting',
  'realestate',
  'cafe',
  'tattoo',
  'shop',
  'retail',
  'florist',
  'fitness',
  'location',
  'eishockey',
] as const;

for (const demo of DEMOS) {
  test(`${demo}: semantic, responsive and accessible smoke`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().includes('ERR_BLOCKED_BY_CLIENT')) {
        consoleErrors.push(message.text());
      }
    });

    const response = await page.goto(`/demo/${demo}`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await page.locator('main').waitFor({ state: 'visible' });
    // Scrolling before React finishes hydrating can mutate native image
    // loading state and create a test-induced attribute mismatch. The outer
    // client boundary marks the document after its hydration commit.
    await page.locator('html[data-flamingo-hydrated="true"]').waitFor({ state: 'attached' });

    const title = await page.title();
    expect(title).not.toBe('Flamingo CMS');
    expect(title.toLowerCase()).not.toContain('startseite |');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.trim()).toBeTruthy();
    expect(description).not.toBe('Powered by Flamingo CMS');

    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.locator('a[href="#"]').count()).toBe(0);

    // Exercise lazy-loaded media instead of treating unfinished requests as
    // healthy. A single requestAnimationFrame per viewport is too fast for
    // IntersectionObserver + Next's dev image optimizer, and produced false
    // negatives for every image-heavy tenant. Promote discovered images to
    // eager, pause briefly at each viewport, then wait for load/error events.
    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight * 0.8, 400);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise<void>((resolve) => setTimeout(resolve, 60));
      }
      const images = Array.from(document.images);
      images.forEach((image) => { image.loading = 'eager'; });
      await Promise.all(images.map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const done = () => {
            image.removeEventListener('load', done);
            image.removeEventListener('error', done);
            resolve();
          };
          image.addEventListener('load', done, { once: true });
          image.addEventListener('error', done, { once: true });
          setTimeout(done, 45_000);
        });
      }));
      window.scrollTo(0, 0);
    });
    // Axe evaluates colours after ancestor opacity has been composited. Give
    // the final in-view fade time to settle so we audit the rendered design,
    // not a single translucent animation frame.
    await page.waitForTimeout(2_000);
    await expect.poll(
      () => page.evaluate(() => Array.from(document.images)
        .filter((image) => !image.complete)
        .map((image) => image.currentSrc || image.src)),
      { timeout: 10_000, message: 'All discovered demo images should finish loading' },
    ).toEqual([]);

    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      brokenImages: Array.from(document.images)
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
    expect(layout.brokenImages).toEqual([]);

    const a11y = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blocking = a11y.violations.filter((violation) => (
      violation.impact === 'critical' || violation.impact === 'serious'
    ));
    expect(blocking, blocking.map((issue) => `${issue.id}: ${issue.help}`).join('\n')).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}
