import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { STUDIO_APP, STUDIO_LIVE } from '@/lib/site-config';
import { Icon } from '../icons/Icon';

/**
 * LC Studio store row (spec §4.2). While STUDIO_LIVE is false: two disabled
 * 近日公開 pills and no badge artwork. STUB (WP0a): WP0b styles `.pill-disabled`
 * and swaps in official badges when STUDIO_LIVE flips.
 */
export function StudioStoreCTA({ d, lang, compact = false }: { d: Dictionary; lang: Locale; compact?: boolean }) {
  const join = lang === 'ja' ? '・' : ' · ';
  const ios = compact ? `${d.common.store.appStoreName}${join}${d.common.store.comingSoonSuffix}` : d.creators.hero.storePillIos;
  const android = compact ? `${d.common.store.googlePlayName}${join}${d.common.store.comingSoonSuffix}` : d.creators.hero.storePillAndroid;
  if (STUDIO_LIVE) {
    return (
      <p className="studio-store">
        <a href={STUDIO_APP.appStoreUrl}>{d.common.store.appStoreName}</a>
        <a href={STUDIO_APP.playUrl}>{d.common.store.googlePlayName}</a>
      </p>
    );
  }
  return (
    <p className="studio-store">
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
