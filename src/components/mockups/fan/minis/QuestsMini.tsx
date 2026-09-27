import type { MockProps } from '@/components/mockups/types';
import { Icon } from '@/components/site';
import { cx } from '../parts';

const CHAPTERS = ['c1', 'c2', 'c3', 'c4', 'c5'] as const;

/**
 * F21 `QuestsMini` (spec §7.1): the quest board with no amounts or counts.
 * Hooks: `[data-m="check"]` (SVG check circles; animators draw their
 * `stroke-dashoffset`), `[data-m="reward"]` (the 「クエスト達成」 card).
 */
export function QuestsMini({ d, className }: MockProps) {
  const t = d.mock.fan.quests;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-mini fm-qm', className)} data-mock="QuestsMini">
      <div className="fm-mini-in" aria-hidden="true">
        <span className="fm-qm-title">{t.title}</span>
        <ul className="fm-qm-list">
          {CHAPTERS.map((k, i) => {
            const last = i === CHAPTERS.length - 1;
            return (
              <li key={k} className="fm-qm-row" data-done={last ? undefined : ''}>
                <svg className="fm-qm-check" viewBox="0 0 20 20" width="18" height="18" data-m={last ? undefined : 'check'}>
                  <circle cx="10" cy="10" r="8.25" fill="none" strokeWidth="1.5" />
                  <path d="M6 10.4l2.7 2.6L14.2 7.4" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="fm-qm-name">{t.chapters[k]}</span>
                <span className="fm-qm-pill" data-go={last ? '' : undefined}>
                  {last ? t.go : t.done}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="fm-qm-daily">
          <span className="fm-qm-daily-lbl">{t.daily}</span>
          <span className="fm-qm-chip">{t.login}</span>
          <span className="fm-qm-chip">{t.shareX}</span>
        </div>
        <div className="fm-qm-reward" data-m="reward">
          <Icon name="celebration" filled size={20} />
          {t.reward}
        </div>
      </div>
    </figure>
  );
}
