import type { SectionProps } from '@/i18n/types';
import { ExpandStage, Eyebrow, ScreenNote, ScrollFillText } from '@/components/site';
import { D01Home } from '@/components/mockups/studio/D01Home';
import { D01Bento, type TileId } from '@/components/mockups/studio/D01Bento';
import { BezelScreen } from '../_shared/BezelScreen';
import { CommandCentreStage } from './CommandCentreStage.client';
import '../creators.css';

/** Accent phrase inside `creators.home.fill`, per locale. */
const ACCENT = { ja: 'スマホひとつで', en: 'All from your phone' } as const;

/** The 7 Home tiles are the page's table of contents (spec §6.3). */
const TILE_HREFS: Record<TileId, string> = {
  publicProfile: '#control',
  fanContent: '#control',
  live: '#real',
  homeVoice: '#voice',
  morningCall: '#voice',
  fillers: '#voice',
  analytics: '#insights',
};

/**
 * #how: 01 しくみ, the command centre (stage #1, spec §6.3). The D01 Home in
 * the phone expands into the full-viewport D01Bento on the cream Studio
 * surface; the intro stays ink (surfaceEnd "studio"). Server HTML is the final
 * state: bento expanded, H2 filled.
 */
export function CommandCentre({ d, lang }: SectionProps) {
  const t = d.creators.home;
  return (
    <ExpandStage
      id="how"
      labelledBy="how-title"
      height={{ mobile: 180, desktop: 240 }}
      direction="expand"
      phone={{
        desktop: { side: 'right', width: 300 },
        mobile: { width: 'min(74vw, 290px)', top: 'calc(var(--intro-h) + 12px)' },
        radius: { desktop: 44, mobile: 36 },
      }}
      surfaceStart="cream"
      surfaceEnd="studio"
      skip={{ href: '#setup', label: d.common.skip.stage }}
      intro={
        <div className="cr-stage-intro cr-how-intro">
          <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
          <ScrollFillText
            as="h2"
            id="how-title"
            text={t.fill}
            lang={lang}
            mode="units"
            unit="phrase"
            tone="studio"
            driver="external"
            accent={ACCENT[lang]}
            className="t-h2"
          />
          <p className="t-lead">{t.lead}</p>
          {/* In the intro, clear of the clip/bezel layers (stays ink: surfaceEnd studio). */}
          <ScreenNote d={d} />
          <CommandCentreStage />
        </div>
      }
      bezelScreen={
        <BezelScreen>
          <D01Home d={d} lang={lang} persona="aoi" />
        </BezelScreen>
      }
      media={
        <div className="cr-how-media">
          <D01Bento d={d} lang={lang} persona="aoi" tileHrefs={TILE_HREFS} tileDesc={t.tiles} />
        </div>
      }
    />
  );
}
