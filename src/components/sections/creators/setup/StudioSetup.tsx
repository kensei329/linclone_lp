import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

const STEPS = ['picks', 'words', 'photos', 'modes', 'ng', 'voice'] as const;

/** #setup: 02 セットアップ (spec §6.4). STUB (WP0a), owned by WP6: replace wholesale. */
export function StudioSetup({ d, lang }: SectionProps) {
  const t = d.creators.setup;
  return (
    <Section id="setup" surface="studio-cyan" labelledBy="setup-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="setup-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
      <ol>
        {STEPS.map((k) => (
          <li key={k}>
            <h3 className="t-h3">{t.steps[k].title}</h3>
            <p className="t-body">{t.steps[k].body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
