import { Fragment, type CSSProperties } from 'react';
import type { SectionProps } from '@/i18n/types';
import type { Locale } from '@/i18n/config';
import { Section, Eyebrow, StoreBadges, Disclosure, ScreenNote, Sticker, Icon, type IconName } from '@/components/site';
import { PhoneFrame } from '@/components/mockups/kit';
import { FirstCall00c } from '@/components/mockups/fan/FirstCall00c';
import { Units } from '@/lib/units';
import { HeroAnimator } from './HeroAnimator.client';
import s from './hero.module.css';

type ChipKey = 'call' | 'morning' | 'voice' | 'chat' | 'live' | 'grow';
const CHIPS: { key: ChipKey; href: string; icon: IconName }[] = [
  { key: 'call', href: '#call', icon: 'call' },
  { key: 'morning', href: '#morning-call', icon: 'alarm' },
  { key: 'voice', href: '#voice-message', icon: 'graphic_eq' },
  { key: 'chat', href: '#chat', icon: 'forum' },
  { key: 'live', href: '#live', icon: 'podcasts' },
  { key: 'grow', href: '#grow', icon: 'psychiatry' },
];

type StickerKey = 'official' | 'first60' | 'call' | 'live';
/** Orbit around the phone (§5.1). `depth` scales cursor parallax and scroll-away; `mobile` = one of the two shown <1024. */
const STICKERS: { key: StickerKey; icon: IconName; tone: 'teal' | 'gold' | 'pink'; tilt: number; depth: number; mobile: boolean }[] = [
  { key: 'official', icon: 'verified', tone: 'teal', tilt: -5, depth: 1.2, mobile: true },
  { key: 'first60', icon: 'timer', tone: 'gold', tilt: 4, depth: 0.8, mobile: true },
  { key: 'call', icon: 'call', tone: 'teal', tilt: -3, depth: 1, mobile: false },
  { key: 'live', icon: 'podcasts', tone: 'pink', tilt: 6, depth: 0.6, mobile: false },
];

/** Keep a numeral with the word after it ("60 seconds" never splits). */
const glueNumerals = (text: string) => text.replace(/(\d) (?=\S)/g, '$1\u00a0');

/** Lead sentences: each starts its own line (「最初の60秒は…」 / "Your first 60 seconds…"). */
const sentences = (text: string, lang: Locale) => (lang === 'ja' ? text.split(/(?<=。)(?=.)/) : text.split(/(?<=[.!?])\s+/));

/**
 * #hero (spec §5.1): the 5-second proposition and the page's single H1.
 * Server-rendered final state; the entrance is CSS transform-only (every
 * element is visible on the first frame, the H1 is the LCP element). The
 * animator island adds the caption marker after idle and, on desktop, cursor
 * parallax plus a transform-only scroll-away.
 */
export function HomeHero({ d, lang }: SectionProps) {
  const t = d.home.hero;
  return (
    <Section id="hero" surface="dawn" labelledBy="hero-title" className={s.hero}>
      <div className={`container-site ${s.grid}`}>
        <div className={s.copy}>
          <div className={s.enter} style={{ '--d': '0ms' } as CSSProperties}>
            <Eyebrow label={t.eyebrow} />
          </div>
          <h1 id="hero-title" className={`t-display-xl ${s.title}`}>
            <Units text={t.title} lang={lang} mode="phrase" />
          </h1>
          <p className={`t-lead ${s.lead} ${s.enter}`} style={{ '--d': '80ms' } as CSSProperties}>
            {sentences(glueNumerals(t.lead), lang).map((line, i) => (
              <Fragment key={i}>
                {i > 0 && lang !== 'ja' ? ' ' : null}
                <span className={s.leadLine}>
                  <Units text={line} lang={lang} mode="phrase" />
                </span>
              </Fragment>
            ))}
          </p>
          <div className={`${s.badges} ${s.enter}`} style={{ '--d': '140ms' } as CSSProperties}>
            <StoreBadges d={d} lang={lang} placement="hero" size="lg" qr showFriction />
          </div>
          <div className={`${s.disclosure} ${s.enter}`} style={{ '--d': '180ms' } as CSSProperties}>
            <Disclosure d={d} variant="line" />
          </div>
          {/* No data-lenis-prevent: the row only scrolls on x, so a vertical swipe or wheel starting on it scrolls the page. */}
          <nav aria-label={t.chipsLabel} className={`${s.chips} ${s.enter}`} style={{ '--d': '220ms' } as CSSProperties}>
            <ul>
              {CHIPS.map((c) => (
                <li key={c.key}>
                  <a href={c.href} className={`glass-fake ${s.chip}`}>
                    <span className={s.chipIcon} aria-hidden="true">
                      <Icon name={c.icon} filled size={16} />
                    </span>
                    {t.chips[c.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={s.visual}>
          <div className={s.orb} data-hero-orb="" aria-hidden="true" />
          <div className={s.phoneSlot} data-hero-phone="">
            <div className={s.phoneRise}>
              {/* The mock's 「タップしてYuzuと話す」 reads as a button, so the whole phone is
                  covered by a real link to the call demo. The link is a transparent
                  overlay sibling (not a wrapper), so its name matches its own text and
                  the figure keeps role="img" with its label: no nested controls. */}
              <div className={s.phoneLink}>
                <PhoneFrame size={{ mobile: 300, desktop: 360 }} label={t.phoneAlt} theme="night">
                  <FirstCall00c d={d} lang={lang} persona="oshi" />
                </PhoneFrame>
                <a href="#call" className={s.phoneHit}>
                  <span className={s.srOnly}>{t.phoneLink}</span>
                </a>
              </div>
            </div>
            {STICKERS.map((st, i) => (
              <span key={st.key} className={s.sticker} data-slot={st.key} data-mobile={st.mobile ? '' : undefined} data-depth={st.depth} aria-hidden="true">
                <Sticker icon={st.icon} label={glueNumerals(t.stickers[st.key])} tone={st.tone} tilt={st.tilt} index={i + 1} />
              </span>
            ))}
          </div>
          <div className={s.note}>
            <ScreenNote d={d} />
          </div>
        </div>
      </div>
      <HeroAnimator />
    </Section>
  );
}
