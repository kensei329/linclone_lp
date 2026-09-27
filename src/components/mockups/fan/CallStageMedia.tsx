import type { MockProps } from '@/components/mockups/types';
import { Aura, CallGlow, Icon, ScrollFillText, Waveform } from '@/components/site';
import { CallBackdrop, cx, personaOf, vars } from './parts';

type CallStageMediaProps = MockProps & { variant: 'stage' | 'final' };

/** Oshi caption accent per locale (spec §5.4: 「聞かせて」 / "Tell me everything"). */
const OSHI_ACCENT = { ja: '聞かせて', en: 'Tell me everything' } as const;

/**
 * F2 `CallStageMedia` (spec §7.1): full-viewport voice call stage, a web
 * recomposition of AICalls 05. Absolutely fills its positioned parent.
 *
 * SSR is the final state: `data-state="speaking"`, both captions filled,
 * meter `0:60`, toast visible, avatar glow lit, fan glow off.
 *
 * DOM hooks (section animators drive these):
 * - root `[data-state]` = connecting | listening | thinking | speaking; CSS shows the matching `[data-call-state] [data-s]`
 * - `[data-caption="fan"]`, `[data-caption="oshi"]`: ScrollFillText driver="external" (`[data-fill-id]` = call-caption-fan / call-caption-oshi)
 * - `[data-meter]`: the `0:60` value text · `[data-toast]` · `[data-wave]` (Waveform, `--amp`)
 * - `[data-avatar-glow]` (SSR opacity 1) · `[data-fan-glow]` (SSR opacity 0)
 * - `[data-demo-root]`: sits OUTSIDE the aria-hidden layer so its link stays focusable
 *
 * Variant `final`: portrait, name, state and the breathing glow only.
 */
export function CallStageMedia({ d, lang, persona = 'oshi', variant, className }: CallStageMediaProps) {
  const p = personaOf(d, persona);
  const c = d.mock.fan.call;
  const stage = variant === 'stage';
  return (
    <div className={cx('fm-call', className)} data-mock="CallStageMedia" data-variant={variant} data-state="speaking" style={vars({ '--pc': p.color })}>
      <div className="fm-call-art" role="img" aria-label={stage ? d.home.call.stageAlt : c.alt}>
        <div className="fm-call-layer" aria-hidden="true">
          <CallBackdrop>
            <Aura persona={persona} shape="scene-portrait" theme="night" monogram={false} voiceprint={false} />
          </CallBackdrop>
          <CallGlow variant="fan" />

          {stage ? (
            <>
              <div className="fm-meter fm-call-meter glass-night">
                <span className="fm-meter-label">{c.freeLabel}</span>
                <span className="fm-meter-value" data-meter="">
                  0:60
                </span>
              </div>
              <div className="fm-call-toast glass-night" data-toast="">
                <Icon name="graphic_eq" size={18} />
                <span>{d.home.call.transcriptToast}</span>
              </div>
            </>
          ) : null}

          <div className="fm-call-col">
            {stage ? (
              <div className="fm-call-cap-fan" data-caption="fan">
                <ScrollFillText
                  as="p"
                  id="call-caption-fan"
                  text={d.home.call.fanCaption}
                  lang={lang}
                  mode="units"
                  unit="phrase"
                  tone="white"
                  driver="external"
                  className="t-h3 fm-cap-fan"
                />
              </div>
            ) : null}

            <div className="fm-call-portrait">
              <CallGlow variant="avatar" state={stage ? 'off' : 'breathe'} />
              <span className="fm-portrait-ring">
                <Aura persona={persona} shape="avatar" theme="night" className="fm-call-avatar" />
              </span>
            </div>

            <div className="fm-call-name">{p.name}</div>
            <div className="fm-call-state" data-call-state="">
              <span className="fm-call-clock">00:08 · </span>
              <span data-s="connecting">{c.connecting}</span>
              <span data-s="listening">{c.listening}</span>
              <span data-s="thinking">{c.thinking}</span>
              <span data-s="speaking">{c.speaking}</span>
            </div>
            <span className="fm-call-wave">
              <Waveform bars={12} tone="neon" amp="css-var" />
            </span>

            {stage ? (
              <div className="fm-call-cap-oshi" data-caption="oshi">
                <ScrollFillText
                  as="p"
                  id="call-caption-oshi"
                  text={d.home.call.oshiCaption}
                  lang={lang}
                  mode="units"
                  unit="phrase"
                  tone="white"
                  driver="external"
                  accent={OSHI_ACCENT[lang]}
                  className="t-display-l fm-cap-oshi"
                />
              </div>
            ) : null}
          </div>

          {stage ? (
            <div className="fm-call-controls">
              <span className="fm-ctl glass-night">
                <Icon name="mic" size={24} />
              </span>
              <span className="fm-ctl fm-ctl-end">
                <Icon name="call_end" filled size={28} />
              </span>
              <span className="fm-ctl glass-night">
                <Icon name="volume_up" size={24} />
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {stage ? (
        <div className="fm-call-demo" data-demo-root="">
          <a href="#download" className="btn-night fm-demo-btn">
            <Icon name="call" filled size={20} />
            <span>{d.home.demo.button}</span>
            <span className="fm-demo-tag">{d.home.demo.tag}</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
