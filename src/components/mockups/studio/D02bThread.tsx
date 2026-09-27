import type { MockProps } from '@/components/mockups/types';
import { Screen, TabBarStudio } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { BackButton, cx, DrawnVerified, NamedToggle } from './parts';
import s from './studio.module.css';

/**
 * S15 `D02bThread` (spec §7.2, source d02b-chat-thread, edited): a follower
 * chat with an official reply. No call button, no "call as the real you", no
 * plan/coin meta; `@kensei` → `@momo_pk`.
 *
 * Hooks (SSR = final):
 * - `[data-toggle="pause"]`: SSR off = paused; the state line
 *   (`pauseOn`/`pauseOff`) and the row tint follow `data-on` via `:has()`.
 * - `[data-m="msg"]` ×3 in order follower → AI → follower, then
 *   `[data-m="official"]` (the solid cyan official bubble) with its label.
 * - `[data-m="verified"]`: the badge; its check `[data-draw]` has
 *   `pathLength=1`, so `strokeDashoffset` 1→0 draws it.
 */
export function D02bThread({ d, className }: MockProps) {
  const t = d.mock.studio.thread;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, s.withTabs, className)} data-mock="D02bThread">
        <div className={s.thHead}>
          <BackButton />
          <span className={s.initial}>M</span>
          <span className={s.thHandle}>{t.handle}</span>
          <span className={s.personCircle}>
            <Icon name="person" size={19} />
          </span>
        </div>
        <div className={s.pauseRow}>
          <span className={s.pauseText}>
            <span className={s.pauseTitle}>{t.pauseTitle}</span>
            <span className={s.pauseState}>
              <span className={s.pauseOn}>{t.pauseOn}</span>
              <span className={s.pauseOff}>{t.pauseOff}</span>
            </span>
          </span>
          <NamedToggle hook="pause" on={false} tone="cyan" />
        </div>
        <div className={s.chat}>
          <div className={s.msg} data-m="msg">
            <span className={s.meta}>{t.handle} · 21:04</span>
            <span className={s.bubble}>{t.follower1}</span>
          </div>
          <div className={cx(s.msg, s.msgMe)} data-m="msg">
            <span className={s.meta}>{t.aiLabel} · 21:05</span>
            <span className={cx(s.bubble, s.bubbleAi)}>{t.ai1}</span>
          </div>
          <div className={s.msg} data-m="msg">
            <span className={s.meta}>{t.handle} · 21:06</span>
            <span className={s.bubble}>{t.follower2}</span>
          </div>
          <div className={cx(s.msg, s.msgMe)} data-m="official">
            <span className={s.officialLabel}>
              <DrawnVerified size={14} />
              {t.officialLabel}
            </span>
            <span className={cx(s.bubble, s.bubbleOfficial)}>{t.official}</span>
            <span className={s.foot9}>{t.officialFoot}</span>
          </div>
        </div>
        <div className={s.thComposer}>
          <div className={s.composer}>
            <Icon name="verified" filled size={18} className={s.drawnVerified} />
            <span>{t.composer}</span>
            <span className={s.sendBtn}>
              <Icon name="send" filled size={16} />
            </span>
          </div>
        </div>
        <TabBarStudio d={d} active="chat" />
      </div>
    </Screen>
  );
}
