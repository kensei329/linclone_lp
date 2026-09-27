import type { SectionProps } from '@/i18n/types';
import { Units } from '@/lib/units';
import { ExpandStage, Eyebrow, ScreenNote, ScrollFillText } from '@/components/site';
import { D01bCloneCheck } from '@/components/mockups/studio/D01bCloneCheck';
import { SelfCallStage } from '@/components/mockups/studio/SelfCallStage';
import { BezelScreen } from '../_shared/BezelScreen';
import { CloneCheckStage } from './CloneCheckStage.client';
import '../creators.css';

/**
 * #check: 03 たしかめる, clone check (stage #2, spec §6.5). The D01b preview
 * chat in the phone expands into the full-bleed night self-call: the ring
 * changes colour teal → violet (a colour change, not a loop, as shipped), the
 * caption fills and the waveform rises. Server HTML is the final state:
 * night self-call, violet ring, fill complete, --amp 1. The screen note sits
 * in the intro (the stage's only static layer).
 */
export function CloneCheck({ d, lang }: SectionProps) {
  const t = d.creators.check;
  return (
    <ExpandStage
      id="check"
      labelledBy="check-title"
      height={{ mobile: 160, desktop: 220 }}
      direction="expand"
      phone={{
        desktop: { side: 'right', width: 300 },
        mobile: { width: 'min(74vw, 290px)', top: 'calc(var(--intro-h) + 12px)' },
        radius: { desktop: 44, mobile: 36 },
      }}
      surfaceStart="cream"
      skip={{ href: '#control', label: d.common.skip.stage }}
      intro={
        <div className="cr-stage-intro cr-check-intro">
          <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
          <h2 id="check-title" className="t-h2">
            <Units text={t.title} lang={lang} mode="phrase" />
          </h2>
          <p className="t-lead">{t.lead}</p>
          {/* Under the intro, clear of the clip/bezel layers; as a .t-small it
              follows the intro's ink → white scrub onto the night. */}
          <ScreenNote d={d} />
          <CloneCheckStage />
        </div>
      }
      bezelScreen={
        <BezelScreen>
          <D01bCloneCheck d={d} lang={lang} persona="aoi" />
        </BezelScreen>
      }
      media={
        <div className="cr-check-media">
          <SelfCallStage
            d={d}
            lang={lang}
            persona="aoi"
            fillSlot={
              <ScrollFillText
                as="p"
                id="check-fill"
                text={t.fill}
                lang={lang}
                mode="units"
                tone="white"
                driver="external"
                className="t-statement cr-check-fill"
              />
            }
          />
        </div>
      }
    />
  );
}
