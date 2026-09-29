import { test, expect } from '@playwright/test';

// STUB (WP0a), owned by WP7: replace with the §9.7 checklist.
for (const path of ['/', '/en', '/creators', '/en/creators']) {
  test(`${path} has exactly one h1`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}
