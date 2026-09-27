import type { MockProps } from '@/components/mockups/types';
import { LiveBadge, Screen, TabBarFan, VerifiedMark } from '@/components/mockups/kit';
import { Aura, Icon, Waveform } from '@/components/site';
import { cx, personaOf } from './parts';

/**
 * F9 `LiveFeedCard` (spec §7.1): the LIVE feed's on-air card (V3 12 family),
 * night. It is the LIVE stage's bezelScreen. No viewer count.
 * Hook: `[data-m="join"]` (pressed at p 0.03–0.08 by the stage timeline).
 */
export function LiveFeedCard({ d, persona = 'kai', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.liveFeed;
  return (
    <Screen theme="night">
      <div className={cx('fm-root fm-feed', className)} data-mock="LiveFeedCard">
        <div className="fm-fill-aura">
          <Aura persona={persona} shape="reel" theme="night" voiceprint={false} />
        </div>
        <span className="fm-photo-fade" />

        <div className="fm-feed-title">{t.title}</div>

        <div className="fm-feed-body">
          <div className="fm-feed-onair">
            <LiveBadge pulse />
            <span>{t.onAir}</span>
            <span className="fm-feed-wave">
              <Waveform tone="white" size="sm" bars={7} playing />
            </span>
          </div>
          <div className="fm-feed-name">
            {p.name}
            <VerifiedMark size={20} tone="neon" />
          </div>
          <div className="fm-feed-theme">{t.theme}</div>
          <div className="fm-feed-join" data-m="join">
            <Icon name="podcasts" filled size={20} />
            {t.join}
          </div>
        </div>

        <TabBarFan d={d} active="live" />
      </div>
    </Screen>
  );
}
