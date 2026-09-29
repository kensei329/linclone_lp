import type { MockProps } from '@/components/mockups/types';
import { Screen, Toggle } from '@/components/mockups/kit';
import { Icon, type IconName } from '@/components/site';
import { cx, SetupFooter, StepHead } from './parts';
import s from './studio.module.css';

type S07NgTopicsProps = MockProps & { compact?: boolean };

const PRESETS: { id: 'politics' | 'romance' | 'sexual' | 'war' | 'others'; icon: IconName }[] = [
  { id: 'politics', icon: 'gavel' },
  { id: 'romance', icon: 'favorite' },
  { id: 'sexual', icon: 'do_not_disturb_on' },
  { id: 'war', icon: 'crisis_alert' },
  { id: 'others', icon: 'groups' },
];

/**
 * S8 `S07NgTopics` (spec §7.2). Five preset rows with pink `Toggle`s (SSR all
 * ON). A row's ON look (pink wash, pink icon/detail, the NG badge) follows
 * its switch through `:has([data-toggle][data-on])`, so the micro only flips
 * `data-on`. Then the custom chip (`data-m="custom"`) and the nickname row.
 * `compact` renders the five rows only, as a responsive card box (#control).
 * No page-visibility / URL card. Crop `{y:100,h:600}`.
 */
export function S07NgTopics({ d, compact = false, className }: S07NgTopicsProps) {
  const n = d.mock.studio.ng;
  const list = (
    <div className={cx(s.gcard, s.ngList)}>
      {PRESETS.map((p) => (
        <div key={p.id} className={s.ngRow} data-m="ng-row">
          <span className={s.ngIcon}>
            <Icon name={p.icon} filled size={16} />
          </span>
          <span className={s.ngText}>
            <span className={s.ngLabelRow}>
              <span className={s.ngLabel}>{n.presets[p.id].label}</span>
              <span className={s.ngBadge}>{n.ngBadge}</span>
            </span>
            <span className={s.ngDetail}>{n.presets[p.id].detail}</span>
          </span>
          <Toggle on tone="pink" />
        </div>
      ))}
    </div>
  );

  if (compact) {
    return (
      <div className={cx(s.ngCompact, className)} data-mock="S07NgTopics" data-compact="">
        {list}
      </div>
    );
  }

  return (
    <Screen theme="cream">
      <div className={cx(s.scr, className)} data-mock="S07NgTopics">
        <StepHead d={d} active={4} title={n.title} sub={n.sub} />
        <div className={s.ng}>
          {list}
          <div className={s.pickGroup}>
            <span className={s.label12}>{n.customLabel}</span>
            <span className={s.customRow}>
              <span className={s.customChip} data-m="custom">
                <Icon name="block" size={14} />
                {n.customChip}
              </span>
              <span className={s.addChip}>
                <Icon name="add" size={14} />
              </span>
            </span>
          </div>
          <div className={cx(s.gcard, s.nickRow)}>
            <span className={s.modeIcon}>
              <Icon name="verified_user" filled size={16} />
            </span>
            <span className={s.nickText}>{n.nickname}</span>
            <Toggle on tone="cyan" />
          </div>
        </div>
        <SetupFooter d={d} />
      </div>
    </Screen>
  );
}
