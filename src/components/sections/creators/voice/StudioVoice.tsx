import type { ReactNode } from 'react';
import type { SectionProps } from '@/i18n/types';
import { Units } from '@/lib/units';
import { Section, Eyebrow, Marquee, Aura, Waveform, GlassCard, ScreenNote, RevealGroup } from '@/components/site';
import { D07HomeVoiceCard } from '@/components/mockups/studio/D07HomeVoiceCard';
import { D07bMorningCard } from '@/components/mockups/studio/D07bMorningCard';
import { D07cFillersCard } from '@/components/mockups/studio/D07cFillersCard';
import { MockFigure } from '../_shared/MockFigure';
import { VoiceMicro } from './VoiceMicro.client';
import '../creators.css';

const LINES = ['l1', 'l2', 'l3', 'l4', 'l5'] as const;
type CardKey = 'homeVoice' | 'morning' | 'fillers';

/**
 * #voice: 06 ボイス, the night-deep band (spec §6.8). A voice-line marquee
 * (2 rows desktop, 1 mobile; the centre of each row is brightened by a mask)
 * and three night-glass cards whose micro-interactions play in view. Reduced
 * motion: the marquee wraps as a static list; cards show their final state.
 */
export function StudioVoice({ d, lang }: SectionProps) {
  const t = d.creators.voice;
  const m = d.mock.studio;
  const p = { d, lang, persona: 'aoi' as const };
  const items = LINES.map((k, i) => (
    <span key={k} className="cr-vline">
      <span className="cr-vtag" aria-hidden="true">
        <Aura persona="aoi" shape="avatar" size={28} theme="night" monogram={false} />
        <Waveform tone="neon" size="sm" bars={7} seed={i * 2} playing />
      </span>
      <span className="t-display-l cr-vline-text">{t.lines[k]}</span>
    </span>
  ));
  const cards: { key: CardKey; alt: string; mock: ReactNode }[] = [
    { key: 'homeVoice', alt: m.homeVoice.alt, mock: <D07HomeVoiceCard {...p} /> },
    { key: 'morning', alt: m.morning.alt, mock: <D07bMorningCard {...p} /> },
    { key: 'fillers', alt: m.fillers.alt, mock: <D07cFillersCard {...p} /> },
  ];

  return (
    <Section id="voice" surface="night-deep" labelledBy="voice-title" className="cr-voice">
      <div className="container-site">
        <header className="cr-sec-head cr-voice-head">
          <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="white" />
          <h2 id="voice-title" className="t-h2">
            <Units text={t.title} lang={lang} mode="phrase" />
          </h2>
          <p className="t-lead cr-on-night-2">{t.lead}</p>
        </header>
      </div>

      <div className="cr-voice-marquee">
        <Marquee rows={2} items={items} label={t.eyebrow.label} speed={56} />
      </div>

      <div className="container-site">
        <RevealGroup selector=".cr-voice-cards > li" stagger={0.1}>
          <ul className="cr-voice-cards" role="list">
            {cards.map((c) => (
              <li key={c.key} data-card={c.key}>
                <GlassCard as="article" tone="night" className="cr-card cr-card-night">
                  <div className="cr-card-stage">
                    <MockFigure label={c.alt}>{c.mock}</MockFigure>
                  </div>
                  <div className="cr-card-copy">
                    <h3 className="t-h3">{t.cards[c.key].title}</h3>
                    <p className="t-body cr-on-night-2">{t.cards[c.key].body}</p>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </RevealGroup>
        <ScreenNote d={d} tone="dark" />
      </div>
      <VoiceMicro />
    </Section>
  );
}
