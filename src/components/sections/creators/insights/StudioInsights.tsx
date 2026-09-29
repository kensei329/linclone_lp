import type { SectionProps } from '@/i18n/types';
import { Units } from '@/lib/units';
import { Section, Eyebrow, Icon, ScreenNote, RevealGroup } from '@/components/site';
import { PhoneFrame, ScreenSlice } from '@/components/mockups/kit';
import { D09Analytics } from '@/components/mockups/studio/D09Analytics';
import { D10EarningsCalculating } from '@/components/mockups/studio/D10EarningsCalculating';
import { InsightsMicro } from './InsightsMicro.client';
import '../creators.css';

/**
 * #insights: 07 データと収益 (spec §6.9). Analytics without values or axes,
 * and Coin-based earnings shown only in the "calculating" state. Desktop two
 * columns with 320 phones; mobile stacked slices. Bars grow on enter; the
 * hourglass turns every 2s while in view.
 */
export function StudioInsights({ d, lang }: SectionProps) {
  const t = d.creators.insights;
  const m = d.mock.studio;
  const p = { d, lang, persona: 'aoi' as const };
  return (
    <Section id="insights" surface="studio-cyan" labelledBy="insights-title" className="cr-insights">
      <RevealGroup selector=".cr-real-copy > *">
        <div className="container-site cr-real-grid cr-insights-grid">
          <div className="cr-real-col" data-col="analytics">
            <div className="cr-real-copy">
              <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
              <h2 id="insights-title" className="t-h2">
                <Units text={t.title} lang={lang} mode="phrase" />
              </h2>
              <p className="t-body cr-real-lead">{t.analyticsBody}</p>
              <p className="glass cr-trust t-small">
                <span className="cr-trust-icon" aria-hidden="true">
                  <Icon name="lock" size={18} />
                </span>
                <span>{t.privacy}</span>
              </p>
            </div>
            <div className="cr-real-mock" data-mock-box="analytics">
              <div className="cr-only-desk">
                <PhoneFrame size={{ mobile: 320, desktop: 320 }} label={m.analytics.alt}>
                  <D09Analytics {...p} />
                </PhoneFrame>
              </div>
              <div className="cr-only-mob">
                <ScreenSlice label={m.analytics.alt} width={{ mobile: 300 }} crop={{ y: 54, h: 620 }} radius={28}>
                  <D09Analytics {...p} />
                </ScreenSlice>
              </div>
            </div>
          </div>

          <div className="cr-real-col" data-col="earnings">
            <div className="cr-real-copy">
              <h3 className="t-h3 cr-real-h3">
                <span className="cr-live-chip" data-tone="gold" aria-hidden="true">
                  <Icon name="payments" size={16} />
                </span>
                <span>{t.earningsTitle}</span>
              </h3>
              <p className="t-body ink-2">{t.earningsBody}</p>
            </div>
            <div className="cr-real-mock" data-mock-box="earnings">
              <div className="cr-only-desk">
                <PhoneFrame size={{ mobile: 320, desktop: 320 }} label={m.earnings.alt}>
                  <D10EarningsCalculating {...p} />
                </PhoneFrame>
              </div>
              <div className="cr-only-mob">
                <ScreenSlice label={m.earnings.alt} width={{ mobile: 300 }} crop={{ y: 54, h: 560 }} radius={28}>
                  <D10EarningsCalculating {...p} />
                </ScreenSlice>
              </div>
            </div>
          </div>
        </div>
      </RevealGroup>
      <div className="container-site">
        <ScreenNote d={d} />
      </div>
      <InsightsMicro />
    </Section>
  );
}
