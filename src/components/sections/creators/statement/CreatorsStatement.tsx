import type { SectionProps } from '@/i18n/types';
import { Section, ScrollFillText, Waveform } from '@/components/site';
import '../creators.css';

/** Accent phrase inside `creators.statement.fill` (case-sensitive), per locale. */
const ACCENT = { ja: 'もう一人の自分', en: 'The you' } as const;

/**
 * #about: statement (spec §6.2). One clip fill, `top 80%` → `bottom 45%`; the
 * accent turns to the Studio gradient at 0.7. Server HTML is filled.
 */
export function CreatorsStatement({ d, lang }: SectionProps) {
  const t = d.creators.statement;
  return (
    <Section id="about" surface="studio" labelledBy="creators-statement" className="cr-statement">
      <div className="container-site cr-statement-inner">
        <span className="cr-statement-wave" aria-hidden="true">
          <Waveform tone="purple" size="thick" bars={9} seed={3} playing />
        </span>
        <ScrollFillText
          as="h2"
          id="creators-statement"
          text={t.fill}
          lang={lang}
          mode="clip"
          tone="studio"
          accent={ACCENT[lang]}
          className="t-display-l cr-statement-title"
        />
        <p className="t-lead ink-2 cr-statement-sub">{t.sub}</p>
      </div>
    </Section>
  );
}
