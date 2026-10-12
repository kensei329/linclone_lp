import type { Locale } from '@/i18n/config';
import jaCommon from '@/i18n/dictionaries/ja/common.json';
import enCommon from '@/i18n/dictionaries/en/common.json';
import jaHeader from '@/i18n/dictionaries/ja/header.json';
import enHeader from '@/i18n/dictionaries/en/header.json';
import jaMeta from '@/i18n/dictionaries/ja/meta.json';
import enMeta from '@/i18n/dictionaries/en/meta.json';
import { localePath } from '@/i18n/paths';
import { clonePageCopy, type ClonePageCopyKey } from '@/content/clone-pages/strings';
import type { StateVariant } from './NotAvailable.client';

// Both locales of a no-action state, for the not-found boundaries
// (they cannot read [lang] on the server).
// Reads only the three small site dictionaries it needs, so it is safe in a
// client bundle (getDictionary() is server-only and loads every namespace).
const SITE = {
  ja: { common: jaCommon, header: jaHeader, meta: jaMeta },
  en: { common: enCommon, header: enHeader, meta: enMeta },
} as const;

export function stateVariants(titleKey: ClonePageCopyKey, bodyKey: ClonePageCopyKey): Record<Locale, StateVariant> {
  const one = (lang: Locale): StateVariant => {
    const d = SITE[lang];
    const copy = clonePageCopy(lang);
    return {
      brand: d.common.brand,
      homeHref: localePath(lang, 'home'),
      homeAria: d.header.homeLabel,
      homeLabel: d.meta.notFound.home,
      title: copy[titleKey],
      body: copy[bodyKey],
    };
  };
  return { ja: one('ja'), en: one('en') };
}
