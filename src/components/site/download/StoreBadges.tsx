import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { Placement } from '@/lib/site-config';
import { storeUrl } from '@/lib/store-links';
import { QrBlock } from './QrBlock';

type StoreBadgesProps = {
  d: Dictionary;
  lang: Locale;
  placement: Placement;
  size?: 'md' | 'lg';
  qr?: boolean;
  showFriction?: boolean;
};

// Official artwork, unmodified (public/badges). Intrinsic ratios: Apple JA
// 108.85×40, EN 119.66×40; Google Play PNGs are 646×250 including Google's
// built-in clear space.
const APPLE_RATIO: Record<Locale, number> = { ja: 108.85157 / 40, en: 119.66407 / 40 };
const PLAY_RATIO = 646 / 250;

/**
 * Both store badges (spec §4.2). STUB (WP0a): correct links, artwork and alt;
 * WP0b adds platform ordering CSS, clear space, BadgeTracker and QR layout.
 */
export function StoreBadges({ d, lang, placement, size = 'md', qr = false, showFriction = false }: StoreBadgesProps) {
  const h = size === 'lg' ? 52 : 44;
  const describedBy = `opens-store-${placement}`;
  return (
    <div data-badges="" className="store-badges">
      <span id={describedBy} hidden>
        {d.a11y.opensStore}
      </span>
      <a href={storeUrl('ios', lang, placement)} aria-describedby={describedBy} className="badge-ios">
        {/* eslint-disable-next-line @next/next/no-img-element -- official SVG artwork, served as-is */}
        <img
          src={`/badges/app-store-${lang}.svg`}
          alt={d.common.store.appStoreBadgeAlt}
          width={Math.round(h * APPLE_RATIO[lang])}
          height={h}
          fetchPriority={placement === 'hero' ? 'high' : undefined}
        />
      </a>
      <a href={storeUrl('android', lang, placement)} aria-describedby={describedBy} className="badge-android">
        {/* eslint-disable-next-line @next/next/no-img-element -- official PNG artwork, served as-is */}
        <img
          src={`/badges/google-play-${lang}.png`}
          alt={d.common.store.googlePlayBadgeAlt}
          width={Math.round(h * PLAY_RATIO)}
          height={h}
        />
      </a>
      {qr ? <QrBlock d={d} lang={lang} placement={`qr_${placement}` as Placement} size={112} /> : null}
      {showFriction ? <p className="t-small">{d.common.freeWithIap}</p> : null}
    </div>
  );
}
