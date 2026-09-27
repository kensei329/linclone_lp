import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { localePath, type PageKey } from '@/i18n/paths';
import { LangAvailableChip } from './LangPill.client';

/**
 * Plain server-rendered link to the other locale; works without JS (spec §4.1).
 * Server component on purpose: passing `d` into a client component would
 * serialise the whole dictionary into the page. The client chip only gets the
 * strings it shows.
 */
export function LangPill({ lang, page, d }: { lang: Locale; page: PageKey; d: Dictionary }) {
  const other: Locale = lang === 'ja' ? 'en' : 'ja';
  return (
    <>
      <a href={localePath(other, page)} hrefLang={other} lang={other} aria-label={d.common.lang.switchLabel} className="lang-pill">
        {d.common.lang[other]}
      </a>
      <LangAvailableChip
        lang={lang}
        href={localePath(other, page)}
        label={lang === 'ja' ? d.common.lang.englishAvailable : d.common.lang.japaneseAvailable}
        dismissLabel={d.common.lang.dismiss}
      />
    </>
  );
}
