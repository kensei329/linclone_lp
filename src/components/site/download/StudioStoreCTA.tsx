import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { STUDIO_APP, STUDIO_LIVE } from '@/lib/site-config';
import { Icon } from '../icons/Icon';

/**
 * LC Studio store row (spec §4.2). While STUDIO_LIVE is false: two neutral
 * 近日公開 pills, aria-disabled and not links, with no badge artwork. When it
 * flips: the official badges linking to the Studio listings.
 */
export function StudioStoreCTA({ d, lang, compact = false }: { d: Dictionary; lang: Locale; compact?: boolean }) {
  const s = d.common.store;
  if (STUDIO_LIVE) {
    return (
      <p className="studio-store" data-compact={compact ? '' : undefined}>
        <a href={STUDIO_APP.appStoreUrl} className="badge badge-ios">
          {/* eslint-disable-next-line @next/next/no-img-element -- official SVG artwork, served as-is */}
          <img src={`/badges/app-store-${lang}.svg`} alt={s.appStoreBadgeAlt} height={compact ? 36 : 44} width={compact ? 98 : 120} />
        </a>
        <a href={STUDIO_APP.playUrl} className="badge">
          {/* eslint-disable-next-line @next/next/no-img-element -- official PNG artwork, served as-is */}
          <img src={`/badges/google-play-${lang}.png`} alt={s.googlePlayBadgeAlt} height={compact ? 47 : 57} width={compact ? 121 : 147} />
        </a>
      </p>
    );
  }
  const join = lang === 'ja' ? '・' : ' · ';
  const ios = compact ? `${s.appStoreName}${join}${s.comingSoonSuffix}` : d.creators.hero.storePillIos;
  const android = compact ? `${s.googlePlayName}${join}${s.comingSoonSuffix}` : d.creators.hero.storePillAndroid;
  return (
    <p className="studio-store" data-compact={compact ? '' : undefined}>
      <span className="pill-disabled" aria-disabled="true">
        <Icon name="phone_iphone" size={16} />
        {ios}
      </span>
      <span className="pill-disabled" aria-disabled="true">
        <Icon name="android" size={16} />
        {android}
      </span>
    </p>
  );
}
