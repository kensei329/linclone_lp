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

/**
 * The same full Organization and WebSite nodes on every page: every WebPage
 * points at #website via isPartOf, so each graph must define it.
 */
const ORGANIZATION = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  legalName: SITE.legalName,
  url: `${O}/`,
  logo: { '@type': 'ImageObject', url: `${O}/brand/logo-512.png`, width: 512, height: 512 },
  email: SITE.contactEmail,
  sameAs: [SITE.appStoreDeveloperUrl],
} as const;
const WEBSITE = { '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE.name, url: `${O}/`, inLanguage: ['ja', 'en'], publisher: { '@id': ORG_ID } } as const;

export function homeGraph(lang: Locale, d: Dictionary): object {
  const url = abs(localePath(lang, 'home'));
  const appStoreUrl = lang === 'ja' ? FAN_APP.appStoreUrlJa : FAN_APP.appStoreUrlIntl;
  const sep = lang === 'ja' ? '' : ' ';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ORGANIZATION,
      WEBSITE,
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
      ORGANIZATION,
      WEBSITE,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: d.meta.creators.title,
        description: d.meta.creators.description,
        inLanguage: lang,
        isPartOf: { '@id': WEBSITE_ID },
        // LC Studio is described as an app only once it is public (verdict: no
        // MobileApplication while unpublished); until then the page is about the company.
        about: { '@id': STUDIO_LIVE ? STUDIO_ID : ORG_ID },
        publisher: { '@id': ORG_ID },
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
      ...(STUDIO_LIVE
        ? [
            {
              '@type': 'MobileApplication',
              '@id': STUDIO_ID,
              name: d.common.studioBrand,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'iOS, Android',
              description: d.creators.faq.items.what.a,
              // Never `offers`: a price of 0 would imply LC Studio is free.
              installUrl: STUDIO_APP.appStoreUrl,
              downloadUrl: [STUDIO_APP.appStoreUrl, STUDIO_APP.playUrl],
              publisher: { '@id': ORG_ID },
            },
          ]
        : []),
    ],
  };
}
