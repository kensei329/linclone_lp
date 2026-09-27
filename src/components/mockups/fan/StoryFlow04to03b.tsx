import type { MockProps } from '@/components/mockups/types';
import { MockChip, RingAvatar, ScanLine, Screen } from '@/components/mockups/kit';
import { Icon, Scene, Waveform } from '@/components/site';
import { ChatHeader, cx, personaOf } from './parts';

/** The fan's fictional handle (spec §7.0). */
const FAN_HANDLE = 'hinata';

/**
 * F7 `StoryFlow04to03b` (spec §7.1): a reply becomes an image + voice Story
 * (V3 04 generation card + post, then 03b Story viewer). A Story always shows
 * image AND voice together.
 *
 * Two stacked sub-screens: `[data-sub="create"]` (cream, underneath) and
 * `[data-sub="viewer"]` (night, on top). SSR = final state: the viewer is
 * active (`data-active` on it), the post pill reads `posted`.
 * Hooks — create: `[data-m="chip-image"]`, `[data-m="gen"]` (dashed card with
 * ScanLine; sits under the scene), `[data-m="scene"]`, `[data-m="ai-tag"]`,
 * `[data-m="post"]` (one label, SSR `posted`; animators swap its text node
 * postBoth → posted). Viewer: `[data-m="progress"]` (first bar fill,
 * scaleX from the left), `[data-m="heart"]`. Animators push the viewer in
 * (xPercent 100→0) and move `data-active` between `[data-sub]` layers.
 */
export function StoryFlow04to03b({ d, persona = 'oshi', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.story;
  const c = d.mock.fan.common;
  return (
    <Screen theme="night">
      <div className={cx('fm-root fm-story', className)} data-mock="StoryFlow04to03b">
        <div className="fm-sub" data-sub="create">
          <ChatHeader d={d} persona={persona} />
          <div className="fm-story-create">
            <div className="fm-bubble" data-from="creator">
              {d.mock.fan.conversation.creator2}
            </div>
            <div className="fm-chips">
              <span data-m="chip-image" data-pressed="">
                <MockChip icon="auto_awesome" label={d.mock.fan.conversation.chipImage} tone="purple" selected />
              </span>
              <MockChip icon="mic" label={d.mock.fan.conversation.chipVoice} />
            </div>
            <div className="fm-story-media">
              <div className="fm-story-gen" data-m="gen">
                <span className="fm-story-gen-ico">
                  <Icon name="blur_on" size={28} />
                </span>
                <span className="fm-story-gen-txt">{t.generating}</span>
                <span className="fm-story-scan">
                  <ScanLine />
                </span>
              </div>
              <div className="fm-story-scene" data-m="scene">
                <Scene kind="cafe-light" />
                <span className="fm-aitag" data-m="ai-tag">
                  <Icon name="auto_awesome" filled size={11} />
                  {c.aiGenerated}
                </span>
              </div>
            </div>
            <div className="fm-story-voice">
              <span className="fm-play-disc">
                <Icon name="play_arrow" filled size={22} />
              </span>
              <Waveform tone="teal" bars={12} />
            </div>
            <div className="fm-story-post" data-m="post">
              <span className="fm-story-post-lbl">{t.posted}</span>
            </div>
          </div>
        </div>

        <div className="fm-sub" data-sub="viewer" data-active="">
          <Scene kind="cafe-light" />
          <span className="fm-story-scrim" />
          <div className="fm-story-bars">
            <span>
              <i data-m="progress" />
            </span>
            <span>
              <i />
            </span>
            <span>
              <i />
            </span>
          </div>
          <div className="fm-story-head">
            <RingAvatar persona={persona} size={32} ring="live" />
            <span className="fm-story-who">
              {FAN_HANDLE} × {p.name}
            </span>
            <span className="fm-story-fanmade">{t.fanMade}</span>
            <span className="fm-story-close">
              <Icon name="close" size={22} />
            </span>
          </div>
          <div className="fm-story-bottom">
            <div className="fm-story-title">{t.storyTitle}</div>
            <div className="fm-story-player glass-night">
              <span className="fm-play-disc">
                <Icon name="pause" filled size={22} />
              </span>
              <span className="fm-story-player-wave">
                <Waveform tone="neon" bars={14} />
                <span className="fm-story-player-meta">
                  {c.aiGenerated} · {p.name}
                </span>
              </span>
            </div>
            <div className="fm-story-reply">
              <span className="fm-story-input">{t.replyPlaceholder}</span>
              <span className="fm-story-heart" data-m="heart">
                <Icon name="favorite" filled size={28} />
              </span>
            </div>
            <div className="fm-story-ai">
              {c.aiGenerated} · {FAN_HANDLE} × {p.name}
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
