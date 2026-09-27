import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';
import { Checkpoint } from './Checkpoint';

/** #call: stage #1 with the tap-to-call demo, then the checkpoint (spec §5.4). STUB (WP0a), owned by WP1: replace wholesale. */
export function CallChapter({ d, lang }: SectionProps) {
  const t = d.home.call;
  return (
    <>
      <Section id="call" surface="night" labelledBy="call-title" immersive skipTo="#morning-call" skipLabel={d.common.skip.stage}>
        <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="white" />
        <h2 id="call-title" className="t-h2">
          <Units text={t.title} lang={lang} mode="phrase" />
        </h2>
        <p className="t-lead">{t.lead}</p>
        <a href="#download">
          {d.home.demo.button} <span>{d.home.demo.tag}</span>
        </a>
      </Section>
      <Checkpoint d={d} lang={lang} />
    </>
  );
}
