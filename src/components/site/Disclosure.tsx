import type { Dictionary } from '@/i18n/dictionaries';
import { Icon } from './icons/Icon';

/** AI-clone disclosure (spec §4.2). Rendered in the hero, #about, the final CTA and the footer. */
export function Disclosure({ d, variant }: { d: Dictionary; variant: 'line' | 'bar' }) {
  if (variant === 'bar') {
    return (
      <p className="glass t-h3 disclosure-bar">
        <Icon name="verified" filled size={24} />
        <span>{d.common.disclosureOfficial}</span>
      </p>
    );
  }
  return (
    <p className="t-small disclosure-line">
      <Icon name="verified" filled size={16} />
      <span>{d.common.disclosure}</span>
    </p>
  );
}
