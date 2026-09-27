import { expect, test, type Page } from '@playwright/test';

/**
 * WP4 fan mockups (spec §7.1), mounted through the real section pages (there
 * is no preview route). Each mockup root carries `data-mock="<Name>"`.
 *
 * - screenshots of every fan mockup in its final (reduced-motion) state
 * - the DOM hooks section animators rely on exist in the server HTML
 * - truth rules hold inside the mockups (no numbers next to coins, no video glyph)
 */

const PAGES = [
  { path: '/', lang: 'ja' },
  { path: '/en', lang: 'en' },
] as const;

const MOCKS = [
  'FirstCall00c', 'CallStageMedia', 'IncomingRing06b', 'MorningSetup06b', 'HomeCards01', 'Conversation04',
  'StoryFlow04to03b', 'Memory06', 'LiveFeedCard', 'LivePlayerStage', 'LiveRequest12', 'LiveSetup13',
  'ShowPreview14', 'ArchiveCard11', 'GrowPicker07', 'CreatorProfile08', 'ReviewStatus10', 'Welcome00a',
  'PickReel00b', 'GuestGate02', 'ReelMini', 'QuestsMini', 'BonusMini', 'InviteMini', 'PlansMini',
  'ConfirmSheetMini', 'MyPageMini', 'SleepMini', 'SignInMini',
] as const;

/** Hooks that must be present in the server HTML (spec §7.1). */
const HOOKS: Record<string, string[]> = {
  FirstCall00c: ['[data-avatar-glow]', '[data-meter]', '[data-m="cta"]'],
  CallStageMedia: ['[data-call-state] [data-s="speaking"]', '[data-caption="fan"] [data-fill-driver="external"]', '[data-caption="oshi"] [data-fill-driver="external"]', '[data-meter]', '[data-toast]', '[data-wave]', '[data-avatar-glow]', '[data-fan-glow]'],
  IncomingRing06b: ['[data-m="portrait"]', '[data-m="accept"]'],
  MorningSetup06b: ['[data-m="time"]', '[data-m="sel"]', '[data-m="ring-card"]'],
  HomeCards01: ['[data-m="play"]', '[data-m="new"]', '[data-m="wave"]'],
  Conversation04: ['[data-m="ended"]', '[data-m="b1"]', '[data-m="b2"]', '[data-m="read"]', '[data-m="typing"][hidden]', '[data-m="b3"]', '[data-m="chips"]'],
  StoryFlow04to03b: ['[data-sub="create"]', '[data-sub="viewer"]', '[data-m="gen"]', '[data-m="scene"]', '[data-m="ai-tag"]', '[data-m="post"]', '[data-m="progress"]', '[data-m="heart"]'],
  Memory06: ['[data-m="nick"]', '[data-m="mode"][data-mode="gentle"]', '[data-m="mode-sel"]', '[data-m="mem"]', '[data-m="lock-2"]'],
  LiveFeedCard: ['[data-m="join"]'],
  LivePlayerStage: ['[data-theme-progress]', '[data-disclaimer]', '[data-comments]', '[data-m="superchat"].is-read', '[data-gift]'],
  LiveSetup13: ['[data-m="topic"]'],
  ShowPreview14: ['[data-m="seg"]', '[data-m="flow"]'],
  CreatorProfile08: ['[data-m="new-row"]'],
  ReviewStatus10: ['[data-status][data-state="approved"]'],
  ReelMini: ['[data-m="reel-track"]', '[data-m="follow"]'],
  QuestsMini: ['[data-m="check"]', '[data-m="reward"]'],
  BonusMini: ['[data-m="day"]'],
  InviteMini: ['[data-m="copy"]'],
  PlansMini: ['[data-m="plan"]'],
  ConfirmSheetMini: ['[data-m="sheet"]', '[data-m="refund"]'],
  MyPageMini: ['[data-m="tab"]', '[data-m="underline"]'],
  SleepMini: ['[data-toggle]', '[data-m="moon"]', '[data-m="sticker"]'],
  SignInMini: ['[data-m="nopw"]'],
};

async function open(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}

for (const { path, lang } of PAGES) {
  test.describe(`fan mockups ${lang}`, () => {
    test('every mockup renders with its hooks', async ({ page }) => {
      await open(page, path);
      for (const name of MOCKS) {
        const root = page.locator(`[data-mock="${name}"]`).first();
        await expect(root, `${name} is on the page`).toHaveCount(1);
        for (const sel of HOOKS[name] ?? []) {
          await expect(root.locator(sel).first(), `${name} ${sel}`).toBeAttached();
        }
      }
    });

    test('truth rules inside mockups', async ({ page }) => {
      await open(page, path);
      const text = await page.locator('[data-mock]').allInnerTexts();
      const all = text.join('\n');
      expect(all).not.toMatch(/\d+\s?(コイン|coins?)/i);
      expect(all).not.toMatch(/[¥$%]|円/);
      expect(all).not.toMatch(/ビデオ|video/i);
      expect(all).not.toMatch(/Mina|Kensei/);
      // Mockup art is decorative: nothing inside it is focusable except the demo link.
      const focusables = await page.locator('[data-mock] :is(a, button, input, [tabindex])').evaluateAll((els) =>
        els.filter((el) => !el.closest('[data-demo-root]')).length,
      );
      expect(focusables).toBe(0);
    });

    test('screenshots', async ({ page }, info) => {
      await open(page, path);
      for (const name of MOCKS) {
        // A mockup can render several times (e.g. desktop phone + mobile slice): shoot the first visible one.
        for (const root of await page.locator(`[data-mock="${name}"]`).all()) {
          // Phone screens live inside PhoneFrame/ScreenSlice figures: shoot the frame when there is one.
          const frame = root.locator('xpath=ancestor::figure[1]');
          const target = (await frame.count()) ? frame : root;
          if (!(await target.isVisible())) continue;
          const box = await target.boundingBox();
          if (!box || box.width < 40 || box.height < 40) continue;
          await target.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
          await target.screenshot({ path: info.outputPath(`${lang}-${info.project.name}-${name}.png`), animations: 'disabled', timeout: 10000 }).catch(() => {});
          break;
        }
      }
    });
  });
}
