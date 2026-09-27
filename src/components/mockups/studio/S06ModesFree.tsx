import type { MockProps } from '@/components/mockups/types';
import { Screen, Toggle } from '@/components/mockups/kit';
import { Icon, type IconName } from '@/components/site';
import { cx, SetupFooter, StepHead } from './parts';
import s from './studio.module.css';

/** The six free relationship modes, fixed list (spec §7.0); no premium section, no 18+. */
const MODES: { id: 'standard' | 'gentle' | 'bestFriend' | 'cheerleader' | 'toughLove' | 'tsundere'; icon: IconName }[] = [
  { id: 'standard', icon: 'chat_bubble' },
  { id: 'gentle', icon: 'favorite' },
  { id: 'bestFriend', icon: 'group' },
  { id: 'cheerleader', icon: 'celebration' },
  { id: 'toughLove', icon: 'local_fire_department' },
  { id: 'tsundere', icon: 'star' },
];

/**
 * S7 `S06ModesFree` (spec §7.2): title, sub and the six free modes, each with
 * a cyan `Toggle` (SSR on). Hook: each row is `[data-m="mode"]`; the micro
 * flips the row's `[data-toggle]` `data-on` (stagger .06). Crop `{y:100,h:520}`.
 */
export function S06ModesFree({ d, className }: MockProps) {
  const m = d.mock.studio.modes;
  const names = d.mock.fan.memory.modes;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, className)} data-mock="S06ModesFree">
        <StepHead d={d} active={3} title={m.title} sub={m.sub} />
        <div className={s.modes}>
          <div className={cx(s.gcard, s.modeList)}>
            {MODES.map((mode) => (
              <div key={mode.id} className={s.modeRow} data-m="mode">
                <span className={s.modeIcon}>
                  <Icon name={mode.icon} filled size={16} />
                </span>
                <span className={s.modeName}>{names[mode.id]}</span>
                <Toggle on tone="cyan" />
              </div>
            ))}
          </div>
        </div>
        <SetupFooter d={d} />
      </div>
    </Screen>
  );
}
