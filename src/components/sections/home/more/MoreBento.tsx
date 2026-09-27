import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';
import { FeatureIndex } from './FeatureIndex';

const TILES = ['modes', 'reel', 'quests', 'bonus', 'invite', 'plans', 'money', 'library', 'sleep', 'signin'] as const;

/** #more: everything else in the app (spec §5.9). STUB (WP0a), owned by WP3: replace wholesale. */
export function MoreBento({ d, lang }: SectionProps) {
  const t = d.home.more;
  return (
    <Section id="more" surface="cream" labelledBy="more-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="more-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
      <ul>
        {TILES.map((k) => (
          <li key={k} id={`more-${k}`}>
            <h3 className="t-h3">{t.tiles[k].title}</h3>
          </li>
        ))}
      </ul>
      <FeatureIndex d={d} lang={lang} />
    </Section>
  );
}
