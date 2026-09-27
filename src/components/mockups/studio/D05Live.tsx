import type { MockProps } from '@/components/mockups/types';
import { Screen, TabBarStudio, Toggle, VerifiedMark } from '@/components/mockups/kit';
import { Icon, Scene, type IconName } from '@/components/site';
import { fmt } from '@/i18n/format';
import { cx, ScreenHeader } from './parts';
import s from './studio.module.css';

type D05LiveProps = MockProps & { dropIn: boolean };

const SETTINGS: { id: 'readAloud' | 'autoArchive' | 'acceptRequests'; icon: IconName }[] = [
  { id: 'readAloud', icon: 'volume_up' },
  { id: 'autoArchive', icon: 'download' },
  { id: 'acceptRequests', icon: 'calendar_month' },
];

/**
 * S16 `D05Live` (spec §7.2, source d05-live-and-archive, edited). The LIVE
 * NOW card (Scene stage-light, pink pill with a 1.4s dot loop in view, auto
 * hosting + segment, two chat lines), three settings rows with toggles on,
 * and the archive row with the `[data-m="dl"]` pill. No viewer count, no
 * "segment 2/4", no daily cap, no co-host, no templates. The drop-in composer
 * and line render ONLY when `dropIn` (pass `CLAIMS.liveDropIn`). LIVE glyph:
 * `podcasts`.
 */
export function D05Live({ d, dropIn, className }: D05LiveProps) {
  const l = d.mock.studio.live;
  const name = d.personas.aoi.name;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, s.withTabs, className)} data-mock="D05Live" data-drop-in={dropIn ? '' : undefined}>
        <ScreenHeader title={l.title} />
        <div className={s.liveBody}>
          <div className={s.liveCard}>
            <Scene kind="stage-light" />
            <span className={s.liveTop}>
              <span className={s.livePill}>
                <span className={s.livePillDot} data-loop="" />
                {l.liveNow}
              </span>
              <span className={s.liveHost}>
                <Icon name="podcasts" size={14} />
                {l.autoHosting}
              </span>
            </span>
            <span className={s.liveSeg}>{l.segment}</span>
            <span className={s.liveChat}>
              <span className={s.liveLine}>
                <b>@sakura</b>
                {l.chat1}
              </span>
              <span className={s.liveLine}>
                <b>rin.rin</b>
                {l.chat2}
              </span>
              {dropIn ? (
                <span className={s.dropLine}>
                  <b>
                    <VerifiedMark size={13} tone="neon" />
                    {fmt(l.realLabel, { name })}
                  </b>
                  {l.dropInLine}
                </span>
              ) : null}
            </span>
            {dropIn ? (
              <span className={s.dropComposer}>
                <span>{l.dropIn}</span>
                <span className={s.sendBtn}>
                  <Icon name="send" filled size={15} />
                </span>
              </span>
            ) : null}
          </div>
          <div className={cx(s.gcard, s.setList)}>
            {SETTINGS.map((row) => (
              <div key={row.id} className={s.setRow}>
                <Icon name={row.icon} size={19} className={s.setIcon} />
                <span className={s.setLabel}>{l.settings[row.id]}</span>
                <Toggle on tone="cyan" />
              </div>
            ))}
          </div>
          <span className={s.secTitle}>{l.archivesTitle}</span>
          <div className={cx(s.gcard, s.archRow)}>
            <span className={s.archThumb}>
              <Scene kind="rain-neon" />
              <span>
                <Icon name="play_arrow" filled size={20} />
              </span>
            </span>
            <span className={s.archName}>{l.archiveItem}</span>
            <span className={s.dlPill} data-m="dl">
              <Icon name="download" size={14} />
              {l.download}
            </span>
          </div>
        </div>
        <TabBarStudio d={d} active="home" />
      </div>
    </Screen>
  );
}
