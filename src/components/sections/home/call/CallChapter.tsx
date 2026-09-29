import { loadDefaultJapaneseParser } from 'budoux';
import type { SectionProps } from '@/i18n/types';
import type { Locale } from '@/i18n/config';
import { ExpandStage, Eyebrow, StoreBadges, Icon } from '@/components/site';
import { StatusBar } from '@/components/mockups/kit';
import { FirstCall00c } from '@/components/mockups/fan/FirstCall00c';
import { CallStageMedia } from '@/components/mockups/fan/CallStageMedia';
import { Units } from '@/lib/units';
import { Checkpoint } from './Checkpoint';
import { CallStageAnimator } from './CallStageAnimator.client';
import { CallDemoLoader } from './CallDemoLoader.client';
import './call.css';

/** Line-break phrases for the demo captions, computed here so no parser ships to the client. */
function phrases(text: string, lang: Locale): string[] {
  if (lang === 'ja') return loadDefaultJapaneseParser().parse(text);
  return text.split(/(?<=\s)/);
}

/**
 * #call (spec §5.4): stage #1. The hero's first-call phone (00c) expands into
 * a full-bleed night call (05) while the light moves from the fan to 推し
 * and both captions fill. Server HTML is the final state (full-bleed, intro
 * in white, captions filled, `speaking`, meter 1:00, demo button visible).
 * The captions-only tap-to-call demo mounts lazily into `[data-demo-root]`,
 * and the checkpoint download block follows the stage.
 */
export function CallChapter({ d, lang }: SectionProps) {
  const t = d.home.call;
  const demo = d.home.demo;

  const intro = (
    <div className="cc-intro">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="call-title" className="t-h2 cc-title">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <div className="cc-more" data-call-more="">
        <p className="t-lead cc-lead">{t.lead}</p>
        <ul className="cc-chips">
          <li>
            <Icon name="volume_up" filled size={16} />
            {t.routes}
          </li>
          <li>
            <Icon name="timer" filled size={16} />
            {d.common.friction.first60}
          </li>
        </ul>
      </div>
      <CallStageAnimator />
      <CallDemoLoader
        lang={lang}
        phrases={{ lineOne: phrases(demo.lineOne, lang), hint: phrases(demo.hint, lang), lineTwo: phrases(demo.lineTwo, lang) }}
        strings={{
          button: demo.button,
          tag: demo.tag,
          startLabel: demo.startLabel,
          captionsLabel: demo.captionsLabel,
          lineOne: demo.lineOne,
          hint: demo.hint,
          lineTwo: demo.lineTwo,
          doneTitle: demo.doneTitle,
          doneBody: demo.doneBody,
          note: demo.note,
          replay: demo.replay,
          paused: demo.paused,
          live: d.common.demo,
          stop: d.mock.fan.call.end,
        }}
        icons={{
          call: <Icon name="call" filled size={22} />,
          end: <Icon name="call_end" filled size={22} />,
          done: <Icon name="check_circle" filled size={40} />,
          replay: <Icon name="replay" size={20} />,
        }}
        badges={<StoreBadges d={d} lang={lang} placement="demo" qr />}
      />
    </div>
  );

  return (
    <>
      <ExpandStage
        id="call"
        labelledBy="call-title"
        height={{ mobile: 180, desktop: 220 }}
        direction="expand"
        phone={{
          desktop: { side: 'right', width: 330 },
          mobile: { width: 'min(76vw, 300px)', top: 'calc(var(--intro-h) + 12px)' },
          radius: { desktop: 44, mobile: 36 },
        }}
        intro={intro}
        media={<CallStageMedia d={d} lang={lang} persona="oshi" variant="stage" />}
        bezelScreen={
          <div className="cc-bezel-screen" data-call-bezel="" aria-hidden="true">
            <FirstCall00c d={d} lang={lang} persona="oshi" />
            <StatusBar time="10:42" theme="night" />
          </div>
        }
        skip={{ href: '#morning-call', label: d.common.skip.stage }}
        surfaceStart="cream"
      />
      <Checkpoint d={d} lang={lang} />
    </>
  );
}
