import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

/** #morning-call: 02 モーニングコール (spec §5.5). STUB (WP0a), owned by WP2: replace wholesale. */
export function MorningChapter({ d, lang }: SectionProps) {
  const t = d.home.morning;
  return (
    <Section id="morning-call" surface="night-to-dawn" labelledBy="morning-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="morning-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
      <div id="voice-message">
        <Eyebrow label={t.voiceEyebrow} />
        <h3 className="t-h3">{t.voiceTitle}</h3>
        <p className="t-body">{t.voiceBody}</p>
      </div>
    </Section>
  );
}
