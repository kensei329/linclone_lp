import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Icon, Ring, type IconName } from '@/components/site';
import { cx } from './parts';
import s from './studio.module.css';

type S09BuildingProps = MockProps & { state: 'building' | 'ready' };

const TOUR: { id: 'reply' | 'curate' | 'voice'; icon: IconName; tone: 'cyan' | 'violet' }[] = [
  { id: 'reply', icon: 'forum', tone: 'cyan' },
  { id: 'curate', icon: 'psychology', tone: 'violet' },
  { id: 'voice', icon: 'graphic_eq', tone: 'cyan' },
];

/**
 * S1 `S09Building` (spec §7.2, source s09-building, shipped copy). No
 * percentage in the ring, no "24 hours", no earnings row.
 *
 * - `state="ready"`: the static ready screen (setup ready card). Root carries
 *   `.is-ready`.
 * - `state="building"`: the /creators hero sequence, CSS only (§6.1): the
 *   ring `[data-ring]` fills `--p` 0→100 (1.6s, .4s delay), then at 2.0s the
 *   `[data-m=title]`/`[data-m=sub]` copy crossfades building → ready and the
 *   check pops. It completes without JS; reduced motion shows the ready state
 *   directly (the ready copy is the un-animated base state).
 */
export function S09Building({ d, state, className }: S09BuildingProps) {
  const b = d.mock.studio.building;
  const animated = state === 'building';
  return (
    <Screen theme="cream">
      <div
        className={cx(s.scr, s.bgStudio, s.s09, animated && s.s09Anim, !animated && 'is-ready', className)}
        data-mock="S09Building"
        data-state={state}
      >
        <div className={s.s09Top}>
          <span className={s.s09RingWrap}>
            <Ring
              size={104}
              tone="violet"
              stroke={9}
              label={
                <span className={s.s09Disc}>
                  <span className={cx(s.s09Building, s.bOnly)}>{b.building}</span>
                  <span className={cx(s.s09Check, s.rOnly)}>
                    <Icon name="check" size={28} />
                  </span>
                </span>
              }
            />
          </span>
          <div className={s.swap} data-m="title">
            <span className={cx(s.s09Copy, s.bOnly)}>
              <span className={s.s09Title}>{b.title}</span>
              <span className={s.s09Sub} data-m="sub">
                {b.sub}
              </span>
            </span>
            <span className={cx(s.s09Copy, s.rOnly)}>
              <span className={s.s09Title}>{b.readyTitle}</span>
              <span className={s.s09Sub} data-m="sub">
                {b.readySub}
              </span>
            </span>
          </div>
        </div>
        <div className={s.s09Tour}>
          <span className={s.tracked}>{b.tourLabel}</span>
          {TOUR.map((t) => (
            <div key={t.id} className={s.tourRow}>
              <span className={s.tourIcon} data-tone={t.tone}>
                <Icon name={t.icon} filled size={17} />
              </span>
              <span className={s.tourText}>
                <span className={s.tourTitle}>{b.tour[t.id].title}</span>
                <span className={s.tourBody}>{b.tour[t.id].body}</span>
              </span>
            </div>
          ))}
        </div>
        <span className={s.s09Cta}>
          {b.cta}
          <Icon name="arrow_forward" size={18} />
        </span>
      </div>
    </Screen>
  );
}
