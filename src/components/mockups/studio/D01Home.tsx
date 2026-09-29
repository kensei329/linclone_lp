import type { MockProps } from '@/components/mockups/types';
import { Screen, TabBarStudio } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { cx, FigureBlank, Sparkline } from './parts';
import { TILE_ICON, TILE_ORDER } from './tiles';
import s from './studio.module.css';

const STATS = ['coins', 'chats', 'callTime', 'estMonth'] as const;

/**
 * S2 `D01Home` (spec §7.2, source d01-home, the SHIPPED layout): greeting,
 * followers/coins/bell as icons only, "clone active" status (no "last
 * trained"), four stat cards with sparklines and no values, the clone-check
 * strip, the seven tiles and the Studio tab bar. No URL row, no numbers.
 * Used as the `#how` stage bezel screen.
 */
export function D01Home({ d, className }: MockProps) {
  const h = d.mock.studio.home;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, s.withTabs, className)} data-mock="D01Home">
        <div className={s.homeHead}>
          <div className={s.homeHello}>
            <span className={s.welcome}>{h.welcome}</span>
            <span className={s.nameRow}>
              <span className={s.homeName}>{d.personas.aoi.name}</span>
              <span className={s.followPill}>
                <Icon name="group" filled size={13} />
              </span>
            </span>
          </div>
          <div className={s.homeIcons}>
            <span className={s.iconPill} data-tone="gold">
              <Icon name="paid" filled size={17} />
            </span>
            <span className={s.iconPill}>
              <Icon name="notifications" size={19} />
              <span className={s.bellDot} />
            </span>
          </div>
        </div>
        <div className={s.status}>
          <span className={s.statusDot}>
            <span className={s.statusRing} data-loop="" />
          </span>
          {h.status}
        </div>
        <div className={s.homeBody}>
          <div className={s.stats}>
            {STATS.map((k, i) => (
              <div key={k} className={cx(s.gcard, s.stat, k === 'estMonth' && s.statAccent)}>
                <span className={s.statLabel}>{h.stats[k]}</span>
                <span className={s.statFoot}>
                  <FigureBlank w={52} h={14} />
                  <Sparkline seed={i} />
                </span>
              </div>
            ))}
          </div>
          <div className={s.checkStrip}>
            <span className={s.checkIcon}>
              <Icon name="verified_user" filled size={22} />
            </span>
            <span className={s.checkText}>
              <span className={s.checkTitle}>{h.checkTitle}</span>
              <span className={s.checkSub}>{h.checkSub}</span>
            </span>
            <span className={s.checkIcons}>
              <span>
                <Icon name="call" filled size={15} />
              </span>
              <span>
                <Icon name="forum" filled size={15} />
              </span>
            </span>
          </div>
          <div className={s.tiles}>
            {TILE_ORDER.map((id) => (
              <div key={id} className={cx(s.gcard, s.tile, id === 'analytics' && s.tileWide)}>
                <span className={s.well} data-tone={TILE_ICON[id].tone}>
                  <Icon name={TILE_ICON[id].icon} filled size={18} />
                </span>
                <span className={s.tileLabel}>{h.tiles[id]}</span>
                <span className={s.tileChev}>
                  <Icon name="chevron_right" size={18} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <TabBarStudio d={d} active="home" />
      </div>
    </Screen>
  );
}
