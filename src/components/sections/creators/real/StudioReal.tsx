import type { SectionProps } from '@/i18n/types';
import { CLAIMS } from '@/lib/site-config';
import { Units } from '@/lib/units';
import { Section, Eyebrow, Icon, ScreenNote, RevealGroup } from '@/components/site';
import { PhoneFrame, ScreenSlice } from '@/components/mockups/kit';
import { D02bThread } from '@/components/mockups/studio/D02bThread';
import { D05Live } from '@/components/mockups/studio/D05Live';
import { RealMicro } from './RealMicro.client';
import '../creators.css';

/**
 * #real: 05 本人として (spec §6.7). Official replies in any follower chat (with
 * the per-chat pause), and the clone-hosted LIVE配信. Desktop: two columns,
 * each with a 320 phone; mobile: stacked, with cropped slices. The drop-in
 * line and mockup row render only when CLAIMS.liveDropIn.
 */
export function StudioReal({ d, lang }: SectionProps) {
  const t = d.creators.real;
  const m = d.mock.studio;
  const p = { d, lang, persona: 'aoi' as const };
  return (
    <Section id="real" surface="cream" labelledBy="real-title" className="cr-real">
      <RevealGroup selector=".cr-real-copy > *">
        <div className="container-site cr-real-grid">
          <div className="cr-real-col" data-col="thread">
            <div className="cr-real-copy">
              <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
              <h2 id="real-title" className="t-h2">
                <Units text={t.title} lang={lang} mode="phrase" />
              </h2>
              <p className="t-body cr-real-lead">{t.officialBody}</p>
              <p className="t-body ink-2 cr-real-point">
                <span className="cr-point-icon" aria-hidden="true">
                  <Icon name="pause" filled size={16} />
                </span>
                <span>{t.pauseBody}</span>
              </p>
            </div>
            <div className="cr-real-mock" data-mock-box="thread">
              <div className="cr-only-desk">
                <PhoneFrame size={{ mobile: 320, desktop: 320 }} label={m.thread.alt} statusTime="21:06">
                  <D02bThread {...p} />
                </PhoneFrame>
              </div>
              <div className="cr-only-mob">
                <ScreenSlice label={m.thread.alt} width={{ mobile: 300 }} crop={{ y: 54, h: 520 }} radius={28}>
                  <D02bThread {...p} />
                </ScreenSlice>
              </div>
            </div>
          </div>

          <div className="cr-real-col" data-col="live">
            <div className="cr-real-copy">
              <h3 className="t-h3 cr-real-h3">
                <span className="cr-live-chip" aria-hidden="true">
                  <Icon name="podcasts" size={16} />
                </span>
                <span>{t.liveTitle}</span>
              </h3>
              <p className="t-body ink-2">{t.liveBody}</p>
              {CLAIMS.liveDropIn ? <p className="t-body ink-2">{t.dropIn}</p> : null}
            </div>
            <div className="cr-real-mock" data-mock-box="live">
              <div className="cr-only-desk">
                <PhoneFrame size={{ mobile: 320, desktop: 320 }} label={m.live.alt} statusTime="20:12">
                  <D05Live {...p} dropIn={CLAIMS.liveDropIn} />
                </PhoneFrame>
              </div>
              <div className="cr-only-mob">
                <ScreenSlice label={m.live.alt} width={{ mobile: 300 }} crop={{ y: 60, h: 600 }} radius={28}>
                  <D05Live {...p} dropIn={CLAIMS.liveDropIn} />
                </ScreenSlice>
              </div>
            </div>
          </div>
        </div>
      </RevealGroup>
      <div className="container-site">
        <ScreenNote d={d} />
      </div>
      <RealMicro />
    </Section>
  );
}
