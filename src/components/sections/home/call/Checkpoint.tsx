import type { SectionProps } from '@/i18n/types';
import { Section, StoreBadges, FrictionList, ScreenNote, Icon } from '@/components/site';
import './call.css';

/**
 * #call-checkpoint (spec §5.4): the download point right after the call
 * stage, on night. The title is a CTA line, not a heading. The light that
 * ended the call keeps glowing on the horizon above it.
 */
export function Checkpoint({ d, lang }: SectionProps) {
  const t = d.home.checkpoint;
  const c = d.home.call;
  return (
    <Section id="call-checkpoint" surface="night" download className="cp">
      <div className="cp-glow" aria-hidden="true" />
      <div className="cp-inner">
        <p className="t-h3 cp-title">{t.title}</p>
        <p className="cp-sub">{t.sub}</p>
        <div className="cp-badges">
          <StoreBadges d={d} lang={lang} placement="checkpoint" showFriction />
        </div>
        <FrictionList d={d} items={['first60', 'trialBeforeSignup', 'noPassword']} />
        <ul className="cp-trust">
          <li className="t-small">
            <Icon name="check" size={16} />
            {c.trust}
          </li>
          <li className="t-small">
            <Icon name="check" size={16} />
            {c.billing}
          </li>
        </ul>
      </div>
      <div className="cp-note">
        <ScreenNote d={d} tone="dark" />
      </div>
    </Section>
  );
}
