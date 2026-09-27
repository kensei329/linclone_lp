import type { ReactNode } from 'react';
import type { SectionProps } from '@/i18n/types';
import type { Locale } from '@/i18n/config';
import { Section, Eyebrow, Carousel, Icon, Aura, RevealGroup, ScreenNote } from '@/components/site';
import { ReelMini } from '@/components/mockups/fan/minis/ReelMini';
import { QuestsMini } from '@/components/mockups/fan/minis/QuestsMini';
import { BonusMini } from '@/components/mockups/fan/minis/BonusMini';
import { InviteMini } from '@/components/mockups/fan/minis/InviteMini';
import { PlansMini } from '@/components/mockups/fan/minis/PlansMini';
import { ConfirmSheetMini } from '@/components/mockups/fan/minis/ConfirmSheetMini';
import { MyPageMini } from '@/components/mockups/fan/minis/MyPageMini';
import { SleepMini } from '@/components/mockups/fan/minis/SleepMini';
import { SignInMini } from '@/components/mockups/fan/minis/SignInMini';
import { Units } from '@/lib/units';
import { FeatureIndex } from './FeatureIndex';
import { ModeSampler, type ModeSample } from './ModeSampler.client';
import { BentoMicro } from './BentoMicro.client';
import s from './more.module.css';

const MODE_IDS = ['standard', 'gentle', 'bestFriend', 'cheerleader', 'toughLove', 'tsundere'] as const;
const MONEY_POINTS = ['confirm', 'refund', 'heard', 'noConnect', 'store'] as const;

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

type TileProps = {
  id: string;
  title: string;
  body?: ReactNode;
  lang: Locale;
  className?: string;
  visualClassName?: string;
  children: ReactNode;
};

/** One bento tile: `.glass` card, an H3 + body, and a mini-mockup stage. */
function Tile({ id, title, body, lang, className, visualClassName, children }: TileProps) {
  return (
    <article id={`more-${id}`} data-tile={id} aria-labelledby={`more-${id}-title`} className={cx('glass', s.tile, className)}>
      <div className={s.copy}>
        <h3 id={`more-${id}-title`} className={cx('t-h3', s.tileTitle)}>
          <Units text={title} lang={lang} mode="phrase" />
        </h3>
        {body}
      </div>
      <div className={cx(s.visual, visualClassName)}>{children}</div>
    </article>
  );
}

/**
 * #more: まだまだ、推しとできること。 (spec §5.9). A cream bento of everything
 * else in the app, each tile with a mini mockup (WP4 F21) and a small
 * micro-interaction (BentoMicro), then the feature index.
 *
 * One DOM serves both breakpoints: below 1024px the six small tiles sit in a
 * scroll-snap Carousel; from 1024px the carousel wrappers become
 * `display: contents` and every tile is placed on the 12-column bento grid.
 */
export function MoreBento({ d, lang }: SectionProps) {
  const t = d.home.more;
  const tiles = t.tiles;
  const mf = d.mock.fan;
  const name = d.personas.yuzu.name;

  const modes: ModeSample[] = MODE_IDS.map((id) => ({ id, label: mf.memory.modes[id], sample: tiles.modes.samples[id] }));
  const small = (id: 'reel' | 'quests' | 'bonus' | 'invite' | 'library' | 'sleep', visual: ReactNode, visualClassName?: string) => (
    <Tile
      key={id}
      id={id}
      title={tiles[id].title}
      body={<p className={cx('t-body', s.body)}>{tiles[id].body}</p>}
      lang={lang}
      className={s[`tile_${id}`]}
      visualClassName={visualClassName}
    >
      {visual}
    </Tile>
  );

  return (
    <Section id="more" surface="cream" labelledBy="more-title" className={s.section}>
      <div className="container-site">
        <header className={s.head}>
          <div className={s.headMain}>
            <Eyebrow num={t.eyebrow.num || undefined} label={t.eyebrow.label} />
            <h2 id="more-title" className={cx('t-h2', s.title)}>
              <Units text={t.title} lang={lang} mode="phrase" />
            </h2>
          </div>
          <p className={cx('t-lead', s.lead)}>{t.lead}</p>
        </header>

        <RevealGroup selector="[data-tile]">
          <div className={s.bento}>
            <Tile
              id="modes"
              title={tiles.modes.title}
              lang={lang}
              className={s.tile_modes}
              visualClassName={s.visual_modes}
              body={
                <>
                  <p className={cx('t-body', s.body)}>{tiles.modes.body}</p>
                  <p className={cx('t-small', s.note)}>{tiles.modes.note}</p>
                </>
              }
            >
              <ModeSampler
                label={mf.memory.modesHeading}
                modes={modes}
                name={name}
                avatar={<Aura persona="oshi" shape="avatar" size={36} monogram />}
                check={<Icon name="check" size={16} />}
              />
            </Tile>

            <div className={s.strip}>
              <Carousel
                d={d}
                label={t.title}
                itemWidth="min(76vw, 320px)"
                items={[
                  small('reel', <ReelMini d={d} lang={lang} />, s.visual_reel),
                  small('quests', <QuestsMini d={d} lang={lang} />),
                  small('bonus', <BonusMini d={d} lang={lang} />),
                  small('invite', <InviteMini d={d} lang={lang} />),
                  small('library', <MyPageMini d={d} lang={lang} />),
                  small('sleep', <SleepMini d={d} lang={lang} />),
                ]}
              />
            </div>

            <Tile
              id="plans"
              title={tiles.plans.title}
              lang={lang}
              className={s.tile_plans}
              visualClassName={s.visual_plans}
              body={<p className={cx('t-body', s.body)}>{tiles.plans.body}</p>}
            >
              <PlansMini d={d} lang={lang} cards={tiles.plans.cards} />
              <p className={cx('t-small', s.note)}>{tiles.plans.note}</p>
            </Tile>

            <Tile
              id="money"
              title={tiles.money.title}
              lang={lang}
              className={s.tile_money}
              visualClassName={s.visual_money}
              body={
                <ul className={s.points}>
                  {MONEY_POINTS.map((k) => (
                    <li key={k}>
                      <span className={s.pointIcon} data-point-icon="" aria-hidden="true">
                        <Icon name="check" size={14} />
                      </span>
                      {tiles.money.points[k]}
                    </li>
                  ))}
                </ul>
              }
            >
              <ConfirmSheetMini d={d} lang={lang} />
            </Tile>

            <Tile
              id="signin"
              title={tiles.signin.title}
              lang={lang}
              className={s.tile_signin}
              visualClassName={s.visual_signin}
              body={<p className={cx('t-body', s.body)}>{tiles.signin.body}</p>}
            >
              <SignInMini d={d} lang={lang} />
            </Tile>
          </div>
        </RevealGroup>
        <ScreenNote d={d} />
        <BentoMicro />

        <FeatureIndex d={d} lang={lang} />
      </div>
    </Section>
  );
}
