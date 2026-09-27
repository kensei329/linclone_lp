'use client';

import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export type MobileDownloadBarClientProps = {
  t: Dictionary['stickyBar'];
  lang: Locale;
  appStoreHref: string;
  playHref: string;
  getHref: string;
};

// STUB (WP0a): WP0b implements the visibility rules of spec §4.1; until then
// nothing renders (the header CTA still works without it).
export function MobileDownloadBarClient(props: MobileDownloadBarClientProps): null {
  void props;
  return null;
}
