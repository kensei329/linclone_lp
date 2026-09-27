import { useId, type CSSProperties } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { Placement } from '@/lib/site-config';
import { storeUrl } from '@/lib/store-links';
import { QrBlock } from './QrBlock';
import { BadgeTracker } from './BadgeTracker.client';

type StoreBadgesProps = {
  d: Dictionary;
  lang: Locale;
  placement: Placement;
  size?: 'md' | 'lg';
  qr?: boolean;
  showFriction?: boolean;
};

// Official artwork, unmodified (public/badges). Apple SVGs are 40 units tall
// with no padding. The Google Play PNGs are 646×250 and include Google's own
// clear space (JA art: visible 646×192 from y=29; EN art: 564×168 from 41,41),
// so the image is scaled up and its padding cancelled with negative margins
// until the visible badge matches the Apple badge height (--bh).
const APPLE_RATIO: Record<Locale, number> = { ja: 108.85157 / 40, en: 119.66407 / 40 };
const PLAY_VISIBLE: Record<Locale, { x: number; y: number; h: number }> = {
  ja: { x: 0, y: 29, h: 192 },
  en: { x: 41, y: 41, h: 168 },
};

/**
 * Both official store badges (spec §4.2). Platform ordering and the mobile
 * single-badge layout are CSS only (html[data-platform], set before paint).
 */
export function StoreBadges({ d, lang, placement, size = 'md', qr = false, showFriction = false }: StoreBadgesProps) {
  const describedBy = `opens-store-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const h = size === 'lg' ? 52 : 44;
  const play = PLAY_VISIBLE[lang];
  const playVars = {
    '--play-scale': (250 / play.h).toFixed(4),
    '--play-mt': (-play.y / play.h).toFixed(4),
    '--play-mx': (-play.x / play.h).toFixed(4),
  } as CSSProperties;
  const playImgH = Math.round((h * 250) / play.h);
  const ios = storeUrl('ios', lang, placement);
  const android = storeUrl('android', lang, placement);

  return (
    <BadgeTracker placement={placement} lang={lang} size={size}>
      <div className="badges-row">
        <a href={ios} className="badge badge-ios" data-store="ios" aria-describedby={describedBy}>
          {/* eslint-disable-next-line @next/next/no-img-element -- official SVG artwork, served as-is */}
          <img
            src={`/badges/app-store-${lang}.svg`}
            alt={d.common.store.appStoreBadgeAlt}
            width={Math.round(h * APPLE_RATIO[lang])}
            height={h}
            fetchPriority={placement === 'hero' ? 'high' : undefined}
            decoding="async"
          />
        </a>
        <a href={android} className="badge badge-android" data-store="android" aria-describedby={describedBy} style={playVars}>
          {/* eslint-disable-next-line @next/next/no-img-element -- official PNG artwork, served as-is */}
          <img
            src={`/badges/google-play-${lang}.png`}
            alt={d.common.store.googlePlayBadgeAlt}
            width={Math.round((playImgH * 646) / 250)}
            height={playImgH}
            fetchPriority={placement === 'hero' ? 'high' : undefined}
            decoding="async"
          />
        </a>
        <a href={android} className="badge-alt badge-alt-android" data-store="android" aria-describedby={describedBy}>
          {d.common.store.otherStoreFromIos}
        </a>
        <a href={ios} className="badge-alt badge-alt-ios" data-store="ios" aria-describedby={describedBy}>
          {d.common.store.otherStoreFromAndroid}
        </a>
      </div>
      {qr ? <QrBlock d={d} lang={lang} placement={(placement.startsWith('qr_') ? placement : `qr_${placement}`) as Placement} size={112} /> : null}
      {showFriction ? <p className="t-small badges-meta">{d.common.freeWithIap}</p> : null}
      <span id={describedBy} hidden>
        {d.a11y.opensStore}
      </span>
    </BadgeTracker>
  );
}
