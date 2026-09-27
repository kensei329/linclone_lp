// Site-wide constants and owner-gated flags (spec §10, §1.4). Every flag
// defaults to the conservative choice; flip them only on owner sign-off.

export const SITE = {
  origin: 'https://www.linclone.com',
  name: 'LinClone',
  legalName: 'LinClone K.K.',
  contactEmail: 'info@linclone.com',
  appStoreDeveloperUrl: 'https://apps.apple.com/jp/developer/linclone-k-k/id1826974719',
} as const;
export const SITE_LAST_MODIFIED = '2026-10-15'; // bump by hand when marketing pages change

export const FAN_APP = {
  appStoreId: '6748680628',
  appStoreUrlJa: 'https://apps.apple.com/jp/app/linclone/id6748680628',
  appStoreUrlIntl: 'https://apps.apple.com/app/id6748680628',
  playPackage: 'com.linclone.app',
  playUrl: 'https://play.google.com/store/apps/details?id=com.linclone.app',
  appStoreProviderToken: null as string | null, // owner to supply App Store Connect `pt`
} as const;

/** Flip to true ONLY when LC Studio is public on BOTH stores. Swaps 近日公開 pills → official badges + real links. */
export const STUDIO_LIVE: boolean = false;
export const STUDIO_APP = {
  appStoreId: '6798622206',
  appStoreUrl: 'https://apps.apple.com/app/id6798622206',
  playPackage: 'com.linclone.studio',
  playUrl: 'https://play.google.com/store/apps/details?id=com.linclone.studio',
} as const;

/** false → show common.devNote under mockups. */
export const LAUNCH: { readonly v3PublicOnStores: boolean } = { v3PublicOnStores: false };

/** Owner-gated claims. Default false = the conservative copy ships. */
export const CLAIMS: {
  readonly liveTimingWired: boolean;
  readonly builtFromOwnVoice: boolean;
  readonly liveDropIn: boolean;
  readonly legacyCarryOver: boolean;
} = {
  liveTimingWired: false, // 「通常約1分」 wired LIVE copy (needs owner approval under the numbers rule)
  builtFromOwnVoice: false, // "made from the creator's own voice and words" (unverified for legacy v1.0 clones)
  liveDropIn: false, // Studio LIVE "drop in as the real you" (shipped_confidence: likely)
  legacyCarryOver: false, // Studio v1.0 clone carry-over (likely)
};

/** Verified official social accounts only. Empty until the owner confirms. */
export const SOCIAL: { name: 'X' | 'Instagram' | 'TikTok' | 'YouTube' | 'LINE'; url: string }[] = [];

/** Rights-cleared fictional demo voice sample, or null (captions-only demo). Never a real creator. */
export const DEMO_AUDIO_SRC: string | null = null;

export type Placement =
  | 'header' | 'hero' | 'demo' | 'checkpoint' | 'how' | 'final' | 'sticky' | 'footer' | 'faq'
  | `qr_${'hero' | 'demo' | 'how' | 'final' | 'dock' | 'header'}`;
/** LC Studio mailto / copy-address placements (analytics `studio_mailto{loc}`, `studio_copy_email{loc}`). */
export type StudioPlacement = 'header' | 'hero' | 'join' | 'final' | 'footer';
