import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { localePath, type PageKey } from '@/i18n/paths';
import { Icon } from '../icons/Icon';

/**
 * Plain server-rendered link to the other locale; works without JS and never
 * redirects (spec §4.1). The dismissible "available" chip is the separate
 * `LangAvailableChip` island, mounted once by the Header, so the footer and
 * menu copies of this pill stay static.
 */
export function LangPill({ lang, page, d }: { lang: Locale; page: PageKey; d: Dictionary }) {
  const other: Locale = lang === 'ja' ? 'en' : 'ja';
  return (
    <a
      href={localePath(other, page)}
      hrefLang={other}
      lang={other}
      aria-label={`${d.common.lang.switchLabel}: ${d.common.lang[other]}`}
      className="lang-pill"
      data-analytics={`lang_switch:${other}`}
    >
      <Icon name="language" size={16} />
      {d.common.lang[other]}
    </a>
  );
}
