import type { ReactNode } from 'react';
import type { SectionProps } from '@/i18n/types';
import {
  Section,
  Eyebrow,
  ScrollFillText,
  GlassCard,
  Carousel,
  Disclosure,
  RevealGroup,
  Aura,
  Scene,
  Icon,
  type IconName,
} from '@/components/site';
import { ScreenSlice, LiveBadge, VerifiedMark } from '@/components/mockups/kit';
import { Memory06 } from '@/components/mockups/fan/Memory06';
import { Units } from '@/lib/units';
import { OshiColorPicker, type OshiOption } from './OshiColorPicker.client';
import { PopOnEnter } from './PopOnEnter.client';
import s from './about.module.css';

/** Statement accent (§5.3): the phrase that ends in the teal→purple gradient. */
const ACCENT = { ja: '公認のAIクローン', en: 'official AI clones' } as const;

/** 推し色 swatches: the persona accents from mock.ts (§5.3). Never the CTA teal. */
const OSHI_COLORS: { key: OshiOption['key']; hex: string }[] = [
  { key: 'rose', hex: '#e14b81' },
  { key: 'teal', hex: '#00afc4' },
  { key: 'lavender', hex: '#a97fe0' },
  { key: 'amber', hex: '#f0a53a' },
  { key: 'sky', hex: '#5b8def' },
  { key: 'mint', hex: '#3fb98a' },
];

type CardKey = 'official' | 'labelled' | 'memory';
const CARDS: { key: CardKey; icon: IconName; tone: 'teal' | 'purple' }[] = [
  { key: 'official', icon: 'verified', tone: 'teal' },
  { key: 'labelled', icon: 'auto_awesome', tone: 'purple' },
  { key: 'memory', icon: 'psychology', tone: 'purple' },
];

/**
 * #about (spec §5.3): trust before features. The AI disclosure becomes the
 * page's biggest statement (a clip fill, the only fill in this viewport),
 * three proof cards with small app crops, the official disclosure bar and the
 * 推し色 picker, which re-tints every `oshi` aura on the page.
 */
export function About({ d, lang }: SectionProps) {
  const t = d.home.about;

  const details: Record<CardKey, ReactNode> = {
    official: (
      <div className={s.detailOfficial} aria-hidden="true">
        <span className={s.officialBadge}>
          <Aura persona="oshi" shape="badge" size={64} ring="story" voiceprint={false} />
          <span className={s.officialMark}>
            <VerifiedMark size={22} />
          </span>
        </span>
        <span className={s.officialText}>
          <span className={s.officialName}>{d.personas.yuzu.name}</span>
          <span className={s.officialChip}>
            <Icon name="verified" filled size={12} />
            {d.home.cast.badge}
          </span>
        </span>
      </div>
    ),
    labelled: (
      <div className={s.detailLabelled} aria-hidden="true">
        <Scene kind="stage-light" />
        <span className={s.labelledTop}>
          <LiveBadge />
          <span className={s.labelledName}>{d.personas.kai.name}</span>
        </span>
        <span className={s.disclaimer}>
          <Icon name="auto_awesome" filled size={12} />
          {d.mock.fan.livePlayer.disclaimer}
        </span>
      </div>
    ),
    memory: (
      <div className={s.detailMemory}>
        <ScreenSlice label={d.mock.fan.memory.alt} width={{ mobile: 292, desktop: 300 }} crop={{ y: 520, h: 120 }} radius={18}>
          <Memory06 d={d} lang={lang} persona="oshi" />
        </ScreenSlice>
      </div>
    ),
  };

  const cards = CARDS.map((c) => (
    <GlassCard key={c.key} as="article" tone="day" className={s.card}>
      <div className={s.detail} data-kind={c.key}>
        {details[c.key]}
      </div>
      <div className={s.cardBody}>
        <span className={s.cardIcon} data-tone={c.tone} aria-hidden="true">
          <Icon name={c.icon} filled size={20} />
        </span>
        <h3 className="t-h3">{t.cards[c.key].title}</h3>
        <p className={`t-body ${s.cardText}`}>{t.cards[c.key].body}</p>
      </div>
    </GlassCard>
  ));

  const options: OshiOption[] = OSHI_COLORS.map((o) => ({ key: o.key, hex: o.hex, name: t.oshiColor.options[o.key] }));

  return (
    <Section id="about" surface="cream" labelledBy="about-title" className={s.about}>
      <div className={`container-site ${s.head}`}>
        <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
        <h2 id="about-title" className={`t-h2 ${s.title}`}>
          <Units text={t.title} lang={lang} mode="phrase" />
        </h2>
        <ScrollFillText as="p" mode="clip" tone="ink" className={`t-statement ${s.statement}`} text={t.statement} lang={lang} accent={ACCENT[lang]} />
      </div>

      <div className={s.cards}>
        <RevealGroup selector=".carousel-track > li">
          <Carousel label={t.eyebrow.label} items={cards} itemWidth="80vw" d={d} />
        </RevealGroup>
      </div>

      <div className={`container-site ${s.trust}`}>
        <div className={s.bar}>
          <Disclosure d={d} variant="bar" />
          <PopOnEnter selector=".disclosure-bar svg" />
        </div>
        <OshiColorPicker label={t.oshiColor.label} hint={t.oshiColor.hint} options={options} />
      </div>
    </Section>
  );
}
