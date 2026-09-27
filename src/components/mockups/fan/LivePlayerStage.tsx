import type { ReactNode } from 'react';
import type { MockProps } from '@/components/mockups/types';
import { LiveBadge, RingAvatar, VerifiedMark } from '@/components/mockups/kit';
import { Aura, Icon, Scene, Waveform, type IconName } from '@/components/site';
import { cx, personaOf, vars } from './parts';

type LivePlayerStageProps = MockProps & { fillSlot?: ReactNode };

const COMMENTS = ['c1', 'c2', 'c3', 'c4'] as const;
const GIFTS: { id: 'rose' | 'star' | 'gem' | 'fireworks' | 'guitar' | 'nova'; icon: IconName }[] = [
  { id: 'rose', icon: 'favorite' },
  { id: 'star', icon: 'star' },
  { id: 'gem', icon: 'auto_awesome' },
  { id: 'fireworks', icon: 'celebration' },
  { id: 'guitar', icon: 'music_note' },
  { id: 'nova', icon: 'local_fire_department' },
];

/**
 * F10 `LivePlayerStage` (spec §7.1): full-viewport audio-only LIVE player, a
 * web recomposition of LivePlayer 11 (live mode). Absolutely fills its
 * positioned parent. No viewer count, no gift coin tiers, `podcasts`/`radio`/
 * `graphic_eq` glyphs only, and the AI disclaimer is always visible.
 *
 * SSR = final state. Hooks:
 * - `[data-theme-progress]`: the teal fill (scaleX .65 in SSR, origin left)
 * - `[data-disclaimer]` (always visible) · `[data-fill]` (the section's fillSlot,
 *   kept OUTSIDE the aria-hidden art so the line stays readable)
 * - `[data-comments]`: masked column whose single child `[data-comments-track]`
 *   holds c1–c4 twice, so LiveLoops can run a seamless yPercent 0→-50 loop
 * - `[data-m="superchat"]` carries `is-read` in SSR (the 読み上げ済み tag pops when it is added)
 * - `[data-gift]` ×6 near the bottom right, SSR opacity 0 (LiveLoops pops them)
 */
export function LivePlayerStage({ d, persona = 'kai', fillSlot, className }: LivePlayerStageProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.livePlayer;
  const comment = (k: (typeof COMMENTS)[number], dup: boolean) => (
    <div className="fm-lp-comment glass-night" key={`${k}${dup ? '-2' : ''}`}>
      <span className="fm-lp-user">{t.comments[k].user}</span>
      <span className="fm-lp-text">{t.comments[k].text}</span>
    </div>
  );
  return (
    <div className={cx('fm-lp', className)} data-mock="LivePlayerStage" style={vars({ '--pc': p.color })}>
      <div className="fm-lp-art" role="img" aria-label={t.alt}>
        <div className="fm-lp-layer" aria-hidden="true">
          <Scene kind="stage-light" />
          <span className="fm-lp-tint" />
          <span className="fm-lp-scrim" />

          <div className="fm-lp-top">
            <span className="fm-lp-av">
              <RingAvatar persona={persona} size={44} ring="live" />
              <span className="fm-lp-av-badge">
                <LiveBadge />
              </span>
            </span>
            <span className="fm-lp-id">
              <span className="fm-lp-name">
                {p.name}
                <VerifiedMark size={16} tone="neon" />
                <span className="fm-lp-follow">{t.follow}</span>
              </span>
              <span className="fm-lp-onair">
                <span className="fm-lp-dot" />
                {t.onAir}
              </span>
            </span>
            <span className="fm-lp-theme">
              <Icon name="radio" size={18} />
              <span className="fm-lp-theme-txt">{t.theme}</span>
              <span className="fm-lp-track">
                <span className="fm-lp-progress" data-theme-progress="" />
              </span>
            </span>
          </div>

          <div className="fm-lp-disclaimer glass-night" data-disclaimer="">
            {t.disclaimer}
          </div>

          <div className="fm-lp-centre">
            <span className="fm-lp-halo" />
            <Aura persona={persona} shape="avatar" size={132} ring="live" theme="night" className="fm-lp-avatar" />
            <span className="fm-lp-wave">
              <Waveform bars={24} tone="white" playing />
            </span>
          </div>

          <div className="fm-lp-feed">
            <div className="fm-lp-super glass-night is-read" data-m="superchat">
              <span className="fm-lp-super-head">
                <span className="fm-lp-super-lbl">{t.superChat}</span>
                <span className="fm-lp-readtag">
                  <Icon name="graphic_eq" size={12} />
                  {t.readOnAir}
                </span>
              </span>
              <span className="fm-lp-text">
                <span className="fm-lp-user">{t.comments.c3.user}</span>
                {t.superChatText}
              </span>
            </div>
            <div className="fm-lp-comments" data-comments="">
              <div className="fm-lp-track-y" data-comments-track="">
                {COMMENTS.map((k) => comment(k, false))}
                {COMMENTS.map((k) => comment(k, true))}
              </div>
            </div>
          </div>

          <div className="fm-lp-gifts">
            {GIFTS.map((g, i) => (
              <span key={g.id} className="fm-lp-gift" data-gift={g.id} style={vars({ '--i': i })}>
                <Icon name={g.icon} filled size={26} />
              </span>
            ))}
          </div>

          <div className="fm-lp-bottom">
            <div className="fm-lp-tray">
              {GIFTS.map((g) => (
                <span key={g.id} className="fm-lp-chip">
                  <Icon name={g.icon} filled size={16} />
                  {t.gifts[g.id]}
                </span>
              ))}
            </div>
            <div className="fm-lp-composer">
              <span className="fm-lp-input">{t.composer}</span>
              <span className="fm-lp-giftbtn">
                <Icon name="redeem" size={20} />
                <span>{t.gift}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {fillSlot ? (
        <div className="fm-lp-fill" data-fill="">
          <div className="fm-lp-fill-in">{fillSlot}</div>
        </div>
      ) : null}
    </div>
  );
}
