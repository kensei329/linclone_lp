import type { MockProps } from '@/components/mockups/types';
import { CoinPill, Screen, TabBarFan } from '@/components/mockups/kit';
import { Aura, Icon, Waveform } from '@/components/site';
import type { PersonaId } from '@/lib/personas';
import { Card, Mark, RoundIcon, cx, personaOf, vars } from './parts';

const RAIL: PersonaId[] = ['ren', 'kai', 'sora'];

/**
 * F5 `HomeCards01` (spec §7.1): signed-in Home (V3 01), cream. No coin number,
 * no bell count, no quest counts. The morning section crops it at {y:430,h:330}.
 * Hooks (voice card): `[data-m="play"]` (one play glyph; the morning micro lays
 * a pause glyph over it), `[data-m="wave"]` wraps the Waveform (animators set
 * `data-playing` + `data-loop` on the `.waveform`), `[data-m="new"]` badge.
 */
export function HomeCards01({ d, persona = 'oshi', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.home;
  const c = d.mock.fan.common;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-home', className)} data-mock="HomeCards01" style={vars({ '--pc': p.color })}>
        <div className="fm-home-top">
          <Mark size={36} tone="color" />
          <span className="fm-home-top-right">
            <CoinPill theme="cream" />
            <RoundIcon icon="search" />
            <RoundIcon icon="notifications" dot />
            <RoundIcon icon="menu" />
          </span>
        </div>

        <div className="fm-home-greet">{t.greeting}</div>

        <div className="fm-home-follow">
          <span className="fm-home-follow-lbl">{t.followingLabel}</span>
          <span className="fm-home-seeall">
            {t.seeAll}
            <Icon name="chevron_right" size={16} />
          </span>
        </div>
        <div className="fm-home-rail">
          <span className="fm-home-railitem">
            <span className="fm-home-newtile">
              <Icon name="add" size={22} />
            </span>
            <span className="fm-home-railname">{t.followNew}</span>
          </span>
          <span className="fm-home-railitem" data-active="">
            <span className="fm-home-sq">
              <Aura persona={persona} shape="avatar" size={60} />
            </span>
            <span className="fm-home-railname">{p.name}</span>
          </span>
          {RAIL.map((id) => (
            <span className="fm-home-railitem" key={id}>
              <span className="fm-home-sq">
                <Aura persona={id} shape="avatar" size={60} />
              </span>
              <span className="fm-home-railname">{d.personas[id].name}</span>
            </span>
          ))}
        </div>

        <div className="fm-home-hero">
          <span className="fm-home-hero-art">
            <Aura persona={persona} shape="card" size={196} voiceprint={false} />
          </span>
          <span className="fm-home-ready">{t.readyToTalk}</span>
          <span className="fm-home-hero-copy">
            <span className="fm-home-hero-name">{p.name}</span>
            <span className="fm-home-hero-genre">{p.genre}</span>
          </span>
          <span className="fm-home-hero-actions">
            <span className="fm-home-callnow">
              <Icon name="call" filled size={16} />
              {c.callNow}
            </span>
            <span className="fm-home-chat">
              <Icon name="forum" filled size={16} />
              {c.chat}
            </span>
          </span>
        </div>

        <Card radius={18} className="fm-home-morning">
          <span className="fm-home-alarm">
            <Icon name="alarm_on" filled size={22} />
          </span>
          <span className="fm-home-mtxt">
            <span className="fm-home-mtitle">{t.morningTitle}</span>
            <span className="fm-home-mtime">{t.morningScheduled}</span>
            <span className="fm-home-mrep">{t.morningRepeat}</span>
          </span>
          <Icon name="chevron_right" size={20} className="fm-home-chev" />
        </Card>

        <Card radius={18} className="fm-home-voice">
          <span className="fm-home-play" data-m="play">
            <Icon name="play_arrow" filled size={26} />
          </span>
          <span className="fm-home-vtxt">
            <span className="fm-home-vtitle">
              <span>{t.voiceTitle}</span>
              <span className="fm-home-new" data-m="new">
                {c.newBadge}
              </span>
            </span>
            <span className="fm-home-wave" data-m="wave">
              <Waveform tone="teal" size="thick" bars={10} />
            </span>
            <span className="fm-home-quote">{t.voiceQuote}</span>
          </span>
        </Card>

        <Card radius={18} className="fm-home-quest">
          <span className="fm-home-flag">
            <Icon name="flag" filled size={18} />
          </span>
          <span className="fm-home-qtitle">{d.mock.fan.quests.board}</span>
          <Icon name="chevron_right" size={20} className="fm-home-chev" />
        </Card>

        <TabBarFan d={d} active="home" />
      </div>
    </Screen>
  );
}
