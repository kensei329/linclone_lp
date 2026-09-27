import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { cx, SetupFooter, StepHead } from './parts';
import s from './studio.module.css';

/** SSR selection (spec §7.2 S4); these four carry `data-m="pick"`, in DOM order 私 → 標準語 → 音楽 → 料理. */
const SELECTED = new Set(['p3', 'standard', 'music', 'cooking']);

/**
 * S4 `S04QuickPicks` (spec §7.2, source s04-personality, shipped; no postal
 * codes, "1 / 6" → dots). Chips: selected = `.is-selected` (global class the
 * `#setup` micro toggles, .3s apart). Crop `{y:100,h:600}`.
 */
export function S04QuickPicks({ d, className }: MockProps) {
  const p = d.mock.studio.picks;
  const groups: { label: string; items: [string, string][] }[] = [
    { label: p.pronounLabel, items: Object.entries(p.pronouns) },
    { label: p.dialectLabel, items: Object.entries(p.dialects) },
    { label: p.hobbyLabel, items: Object.entries(p.hobbies) },
  ];
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, className)} data-mock="S04QuickPicks">
        <StepHead d={d} active={0} title={p.title} sub={p.sub} />
        <div className={s.picks}>
          {groups.map((g) => (
            <div key={g.label} className={s.pickGroup}>
              <span className={s.label12}>{g.label}</span>
              <span className={s.chips}>
                {g.items.map(([id, label]) => {
                  const on = SELECTED.has(id);
                  return (
                    <span key={id} className={cx(s.chip, on && 'is-selected')} data-m={on ? 'pick' : undefined}>
                      <span className={s.chipCheck}>
                        <Icon name="check" size={14} />
                      </span>
                      {label}
                    </span>
                  );
                })}
              </span>
            </div>
          ))}
        </div>
        <SetupFooter d={d} />
      </div>
    </Screen>
  );
}
