import { test, expect, type Page } from '@playwright/test';

// WP5: LC Studio mockups (spec §7.2), exercised through the /creators pages.
// Screenshots of every mounted mockup in its SSR final state (reduced motion),
// plus the truth and hook contracts the section animators rely on.

const PAGES = [
  { lang: 'ja', path: '/creators' },
  { lang: 'en', path: '/en/creators' },
] as const;

const MOCKS = [
  'S09Building', 'D01Home', 'D01Bento', 'S04QuickPicks', 'S04aOwnWords', 'S05Photos', 'S06ModesFree', 'S07NgTopics',
  'S08bRecord', 'D01bCloneCheck', 'SelfCallStage', 'D06GrowCard', 'D08ProfileCard', 'D04GalleryCard', 'D02bThread',
  'D05Live', 'D07HomeVoiceCard', 'D07bMorningCard', 'D07cFillersCard', 'D09Analytics', 'D10EarningsCalculating',
];

async function open(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}

for (const { lang, path } of PAGES) {
  test.describe(`studio mockups ${lang}`, () => {
    test('every mockup is mounted and screenshotted in its final state', async ({ page }, info) => {
      await open(page, path);
      for (const name of MOCKS) {
        const el = page.locator(`[data-mock="${name}"]`).first();
        await expect(el, `${name} is mounted`).toHaveCount(1);
        if (!(await el.isVisible())) continue; // e.g. desktop-only phone vs mobile slice
        await el.scrollIntoViewIfNeeded();
        await page.screenshot({ path: info.outputPath(`${lang}-${name}.png`), clip: (await el.boundingBox()) ?? undefined });
      }
    });

    test('truth rules hold inside the mockups', async ({ page }) => {
      await open(page, path);
      const text = await page.locator('[data-mock]').allInnerTexts();
      const all = text.join('\n');
      expect(all).not.toMatch(/ファン|あなた|ライブ|\bfans?\b/i);
      expect(all).not.toMatch(/[¥$%]|\d+\s?(コイン|coins?)/i);
      expect(all).not.toMatch(/interview|インタビュー|24時間|24 hours|co-host|共同配信/i);
      // Only clocks/timers and the analytics range labels carry digits.
      const digits = all.replace(/\d{1,2}:\d{2}/g, '').replace(/(7|30|90)(日| days)/g, '').match(/\d/g);
      expect(digits, 'no figures in the Studio mockups').toBeNull();
      expect(await page.locator('[data-mock] path[d*="videocam"]').count()).toBe(0);
    });

    test('hook contract and SSR final states', async ({ page }) => {
      await open(page, path);
      // Setup screens mount twice (desktop phone + mobile slice): scope to one.
      const mock = (name: string) => page.locator(`[data-mock="${name}"]`).first();
      // D01Bento: a nav of seven real tile links with "label: desc" names.
      const tiles = mock('D01Bento').locator('a[data-tile]');
      await expect(tiles).toHaveCount(7);
      for (const t of await tiles.all()) expect(await t.getAttribute('aria-label')).toMatch(/.+: .+/);
      await expect(mock('D01Bento').locator('[data-tile-arrow]')).toHaveCount(7);
      // Setup finals.
      await expect(mock('S04QuickPicks').locator('[data-m="pick"].is-selected')).toHaveCount(4);
      await expect(mock('S04aOwnWords').locator('[data-m="link-wiki"][data-state="analyzed"]')).toHaveCount(1);
      await expect(mock('S06ModesFree').locator('[data-m="mode"]')).toHaveCount(6);
      await expect(page.locator('[data-mock="S07NgTopics"]:not([data-compact])').first().locator('[data-m="ng-row"] [data-toggle][data-on]')).toHaveCount(5);
      // Control / real / voice / insights finals.
      await expect(mock('D06GrowCard').locator('[data-m="grow-card"]')).toHaveAttribute('data-state', 'approved');
      await expect(mock('D08ProfileCard').locator('[data-toggle="ai-images"]')).toHaveAttribute('data-on', '');
      await expect(mock('D02bThread').locator('[data-toggle="pause"]')).not.toHaveAttribute('data-on', /.*/);
      await expect(mock('D07HomeVoiceCard').locator('[data-m="pipe"][data-lit]')).toHaveCount(3);
      await expect(mock('D09Analytics').locator('[data-bar]')).toHaveCount(7);
      // The self-call ring is violet in the final state.
      const ring = page.locator('[data-self-ring]').first();
      await expect(ring).toHaveCSS('border-top-color', 'rgb(139, 85, 214)');
    });
  });
}
