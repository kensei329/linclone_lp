import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { MobileDownloadBarClient } from './MobileDownloadBar.client';

type MobileDownloadBarProps = { d: Dictionary; lang: Locale; appStoreHref: string; playHref: string; getHref: string };

/**
 * Sticky mobile download bar (spec §4.1). Server wrapper so only the bar's own
 * strings cross into the client island (never the whole dictionary).
 */
export function MobileDownloadBar({ d, lang, appStoreHref, playHref, getHref }: MobileDownloadBarProps) {
  return <MobileDownloadBarClient t={d.stickyBar} lang={lang} appStoreHref={appStoreHref} playHref={playHref} getHref={getHref} />;
}
