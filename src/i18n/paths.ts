import type { Metadata } from 'next';
import type { Locale } from './config';

export type PageKey = 'home' | 'creators';

const PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { ja: '/', en: '/en' },
  creators: { ja: '/creators', en: '/en/creators' },
};

/** ('ja','home') → '/', ('en','creators','#faq') → '/en/creators#faq'. JA is served unprefixed. */
export function localePath(lang: Locale, page: PageKey, hash?: string): string {
  const base = PATHS[page][lang];
  if (!hash) return base;
  return `${base}${hash.startsWith('#') ? hash : `#${hash}`}`;
}

/** Self-canonical plus reciprocal hreflang; x-default is the JA page (spec §8.1). */
export function alternatesFor(page: PageKey, lang: Locale): NonNullable<Metadata['alternates']> {
  const p = PATHS[page];
  return {
    canonical: p[lang],
    languages: { ja: p.ja, en: p.en, 'x-default': p.ja },
  };
}
