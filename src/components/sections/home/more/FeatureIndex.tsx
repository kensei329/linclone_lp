import type { SectionProps } from '@/i18n/types';
import type { Dictionary } from '@/i18n/dictionaries';

type IndexKey = keyof Dictionary['home']['more']['index'];

// Anchor for every feature-index chip (spec §5.9).
const ANCHORS: Record<IndexKey, string> = {
  call: '#call', chat: '#chat', imageVoice: '#stories', stories: '#stories', morning: '#morning-call',
  voiceMessage: '#voice-message', memory: '#memory', nickname: '#memory', modes: '#more-modes', live: '#live',
  gifts: '#live', liveRequest: '#live-request', archive: '#live-request', grow: '#grow', reel: '#more-reel',
  quests: '#more-quests', bonus: '#more-bonus', invite: '#more-invite', wallet: '#more-plans',
  notifications: '#more-sleep', signin: '#how-it-works', languages: '#faq',
};

/** 「アプリでできること、ぜんぶ」 index (spec §5.9). STUB (WP0a), owned by WP3: replace wholesale. */
export function FeatureIndex({ d }: SectionProps) {
  const t = d.home.more;
  return (
    <div className="feature-index">
      <h3 className="t-h3">{t.indexTitle}</h3>
      <ul>
        {(Object.keys(ANCHORS) as IndexKey[]).map((k) => (
          <li key={k}>
            <a href={ANCHORS[k]}>{t.index[k]}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
