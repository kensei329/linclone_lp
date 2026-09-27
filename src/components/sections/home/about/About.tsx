import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Disclosure } from '@/components/site/Disclosure';
import { Units } from '@/lib/units';

/** #about: trust before features (spec §5.3). STUB (WP0a), owned by WP1: replace wholesale. */
export function About({ d, lang }: SectionProps) {
  const t = d.home.about;
  return (
    <Section id="about" surface="cream" labelledBy="about-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="about-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-statement">{t.statement}</p>
      <ul>
        {(['official', 'labelled', 'memory'] as const).map((k) => (
          <li key={k}>
            <h3 className="t-h3">{t.cards[k].title}</h3>
            <p className="t-body">{t.cards[k].body}</p>
          </li>
        ))}
      </ul>
      <Disclosure d={d} variant="bar" />
    </Section>
  );
}
