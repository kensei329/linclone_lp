import type { MockProps } from '@/components/mockups/types';
import { Aura, Waveform } from '@/components/site';
import type { PersonaId } from '@/lib/personas';
import { cx, personaOf } from '../parts';

const SLIDES: (PersonaId | 'oshi')[] = ['kai', 'sora', 'oshi'];

/**
 * F21 `ReelMini` (spec §7.1): a 9:16 aura Reel, 180×320 (mobile 150×266).
 * Hooks: `[data-m="reel-track"]` (vertical track of 3 slides: Kai, Sora, Yuzu;
 * animators move it by whole slide heights), `[data-m="follow"]` per slide,
 * `data-state` = follow | following (+ `[data-following]`) swaps the label.
 * SSR: Kai, Following.
 */
export function ReelMini({ d, className }: MockProps) {
  const c = d.mock.fan.common;
  return (
    <figure role="img" aria-label={d.mock.fan.reel.alt} className={cx('fm-mini fm-rm', className)} data-mock="ReelMini">
      <div className="fm-rm-window" aria-hidden="true">
        <div className="fm-rm-track" data-m="reel-track">
          {SLIDES.map((id, i) => {
            const p = personaOf(d, id);
            const on = i === 0;
            return (
              <div className="fm-rm-slide" key={id}>
                <span className="fm-fill-aura">
                  <Aura persona={id} shape="reel" theme="night" voiceprint={false} />
                </span>
                <span className="fm-photo-fade" />
                <span className="fm-rm-copy">
                  <span className="fm-rm-name">{p.name}</span>
                  <Waveform tone="neon" size="sm" bars={9} playing seed={i * 3} />
                  <span className="fm-rm-follow" data-m="follow" data-state={on ? 'following' : 'follow'} data-following={on ? '' : undefined}>
                    <span data-l="follow">{c.follow}</span>
                    <span data-l="following">{c.following}</span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
