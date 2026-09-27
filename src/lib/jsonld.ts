import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { localePath } from '@/i18n/paths';
import { FAN_APP, SITE, STUDIO_APP, STUDIO_LIVE } from './site-config';

// schema.org graphs (spec §8.3). No aggregateRating, FAQPage or HowTo.

const O = SITE.origin;
const ORG_ID = `${O}/#org`;
const WEBSITE_ID = `${O}/#website`;
const FAN_APP_ID = `${O}/#fan-app`;
const STUDIO_ID = `${O}/#lc-studio`;

const abs = (path: string) => (path === '/' ? `${O}/` : `${O}${path}`);

/** First sentence of a dictionary string (JA ends at 「。」, EN at ". "). */
function firstSentence(text: string, lang: Locale): string {
  if (lang === 'ja') {
    const i = text.indexOf('。');
    return i >= 0 ? text.slice(0, i + 1) : text;
  }
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : text;
}

const withStop = (s: string, lang: Locale) => (lang === 'ja' ? `${s}。` : `${s}.`);

export function homeGraph(lang: Locale, d: Dictionary): object {
  const url = abs(localePath(lang, 'home'));
  const appStoreUrl = lang === 'ja' ? FAN_APP.appStoreUrlJa : FAN_APP.appStoreUrlIntl;
  const sep = lang === 'ja' ? '' : ' ';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: SITE.name,
        legalName: SITE.legalName,
        url: `${O}/`,
        logo: { '@type': 'ImageObject', url: `${O}/brand/logo-512.png`, width: 512, height: 512 },
        email: SITE.contactEmail,
        sameAs: [SITE.appStoreDeveloperUrl],
      },
      // The WebSite node lives on `/` only.
      ...(lang === 'ja'
        ? [{ '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE.name, url: `${O}/`, inLanguage: ['ja', 'en'], publisher: { '@id': ORG_ID } }]
        : []),
      {
        '@type': 'WebPage',
        '@id': lang === 'ja' ? `${O}/#webpage` : `${url}#webpage`,
        url,
        name: d.meta.home.title,
        description: d.meta.home.description,
        inLanguage: lang,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': FAN_APP_ID },
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'MobileApplication',
        '@id': FAN_APP_ID,
        name: SITE.name,
        operatingSystem: 'iOS, Android',
        applicationCategory: 'EntertainmentApplication',
        inLanguage: ['ja', 'en'],
        description: `${firstSentence(d.home.faq.items.what.a, lang)}${sep}${withStop(d.common.disclosure, lang)}`,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' },
        installUrl: appStoreUrl,
        downloadUrl: [appStoreUrl, FAN_APP.playUrl],
        publisher: { '@id': ORG_ID },
      },
    ],
  };
}

export function creatorsGraph(lang: Locale, d: Dictionary): object {
  const home = abs(localePath(lang, 'home'));
  const url = abs(localePath(lang, 'creators'));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': ORG_ID, name: SITE.name, legalName: SITE.legalName, url: `${O}/` },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: d.meta.creators.title,
        description: d.meta.creators.description,
        inLanguage: lang,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': STUDIO_ID },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: d.meta.creators.breadcrumbHome, item: home },
          { '@type': 'ListItem', position: 2, name: d.meta.creators.breadcrumbCreators, item: url },
        ],
      },
      {
        '@type': 'MobileApplication',
        '@id': STUDIO_ID,
        name: d.common.studioBrand,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'iOS, Android',
        description: d.creators.faq.items.what.a,
        // Never `offers`: a price of 0 would imply LC Studio is free.
        ...(STUDIO_LIVE ? { installUrl: STUDIO_APP.appStoreUrl, downloadUrl: [STUDIO_APP.appStoreUrl, STUDIO_APP.playUrl] } : {}),
        publisher: { '@id': ORG_ID },
      },
    ],
  };
}
