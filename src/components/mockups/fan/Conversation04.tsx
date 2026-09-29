import type { MockProps } from '@/components/mockups/types';
import { MockChip, Screen, TypingDots } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { ChatHeader, cx } from './parts';

/**
 * F6 `Conversation04` (spec §7.1): clone chat thread (V3 04 / AIChat), cream.
 * The thread flows top-down from y 120 so longer EN lines never collide.
 * Hooks: `[data-m="ended"]`, `[data-m="b1"]`, `[data-m="b2"]` + `[data-m="read"]`,
 * `[data-m="typing"]` (carries `hidden` in the final state; animators unhide it
 * for ~1.2s), `[data-m="b3"]`, `[data-m="chips"]`.
 * Removed: the paywall bubble, coin tags and 「チャットを追加」.
 */
export function Conversation04({ d, persona = 'oshi', className }: MockProps) {
  const t = d.mock.fan.conversation;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-chat', className)} data-mock="Conversation04">
        <ChatHeader d={d} persona={persona} />

        <div className="fm-thread">
          <div className="fm-day">{t.dayLabel}</div>
          <div className="fm-sys" data-m="ended">
            <Icon name="call" filled size={14} />
            {t.callEnded}
          </div>
          <div className="fm-bubble" data-from="creator" data-m="b1">
            {t.creator1}
          </div>
          <div className="fm-bubble" data-from="fan" data-m="b2">
            {t.fan1}
          </div>
          <div className="fm-read" data-m="read">
            {t.read}
          </div>
          <div className="fm-bubble fm-typing" data-from="creator" data-m="typing" hidden>
            <TypingDots />
          </div>
          <div className="fm-bubble" data-from="creator" data-m="b3">
            {t.creator2}
          </div>
          <div className="fm-chips" data-m="chips">
            <span data-chip="image">
              <MockChip icon="auto_awesome" label={t.chipImage} />
            </span>
            <span data-chip="voice">
              <MockChip icon="mic" label={t.chipVoice} />
            </span>
          </div>
        </div>

        <div className="fm-composer">
          <span className="fm-composer-input">{t.composer}</span>
          <span className="fm-send">
            <Icon name="send" filled size={20} />
          </span>
        </div>
      </div>
    </Screen>
  );
}
