'use client';

import type { Locale } from '@/i18n/config';

type LangAvailableChipProps = { lang: Locale; href: string; label: string; dismissLabel: string };

// STUB (WP0a): WP0b shows the dismissible "English available" / 「日本語で見る」
// chip based on navigator.languages (localStorage['lc.langPill']); never redirects.
export function LangAvailableChip(props: LangAvailableChipProps): null {
  void props;
  return null;
}
