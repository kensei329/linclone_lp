import { loadDefaultJapaneseParser } from 'budoux';
import type { SectionProps } from '@/i18n/types';
import type { Locale } from '@/i18n/config';
import {
  ExpandStage,
  type ExpandStageProps,
  Eyebrow,
  ScrollFillText,
  CaptionMarker,
  StoreBadges,
  QrBlock,
  FrictionList,
  Disclosure,
  ScreenNote,
  CallGlow,
} from '@/components/site';
import { CallStageMedia } from '@/components/mockups/fan/CallStageMedia';
import { FinalStageAnimator } from './FinalStageAnimator.client';
import s from './final.module.css';

/** The word the caption marker rests on (spec §5.13: 「電話」 / "call"). */
const MARK = { ja: '電話', en: 'call' } as const;

/**
 * Index of the fill unit that holds `MARK`. JA uses phrase units (BudouX,
 * exactly as `Units` splits them), so the marker rests on 「電話しよう。」;
 * EN splits on spaces.
 */
function markIndex(text: string, lang: Locale): number {
  const units = lang === 'ja' ? loadDefaultJapaneseParser().parse(text) : text.split(/\s+/).filter(Boolean);
  const i = units.findIndex((u) => u.toLowerCase().includes(MARK[lang]));
  return i < 0 ? units.length - 1 : i;
}

/**
 * #download: 推しに、電話しよう。 (spec §5.13), stage #3, the reverse collapse:
 * the call from #call shrinks back into a phone beside the store badges.
 * The server HTML is the collapsed final state (media clipped to the phone
 * rect in pure CSS inside the phone bezel, and the full CTA block),
 * which is also what every `#download` link lands on.
 */
export function FinalCta({ d, lang }: SectionProps) {
  const t = d.home.final;
  const props: ExpandStageProps = {
    id: 'download',
    className: s.stage,
    rootAttrs: { 'data-download-block': '' },
    decor: (
      <div className={s.decor}>
        <span className={s.burst} data-burst="" />
        <span className={s.sunrise} data-sunrise="">
          <CallGlow variant="fan" />
        </span>
      </div>
    ),
    labelledBy: 'download-title',
    height: { mobile: 140, desktop: 200 },
    direction: 'collapse',
    surfaceStart: 'night',
    phone: {
      desktop: { side: 'right', width: 300 },
      mobile: { width: 'min(56vw, 220px)', top: 'calc(var(--intro-h) + 8px)' },
      radius: { desktop: 40, mobile: 30 },
    },
    skip: { href: '#download-cta', label: d.common.skip.stage },
    intro: (
      <div className={s.intro} data-final-intro="">
        <div className={s.lede}>
          <Eyebrow label={t.eyebrow} tone="white" />
          <ScrollFillText
            as="h2"
            id="download-title"
            text={t.title}
            lang={lang}
            mode="units"
            unit={lang === 'ja' ? 'phrase' : 'word'}
            tone="white"
            driver="external"
            className={`t-display-l ${s.title}`}
          />
          <CaptionMarker targetId="download-title" restOn={markIndex(t.title, lang)} tone="neon" />
          <p className={s.sub} data-final-reveal="">
            {t.sub}
          </p>
        </div>
        <div className={s.dl} id="download-cta" data-final-dl="">
          <div className={s.dlRow} data-final-reveal="">
            <div className={s.badges}>
              <StoreBadges d={d} lang={lang} placement="final" size="lg" showFriction />
              <FrictionList d={d} items={['first60', 'trialBeforeSignup', 'noPassword']} />
            </div>
            <div className={s.qr}>
              <QrBlock d={d} lang={lang} placement="qr_final" size={112} caption={t.qrCaption} />
            </div>
          </div>
          <div className={s.fine} data-final-reveal="">
            <Disclosure d={d} variant="line" />
            <ScreenNote d={d} tone="dark" />
          </div>
        </div>
        <FinalStageAnimator />
      </div>
    ),
    media: (
      <div className={s.media} role="img" aria-label={t.stageAlt}>
        <CallStageMedia d={d} lang={lang} persona="oshi" variant="final" />
      </div>
    ),
  };

  return <ExpandStage {...props} />;
}
