import type { Dictionary } from '@/i18n/dictionaries';
import type { MockProps } from '@/components/mockups/types';
import { Icon, type IconName } from '@/components/site';
import { cx } from '../parts';

type PlansMiniProps = MockProps & { cards: Dictionary['home']['more']['tiles']['plans']['cards'] };

const ICONS: Record<string, IconName> = { free: 'forum', basic: 'paid', premium: 'confirmation_number', super: 'workspace_premium' };

/**
 * F21 `PlansMini` (spec §7.1): four qualitative plan cards (name + perk).
 * There is no prop, slot or glyph for a price, coin amount or ticket count.
 * The premium card carries a 2px #8b55d6 ring. Hook: `[data-m="plan"]` ×4.
 * Labelled by the plan names and perks (there is no separate alt key).
 */
export function PlansMini({ lang, cards, className }: PlansMiniProps) {
  const label = Object.values(cards).map((c) => `${c.name}: ${c.perk}`).join(lang === 'ja' ? '／' : ' / ');
  return (
    <figure role="img" aria-label={label} className={cx('fm-mini fm-pm', className)} data-mock="PlansMini">
      <ul className="fm-pm-list" aria-hidden="true">
        {Object.entries(cards).map(([id, c]) => (
          <li key={id} className="fm-pm-card" data-m="plan" data-plan={id}>
            <span className="fm-pm-ico">
              <Icon name={ICONS[id] ?? 'forum'} filled size={18} />
            </span>
            <span className="fm-pm-name">{c.name}</span>
            <span className="fm-pm-perk">{c.perk}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
