import type { MockProps } from '@/components/mockups/types';
import { Segmented } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { cx } from './parts';
import s from './studio.module.css';

/**
 * S17b `D07bMorningCard` (card, night-glass; spec §7.2, source
 * d07b-morning-call): the tone `Segmented` `[data-m="seg"]` (gentle | casual)
 * and two lists of three first lines; only the active tone's list is shown.
 * The list follows the segmented selection through `:has()`, so the
 * `#voice` auto-toggle only moves `data-selected` between the two spans
 * (fade .26s). No coin note, no "10 patterns".
 */
export function D07bMorningCard({ d, className }: MockProps) {
  const m = d.mock.studio.morning;
  const lists = [
    { key: 'gentle', lines: m.linesGentle, cls: s.linesGentle },
    { key: 'casual', lines: m.linesCasual, cls: s.linesCasual },
  ];
  return (
    <div className={cx(s.card, s.night, s.morning, className)} data-mock="D07bMorningCard">
      <div className={s.cardHead}>
        <span className={s.cardTitle}>{m.title}</span>
        <span className={s.cardSub}>{m.sub}</span>
      </div>
      <span data-m="seg" style={{ display: 'contents' }}>
        <Segmented items={[m.gentle, m.casual]} active={0} />
      </span>
      <div className={s.lineStack}>
        {lists.map((l) => (
          <ul key={l.key} className={l.cls} data-m={`lines-${l.key}`}>
            {(['l1', 'l2', 'l3'] as const).map((k) => (
              <li key={k} className={cx(s.nPane, s.lineItem)}>
                <Icon name="play_circle" filled size={20} />
                <span>{l.lines[k]}</span>
                <Icon name="edit" size={16} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
