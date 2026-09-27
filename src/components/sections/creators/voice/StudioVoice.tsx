import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

/** #voice: 06 ボイス (spec §6.8). STUB (WP0a), owned by WP6: replace wholesale. */
export function StudioVoice({ d, lang }: SectionProps) {
  const t = d.creators.voice;
  return (
    <Section id="voice" surface="night-deep" labelledBy="voice-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="white" />
      <h2 id="voice-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
    </Section>
  );
}
