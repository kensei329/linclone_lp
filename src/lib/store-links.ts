import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { FAN_APP, SITE, type Placement } from './site-config';

export function storeUrl(store: 'ios' | 'android', lang: Locale, placement: Placement): string {
  if (store === 'ios') {
    const base = lang === 'ja' ? FAN_APP.appStoreUrlJa : FAN_APP.appStoreUrlIntl;
    const q = new URLSearchParams({ ct: `lp_${placement}_${lang}`, mt: '8' });
    if (FAN_APP.appStoreProviderToken) q.set('pt', FAN_APP.appStoreProviderToken);
    return `${base}?${q}`;
  }
  const ref = `utm_source=linclone_lp&utm_medium=${placement}&utm_campaign=${lang}`;
  return `${FAN_APP.playUrl}&hl=${lang}&referrer=${encodeURIComponent(ref)}`;
}

/** No-JS / QR entry point; /get redirects by user agent. */
export const getUrl = (placement: Placement, lang: Locale): string => `/get?src=${placement}&lang=${lang}`;
export const getAbsUrl = (placement: Placement, lang: Locale): string => `${SITE.origin}${getUrl(placement, lang)}`;

/** Server-computed hrefs for client islands (MobileDownloadBar). */
export function hrefs(placement: Placement, lang: Locale): { appStoreHref: string; playHref: string; getHref: string } {
  return { appStoreHref: storeUrl('ios', lang, placement), playHref: storeUrl('android', lang, placement), getHref: getUrl(placement, lang) };
}

/** LC Studio invitation request (the only Studio CTA while it is invite-only). */
export function mailtoStudio(lang: Locale, d: Dictionary): string {
  // `lang` is part of the contract; the template is already localised through `d`.
  void lang;
  const { subject, body } = d.creators.mailto;
  return `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
