import type { MockProps } from '@/components/mockups/types';
import { Screen, TabBarStudio } from '@/components/mockups/kit';
import { Aura, Icon } from '@/components/site';
import { fmt } from '@/i18n/format';
import { BackButton, cx } from './parts';
import s from './studio.module.css';

/**
 * S10 `D01bCloneCheck` (spec §7.2, source d01b-clone-check, shown as-is minus
 * emoji): the creator chats with their own clone in preview mode. Header
 * (aoi aura with a cyan ring, "{name} · クローン", online dot, call circle),
 * the preview note `[data-m="preview-note"]` (the `#check` stage pops it at
 * p .02–.06), three bubbles, the voice-call / morning-call pills and the
 * composer. `#check` stage bezel screen.
 */
export function D01bCloneCheck({ d, className }: MockProps) {
  const c = d.mock.studio.check;
  const name = d.personas.aoi.name;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, s.withTabs, className)} data-mock="D01bCloneCheck">
        <div className={s.ccHead}>
          <BackButton />
          <span className={s.ccAvatar}>
            <Aura persona="aoi" shape="avatar" size={38} />
          </span>
          <span className={s.ccTitleWrap}>
            <span className={s.ccTitle}>{fmt(c.title, { name })}</span>
            <span className={s.ccOnline}>
              <span className={s.ccDot} data-loop="" />
              {c.online}
            </span>
          </span>
          <span className={s.callCircle}>
            <Icon name="call" filled size={18} />
          </span>
        </div>
        <div className={s.ccNote} data-m="preview-note">
          <Icon name="visibility" size={16} />
          <span>{c.preview}</span>
        </div>
        <div className={s.chat}>
          <div className={s.msg}>
            <span className={s.meta}>{name} · 10:41</span>
            <span className={s.bubble}>{c.clone1}</span>
          </div>
          <div className={cx(s.msg, s.msgMe)}>
            <span className={cx(s.bubble, s.bubbleMe)}>{c.me1}</span>
          </div>
          <div className={s.msg}>
            <span className={s.bubble}>{c.clone2}</span>
            <span className={s.meta}>10:42</span>
          </div>
        </div>
        <div className={s.composeArea}>
          <div className={s.pills}>
            <span className={s.pillCyan}>
              <Icon name="call" filled size={15} />
              {c.voiceCall}
            </span>
            <span className={s.pillGold}>
              <Icon name="alarm" filled size={15} />
              {c.morningCall}
            </span>
          </div>
          <div className={s.composer}>
            <span>{c.composer}</span>
            <span className={s.sendBtn}>
              <Icon name="send" filled size={16} />
            </span>
          </div>
        </div>
        <TabBarStudio d={d} active="home" />
      </div>
    </Screen>
  );
}
