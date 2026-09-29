import type { IconName } from '@/components/site/icons/Icon';

/** The seven shipped D01 Home tiles, in the app's order (spec §6.3, §7.2 S2/S3). */
export type TileId = 'publicProfile' | 'fanContent' | 'live' | 'homeVoice' | 'morningCall' | 'fillers' | 'analytics';

export const TILE_ORDER: TileId[] = ['publicProfile', 'fanContent', 'live', 'homeVoice', 'morningCall', 'fillers', 'analytics'];

export const TILE_ICON: Record<TileId, { icon: IconName; tone: 'violet' | 'pink' | 'cyan' | 'gold' }> = {
  publicProfile: { icon: 'badge', tone: 'violet' },
  fanContent: { icon: 'photo_library', tone: 'pink' },
  live: { icon: 'podcasts', tone: 'pink' },
  homeVoice: { icon: 'graphic_eq', tone: 'cyan' },
  morningCall: { icon: 'alarm', tone: 'gold' },
  fillers: { icon: 'chat_bubble', tone: 'cyan' },
  analytics: { icon: 'bar_chart', tone: 'violet' },
};

/**
 * Mobile `ScreenSlice` crops for the setup screens, in 390×844 screen px
 * (spec §7.2). Use with `width.mobile ≥ 292` so the effective scale stays
 * ≥ .75.
 */
export const STUDIO_CROPS = {
  S04QuickPicks: { y: 100, h: 600 },
  S04aOwnWords: { y: 100, h: 620 },
  S05Photos: { y: 100, h: 420 },
  S06ModesFree: { y: 100, h: 520 },
  S07NgTopics: { y: 100, h: 600 },
  S08bRecord: { y: 100, h: 560 },
} as const;
