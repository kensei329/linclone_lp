import type { ReactNode } from 'react';
import type { SectionProps } from '@/i18n/types';
import { Section, Eyebrow, ScrollFillText, GlassCard, ScreenNote, RevealGroup } from '@/components/site';
import { D06GrowCard } from '@/components/mockups/studio/D06GrowCard';
import { S07NgTopics } from '@/components/mockups/studio/S07NgTopics';
import { D08ProfileCard } from '@/components/mockups/studio/D08ProfileCard';
import { D04GalleryCard } from '@/components/mockups/studio/D04GalleryCard';
import { MockFigure } from '../_shared/MockFigure';
import { ControlMicro } from './ControlMicro.client';
import '../creators.css';

type CardKey = 'grow' | 'ng' | 'profile' | 'labels';

/**
 * #control: 04 安心, 最終判断は、いつもご自身で。 (spec §6.6). A units fill H2
 * (`top 75%` → `center 45%`) and a 2×2 bento of glass cards, each with a
 * card-crop mockup that plays one micro-interaction on enter (0.3s apart).
 * Server HTML: grow approved, NG on, AI images on, label chip and ribbon shown.
 */
export function StudioControl({ d, lang }: SectionProps) {
  const t = d.creators.control;
  const m = d.mock.studio;
  const p = { d, lang, persona: 'aoi' as const };
  const cards: { key: CardKey; alt: string; mock: ReactNode }[] = [
    { key: 'grow', alt: m.grow.alt, mock: <D06GrowCard {...p} /> },
    { key: 'ng', alt: m.ng.alt, mock: <S07NgTopics {...p} compact /> },
    { key: 'profile', alt: m.profile.alt, mock: <D08ProfileCard {...p} /> },
    { key: 'labels', alt: m.content.alt, mock: <D04GalleryCard {...p} /> },
  ];

  return (
    <Section id="control" surface="studio" labelledBy="control-title" className="cr-control">
      <div className="container-site">
        <header className="cr-sec-head cr-control-head">
          <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
          <ScrollFillText
            as="h2"
            id="control-title"
            text={t.fill}
            lang={lang}
            mode="units"
            unit="phrase"
            tone="studio"
            start="top 75%"
            end="center 45%"
            className="t-display-l"
          />
          <p className="t-lead ink-2">{t.lead}</p>
        </header>

        <RevealGroup selector=".cr-bento-item" stagger={0.1}>
          <ul className="cr-bento" role="list">
            {cards.map((c) => (
              <li key={c.key} className="cr-bento-item" data-card={c.key}>
                <GlassCard as="article" tone="day" className="cr-card">
                  <div className="cr-card-stage">
                    <MockFigure label={c.alt}>{c.mock}</MockFigure>
                  </div>
                  <div className="cr-card-copy">
                    <h3 className="t-h3">{t.cards[c.key].title}</h3>
                    <p className="t-body ink-2">{t.cards[c.key].body}</p>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </RevealGroup>
        <ScreenNote d={d} />
      </div>
      <ControlMicro />
    </Section>
  );
}
