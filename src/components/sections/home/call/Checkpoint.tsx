import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { StoreBadges } from '@/components/site/download/StoreBadges';
import { FrictionList } from '@/components/site/download/FrictionList';

/** #call-checkpoint: download point after the call stage (spec §5.4). STUB (WP0a), owned by WP1: replace wholesale. */
export function Checkpoint({ d, lang }: SectionProps) {
  return (
    <Section id="call-checkpoint" surface="night" download>
      <p className="t-h3">{d.home.checkpoint.title}</p>
      <p>{d.home.checkpoint.sub}</p>
      <StoreBadges d={d} lang={lang} placement="checkpoint" showFriction />
      <FrictionList d={d} items={['first60', 'trialBeforeSignup', 'noPassword']} />
    </Section>
  );
}
