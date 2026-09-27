import type { MockProps } from '@/components/mockups/types';
import { Screen, VerifiedMark } from '@/components/mockups/kit';
import { Aura, Icon, Waveform } from '@/components/site';
import { fmt } from '@/i18n/format';
import { Card, cx, personaOf } from './parts';

/**
 * F19 `PickReel00b` (spec §7.1): pick your favourites, the tutorial Reel
 * (V3 00b / 01b), night. The tooltip no longer says 「1人以上」.
 */
export function PickReel00b({ d, persona = 'oshi', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.reel;
  const c = d.mock.fan.common;
  return (
    <Screen theme="night">
      <div className={cx('fm-root fm-reel', className)} data-mock="PickReel00b">
        <div className="fm-fill-aura">
          <Aura persona={persona} shape="reel" theme="night" voiceprint={false} />
        </div>
        <span className="fm-photo-fade" />
        <span className="fm-dots fm-reel-dots">
          <i />
          <i data-on="" />
          <i />
        </span>

        <Card radius={18} className="fm-reel-tip">
          <span className="fm-reel-tip-title">{t.tooltipTitle}</span>
          <span className="fm-reel-tip-sub">{t.tooltipSub}</span>
        </Card>

        <span className="fm-reel-nav">
          <span>
            <Icon name="expand_less" size={24} />
          </span>
          <span>
            <Icon name="expand_more" size={24} />
          </span>
        </span>

        <div className="fm-reel-body">
          <div className="fm-reel-namerow">
            <span className="fm-reel-name">
              {p.name}
              <VerifiedMark size={22} />
            </span>
            <span className="fm-reel-follow">{c.follow}</span>
          </div>
          <div className="fm-reel-tags">
            {p.genre} · {p.tags}
          </div>
          <div className="fm-reel-voice glass-night">
            <span className="fm-play-disc fm-reel-play">
              <Icon name="graphic_eq" size={22} />
            </span>
            <span className="fm-reel-vtxt">
              <span className="fm-reel-quote">{t.voiceQuote}</span>
              <Waveform tone="neon" bars={10} />
            </span>
          </div>
          <div className="fm-reel-actions">
            <span className="fm-reel-call">
              <Icon name="call" filled size={20} />
              {fmt(t.callCta, { name: p.name })}
            </span>
            <span className="fm-reel-dark">
              <Icon name="podcasts" filled size={20} />
              {c.liveBadge}
            </span>
            <span className="fm-reel-dark fm-reel-sq">
              <Icon name="forum" filled size={20} />
            </span>
          </div>
        </div>
      </div>
    </Screen>
  );
}
