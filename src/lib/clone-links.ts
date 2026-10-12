// DONE-C (Ritik's contract docs/DONE-C-HANDOFF.md §2, branch claude/k1009-donec
// of clone-net-web): the store and app-scheme links of the clone page
// (/c/<slug>) and the LC Studio invitation page (/studio/invite/<code>).
// Constants on purpose: the contract fixes these exact URLs, so they do not
// reuse storeUrl() (which adds campaign parameters and a referrer of its own).
// Pure module: imported by both server components and the hand-off button.

export const FAN_APP_LINKS = {
  appStore: 'https://apps.apple.com/jp/app/id6748680628',
  playBase: 'https://play.google.com/store/apps/details?id=com.linclone.app',
} as const;

export const STUDIO_APP_LINKS = {
  appStore: 'https://apps.apple.com/jp/app/id6798622206',
  playBase: 'https://play.google.com/store/apps/details?id=com.linclone.studio',
} as const;

/**
 * Play URL carrying the page URL through the Play Install Referrer, exactly as
 * §2.1 step 5 / §2.3 step 3 specify:
 * `&referrer=` + encodeURIComponent("lc_link=" + encodeURIComponent(url)).
 * The app reads `lc_link` from getInstallReferrerAsync() on first launch.
 */
export function playUrlWithLink(playBase: string, url: string): string {
  return `${playBase}&referrer=${encodeURIComponent(`lc_link=${encodeURIComponent(url)}`)}`;
}

/** The fan app's scheme link to a creator page (§2.1 step 6; today's app understands it). */
export function fanAppSchemeLink(influencerId: string): string {
  return `linclone://share/clone/${encodeURIComponent(influencerId)}`;
}

/** Everything the copy-then-store button needs (serialisable: passed to a client island). */
export type HandoffTargets = {
  /** What is copied to the clipboard on tap: the page's canonical https URL. */
  copyUrl: string;
  appStore: string;
  play: string;
  /** Tried first inside LINE / Instagram / X in-app browsers, then the store. */
  appLink: string;
};

export function fanHandoff(url: string, influencerId: string): HandoffTargets {
  return { copyUrl: url, appStore: FAN_APP_LINKS.appStore, play: playUrlWithLink(FAN_APP_LINKS.playBase, url), appLink: fanAppSchemeLink(influencerId) };
}

export function studioHandoff(url: string, appLink: string): HandoffTargets {
  return { copyUrl: url, appStore: STUDIO_APP_LINKS.appStore, play: playUrlWithLink(STUDIO_APP_LINKS.playBase, url), appLink };
}
