import type { MockProps } from '@/components/mockups/types';
import { Icon } from '@/components/site';
import { cx } from './parts';
import s from './studio.module.css';

/**
 * S12 `D06GrowCard` (card; spec §7.2, source d06-grow-management): a
 * follower-submitted fact awaiting review. No vote count or %: the 4px violet
 * bar has no label. `@kensei` → `@yuki_nn`.
 *
 * Hooks: `[data-m="grow-card"]` carries `data-state="approved" | "pending"`
 * (SSR `approved`: teal wash, `[data-m="result"]` shown, buttons hidden). The
 * `#control` micro sets `pending`, presses `[data-m="approve"]` (scale .96)
 * and sets `approved` again; the swap is a CSS crossfade.
 */
export function D06GrowCard({ d, className }: MockProps) {
  const g = d.mock.studio.grow;
  return (
    <div className={cx(s.card, className)} data-mock="D06GrowCard">
      <div className={s.cardHead}>
        <span className={s.cardTitle}>{g.title}</span>
        <span className={s.cardSub}>{g.sub}</span>
      </div>
      <span className={s.pendingLabel}>
        <span />
        {g.pending}
      </span>
      <div className={cx(s.pane, s.growCard)} data-m="grow-card" data-state="approved">
        <div className={s.growMeta}>
          <span className={s.catPill}>{g.category}</span>
          <span className={s.handle}>{g.handle}</span>
          <span className={s.aiChip}>
            <Icon name="check" size={13} />
            {g.aiReview}
          </span>
        </div>
        <span className={s.voteBar}>
          <span />
        </span>
        <span className={s.fact}>{g.fact}</span>
        <div className={s.growActions}>
          <div className={s.growBtns}>
            <span className={s.approve} data-m="approve">
              <Icon name="check" size={16} />
              {g.approve}
            </span>
            <span className={s.reject}>
              <Icon name="close" size={16} />
              {g.reject}
            </span>
          </div>
          <span className={s.result} data-m="result">
            {g.approved}
          </span>
        </div>
      </div>
    </div>
  );
}
