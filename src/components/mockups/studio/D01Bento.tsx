import type { CSSProperties } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import type { MockProps } from '@/components/mockups/types';
import { Aura, Icon } from '@/components/site';
import { cx, FigureBlank, Sparkline } from './parts';
import { TILE_ICON, TILE_ORDER, type TileId } from './tiles';
import s from './studio.module.css';

export type { TileId } from './tiles';

type D01BentoProps = MockProps & {
  tileHrefs: Record<TileId, string>;
  tileDesc: Dictionary['creators']['home']['tiles'];
  /** Where the clone-check card links (default `#check`, the §6.5 stage). */
  checkHref?: string;
};

const STATS = ['coins', 'chats', 'callTime', 'estMonth'] as const;
/** Relative bar heights of the decorative analytics tile chart (no values, no axis). */
const BARS = [42, 58, 47, 71, 64, 88, 100];

/**
 * S3 `D01Bento` (spec §6.3, §7.2): the full-viewport command centre, i.e. the
 * `#how` stage media. `position:absolute; inset:0` on the studio surface.
 *
 * - The tiles are REAL links: `<a href={tileHrefs[id]} data-tile>` with
 *   `aria-label="{label}: {desc}"`, inside `<nav aria-label={tocLabel}>`.
 *   Each carries a `[data-tile-arrow]` chip (the p .70–.90 pop beat).
 * - Desktop (≥1024): a 12-col bento right of the stage intro (it never covers
 *   it), from `header-h + 24px` to `100svh − 32px`: header card, clone-check
 *   card, four stat cards (sparklines, no values), then the tiles 3-up with
 *   analytics full width.
 * - Mobile: the area under the intro (`var(--intro-h)`), a compact 2-col grid
 *   of the clone-check strip and the tiles only.
 * - Hover lifts with `translate` (not `transform`), so a stage timeline can
 *   scale `[data-tile]` freely.
 */
export function D01Bento({ d, tileHrefs, tileDesc, checkHref = '#check', className }: D01BentoProps) {
  const h = d.mock.studio.home;
  return (
    <nav aria-label={d.creators.home.tocLabel} data-mock="D01Bento" className={cx(s.bento, className)}>
      <div className={s.bentoGrid}>
        <div className={s.bHead} aria-hidden="true">
          <Aura persona="aoi" shape="avatar" size={52} ring="story" />
          <span className={s.bHeadText}>
            <span className={s.welcome}>{h.welcome}</span>
            <span className={s.bHeadName}>
              {d.personas.aoi.name}
              <span className={s.followPill}>
                <Icon name="group" filled size={13} />
              </span>
            </span>
            <span className={s.bHeadStatus}>
              <span className={s.statusDot}>
                <span className={s.statusRing} data-loop="" />
              </span>
              {h.status}
            </span>
          </span>
          <span className={s.homeIcons}>
            <span className={s.iconPill} data-tone="gold">
              <Icon name="paid" filled size={17} />
            </span>
            <span className={s.iconPill}>
              <Icon name="notifications" size={19} />
              <span className={s.bellDot} />
            </span>
          </span>
        </div>

        <a href={checkHref} className={s.bCheck} data-tile-check="">
          <span className={s.bCheckTop}>
            <span className={s.bCheckIcon}>
              <Icon name="verified_user" filled size={20} />
            </span>
          </span>
          <span className={s.bCheckText}>
            <span className={s.bCheckTitle}>{h.checkTitle}</span>
            <span className={s.bCheckSub}>{h.checkSub}</span>
          </span>
        </a>

        <div className={s.bStats} aria-hidden="true">
          {STATS.map((k, i) => (
            <span key={k} className={cx(s.bStat, k === 'estMonth' && s.bStatAccent)}>
              <span className={s.bStatLabel}>{h.stats[k]}</span>
              <span className={s.statFoot}>
                <FigureBlank w={56} h={14} />
                <Sparkline seed={i} />
              </span>
            </span>
          ))}
        </div>

        <ul className={s.bTiles}>
          {TILE_ORDER.map((id) => {
            const wide = id === 'analytics';
            const tone = TILE_ICON[id].tone;
            return (
              <li key={id} data-wide={wide ? '' : undefined}>
                <a href={tileHrefs[id]} data-tile={id} className={s.bTile} aria-label={`${h.tiles[id]}: ${tileDesc[id]}`}>
                  {wide ? (
                    <span className={cx(s.bWell, s.bWideWell)} data-tone={tone} aria-hidden="true">
                      <Icon name={TILE_ICON[id].icon} filled size={20} />
                    </span>
                  ) : null}
                  <span className={s.bTileTop}>
                    <span className={s.bWell} data-tone={tone} aria-hidden="true">
                      <Icon name={TILE_ICON[id].icon} filled size={20} />
                    </span>
                    <span className={s.bArrow} data-tile-arrow="" aria-hidden="true">
                      <Icon name="arrow_forward" size={16} />
                    </span>
                  </span>
                  <span className={s.bTileText}>
                    <span className={s.bTileLabel}>{h.tiles[id]}</span>
                    <span className={s.bTileDesc}>{tileDesc[id]}</span>
                  </span>
                  {wide ? (
                    <span className={s.bChart} aria-hidden="true">
                      {BARS.map((v, i) => (
                        <span key={i} style={{ '--h': `${v}%` } as CSSProperties} />
                      ))}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
