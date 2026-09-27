import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

const CARDS = ['grow', 'ng', 'profile', 'labels'] as const;

/** #control: 04 安心 (spec §6.6). STUB (WP0a), owned by WP6: replace wholesale. */
export function StudioControl({ d, lang }: SectionProps) {
  const t = d.creators.control;
  return (
    <Section id="control" surface="studio" labelledBy="control-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="control-title" className="t-display-l">
        <Units text={t.fill} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
      <ul>
        {CARDS.map((k) => (
          <li key={k}>
            <h3 className="t-h3">{t.cards[k].title}</h3>
            <p className="t-body">{t.cards[k].body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
