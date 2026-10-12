import type { CSSProperties } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { localePath } from '@/i18n/paths';
import { qrSvg } from '@/lib/qr';
import type { HandoffTargets } from '@/lib/clone-links';
import type { ClonePageCopy } from '@/content/clone-pages/strings';
import { HandoffButton } from './HandoffButton.client';
import type { ShellProps } from './frame';
import './clone-pages.css';

// Building blocks of the DONE-C pages (/c/<slug>, /studio/invite/<code>).
// Phone vs computer is CSS only, keyed off html[data-platform] that the (site)
// layout's head script sets before first paint, so the HTML is one cacheable
// render for every visitor (no user-agent read on the server). Without JS
// there is no data-platform: the computer view (plain store links + QR) shows.

export type HandoffLoc = 'clone_page' | 'studio_invite';

/** Shell props from the site dictionary (approved strings: brand, home label, language names). */
export function shellProps(d: Dictionary, lang: Locale, otherLangHref?: string): Omit<ShellProps, 'children'> {
  const other: Locale = lang === 'ja' ? 'en' : 'ja';
  return {
    brand: d.common.brand,
    homeHref: localePath(lang, 'home'),
    homeAria: d.header.homeLabel,
    langLink: otherLangHref ? { href: otherLangHref, label: d.common.lang[other], lang: other } : undefined,
  };
}

/** Phone view: the one copy-then-store button and its hint. Hidden on computers. */
export function PhoneHandoff({ targets, label, hint, loc }: { targets: HandoffTargets; label: string; hint: string; loc: HandoffLoc }) {
  return (
    <div className="cp-phone">
      <HandoffButton targets={targets} label={label} describedBy={`cp-hint-${loc}`} loc={loc} />
      <p id={`cp-hint-${loc}`} className="t-small cp-hint">
        {hint}
      </p>
    </div>
  );
}

// Official badge artwork as on the rest of the site (StoreBadges.tsx): Apple
// SVGs are 40 units tall; the Google Play PNGs carry Google's clear space,
// cancelled with negative margins so the visible badge matches --bh.
const APPLE_RATIO: Record<Locale, number> = { ja: 108.85157 / 40, en: 119.66407 / 40 };
const PLAY_VISIBLE: Record<Locale, { x: number; y: number; h: number }> = { ja: { x: 0, y: 29, h: 192 }, en: { x: 41, y: 41, h: 168 } };
const PLAY_FILE: Record<Locale, { w: number; h: number }> = { ja: { w: 352, h: 136 }, en: { w: 646, h: 250 } };
const BADGE_H = 44;
const QR_PX = 168;

/**
 * Computer view (contract §2.4, one template for both pages): the right app's
 * store badges (constant URLs) and a QR code of the page's canonical `url`,
 * so the phone that scans it lands on the same page. Hidden on phones.
 */
export async function ComputerPanel({
  d,
  lang,
  copy,
  storesLabel,
  targets,
  qrUrl,
  loc,
}: {
  d: Dictionary;
  lang: Locale;
  copy: ClonePageCopy;
  storesLabel: string;
  targets: HandoffTargets;
  qrUrl: string;
  loc: HandoffLoc;
}) {
  const svg = await qrSvg(qrUrl, QR_PX);
  const play = PLAY_VISIBLE[lang];
  const playVars = {
    '--play-scale': (250 / play.h).toFixed(4),
    '--play-mt': (-play.y / play.h).toFixed(4),
    '--play-mx': (-play.x / play.h).toFixed(4),
  } as CSSProperties;
  const playImgH = Math.round((BADGE_H * 250) / play.h);
  const analytics = `cta_click:${loc}_computer`;
  return (
    <section className="cp-computer glass" aria-labelledby="cp-computer-title">
      <h2 id="cp-computer-title" className="cp-computer-title">
        {copy['shared.computerTitle']}
      </h2>
      <figure className="qr-block cp-qr">
        <div role="img" aria-label={copy['shared.qrAlt']} className="qr-card" style={{ '--qr': `${QR_PX}px` } as CSSProperties} dangerouslySetInnerHTML={{ __html: svg }} />
        <figcaption className="t-small">{copy['shared.qrCaption']}</figcaption>
      </figure>
      <div className="cp-stores">
        <p className="cp-stores-label">{storesLabel}</p>
        <div className="store-badges cp-badges">
          <div className="badges-row">
            <a href={targets.appStore} className="badge badge-ios" data-store="ios" data-analytics={analytics} aria-describedby="cp-opens-store">
              {/* eslint-disable-next-line @next/next/no-img-element -- official SVG artwork, served as-is */}
              <img src={`/badges/app-store-${lang}.svg`} alt={d.common.store.appStoreBadgeAlt} width={Math.round(BADGE_H * APPLE_RATIO[lang])} height={BADGE_H} decoding="async" />
            </a>
            <a href={targets.play} className="badge badge-android" data-store="android" data-analytics={analytics} aria-describedby="cp-opens-store" style={playVars}>
              {/* eslint-disable-next-line @next/next/no-img-element -- official PNG artwork, served as-is */}
              <img
                src={`/badges/google-play-${lang}.png`}
                alt={d.common.store.googlePlayBadgeAlt}
                width={Math.round((playImgH * PLAY_FILE[lang].w) / PLAY_FILE[lang].h)}
                height={playImgH}
                decoding="async"
              />
            </a>
          </div>
          <span id="cp-opens-store" hidden>
            {d.a11y.opensStore}
          </span>
        </div>
      </div>
    </section>
  );
}
