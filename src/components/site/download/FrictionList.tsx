import type { Dictionary } from '@/i18n/dictionaries';
import { Icon } from '../icons/Icon';

type FrictionKey = 'freeDownload' | 'first60' | 'trialBeforeSignup' | 'noPassword';

/** Inline chips that remove download friction: `check` 14px + `.t-small` ink-2 (spec §4.2). */
export function FrictionList({ d, items = ['freeDownload', 'first60', 'noPassword'] }: { d: Dictionary; items?: FrictionKey[] }) {
  return (
    <ul className="friction-list">
      {items.map((k) => (
        <li key={k} className="t-small">
          <Icon name="check" size={14} />
          {d.common.friction[k]}
        </li>
      ))}
    </ul>
  );
}
