import type { SectionProps } from '@/i18n/types';
import type { Dictionary } from '@/i18n/dictionaries';
import { Icon, type IconName } from '@/components/site';
import { Units } from '@/lib/units';
import s from './more.module.css';

type IndexKey = keyof Dictionary['home']['more']['index'];

// Anchor + glyph for every feature-index chip (spec §5.9). The order is the
// dictionary's, which follows the page. LIVE uses `podcasts` (never videocam).
const ITEMS: Record<IndexKey, { href: string; icon: IconName }> = {
  call: { href: '#call', icon: 'call' },
  chat: { href: '#chat', icon: 'forum' },
  imageVoice: { href: '#stories', icon: 'auto_awesome' },
  stories: { href: '#stories', icon: 'photo_library' },
  morning: { href: '#morning-call', icon: 'alarm' },
  voiceMessage: { href: '#voice-message', icon: 'mic' },
  memory: { href: '#memory', icon: 'psychology' },
  nickname: { href: '#memory', icon: 'badge' },
  modes: { href: '#more-modes', icon: 'favorite' },
  live: { href: '#live', icon: 'podcasts' },
  liveRequest: { href: '#live-request', icon: 'edit_note' },
  gifts: { href: '#live', icon: 'redeem' },
  archive: { href: '#live-request', icon: 'play_circle' },
  grow: { href: '#grow', icon: 'psychiatry' },
  reel: { href: '#more-reel', icon: 'play_arrow' },
  quests: { href: '#more-quests', icon: 'flag' },
  bonus: { href: '#more-bonus', icon: 'calendar_month' },
  invite: { href: '#more-invite', icon: 'group' },
  wallet: { href: '#more-plans', icon: 'paid' },
  notifications: { href: '#more-sleep', icon: 'notifications' },
  signin: { href: '#how-it-works', icon: 'key' },
  languages: { href: '#faq', icon: 'language' },
};

/**
 * 「アプリでできること、ぜんぶ」 (spec §5.9): 22 chip links, each to the section
 * or bento tile that shows the feature. Always rendered and always visible
 * (it is the page's feature map for search engines and for skimmers).
 */
export function FeatureIndex({ d, lang }: SectionProps) {
  const t = d.home.more;
  const keys = Object.keys(t.index) as IndexKey[];
  return (
    <nav className={s.index} aria-labelledby="more-index-title">
      <h3 id="more-index-title" className={`t-h3 ${s.indexTitle}`}>
        <Units text={t.indexTitle} lang={lang} mode="phrase" />
      </h3>
      <ul className={s.indexList}>
        {keys.map((k) => (
          <li key={k}>
            <a href={ITEMS[k].href} className={s.indexChip}>
              <span className={s.indexIcon} aria-hidden="true">
                <Icon name={ITEMS[k].icon} filled size={16} />
              </span>
              <span>{t.index[k]}</span>
              <Icon name="arrow_forward" size={16} className={s.indexArrow} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
