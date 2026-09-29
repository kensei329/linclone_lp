import type { MockProps } from '@/components/mockups/types';
import { Screen, TabBarStudio } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { cx } from './parts';
import s from './studio.module.css';

/**
 * S19 `D10EarningsCalculating` (spec §7.2, source d10-earnings, calculating
 * state only): month chips, the gold hourglass `[data-m="hourglass"]` (CSS:
 * flips 180° over ~.6s every 2s, in view only, so no JS is needed), the
 * calculating copy, three shimmering skeleton bars where figures would be
 * (`data-loop`), and the CSV / bank rows. No balance, $, share %, payout
 * floor or payout date.
 */
export function D10EarningsCalculating({ d, className }: MockProps) {
  const e = d.mock.studio.earnings;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, s.withTabs, className)} data-mock="D10EarningsCalculating">
        <div className={s.earnHead}>
          <span className={s.earnTitle}>{e.title}</span>
          <span className={s.hdrSub}>{e.sub}</span>
        </div>
        <div className={s.monthChips}>
          <span className={s.monthChip}>{e.months.prev}</span>
          <span className={s.monthChip} data-selected="">
            {e.months.current}
          </span>
        </div>
        <div className={cx(s.gcard, s.calcCard)}>
          <span className={s.hourglass} data-m="hourglass">
            <span className={s.hourglassIcon} data-loop="">
              <Icon name="hourglass_top" filled size={34} />
            </span>
          </span>
          <span className={s.calcTitle}>{e.calculatingTitle}</span>
          <span className={s.calcBody}>{e.calculatingBody}</span>
          <span className={s.skels}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={s.skel}>
                <span className={s.skelShine} data-loop="" />
              </span>
            ))}
          </span>
        </div>
        <div className={s.earnBtns}>
          <span className={cx(s.gcard, s.earnBtn)}>
            <Icon name="download" size={19} />
            <span>{e.csv}</span>
            <Icon name="chevron_right" size={18} />
          </span>
          <span className={cx(s.gcard, s.earnBtn)}>
            <Icon name="account_balance" size={19} />
            <span>{e.bank}</span>
            <Icon name="chevron_right" size={18} />
          </span>
        </div>
        <TabBarStudio d={d} active="earnings" />
      </div>
    </Screen>
  );
}
