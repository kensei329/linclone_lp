import type { MockProps } from '@/components/mockups/types';
import { CoinPill, Screen } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { fmt } from '@/i18n/format';
import { Card, ScreenHeader, cx, personaOf } from './parts';

/** The six free relationship modes, fixed (spec §7.0: never premium / 18+ modes). */
const MODES = ['standard', 'gentle', 'bestFriend', 'cheerleader', 'toughLove', 'tsundere'] as const;
const MEMORIES = ['m1', 'm2', 'm3'] as const;

/**
 * F8 `Memory06` (spec §7.1): 2人の関係と記憶 (V3 06), cream. The premium block,
 * the 18+ note, 「27/30」 and every coin price are removed.
 * Hooks: `[data-m="nick"]` (the nickname text; animators retype it),
 * `[data-m="mode"][data-mode]` cells in a 3×2 grid, `[data-m="mode-sel"]` the
 * selection pill overlay (SSR on `gentle`; animators translate it by the cell
 * offsets; `[data-selected]` marks the SSR cell only), `[data-m="mem"]` rows, `[data-m="lock-2"]` (m2's lock, filled
 * violet in SSR). The third row sits in y 532–592 so the #about slice
 * {y:520,h:120} frames one complete memory row.
 */
export function Memory06({ d, persona = 'oshi', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.memory;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-mem', className)} data-mock="Memory06">
        <ScreenHeader title={t.title} caption={p.name} right={<CoinPill theme="cream" />} />

        <Card radius={18} className="fm-mem-nick">
          <span className="fm-mem-nick-txt">
            <span className="fm-mem-nick-h">{fmt(t.nickHeading, { name: p.name })}</span>
            <span className="fm-mem-nick-val">
              <span data-m="nick">{d.personas.fan.nickname}</span>
              <span className="fm-caret" />
            </span>
          </span>
          <span className="fm-mem-edit">
            <Icon name="edit" size={14} />
            {t.edit}
          </span>
        </Card>

        <div className="fm-label fm-mem-lbl" style={{ top: 232 }}>
          {t.modesHeading}
        </div>
        <div className="fm-mem-modes">
          {MODES.map((m, i) => (
            <span key={m} className="fm-mem-mode" data-m="mode" data-mode={m} data-selected={m === 'gentle' ? '' : undefined} style={{ gridArea: `${Math.floor(i / 3) + 1} / ${(i % 3) + 1}` }}>
              {t.modes[m]}
            </span>
          ))}
          <span className="fm-mem-sel" data-m="mode-sel" />
        </div>

        <div className="fm-label fm-mem-lbl" style={{ top: 362 }}>
          {t.recentHeading}
        </div>
        <div className="fm-mem-list">
          {MEMORIES.map((k) => (
            <Card key={k} radius={16} className="fm-mem-row" data-m="mem">
              <span className="fm-mem-row-txt">{t.memories[k]}</span>
              <span className="fm-mem-icons">
                <span className="fm-mem-lock" data-m={k === 'm2' ? 'lock-2' : undefined} data-on={k === 'm2' ? '' : undefined}>
                  <Icon name="lock" filled={k === 'm2'} size={20} />
                </span>
                <Icon name="edit" size={20} />
                <Icon name="delete" size={20} />
              </span>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
}
